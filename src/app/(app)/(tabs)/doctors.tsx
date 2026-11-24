import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { doctors, specialties } from '../../../data/doctors';
import { Doctor } from '../../../types/models';

export default function FindDoctorScreen() {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialtyFilters = useMemo(() => ['All', ...specialties], []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const query = search.toLowerCase().trim();
      const fullName = `dr. ${doc.firstName} ${doc.lastName}`.toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        (doc.specialties && doc.specialties.some((s) => s.toLowerCase().includes(query)));

      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        doc.specialty === selectedSpecialty ||
        (doc.specialties && doc.specialties.includes(selectedSpecialty));

      return matchesSearch && matchesSpecialty;
    });
  }, [search, selectedSpecialty]);

  function handleDoctorPress(doc: Doctor) {
    router.push({
      pathname: '/(app)/doctor/[id]',
      params: { id: doc.id },
    });
  }

  function handleBookPress(doc: Doctor) {
    router.push({
      pathname: '/(app)/book-appointment',
      params: { doctorId: doc.id },
    });
  }

  function renderDoctorCard({ item: doc }: { item: Doctor }) {
    const initials = `${doc.firstName[0]}${doc.lastName[0]}`.toUpperCase();

    return (
      <TouchableOpacity
        style={styles.doctorCard}
        activeOpacity={0.8}
        onPress={() => handleDoctorPress(doc)}
      >
        <View style={styles.cardTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.doctorName}>
              Dr. {doc.firstName} {doc.lastName}
            </Text>
            <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>

            <View style={styles.statsRow}>
              <View style={styles.ratingBadge}>
                <Feather name="star" size={12} color="#eab308" />
                <Text style={styles.ratingText}>{doc.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.statsDivider}>•</Text>
              <Text style={styles.reviewsText}>{doc.reviewCount} reviews</Text>
              <Text style={styles.statsDivider}>•</Text>
              <Text style={styles.experienceText}>{doc.experience}y exp</Text>
            </View>
          </View>
        </View>

        <Text style={styles.bioText} numberOfLines={2}>
          {doc.bio}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.feeSection}>
            <Text style={styles.feeLabel}>Consultation</Text>
            <Text style={styles.feeValue}>
              Rp {doc.consultationFee.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => handleDoctorPress(doc)}
              activeOpacity={0.8}
            >
              <Text style={styles.profileBtnText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => handleBookPress(doc)}
              activeOpacity={0.8}
            >
              <Text style={styles.bookBtnText}>Book</Text>
              <Feather name="arrow-right" size={14} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Find a Doctor</Text>
        <Text style={styles.screenSubtitle}>
          Search and book consultations with our specialists.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or specialty..."
            placeholderTextColor={Colors.textPlaceholder}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {Boolean(search) && (
            <TouchableOpacity
              onPress={() => setSearch('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Specialty Filter Horizontal Scroll */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={specialtyFilters}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedSpecialty === item;
            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedSpecialty(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctorCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="user-x" size={26} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms or specialty filter.
            </Text>
            {(Boolean(search) || selectedSpecialty !== 'All') && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSearch('');
                  setSelectedSpecialty('All');
                }}
              >
                <Text style={styles.resetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            )}
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
    paddingBottom: 10,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 3,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterList: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary700,
    borderColor: Colors.primary700,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
    gap: 14,
  },
  doctorCard: {
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary50,
    borderWidth: 1,
    borderColor: Colors.primary200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary700,
  },
  headerInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statsDivider: {
    color: Colors.textPlaceholder,
    fontSize: 10,
  },
  reviewsText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  experienceText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bioText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  feeSection: {
    gap: 1,
  },
  feeLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary700,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary700,
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textInverse,
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
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: Colors.primary50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary700,
  },
});
