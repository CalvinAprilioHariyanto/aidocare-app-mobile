import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/config';
import { LoginPayload, RegisterPayload, User } from '../types/auth';

const DEMO_USERS: User[] = [
  {
    id: 'PAT-001',
    role: 'patient',
    firstName: 'Calvin',
    lastName: 'Patient',
    email: 'patient@aidocare.com',
    phoneNumber: '+62 812 3456 7890',
  },
  {
    id: 'DOC-001',
    role: 'doctor',
    firstName: 'Sarah',
    lastName: 'Anderson',
    email: 'doctor@aidocare.com',
    phoneNumber: '+62 811 2345 6789',
  },
];

export function normalizeUser(user: any): User {
  return {
    ...user,
    role: (user.role || 'patient').toLowerCase(),
    firstName: user.firstName || user.name?.split(' ')[0] || '',
    lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
  };
}

async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      // Body not JSON
    }

    if (!response.ok) {
      const errorMessage =
        data.error?.message ||
        data.message ||
        `Request failed with status ${response.status}.`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function loginApi(payload: LoginPayload): Promise<{ token: string; user: User }> {
  const { email, password } = payload;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    if (data.token && data.user) {
      return {
        token: data.token,
        user: normalizeUser(data.user),
      };
    }
    throw new Error(data.message || 'The server returned an invalid response.');
  } catch (apiError: any) {
    // If backend is unreachable or 404, check mock credentials for smooth offline development & testing
    const demoMatch = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (demoMatch && (password === 'patient123' || password === 'doctor123')) {
      const mockToken = `mock-jwt-token-${demoMatch.id}-${Date.now()}`;
      return {
        token: mockToken,
        user: demoMatch,
      };
    }

    // Check if user was registered locally in mock storage
    try {
      const locallySaved = await AsyncStorage.getItem(`mock_reg_${normalizedEmail}`);
      if (locallySaved) {
        const parsed = JSON.parse(locallySaved);
        if (parsed.password === password) {
          return {
            token: `mock-jwt-token-${parsed.user.id}`,
            user: parsed.user,
          };
        }
      }
    } catch {
      // Ignore
    }

    // Rethrow actual server error or helpful offline message
    if (apiError.name === 'AbortError' || apiError.message?.includes('Network request failed') || apiError.message?.includes('Failed to fetch')) {
      throw new Error('Could not connect to server. Check your connection or use demo account.');
    }
    throw apiError;
  }
}

export async function registerApi(payload: RegisterPayload): Promise<{ user: User; message: string }> {
  const { firstName, lastName, email, phone, phoneNumber, password, confirmPassword } = payload;
  const finalPhone = (phoneNumber || phone || '').trim();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phoneNumber: finalPhone,
        password,
        confirmPassword: confirmPassword || password,
      }),
    });

    return {
      user: normalizeUser(data.user || {
        id: `PAT-${Date.now()}`,
        email: normalizedEmail,
        firstName,
        lastName,
        phoneNumber: finalPhone,
        role: 'patient',
      }),
      message: data.message || 'Registration successful',
    };
  } catch (apiError: any) {
    // If backend is unreachable, save mock user locally so registration and login test works seamlessly
    if (apiError.name === 'AbortError' || apiError.message?.includes('Network request failed') || apiError.message?.includes('Application not found') || apiError.message?.includes('status 404')) {
      const mockUser: User = {
        id: `PAT-${Date.now().toString().slice(-4)}`,
        role: 'patient',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phoneNumber: finalPhone,
      };

      await AsyncStorage.setItem(
        `mock_reg_${normalizedEmail}`,
        JSON.stringify({ user: mockUser, password })
      );

      return {
        user: mockUser,
        message: 'Account created successfully (Local/Demo Mode)',
      };
    }
    throw apiError;
  }
}

export async function getProfileApi(token: string): Promise<User> {
  if (token.startsWith('mock-jwt-token')) {
    const cachedUser = await getStoredUser();
    if (cachedUser) return cachedUser;
  }

  const data = await apiRequest('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return normalizeUser(data.user);
}

// Storage helpers
export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

export async function getStoredUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function saveSession(token: string, user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to save session to AsyncStorage', err);
  }
}

export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (err) {
    console.warn('Failed to clear session from AsyncStorage', err);
  }
}
