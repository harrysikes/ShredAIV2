import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

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
    backgroundColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#000000',
  },
  selected: {
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
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
    color: '#ffffff',
    fontSize: 14,
  },
  outlineText: {
    color: '#000000',
    fontSize: 14,
  },
  selectedText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  ghostText: {
    color: '#000000',
    fontSize: 14,
  },
  linkText: {
    color: '#000000',
    fontSize: 14,
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
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
