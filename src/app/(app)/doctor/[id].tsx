import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { getDoctorById } from '../../../data/doctors';

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = useMemo(() => getDoctorById(id || 'DOC-001'), [id]);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Doctor Not Found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`.toUpperCase();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const availabilityDays = Object.keys(doctor.availability || {})
    .map(Number)
    .map((d) => dayNames[d])
    .join(', ');

  function handleBook() {
    router.push({
      pathname: '/(app)/book-appointment',
      params: { doctorId: doctor!.id },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Doctor Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.doctorName}>
                Dr. {doctor.firstName} {doctor.lastName}
              </Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>

              <View style={styles.ratingRow}>
                <Feather name="star" size={13} color="#eab308" />
                <Text style={styles.ratingVal}>{doctor.rating.toFixed(1)}</Text>
                <Text style={styles.reviewsCount}>({doctor.reviewCount} reviews)</Text>
              </View>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.quickMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Experience</Text>
              <Text style={styles.metricVal}>{doctor.experience} Years</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Consultation</Text>
              <Text style={styles.metricVal}>
                Rp {(doctor.consultationFee || 150000).toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{doctor.bio}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Details & Credentials</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="award" size={16} color={Colors.primary700} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoVal}>{doctor.education}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="map-pin" size={16} color={Colors.primary700} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoVal}>{doctor.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="calendar" size={16} color={Colors.primary700} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Available Days</Text>
              <Text style={styles.infoVal}>{availabilityDays || 'Monday - Friday'}</Text>
            </View>
          </View>
        </View>

        {/* Languages Spoken */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languagesRow}>
            {(doctor.languages || ['English', 'Indonesian']).map((lang) => (
              <View key={lang} style={styles.langChip}>
                <Text style={styles.langChipText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomFeeBox}>
          <Text style={styles.bottomFeeLabel}>Total Fee</Text>
          <Text style={styles.bottomFeeVal}>
            Rp {doctor.consultationFee.toLocaleString('id-ID')}
          </Text>
        </View>

        <TouchableOpacity style={styles.bookCtaBtn} onPress={handleBook} activeOpacity={0.8}>
          <Feather name="calendar" size={16} color={Colors.textInverse} />
          <Text style={styles.bookCtaBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    paddingBottom: 20,
    gap: 16,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarLarge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLargeText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewsCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  quickMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.borderLight,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary700,
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
    marginBottom: 10,
  },
  bioText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    backgroundColor: Colors.primary50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary700,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomFeeBox: {
    gap: 1,
  },
  bottomFeeLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomFeeVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary700,
  },
  bookCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary700,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  bookCtaBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    fontWeight: '600',
  },
});
