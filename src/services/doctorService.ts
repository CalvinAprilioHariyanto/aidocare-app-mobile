import { API_BASE_URL } from '../constants/config';
import { doctors as mockDoctors, getDoctorById as getMockDoctorById, specialties as mockSpecialties } from '../data/doctors';
import { Doctor } from '../types/models';
import { getStoredToken } from './authService';

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

export async function listDoctors(filters: { search?: string; specialty?: string } = {}): Promise<Doctor[]> {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.specialty) params.append('specialty', filters.specialty);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const data = await request(`/api/doctors${queryStr}`);
    if (Array.isArray(data.doctors) && data.doctors.length > 0) {
      return data.doctors;
    }
  } catch {
    // Graceful fallback to mock data
  }

  // Filter mock doctors
  return mockDoctors.filter((doc) => {
    const query = (filters.search || '').toLowerCase().trim();
    const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    const matchesSearch =
      !query ||
      fullName.includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      (doc.specialties && doc.specialties.some((s) => s.toLowerCase().includes(query)));

    const matchesSpecialty = !filters.specialty || doc.specialty === filters.specialty;
    return matchesSearch && matchesSpecialty;
  });
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  try {
    const data = await request(`/api/doctors/${id}`);
    if (data.doctor) return data.doctor;
  } catch {
    // Graceful fallback
  }

  return getMockDoctorById(id);
}

export const getDoctorById = getDoctor;

export function listSpecialties(): string[] {
  return mockSpecialties;
}
