import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

interface WelcomeHeaderProps {
  onLogoutPress?: () => void;
  onProfilePress?: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  onLogoutPress,
  onProfilePress,
}) => {
  const { user } = useAuth();
  const firstName = user?.firstName || 'Patient';
  const initials = `${firstName[0] || 'P'}${user?.lastName?.[0] || 'A'}`.toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.greetingSection}>
          <Text style={styles.dateText}>{formatDate()}</Text>
          <Text style={styles.greetingTitle}>
            {getGreeting()},{'\n'}
            <Text style={styles.userName}>{firstName} 👋</Text>
          </Text>
          <Text style={styles.subtitle}>Here is your health overview today.</Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={onProfilePress}
            activeOpacity={0.8}
            accessibilityLabel="View profile"
          >
            <Text style={styles.avatarText}>{initials}</Text>
            <View style={styles.onlineDot} />
          </TouchableOpacity>

          {onLogoutPress && (
            <TouchableOpacity
              style={styles.logoutIconButton}
              onPress={onLogoutPress}
              activeOpacity={0.7}
              accessibilityLabel="Sign out"
            >
              <Feather name="log-out" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greetingSection: {
    flex: 1,
    paddingRight: 16,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  userName: {
    color: Colors.primary700,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  actionsSection: {
    alignItems: 'center',
    gap: 10,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary700,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: Colors.primary700,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  logoutIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
