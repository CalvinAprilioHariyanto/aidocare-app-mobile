import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Checkbox({ checked, onChange, label, containerStyle }: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onChange(!checked)}
      style={[styles.container, containerStyle]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Feather name="check" size={13} color={Colors.textInverse} />}
      </View>
      {typeof label === 'string' ? (
        <Text style={styles.label}>{label}</Text>
      ) : (
        <View style={styles.customLabelContainer}>{label}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  customLabelContainer: {
    flex: 1,
  },
});
