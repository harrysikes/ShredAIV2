import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressProps {
  value?: number;
  className?: string;
  style?: any;
}

export function Progress({ value = 0, style }: ProgressProps) {
  const progressWidth = Math.max(0, Math.min(100, value || 0));
  
  return (
    <View style={[styles.root, style]}>
      <View 
        style={[
          styles.indicator, 
          { width: `${progressWidth}%` }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  indicator: {
    backgroundColor: '#000000',
    height: '100%',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
