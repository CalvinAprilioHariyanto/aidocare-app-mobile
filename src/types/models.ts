export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  specialties?: string[];
  title: string;
  experience: number;
  rating: number;
  reviewCount: number;
  bio: string;
  education: string;
  languages: string[];
  consultationFee: number;
  location: string;
  availability: Record<number, string[]>;
}

export interface ConsultationType {
  id: string;
  label: string;
  description: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName?: string;
  specialty?: string;
  doctor?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    specialty?: string;
  };
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  appointmentDate?: string;
  startTime?: string;
  type: string;
  consultationType?: string;
  status: AppointmentStatus;
  location?: string;
  notes?: string;
  consultationFee?: number;
  createdAt?: string;
}

export interface MetricItem {
  value?: number;
  unit?: string;
  status?: 'normal' | 'high' | 'low' | 'critical';
  systolic?: number;
  diastolic?: number;
}

export interface HealthMetrics {
  bloodPressure: MetricItem;
  heartRate: MetricItem;
  weight: MetricItem;
  bmi: MetricItem;
}

export interface HealthTip {
  id: string;
  title: string;
  body: string;
  tag: 'Wellness' | 'Prevention' | string;
}

export interface RecentActivityItem {
  id: string;
  type: 'consultation' | 'prescription' | 'lab' | 'record';
  title: string;
  description: string;
  date: string;
  icon: 'consultation' | 'prescription' | 'lab' | 'record';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  bloodType?: string;
  height?: string;
  weight?: string;
  allergies?: string;
  medicalConditions?: string;
  currentMedications?: string;
  previousSurgeries?: string;
  otherMedicalInfo?: string;
  emergencyContacts?: EmergencyContact[];
}
