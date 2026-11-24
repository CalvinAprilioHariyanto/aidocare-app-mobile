import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface LogoProps {
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function Logo({ style, size = 'medium', showText = true }: LogoProps) {
  const fontSizes = {
    small: 18,
    medium: 22,
    large: 26,
  };

  if (!showText) return null;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.brandText, { fontSize: fontSizes[size] }]}>
        <Text style={styles.aidoText}>Aido</Text>
        <Text style={styles.careText}> Care</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  aidoText: {
    color: Colors.textPrimary,
  },
  careText: {
    color: Colors.primary,
  },
});

