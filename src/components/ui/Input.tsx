import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input = React.forwardRef<any, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      rightElement,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            Boolean(error) && styles.inputContainerError,
          ]}
        >
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              icon ? styles.inputWithIcon : undefined,
              rightElement ? styles.inputWithRightElement : undefined,
              inputStyle,
            ]}
            placeholderTextColor={Colors.textPlaceholder}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {rightElement && (
            <View style={styles.rightElementContainer}>{rightElement}</View>
          )}
        </View>
        {(Boolean(error) || Boolean(helperText)) && (
          <Text style={[styles.helper, Boolean(error) && styles.helperError]}>
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: Colors.borderFocus,
    backgroundColor: Colors.surfaceMint,
  },
  inputContainerError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  iconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  inputWithIcon: {
    paddingLeft: 2,
  },
  inputWithRightElement: {
    paddingRight: 8,
  },
  rightElementContainer: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginLeft: 4,
  },
  helperError: {
    color: Colors.error,
    fontWeight: '500',
  },
});
