import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';

export interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  route: string;
}

const featuredAction: QuickActionItem = {
  id: 'find-doctor',
  label: 'Find a Doctor',
  description: 'Search specialists and book consultations',
  icon: 'search',
  iconColor: Colors.primary700,
  bgColor: Colors.primary50,
  borderColor: Colors.primary200,
  route: '/(app)/doctors',
};

const secondaryActions: QuickActionItem[] = [
  {
    id: 'appointments',
    label: 'Appointments',
    description: 'View schedule',
    icon: 'calendar',
    iconColor: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    route: '/(app)/appointments',
  },
  {
    id: 'health-profile',
    label: 'Health Profile',
    description: 'Update your vitals & info',
    icon: 'user',
    iconColor: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    route: '/(app)/profile',
  },
];

interface QuickActionsProps {
  onActionPress: (item: QuickActionItem) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      {/* Primary Featured Action: Find Doctor */}
      <TouchableOpacity
        style={styles.featuredCard}
        activeOpacity={0.7}
        onPress={() => onActionPress(featuredAction)}
      >
        <View style={styles.featuredLeft}>
          <View style={[styles.iconContainer, { backgroundColor: featuredAction.bgColor }]}>
            <Feather name={featuredAction.icon} size={22} color={featuredAction.iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.featuredLabel}>{featuredAction.label}</Text>
            <Text style={styles.featuredDescription}>{featuredAction.description}</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      {/* Secondary Actions: Appointments & Health Profile */}
      <View style={styles.secondaryRow}>
        {secondaryActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onActionPress(action)}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
              <Feather name={action.icon} size={22} color={action.iconColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{action.label}</Text>
              <Text style={styles.description}>{action.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  featuredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  featuredLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  featuredDescription: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 114,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textContainer: {
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  description: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
