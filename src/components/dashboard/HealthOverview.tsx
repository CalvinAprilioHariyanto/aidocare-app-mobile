import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { mockHealthMetrics } from '../../data/dashboardData';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  status?: string;
  icon: React.ReactNode;
  iconBg: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  status = 'Normal',
  icon,
  iconBg,
}) => {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.metricInfo}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>
          {value} {unit && <Text style={styles.metricUnit}>{unit}</Text>}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

export const HealthOverview: React.FC = () => {
  const { user } = useAuth();
  const metrics = mockHealthMetrics;
  const bloodType = user?.bloodType || 'O+';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="activity" size={17} color={Colors.primary} />
          <Text style={styles.title}>Health Overview</Text>
        </View>
        <Text style={styles.subtitle}>Your latest health vitals</Text>
      </View>

      <View style={styles.grid}>
        {/* Blood Type Card */}
        <View style={styles.metricCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
            <MaterialCommunityIcons name="water" size={20} color="#dc2626" />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Blood Type</Text>
            <Text style={styles.metricValue}>{bloodType}</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#fef2f2' }]}>
              <Text style={[styles.statusText, { color: '#dc2626' }]}>RH Positive</Text>
            </View>
          </View>
        </View>

        {/* Blood Pressure */}
        <MetricCard
          label="Blood Pressure"
          value={`${metrics.bloodPressure.systolic}/${metrics.bloodPressure.diastolic}`}
          unit={metrics.bloodPressure.unit}
          status="Normal"
          icon={<MaterialCommunityIcons name="heart-pulse" size={20} color={Colors.primary} />}
          iconBg={Colors.primary50}
        />

        {/* Heart Rate */}
        <MetricCard
          label="Heart Rate"
          value={String(metrics.heartRate.value)}
          unit={metrics.heartRate.unit}
          status="Normal"
          icon={<Feather name="heart" size={18} color="#ec4899" />}
          iconBg="#fdf2f8"
        />

        {/* Weight */}
        <MetricCard
          label="Weight"
          value={String(metrics.weight.value)}
          unit={metrics.weight.unit}
          status="Normal"
          icon={<MaterialCommunityIcons name="scale-bathroom" size={20} color="#0284c7" />}
          iconBg="#f0f9ff"
        />

        {/* BMI */}
        <MetricCard
          label="Body Mass Index"
          value={String(metrics.bmi.value)}
          unit={metrics.bmi.unit}
          status="Normal"
          icon={<MaterialCommunityIcons name="human" size={20} color="#8b5cf6" />}
          iconBg="#f5f3ff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    marginBottom: 14,
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
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricInfo: {
    gap: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  metricUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
});
