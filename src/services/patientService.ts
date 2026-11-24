import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';
import { PatientProfile } from '../types/models';
import { getStoredToken, getStoredUser } from './authService';

const PROFILE_STORAGE_KEY = '@aidocare_patient_profile';

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

export async function getPatientProfile(): Promise<PatientProfile> {
  const currentUser = await getStoredUser();
  const defaultProfile: PatientProfile = {
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phoneNumber || currentUser?.phone || '',
    bloodType: currentUser?.bloodType || 'O+',
    height: '172 cm',
    weight: '68 kg',
    allergies: 'None reported',
    medicalConditions: 'None',
    emergencyContacts: [
      { name: 'Sarah Patient', relationship: 'Spouse', phone: '+62 812 9876 5432' },
    ],
  };

  try {
    const data = await request('/api/patient/profile');
    if (data.profile) {
      const merged: PatientProfile = {
        ...defaultProfile,
        ...data.profile,
        emergencyContacts: data.profile.emergencyContacts || defaultProfile.emergencyContacts,
      };
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch {
    // Fallback to local storage
  }

  try {
    const cached = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore
  }

  return defaultProfile;
}

export async function updatePatientProfile(payload: Partial<PatientProfile>): Promise<PatientProfile> {
  const current = await getPatientProfile();
  const updated: PatientProfile = {
    ...current,
    ...payload,
  };

  try {
    await request('/api/patient/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch {
    // Fallback
  }

  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
