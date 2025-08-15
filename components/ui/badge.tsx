import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'default',
  style,
  textStyle
}: BadgeProps) {
  const badgeStyle = [
    styles.base,
    styles[variant],
    size === 'default' ? styles.sizeDefault : styles[size],
    style
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyleCombined}>
        {children}
      </Text>
    </View>
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
  },
  secondary: {
    backgroundColor: '#F3F4F6',
  },
  destructive: {
    backgroundColor: '#EF4444',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  
  // Sizes
  sizeDefault: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 20,
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    minHeight: 16,
  },
  lg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 24,
  },
  
  // Text styles
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  secondaryText: {
    color: '#374151',
    fontSize: 12,
  },
  destructiveText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  outlineText: {
    color: '#374151',
    fontSize: 12,
  },
  smText: {
    fontSize: 10,
  },
  lgText: {
    fontSize: 14,
  },
});
