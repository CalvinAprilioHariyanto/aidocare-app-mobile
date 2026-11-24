import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HealthOverview } from '../../../components/dashboard/HealthOverview';
import { HealthTipsCard } from '../../../components/dashboard/HealthTipsCard';
import { ProfileCompletion } from '../../../components/dashboard/ProfileCompletion';
import { QuickActions } from '../../../components/dashboard/QuickActions';
import { RecentActivityList } from '../../../components/dashboard/RecentActivityList';
import { UpcomingAppointmentCard } from '../../../components/dashboard/UpcomingAppointmentCard';
import { WelcomeHeader } from '../../../components/dashboard/WelcomeHeader';
import { Colors } from '../../../constants/colors';
import { useAppointments } from '../../../context/AppointmentContext';
import { useAuth } from '../../../context/AuthContext';
import { Appointment } from '../../../types/models';

export default function HomeTabScreen() {
  const { logout } = useAuth();
  const { reloadAppointments } = useAppointments();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await reloadAppointments();
    } finally {
      setRefreshing(false);
    }
  }

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to log out of Aido Care?', [
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

  function handleQuickAction(action: { id: string; label: string }) {
    switch (action.id) {
      case 'find-doctor':
        router.push('/(app)/(tabs)/doctors');
        break;
      case 'appointments':
        router.push('/(app)/(tabs)/appointments');
        break;
      case 'health-profile':
        router.push('/(app)/(tabs)/profile');
        break;
      default:
        break;
    }
  }

  function handleDetailPress(appointment: Appointment) {
    router.push({
      pathname: '/(app)/appointment/[id]',
      params: { id: appointment.id },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* 1. Welcome Header */}
        <WelcomeHeader
          onLogoutPress={handleLogout}
          onProfilePress={() => router.push('/(app)/(tabs)/profile')}
        />

        {/* 2. Quick Actions 2x2 Grid */}
        <QuickActions onActionPress={handleQuickAction} />

        {/* 3. Profile Completion Banner */}
        <ProfileCompletion
          onUpdatePress={() => router.push('/(app)/(tabs)/profile')}
        />

        {/* 4. Upcoming Appointment Card */}
        <UpcomingAppointmentCard
          onViewAll={() => router.push('/(app)/(tabs)/appointments')}
          onBookPress={() => router.push('/(app)/(tabs)/doctors')}
          onDetailPress={handleDetailPress}
        />

        {/* 5. Health Vitals Overview */}
        <HealthOverview />

        {/* 6. Recent Activity Feed */}
        <RecentActivityList />

        {/* 7. Health & Wellness Tips */}
        <HealthTipsCard />

        <View style={styles.bottomSpacer} />
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
    paddingBottom: 24,
  },
  bottomSpacer: {
    height: 16,
  },
});
