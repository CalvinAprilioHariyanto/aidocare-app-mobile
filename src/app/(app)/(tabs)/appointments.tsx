import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { useAppointments } from '../../../context/AppointmentContext';
import { Appointment, AppointmentStatus } from '../../../types/models';

type FilterType = 'all' | 'confirmed' | 'completed' | 'cancelled';

const filterTabs: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const statusStyles: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  confirmed: { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' },
  pending: { bg: '#fef3c7', text: '#b45309', dot: '#d97706' },
  completed: { bg: '#f1f5f9', text: '#475569', dot: '#64748b' },
  cancelled: { bg: '#fee2e2', text: '#b91c1c', dot: '#dc2626' },
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function AppointmentsScreen() {
  const { appointments, loading, reloadAppointments, cancelAppointment } = useAppointments();
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await reloadAppointments();
    } finally {
      setRefreshing(false);
    }
  }

  const filtered = useMemo(() => {
    const sorted = [...appointments].sort((a, b) => {
      const dtA = new Date(`${a.date || a.appointmentDate}T${a.time || a.startTime || '00:00'}`);
      const dtB = new Date(`${b.date || b.appointmentDate}T${b.time || b.startTime || '00:00'}`);
      return dtB.getTime() - dtA.getTime();
    });

    if (filter === 'all') return sorted;
    return sorted.filter((apt) => apt.status.toLowerCase() === filter);
  }, [appointments, filter]);

  function handleCancel(apt: Appointment) {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${apt.doctorName || 'your doctor'}?`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment(apt.id);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not cancel appointment.');
            }
          },
        },
      ]
    );
  }

  function handleAppointmentPress(apt: Appointment) {
    router.push({
      pathname: '/(app)/appointment/[id]',
      params: { id: apt.id },
    });
  }

  function renderAppointmentCard({ item: apt }: { item: Appointment }) {
    const styleConfig = statusStyles[apt.status.toLowerCase()] || statusStyles.completed;
    const canCancel = apt.status.toLowerCase() === 'confirmed' || apt.status.toLowerCase() === 'pending';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => handleAppointmentPress(apt)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.doctorRow}>
            <View style={styles.doctorAvatar}>
              <Feather name="user" size={18} color={Colors.primary700} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{apt.doctorName || 'Doctor'}</Text>
              <Text style={styles.specialtyText}>{apt.specialty || 'General Medicine'}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: styleConfig.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: styleConfig.dot }]} />
            <Text style={[styles.statusText, { color: styleConfig.text }]}>
              {apt.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Date, Time, Type Row */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={13} color={Colors.textMuted} />
            <Text style={styles.detailText}>{formatDate(apt.date || apt.appointmentDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={13} color={Colors.textMuted} />
            <Text style={styles.detailText}>{apt.time || apt.startTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="map-pin" size={13} color={Colors.textMuted} />
            <Text style={styles.detailText} numberOfLines={1}>
              {apt.location || 'Aido Care Clinic'}
            </Text>
          </View>
        </View>

        {/* Card Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewDetailBtn}
            onPress={() => handleAppointmentPress(apt)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDetailBtnText}>View Details</Text>
            <Feather name="chevron-right" size={14} color={Colors.primary} />
          </TouchableOpacity>

          {canCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancel(apt)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Appointments</Text>
            <Text style={styles.screenSubtitle}>Manage your scheduled consultations</Text>
          </View>

          <TouchableOpacity
            style={styles.newApptBtn}
            onPress={() => router.push('/(app)/(tabs)/doctors')}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={15} color={Colors.textInverse} />
            <Text style={styles.newApptBtnText}>Book</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabsContainer}>
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setFilter(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Appointments List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointmentCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="calendar" size={26} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No appointments found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all'
                ? 'You have not scheduled any appointments yet.'
                : `No ${filter} appointments.`}
            </Text>
            <TouchableOpacity
              style={styles.findDoctorBtn}
              onPress={() => router.push('/(app)/(tabs)/doctors')}
              activeOpacity={0.8}
            >
              <Feather name="search" size={15} color={Colors.textInverse} />
              <Text style={styles.findDoctorBtnText}>Find a Doctor</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  newApptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary700,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  newApptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  filterTabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceMuted,
    padding: 3,
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabButtonTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
    gap: 12,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  doctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary50,
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
  specialtyText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  detailsBox: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  cancelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  findDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
});
