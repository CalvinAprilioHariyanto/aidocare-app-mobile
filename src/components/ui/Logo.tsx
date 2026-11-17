import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface LogoProps {
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function Logo({ style, size = 'medium', showText = true }: LogoProps) {
  const iconSizes = {
    small: { width: 28, height: 28, fontSize: 18 },
    medium: { width: 38, height: 38, fontSize: 22 },
    large: { width: 48, height: 48, fontSize: 26 },
  };

  const currentSize = iconSizes[size];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoRow}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ width: currentSize.width * 1.1, height: currentSize.height * 1.1 }}
          resizeMode="contain"
          accessibilityLabel="Aido Care Logo"
        />
        {showText && (
          <View style={styles.textContainer}>
            <Text style={[styles.brandText, { fontSize: currentSize.fontSize }]}>
              <Text style={styles.aidoText}>Aido</Text>
              <Text style={styles.careText}> Care</Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textContainer: {
    marginLeft: 4,
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
