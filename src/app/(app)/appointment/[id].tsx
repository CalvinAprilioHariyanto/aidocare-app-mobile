import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { useAppointments } from '../../../context/AppointmentContext';
import { getDoctorById } from '../../../data/doctors';

const statusStyles: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  confirmed: { bg: '#dcfce7', text: '#15803d', dot: '#16a34a', label: 'Confirmed' },
  pending: { bg: '#fef3c7', text: '#b45309', dot: '#d97706', label: 'Pending' },
  completed: { bg: '#f1f5f9', text: '#475569', dot: '#64748b', label: 'Completed' },
  cancelled: { bg: '#fee2e2', text: '#b91c1c', dot: '#dc2626', label: 'Cancelled' },
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appointments, cancelAppointment } = useAppointments();

  const appointment = useMemo(
    () => appointments.find((a) => a.id === id),
    [appointments, id]
  );

  const doctor = useMemo(
    () => (appointment?.doctorId ? getDoctorById(appointment.doctorId) : null),
    [appointment]
  );

  if (!appointment) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Appointment not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusConfig =
    statusStyles[appointment.status.toLowerCase()] || statusStyles.completed;
  const isCancellable =
    appointment.status.toLowerCase() === 'confirmed' ||
    appointment.status.toLowerCase() === 'pending';

  function handleCancel() {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment(appointment!.id);
              Alert.alert('Cancelled', 'Your appointment has been cancelled.');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not cancel appointment.');
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Appointment Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig.dot }]} />
            <Text style={[styles.statusText, { color: statusConfig.text }]}>
              {statusConfig.label}
            </Text>
          </View>

          <Text style={styles.appointmentId}>Appointment ID: {appointment.id}</Text>

          <View style={styles.dateTimeBanner}>
            <View style={styles.dateBlock}>
              <Feather name="calendar" size={18} color={Colors.primary700} />
              <View>
                <Text style={styles.dateTitle}>
                  {formatDate(appointment.date || appointment.appointmentDate)}
                </Text>
                <Text style={styles.timeSubtitle}>
                  {appointment.time || appointment.startTime} (Local Time)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Doctor Information Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Doctor Information</Text>
          <View style={styles.doctorRow}>
            <View style={styles.avatarCircle}>
              <Feather name="user" size={22} color={Colors.primary700} />
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>
                {appointment.doctorName ||
                  (doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor')}
              </Text>
              <Text style={styles.docSpecialty}>
                {appointment.specialty || doctor?.specialty || 'General Medicine'}
              </Text>
              {doctor && (
                <Text style={styles.docExp}>{doctor.experience} years of clinical experience</Text>
              )}
            </View>
          </View>
        </View>

        {/* Location & Consultation Type */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Consultation Details</Text>

          <View style={styles.detailItem}>
            <View style={styles.detailIconBox}>
              <Feather name="layers" size={16} color={Colors.primary700} />
            </View>
            <View style={styles.detailTextBox}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailVal}>
                {appointment.type || appointment.consultationType || 'In-Person Consultation'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconBox}>
              <Feather name="map-pin" size={16} color={Colors.primary700} />
            </View>
            <View style={styles.detailTextBox}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailVal}>
                {appointment.location || 'Aido Care Clinic — Room 204'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconBox}>
              <Feather name="credit-card" size={16} color={Colors.primary700} />
            </View>
            <View style={styles.detailTextBox}>
              <Text style={styles.detailLabel}>Fee</Text>
              <Text style={styles.detailVal}>
                Rp {(appointment.consultationFee || 150000).toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {Boolean(appointment.notes) && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Patient Notes</Text>
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </View>
        )}

        {/* Cancel Action */}
        {isCancellable && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
            <Feather name="x-circle" size={16} color={Colors.error} />
            <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  backIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    gap: 16,
  },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  appointmentId: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  dateTimeBanner: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timeSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  docSpecialty: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 1,
  },
  docExp: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTextBox: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  notesText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: Colors.primary700,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: Colors.textInverse,
  },
});
