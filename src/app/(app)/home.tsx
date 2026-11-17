import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

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

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Logo size="small" />
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutIconButton}
            accessibilityLabel="Sign Out"
          >
            <Feather name="log-out" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {/* Welcome Banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.welcomeBadgeText}>Active Session</Text>
          </View>
          <Text style={styles.welcomeTitle}>
            Hello, {displayName} 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Welcome to Aido Care. Your healthcare dashboard is ready.
          </Text>
        </View>

        {/* User Profile Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{displayName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user?.email || '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Role</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {(user?.role || 'patient').toUpperCase()}
              </Text>
            </View>
          </View>
          {Boolean(user?.phoneNumber) && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{user?.phoneNumber}</Text>
              </View>
            </>
          )}
        </View>

        {/* Healthcare Services Menu Preview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Healthcare Services</Text>
          <View style={styles.servicesGrid}>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIconCircle, { backgroundColor: Colors.primary100 }]}>
                <Feather name="calendar" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.serviceLabel}>Appointments</Text>
            </View>

            <View style={styles.serviceItem}>
              <View style={[styles.serviceIconCircle, { backgroundColor: '#e0f2fe' }]}>
                <Feather name="user-check" size={20} color="#0284c7" />
              </View>
              <Text style={styles.serviceLabel}>Find Doctors</Text>
            </View>

            <View style={styles.serviceItem}>
              <View style={[styles.serviceIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Feather name="file-text" size={20} color="#d97706" />
              </View>
              <Text style={styles.serviceLabel}>Health Records</Text>
            </View>
          </View>
        </View>

        {/* Logout Action */}
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoutIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.errorLight,
  },
  welcomeCard: {
    backgroundColor: Colors.primary700,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.primary700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  welcomeBadgeText: {
    fontSize: 11,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textInverse,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: Colors.primary100,
    lineHeight: 18,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  roleBadge: {
    backgroundColor: Colors.surfaceMint,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceMintBorder,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  serviceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 8,
    borderColor: '#fca5a5',
  },
});
