import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { mockRecentActivity } from '../../data/dashboardData';
import { RecentActivityItem } from '../../types/models';

function formatRelativeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 0 && diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

interface ActivityIconConfig {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
}

const iconConfigs: Record<string, ActivityIconConfig> = {
  consultation: { icon: 'user-check', color: Colors.primary700, bg: Colors.primary50 },
  prescription: { icon: 'file-text', color: '#0284c7', bg: '#eff6ff' },
  lab: { icon: 'activity', color: '#d97706', bg: '#fffbeb' },
  record: { icon: 'folder', color: '#64748b', bg: '#f1f5f9' },
};

interface RecentActivityListProps {
  onViewAll?: () => void;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ onViewAll }) => {
  const activities = mockRecentActivity;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Feather name="clock" size={17} color={Colors.primary} />
          <Text style={styles.cardTitle}>Recent Activity</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.list}>
        {activities.map((item, index) => {
          const config = iconConfigs[item.type] || iconConfigs.record;
          const isLast = index === activities.length - 1;

          return (
            <View
              key={item.id}
              style={[styles.itemRow, !isLast && styles.itemBorder]}
            >
              <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
                <Feather name={config.icon} size={16} color={config.color} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <Text style={styles.itemDate}>{formatRelativeDate(item.date)}</Text>
            </View>
          );
        })}
      </View>
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
    marginBottom: 12,
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
  list: {
    gap: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemDate: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
