// hooks/useNotifications.js
import * as Notifications from 'expo-notifications';

// Tells Expo how to display notifications when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Call this once on app load to get permission
export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Notification permission denied');
  }
  return status === 'granted';
};

// Call this when a station is saved as favourite
export const sendFavouriteNotification = async (stationName) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⭐ Favourite Saved!',
      body: `${stationName} has been added to your favourites.`,
    },
    trigger: null, // null = send immediately
  });
};