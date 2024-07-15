import React from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

interface NotificationDisplayProps {
  notification: Notifications.Notification | null;
}

export default function NotificationDisplay({ notification }: NotificationDisplayProps) {
  if (!notification) return null;

  return (
    <View style={{
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      marginVertical: 5,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
        {notification.request.content.title}
      </Text>
      <Text style={{ fontSize: 14 }}>
        {notification.request.content.body}
      </Text>
    </View>
  );
}
