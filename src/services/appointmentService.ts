import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';
import { mockUpcomingAppointment } from '../data/dashboardData';
import { getDoctorById } from '../data/doctors';
import { Appointment } from '../types/models';
import { getStoredToken } from './authService';

const APPOINTMENTS_STORAGE_KEY = '@aidocare_appointments_v1';

const INITIAL_MOCK_APPOINTMENTS: Appointment[] = [
  mockUpcomingAppointment,
  {
    id: 'APT-1000',
    doctorId: 'DOC-002',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    date: '2026-09-15',
    time: '10:00',
    type: 'In-Person Consultation',
    consultationType: 'In-Person Consultation',
    status: 'completed',
    location: 'Aido Care Clinic — Room 310',
    consultationFee: 250000,
  },
];

async function getStoredAppointments(): Promise<Appointment[]> {
  try {
    const raw = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_APPOINTMENTS));
      return INITIAL_MOCK_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_APPOINTMENTS;
  }
}

async function saveStoredAppointments(list: Appointment[]): Promise<void> {
  try {
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save appointments to storage', err);
  }
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getStoredToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !token.startsWith('mock-')) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      // Body not JSON
    }

    if (!res.ok) {
      throw new Error(data.error?.message || data.message || `Request failed (${res.status})`);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function listAppointments(): Promise<Appointment[]> {
  try {
    const data = await request('/api/appointments');
    if (Array.isArray(data.appointments) && data.appointments.length > 0) {
      // Map API fields if needed
      const normalized: Appointment[] = data.appointments.map((a: any) => ({
        id: a.id,
        doctorId: a.doctorId,
        doctorName: a.doctorName || (a.doctor ? `Dr. ${a.doctor.firstName} ${a.doctor.lastName}` : 'Doctor'),
        specialty: a.specialty || a.doctor?.specialty || 'General Medicine',
        date: a.appointmentDate || a.date,
        time: a.startTime || a.time,
        type: a.type || 'General Consultation',
        consultationType: a.type || 'General Consultation',
        status: (a.status || 'confirmed').toLowerCase(),
        location: a.location || 'Aido Care Clinic',
        consultationFee: a.consultationFee,
        notes: a.notes,
      }));
      await saveStoredAppointments(normalized);
      return normalized;
    }
  } catch {
    // Graceful fallback to local storage
  }

  return getStoredAppointments();
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const data = await request(`/api/appointments/${id}`);
    if (data.appointment) return data.appointment;
  } catch {
    // Graceful fallback
  }

  const list = await getStoredAppointments();
  return list.find((a) => a.id === id) || null;
}

export interface BookAppointmentPayload {
  doctorId: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
  doctorName?: string;
  specialty?: string;
  location?: string;
  consultationFee?: number;
}

export async function bookAppointment(payload: BookAppointmentPayload): Promise<Appointment> {
  const doctor = getDoctorById(payload.doctorId);
  const docName = payload.doctorName || (doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor');
  const spec = payload.specialty || doctor?.specialty || 'General Medicine';
  const fee = payload.consultationFee || doctor?.consultationFee || 150000;
  const loc = payload.location || doctor?.location || 'Aido Care Clinic';

  const newAppointment: Appointment = {
    id: `APT-${Date.now().toString().slice(-4)}`,
    doctorId: payload.doctorId,
    doctorName: docName,
    specialty: spec,
    date: payload.date,
    time: payload.time,
    appointmentDate: payload.date,
    startTime: payload.time,
    type: payload.type,
    consultationType: payload.type,
    status: 'confirmed',
    location: loc,
    notes: payload.notes || '',
    consultationFee: fee,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        doctorId: payload.doctorId,
        appointmentDate: payload.date,
        startTime: payload.time,
        type: payload.type,
        notes: payload.notes,
      }),
    });
    if (res.appointment) {
      newAppointment.id = res.appointment.id;
    }
  } catch {
    // Persist locally
  }

  const currentList = await getStoredAppointments();
  const updatedList = [newAppointment, ...currentList.filter((a) => a.id !== newAppointment.id)];
  await saveStoredAppointments(updatedList);
  return newAppointment;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  try {
    await request(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
  } catch {
    // Local fallback
  }

  const currentList = await getStoredAppointments();
  let updatedAppointment: Appointment | null = null;
  const updatedList = currentList.map((apt) => {
    if (apt.id === id) {
      updatedAppointment = { ...apt, status: 'cancelled' as const };
      return updatedAppointment;
    }
    return apt;
  });

  await saveStoredAppointments(updatedList);
  if (!updatedAppointment) {
    throw new Error('Appointment not found');
  }
  return updatedAppointment;
}

export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string
): Promise<Appointment> {
  try {
    await request(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ appointmentDate: newDate, startTime: newTime }),
    });
  } catch {
    // Local fallback
  }

  const currentList = await getStoredAppointments();
  let updatedAppointment: Appointment | null = null;
  const updatedList = currentList.map((apt) => {
    if (apt.id === id) {
      updatedAppointment = {
        ...apt,
        date: newDate,
        time: newTime,
        appointmentDate: newDate,
        startTime: newTime,
        status: 'confirmed' as const,
      };
      return updatedAppointment;
    }
    return apt;
  });

  await saveStoredAppointments(updatedList);
  if (!updatedAppointment) {
    throw new Error('Appointment not found');
  }
  return updatedAppointment;
}
