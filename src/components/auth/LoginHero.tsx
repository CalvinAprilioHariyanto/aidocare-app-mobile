import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Images } from '../../constants/images';

export function LoginHero() {
  return (
    <View style={styles.card}>
      {/* Top Titles */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Your Health, Our Care —{'\n'}
          <Text style={styles.titleHighlight}>Made Simple</Text>
        </Text>
        <Text style={styles.subtitle}>
          Access your healthcare journey with ease.
        </Text>
      </View>

      {/* Visual with Doctor Image & Floating Badges */}
      <View style={styles.visualContainer}>
        <View style={styles.imageBackdrop}>
          <Image
            source={Images.doctor}
            style={styles.doctorImage}
            resizeMode="contain"
          />
        </View>

        {/* Floating Callout Badge 1: 5.7M Doses */}
        <View style={[styles.badge, styles.badgeLeft]}>
          <Feather name="activity" size={12} color={Colors.info} />
          <Text style={styles.badgeText}>5.7M doses insured!</Text>
        </View>

        {/* Floating Callout Badge 2: 98% Accurate */}
        <View style={[styles.badge, styles.badgeRight]}>
          <Feather name="check-circle" size={12} color={Colors.success} />
          <Text style={styles.badgeText}>98% Accurate</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceMint,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceMintBorder,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  textContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  titleHighlight: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  visualContainer: {
    height: 150,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  imageBackdrop: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  doctorImage: {
    width: 220,
    height: 145,
  },
  badge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  badgeLeft: {
    bottom: 12,
    left: 4,
  },
  badgeRight: {
    top: 24,
    right: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
