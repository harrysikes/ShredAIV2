import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  return (
    <View 
      style={[
        styles.separator,
        orientation === 'vertical' && styles.vertical,
        style
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#E5E7EB',
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});
