import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { Colors } from '../../../constants/colors';
import { useAuth } from '../../../context/AuthContext';
import { getPatientProfile, updatePatientProfile } from '../../../services/patientService';
import { EmergencyContact, PatientProfile } from '../../../types/models';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profile, setProfile] = useState<PatientProfile>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phoneNumber || user?.phone || '',
    dateOfBirth: '1998-05-14',
    gender: 'Male',
    bloodType: 'O+',
    height: '172 cm',
    weight: '68 kg',
    allergies: 'None reported',
    medicalConditions: 'None',
    currentMedications: 'Multivitamin',
    previousSurgeries: 'None',
    otherMedicalInfo: '',
    emergencyContacts: [
      { name: 'Sarah Patient', relationship: 'Spouse', phone: '+62 812 9876 5432' },
    ],
  });

  useEffect(() => {
    let active = true;
    getPatientProfile()
      .then((data) => {
        if (active && data) {
          setProfile((prev) => ({
            ...prev,
            ...data,
            firstName: data.firstName || prev.firstName,
            lastName: data.lastName || prev.lastName,
          }));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleFieldChange(field: keyof PatientProfile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  }

  function handleEmergencyChange(index: number, key: keyof EmergencyContact, value: string) {
    const list = [...(profile.emergencyContacts || [])];
    list[index] = { ...list[index], [key]: value };
    setProfile((prev) => ({ ...prev, emergencyContacts: list }));
    setSavedSuccess(false);
  }

  function addEmergencyContact() {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [
        ...(prev.emergencyContacts || []),
        { name: '', relationship: '', phone: '' },
      ],
    }));
  }

  function removeEmergencyContact(index: number) {
    const list = [...(profile.emergencyContacts || [])];
    if (list.length <= 1) {
      list[0] = { name: '', relationship: '', phone: '' };
    } else {
      list.splice(index, 1);
    }
    setProfile((prev) => ({ ...prev, emergencyContacts: list }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updatePatientProfile(profile);
      setSavedSuccess(true);
      Alert.alert('Success', 'Your health profile has been saved.');
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const initials = `${profile.firstName?.[0] || 'P'}${profile.lastName?.[0] || 'A'}`.toUpperCase();

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.screenHeader}>
            <View>
              <Text style={styles.screenTitle}>Health Profile</Text>
              <Text style={styles.screenSubtitle}>View and manage your medical details</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Feather name="log-out" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>

          {/* Patient Snapshot Card */}
          <View style={styles.snapshotCard}>
            <View style={styles.snapshotTop}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>{initials}</Text>
              </View>
              <View style={styles.snapshotInfo}>
                <Text style={styles.patientName}>
                  {profile.firstName || 'Patient'} {profile.lastName}
                </Text>
                <Text style={styles.patientId}>ID: PAT-001 • Active Record</Text>
              </View>
            </View>

            <View style={styles.snapshotMetricsRow}>
              <View style={styles.snapshotMetric}>
                <Text style={styles.metricLabel}>Blood Type</Text>
                <Text style={styles.metricVal}>{profile.bloodType || '—'}</Text>
              </View>
              <View style={styles.snapshotMetric}>
                <Text style={styles.metricLabel}>Height</Text>
                <Text style={styles.metricVal}>{profile.height || '—'}</Text>
              </View>
              <View style={styles.snapshotMetric}>
                <Text style={styles.metricLabel}>Weight</Text>
                <Text style={styles.metricVal}>{profile.weight || '—'}</Text>
              </View>
            </View>
          </View>

          {/* Section 1: Personal Information */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>01</Text>
              </View>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={styles.fieldLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={profile.firstName}
                  onChangeText={(v) => handleFieldChange('firstName', v)}
                />
              </View>
              <View style={styles.formFieldHalf}>
                <Text style={styles.fieldLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={profile.lastName}
                  onChangeText={(v) => handleFieldChange('lastName', v)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={profile.dateOfBirth}
                placeholder="YYYY-MM-DD"
                onChangeText={(v) => handleFieldChange('dateOfBirth', v)}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={profile.gender}
                  placeholder="Male / Female"
                  onChangeText={(v) => handleFieldChange('gender', v)}
                />
              </View>
              <View style={styles.formFieldHalf}>
                <Text style={styles.fieldLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={profile.phone}
                  keyboardType="phone-pad"
                  onChangeText={(v) => handleFieldChange('phone', v)}
                />
              </View>
            </View>
          </View>

          {/* Section 2: Basic Health Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>02</Text>
              </View>
              <Text style={styles.sectionTitle}>Basic Health</Text>
            </View>

            {/* Blood Type Selection Chips */}
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Blood Type</Text>
              <View style={styles.bloodChipsRow}>
                {bloodTypes.map((type) => {
                  const isSelected = profile.bloodType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.bloodChip, isSelected && styles.bloodChipActive]}
                      onPress={() => handleFieldChange('bloodType', type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.bloodChipText,
                          isSelected && styles.bloodChipTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={styles.fieldLabel}>Height</Text>
                <TextInput
                  style={styles.input}
                  value={profile.height}
                  placeholder="e.g. 170 cm"
                  onChangeText={(v) => handleFieldChange('height', v)}
                />
              </View>
              <View style={styles.formFieldHalf}>
                <Text style={styles.fieldLabel}>Weight</Text>
                <TextInput
                  style={styles.input}
                  value={profile.weight}
                  placeholder="e.g. 65 kg"
                  onChangeText={(v) => handleFieldChange('weight', v)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Known Allergies</Text>
              <TextInput
                style={styles.input}
                value={profile.allergies}
                placeholder="e.g. Peanuts, Penicillin (or None)"
                onChangeText={(v) => handleFieldChange('allergies', v)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Medical Conditions</Text>
              <TextInput
                style={styles.input}
                value={profile.medicalConditions}
                placeholder="e.g. Asthma, Hypertension (or None)"
                onChangeText={(v) => handleFieldChange('medicalConditions', v)}
              />
            </View>
          </View>

          {/* Section 3: Medical History */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>03</Text>
              </View>
              <Text style={styles.sectionTitle}>Medical History</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Current Medications</Text>
              <TextInput
                style={styles.input}
                value={profile.currentMedications}
                placeholder="e.g. Vitamin C, Metformin"
                onChangeText={(v) => handleFieldChange('currentMedications', v)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Previous Surgeries</Text>
              <TextInput
                style={styles.input}
                value={profile.previousSurgeries}
                placeholder="e.g. Appendectomy (2020)"
                onChangeText={(v) => handleFieldChange('previousSurgeries', v)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Other Medical Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.otherMedicalInfo}
                placeholder="Any preferences or additional notes..."
                multiline
                numberOfLines={3}
                onChangeText={(v) => handleFieldChange('otherMedicalInfo', v)}
              />
            </View>
          </View>

          {/* Section 4: Emergency Contacts */}
          <View style={styles.sectionCard}>
            <View style={styles.emergencyHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>04</Text>
                </View>
                <Text style={styles.sectionTitle}>Emergency Contacts</Text>
              </View>

              <TouchableOpacity
                style={styles.addContactBtn}
                onPress={addEmergencyContact}
                activeOpacity={0.7}
              >
                <Feather name="plus" size={13} color={Colors.primary} />
                <Text style={styles.addContactBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            {profile.emergencyContacts?.map((contact, index) => (
              <View key={index} style={styles.contactItemBox}>
                <View style={styles.contactItemHeader}>
                  <Text style={styles.contactNum}>Contact {index + 1}</Text>
                  {(profile.emergencyContacts?.length || 0) > 1 && (
                    <TouchableOpacity
                      onPress={() => removeEmergencyContact(index)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={contact.name}
                    placeholder="e.g. Jane Doe"
                    onChangeText={(v) => handleEmergencyChange(index, 'name', v)}
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formFieldHalf}>
                    <Text style={styles.fieldLabel}>Relationship</Text>
                    <TextInput
                      style={styles.input}
                      value={contact.relationship}
                      placeholder="e.g. Spouse / Parent"
                      onChangeText={(v) => handleEmergencyChange(index, 'relationship', v)}
                    />
                  </View>
                  <View style={styles.formFieldHalf}>
                    <Text style={styles.fieldLabel}>Phone</Text>
                    <TextInput
                      style={styles.input}
                      value={contact.phone}
                      keyboardType="phone-pad"
                      placeholder="+62 8..."
                      onChangeText={(v) => handleEmergencyChange(index, 'phone', v)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color={Colors.textInverse} size="small" />
            ) : (
              <>
                <Feather name="check" size={18} color={Colors.textInverse} />
                <Text style={styles.saveBtnText}>Save Profile Changes</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
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
  keyboardView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.errorLight,
  },
  snapshotCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  snapshotTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatarLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLargeText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  snapshotInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  patientId: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  snapshotMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  snapshotMetric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary700,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary700,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.primary50,
    borderRadius: 8,
  },
  addContactBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary700,
  },
  formGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  formFieldHalf: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  bloodChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bloodChipActive: {
    backgroundColor: Colors.primary700,
    borderColor: Colors.primary700,
  },
  bloodChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  bloodChipTextActive: {
    color: Colors.textInverse,
  },
  contactItemBox: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  contactItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactNum: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary700,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: Colors.primary700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  bottomSpacer: {
    height: 24,
  },
});
