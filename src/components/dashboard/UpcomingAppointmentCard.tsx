import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAppointments } from '../../context/AppointmentContext';
import { Appointment } from '../../types/models';

function formatAppointmentDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

interface UpcomingAppointmentCardProps {
  onViewAll?: () => void;
  onBookPress?: () => void;
  onDetailPress?: (appointment: Appointment) => void;
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  onViewAll,
  onBookPress,
  onDetailPress,
}) => {
  const { getUpcoming } = useAppointments();
  const upcomingList = getUpcoming();
  const appointment = upcomingList[0];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Feather name="clock" size={17} color={Colors.primary} />
          <Text style={styles.cardTitle}>Upcoming Appointment</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        )}
      </View>

      {!appointment ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="calendar" size={24} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No upcoming appointments</Text>
          <Text style={styles.emptySubtitle}>Book a consultation with a specialist.</Text>
          <TouchableOpacity style={styles.findDoctorBtn} onPress={onBookPress} activeOpacity={0.8}>
            <Feather name="search" size={15} color={Colors.textInverse} />
            <Text style={styles.findDoctorBtnText}>Find a Doctor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.appointmentBox}>
          {/* Status badge + date/time */}
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{appointment.status.toUpperCase()}</Text>
            </View>
            <View style={styles.dateTimeChip}>
              <Feather name="calendar" size={12} color={Colors.textMuted} />
              <Text style={styles.dateTimeText}>
                {formatAppointmentDate(appointment.date || appointment.appointmentDate)} ·{' '}
                {appointment.time || appointment.startTime}
              </Text>
            </View>
          </View>

          {/* Doctor Info */}
          <View style={styles.doctorRow}>
            <View style={styles.doctorAvatar}>
              <Feather name="user" size={18} color={Colors.primary} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>
                {appointment.doctorName ||
                  (appointment.doctor
                    ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                    : 'Doctor')}
              </Text>
              <Text style={styles.doctorSpecialty}>
                {appointment.specialty || appointment.doctor?.specialty || 'General Practice'}
              </Text>
            </View>
          </View>

          {/* Details (Location & Type) */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Feather name="map-pin" size={13} color={Colors.textMuted} />
              <Text style={styles.detailText} numberOfLines={1}>
                {appointment.location || 'Aido Care Clinic — Room 204'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="video" size={13} color={Colors.textMuted} />
              <Text style={styles.detailText} numberOfLines={1}>
                {appointment.type || appointment.consultationType || 'In-Person Consultation'}
              </Text>
            </View>
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onDetailPress && onDetailPress(appointment)}
            activeOpacity={0.8}
          >
            <Text style={styles.detailButtonText}>View Details</Text>
            <Feather name="arrow-right" size={14} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  findDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  findDoctorBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  appointmentBox: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
  },
  dateTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateTimeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  detailsRow: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
