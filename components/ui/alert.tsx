import React from 'react';
import { View, Text, StyleSheet, Modal, ViewStyle } from 'react-native';
import { Button } from './button';

interface AlertProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  actions?: Array<{
    text: string;
    onPress: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    style?: 'default' | 'destructive';
  }>;
  style?: ViewStyle;
}

export function Alert({ 
  title, 
  message, 
  visible, 
  onClose, 
  actions = [],
  style 
}: AlertProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alert, style]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          
          {actions.length > 0 ? (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  onPress={action.onPress}
                  style={action.style === 'destructive' ? [styles.actionButton, styles.destructiveButton] : styles.actionButton}
                >
                  {action.text}
                </Button>
              ))}
            </View>
          ) : (
            <View style={styles.actions}>
              <Button variant="outline" onPress={onClose}>
                OK
              </Button>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alert: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    minWidth: 80,
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
});
