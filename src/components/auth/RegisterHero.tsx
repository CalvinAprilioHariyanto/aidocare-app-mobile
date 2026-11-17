import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';

const SLIDE_IMAGES = [
  require('../../assets/images/slide1.jpg'),
  require('../../assets/images/slide2.jpg'),
  require('../../assets/images/slide3.jpg'),
  require('../../assets/images/slide4.jpg'),
  require('../../assets/images/slide5.jpg'),
];

const SPECIALTIES = [
  'General Doctor',
  'Cardiology',
  'Dermatology',
  'Dentist',
  'Pediatricians',
];

export function RegisterHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 3.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function handlePrev() {
    setCurrentSlide((prev) => (prev - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length);
  }

  function handleNext() {
    setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Find the Right Care, Faster</Text>

      {/* Carousel Container */}
      <View style={styles.carouselContainer}>
        <Image
          source={SLIDE_IMAGES[currentSlide]}
          style={styles.slideImage}
          resizeMode="cover"
        />

        {/* Carousel Prev/Next Buttons */}
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.arrowButton, styles.arrowLeft]}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={16} color={Colors.textInverse} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.arrowButton, styles.arrowRight]}
          activeOpacity={0.7}
        >
          <Feather name="chevron-right" size={16} color={Colors.textInverse} />
        </TouchableOpacity>

        {/* Dot Indicators */}
        <View style={styles.dotsContainer}>
          {SLIDE_IMAGES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentSlide(index)}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.subtitle}>
        Not sure which specialist to see? Get guided to the right care based on your needs.
      </Text>

      {/* Specialty Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.specialtiesScroll}
      >
        {SPECIALTIES.map((item, idx) => (
          <View key={idx} style={styles.specialtyChip}>
            <View style={styles.specialtyDot} />
            <Text style={styles.specialtyText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceMint,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceMintBorder,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  carouselContainer: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    width: 18,
    backgroundColor: Colors.textInverse,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 16,
  },
  specialtiesScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  specialtyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
