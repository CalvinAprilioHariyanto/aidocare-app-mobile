import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountSwitcher } from '../../components/auth/AccountSwitcher';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/ui/Logo';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: string, value: string) {
    if (error) setError('');
    const nextVal = field === 'phone' ? value.replace(/\D/g, '').slice(0, 15) : value;
    setFormData((prev) => ({ ...prev, [field]: nextVal }));
  }

  function validate(): boolean {
    if (!formData.firstName.trim()) {
      setError('First name is required.');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setError('Enter a valid email address.');
      return false;
    }
    if (!/^\d{7,15}$/.test(formData.phone)) {
      setError('Enter a phone number using 7 to 15 digits.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (
      !/[a-z]/.test(formData.password) ||
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      setError('Password must include uppercase, lowercase, and a number.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Your passwords do not match.');
      return false;
    }
    if (!acceptedTerms) {
      setError('Please agree to the Terms of Use and handling of personal information.');
      return false;
    }

    return true;
  }

  async function handleRegister() {
    if (!validate()) return;

    setError('');
    setIsSubmitting(true);

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created. Please log in to continue.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Centered Aido Care Logo */}
          <Logo style={styles.logo} />

          {/* Segmented Account Switcher Tab: New Patient | Existing Patient */}
          <AccountSwitcher activeTab="register" />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Start your smarter healthcare journey with Aido Care
            </Text>
          </View>

          {/* Error Banner */}
          {Boolean(error) && (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.form}>
            {/* First Name & Last Name Row */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="First Name"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChangeText={(val) => updateField('firstName', val)}
                  autoCapitalize="words"
                  icon={<Feather name="user" size={16} color={Colors.textMuted} />}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Last Name"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChangeText={(val) => updateField('lastName', val)}
                  autoCapitalize="words"
                  icon={<Feather name="user" size={16} color={Colors.textMuted} />}
                />
              </View>
            </View>

            {/* Email */}
            <Input
              label="Email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChangeText={(val) => updateField('email', val)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              icon={<Feather name="mail" size={16} color={Colors.textMuted} />}
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              placeholder="089532632332"
              value={formData.phone}
              onChangeText={(val) => updateField('phone', val)}
              keyboardType="phone-pad"
              maxLength={15}
              icon={<Feather name="phone" size={16} color={Colors.textMuted} />}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              placeholder="Min. 8 chars (A-Z, 0-9, symbol)"
              value={formData.password}
              onChangeText={(val) => updateField('password', val)}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm password"
              placeholder="********"
              value={formData.confirmPassword}
              onChangeText={(val) => updateField('confirmPassword', val)}
            />

            {/* Terms and Conditions Checkbox */}
            <View style={styles.termsWrapper}>
              <Checkbox
                checked={acceptedTerms}
                onChange={setAcceptedTerms}
                label={
                  <Text style={styles.termsText}>
                    I agree to the handling of personal information.{' '}
                    <Text
                      style={styles.termsLink}
                      onPress={() =>
                        Alert.alert('Terms of Use', 'Aido Care Terms of Service & Privacy Policy.')
                      }
                    >
                      Terms of Use
                    </Text>
                  </Text>
                }
              />
            </View>

            {/* Submit Button */}
            <Button
              title="Register"
              loading={isSubmitting}
              onPress={handleRegister}
              style={styles.submitButton}
            />

            {/* Footer Navigation Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
              >
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  logo: {
    marginVertical: 12,
  },
  header: {
    marginBottom: 16,
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.errorLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorBannerText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  form: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  termsWrapper: {
    marginVertical: 8,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '600',
    color: Colors.primary,
  },
  submitButton: {
    marginTop: 12,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
