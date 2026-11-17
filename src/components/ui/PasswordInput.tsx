import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Input, InputProps } from './Input';

export function PasswordInput(props: Omit<InputProps, 'rightElement' | 'icon'>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      secureTextEntry={!showPassword}
      icon={<Feather name="lock" size={17} color={Colors.textMuted} />}
      rightElement={
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.eyeButton}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={18}
            color={Colors.textMuted}
          />
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  eyeButton: {
    padding: 4,
  },
});
