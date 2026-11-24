import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAppointments } from '../../context/AppointmentContext';
import { consultationTypes, getDoctorById } from '../../data/doctors';

interface AvailableDate {
  date: string;
  dayName: string;
  dayNum: string;
  dayOfWeek: number;
}

function generateNextDates(doctorAvailability: Record<number, string[]> = {}): AvailableDate[] {
  const dates: AvailableDate[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; dates.length < 10 && i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();

    if (doctorAvailability[dayOfWeek] && doctorAvailability[dayOfWeek].length > 0) {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      dates.push({
        date: `${y}-${mo}-${da}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: String(d.getDate()),
        dayOfWeek,
      });
    }
  }

  return dates;
}

export default function BookAppointmentScreen() {
  const params = useLocalSearchParams<{ doctorId: string }>();
  const doctor = useMemo(() => getDoctorById(params.doctorId || 'DOC-001'), [params.doctorId]);
  const { bookAppointment } = useAppointments();

  const availableDates = useMemo(
    () => generateNextDates(doctor?.availability),
    [doctor?.availability]
  );

  const [selectedDate, setSelectedDate] = useState<AvailableDate | null>(
    availableDates[0] || null
  );

  const availableSlots = useMemo(() => {
    if (!selectedDate || !doctor?.availability) return [];
    return doctor.availability[selectedDate.dayOfWeek] || [];
  }, [selectedDate, doctor]);

  const [selectedSlot, setSelectedSlot] = useState<string>(availableSlots[0] || '10:00');
  const [selectedType, setSelectedType] = useState<string>(consultationTypes[0].label);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update selected slot when date changes if current slot is invalid
  React.useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(selectedSlot)) {
      setSelectedSlot(availableSlots[0]);
    }
  }, [selectedDate, availableSlots]);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Doctor not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  async function handleConfirm() {
    if (!selectedDate) {
      Alert.alert('Required', 'Please select an appointment date.');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Required', 'Please select an appointment time slot.');
      return;
    }

    setSubmitting(true);
    try {
      await bookAppointment({
        doctorId: doctor!.id,
        doctorName: `Dr. ${doctor!.firstName} ${doctor!.lastName}`,
        specialty: doctor!.specialty,
        date: selectedDate.date,
        time: selectedSlot,
        type: selectedType,
        location: doctor!.location,
        consultationFee: doctor!.consultationFee,
        notes: notes.trim(),
      });

      setIsSuccess(true);
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Could not complete appointment booking.');
    } finally {
      setSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Feather name="check" size={36} color={Colors.textInverse} />
          </View>
          <Text style={styles.successTitle}>Appointment Booked!</Text>
          <Text style={styles.successSubtitle}>
            Your appointment with Dr. {doctor.firstName} {doctor.lastName} on{' '}
            {selectedDate?.date} at {selectedSlot} has been confirmed.
          </Text>

          <View style={styles.successActions}>
            <TouchableOpacity
              style={styles.viewApptsBtn}
              onPress={() => router.replace('/(app)/(tabs)/appointments')}
            >
              <Text style={styles.viewApptsBtnText}>View Appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => router.replace('/(app)/(tabs)')}
            >
              <Text style={styles.homeBtnText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Book Appointment</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Doctor Info Card */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarText}>
                {doctor.firstName[0]}
                {doctor.lastName[0]}
              </Text>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.docName}>
                Dr. {doctor.firstName} {doctor.lastName}
              </Text>
              <Text style={styles.docSpecialty}>{doctor.specialty}</Text>
              <Text style={styles.docLocation}>{doctor.location}</Text>
            </View>
          </View>

          {/* 1. Select Date */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Feather name="calendar" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>1. Select Date</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
              {availableDates.map((item) => {
                const isSelected = selectedDate?.date === item.date;
                return (
                  <TouchableOpacity
                    key={item.date}
                    style={[styles.dateChip, isSelected && styles.dateChipActive]}
                    onPress={() => setSelectedDate(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                      {item.dayName}
                    </Text>
                    <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>
                      {item.dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 2. Select Time Slot */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Feather name="clock" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>2. Available Time Slots</Text>
            </View>

            {availableSlots.length === 0 ? (
              <Text style={styles.emptySlotText}>No slots available for this day.</Text>
            ) : (
              <View style={styles.slotsGrid}>
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.slotChip, isSelected && styles.slotChipActive]}
                      onPress={() => setSelectedSlot(slot)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* 3. Consultation Type */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Feather name="layers" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>3. Consultation Type</Text>
            </View>

            <View style={styles.typesList}>
              {consultationTypes.map((type) => {
                const isSelected = selectedType === type.label;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeOption, isSelected && styles.typeOptionActive]}
                    onPress={() => setSelectedType(type.label)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.typeTextGroup}>
                      <Text style={styles.typeTitle}>{type.label}</Text>
                      <Text style={styles.typeDesc}>{type.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Notes / Reason */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Feather name="message-square" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>4. Symptoms or Notes (Optional)</Text>
            </View>
            <TextInput
              style={styles.notesInput}
              placeholder="Describe your symptoms or reason for visit..."
              placeholderTextColor={Colors.textPlaceholder}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Payment & Fee Breakdown */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Fee Breakdown</Text>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Doctor Consultation</Text>
              <Text style={styles.feeValue}>
                Rp {doctor.consultationFee.toLocaleString('id-ID')}
              </Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Service Fee</Text>
              <Text style={styles.feeValue}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.feeRow}>
              <Text style={styles.feeTotalLabel}>Total Due</Text>
              <Text style={styles.feeTotalValue}>
                Rp {doctor.consultationFee.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirm}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.textInverse} size="small" />
            ) : (
              <>
                <Feather name="check-circle" size={18} color={Colors.textInverse} />
                <Text style={styles.confirmBtnText}>Confirm Booking</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    gap: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  doctorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  doctorDetails: {
    flex: 1,
  },
  docName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  docSpecialty: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  docLocation: {
    fontSize: 11,
    color: Colors.textSecondary,
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dateList: {
    gap: 10,
    paddingVertical: 2,
  },
  dateChip: {
    width: 58,
    height: 68,
    borderRadius: 12,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dateChipActive: {
    backgroundColor: Colors.primary700,
    borderColor: Colors.primary700,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  dayNameActive: {
    color: Colors.textInverse,
  },
  dayNum: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dayNumActive: {
    color: Colors.textInverse,
  },
  emptySlotText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotChip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotChipActive: {
    backgroundColor: Colors.primary700,
    borderColor: Colors.primary700,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  slotTextActive: {
    color: Colors.textInverse,
  },
  typesList: {
    gap: 10,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
  },
  typeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  typeTextGroup: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  typeDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notesInput: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: Colors.textPrimary,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  feeLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  feeTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  feeTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary700,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary700,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: Colors.primary700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  successActions: {
    width: '100%',
    gap: 12,
  },
  viewApptsBtn: {
    backgroundColor: Colors.primary700,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewApptsBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  homeBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: Colors.textInverse,
  },
});
