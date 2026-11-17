import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface AccountSwitcherProps {
  activeTab: 'register' | 'login';
  style?: ViewStyle;
}

export function AccountSwitcher({ activeTab, style }: AccountSwitcherProps) {
  function handleSelect(tab: 'register' | 'login') {
    if (tab === activeTab) return;
    if (tab === 'register') {
      router.replace('/(auth)/register');
    } else {
      router.replace('/(auth)/login');
    }
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelect('register')}
        style={[styles.tab, activeTab === 'register' && styles.activeTab]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'register' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          New Patient
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelect('login')}
        style={[styles.tab, activeTab === 'login' && styles.activeTab]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'login' ? styles.activeTabText : styles.inactiveTabText,
          ]}
        >
          Existing Patient
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 12,
    padding: 4,
    height: 48,
    marginVertical: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.primary,
  },
  inactiveTabText: {
    color: Colors.textSecondary,
  },
});
