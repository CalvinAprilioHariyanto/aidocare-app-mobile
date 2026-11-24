import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as appointmentService from '../services/appointmentService';
import { Appointment } from '../types/models';
import { useAuth } from './AuthContext';

interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  bookAppointment: (details: appointmentService.BookAppointmentPayload) => Promise<Appointment>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<Appointment>;
  getUpcoming: () => Appointment[];
  reloadAppointments: () => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await appointmentService.listAppointments();
      setAppointments(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      reloadAppointments();
    } else {
      setAppointments([]);
      setLoading(false);
    }
  }, [isAuthenticated, reloadAppointments]);

  const bookAppointment = useCallback(
    async (details: appointmentService.BookAppointmentPayload) => {
      const created = await appointmentService.bookAppointment(details);
      setAppointments((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
      return created;
    },
    []
  );

  const rescheduleAppointment = useCallback(
    async (id: string, newDate: string, newTime: string) => {
      const updated = await appointmentService.rescheduleAppointment(id, newDate, newTime);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, ...updated, date: newDate, time: newTime, status: 'confirmed' } : apt
        )
      );
      return updated;
    },
    []
  );

  const cancelAppointment = useCallback(async (id: string) => {
    const updated = await appointmentService.cancelAppointment(id);
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updated, status: 'cancelled' } : apt))
    );
    return updated;
  }, []);

  const getUpcoming = useCallback(() => {
    const now = new Date();
    return appointments
      .filter((apt) => {
        const isConfirmed =
          apt.status?.toLowerCase() === 'confirmed' || apt.status === 'pending';
        if (!isConfirmed) return false;

        const dateStr = apt.date || apt.appointmentDate;
        const timeStr = apt.time || apt.startTime || '00:00';
        const aptDateTime = new Date(`${dateStr}T${timeStr}`);

        // If valid date, check if in future; otherwise keep if confirmed
        if (isNaN(aptDateTime.getTime())) return true;
        return aptDateTime >= now;
      })
      .sort((a, b) => {
        const dtA = new Date(`${a.date || a.appointmentDate}T${a.time || a.startTime || '00:00'}`);
        const dtB = new Date(`${b.date || b.appointmentDate}T${b.time || b.startTime || '00:00'}`);
        return dtA.getTime() - dtB.getTime();
      });
  }, [appointments]);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        getUpcoming,
        reloadAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export function useAppointments(): AppointmentContextType {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
