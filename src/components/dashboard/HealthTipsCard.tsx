import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { mockHealthTips } from '../../data/dashboardData';

const tagStyles: Record<string, { bg: string; text: string }> = {
  Wellness: { bg: Colors.primary50, text: Colors.primary700 },
  Prevention: { bg: '#f0fdf4', text: '#15803d' },
};

export const HealthTipsCard: React.FC = () => {
  const tips = mockHealthTips;
  if (!tips || tips.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="shield" size={17} color={Colors.primary} />
          <Text style={styles.title}>Health & Wellness Tips</Text>
        </View>
      </View>

      <View style={styles.tipsList}>
        {tips.map((tip) => {
          const styleConfig = tagStyles[tip.tag] || {
            bg: Colors.surfaceMuted,
            text: Colors.textSecondary,
          };

          return (
            <View key={tip.id} style={styles.tipItem}>
              <View style={[styles.tagBadge, { backgroundColor: styleConfig.bg }]}>
                <Text style={[styles.tagText, { color: styleConfig.text }]}>{tip.tag}</Text>
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipBody}>{tip.body}</Text>
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
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  tipBody: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
});
