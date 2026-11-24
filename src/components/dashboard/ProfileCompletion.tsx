import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { getProfileCompletion } from '../../data/dashboardData';

interface ProfileCompletionProps {
  onUpdatePress?: () => void;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onUpdatePress }) => {
  const { user } = useAuth();
  const { percent, missing } = getProfileCompletion(user);

  if (percent >= 100) return null;

  const missingText =
    missing.length > 0
      ? `Missing: ${missing.slice(0, 2).join(', ')}${missing.length > 2 ? ` +${missing.length - 2} more` : ''}`
      : 'Almost there!';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Feather name="alert-circle" size={18} color="#d97706" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Complete your health profile</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {missingText}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.percentText}>{percent}%</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={onUpdatePress}
        activeOpacity={0.8}
      >
        <Text style={styles.updateButtonText}>Update Profile</Text>
        <Feather name="chevron-right" size={15} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffdf5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  track: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    width: 36,
    textAlign: 'right',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  updateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
