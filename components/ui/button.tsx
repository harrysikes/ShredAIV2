import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import colors from '../../constants/colors';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'selected';
  size?: 'default' | 'sm' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default',
  onPress, 
  disabled = false,
  style,
  textStyle
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    size === 'default' ? styles.sizeDefault : styles[size],
    disabled && styles.disabled,
    style
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyleCombined}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    flexDirection: 'row',
  },
  
  // Variants
  default: {
    backgroundColor: colors.textPrimary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.textPrimary,
  },
  selected: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  sizeDefault: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  lg: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  
  // Text styles
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '500',
  },
  outlineText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  selectedText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  ghostText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  linkText: {
    color: colors.accent,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  smText: {
    fontSize: 12,
  },
  lgText: {
    fontSize: 16,
  },
  
  // States
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    opacity: 0.6,
  },
});
