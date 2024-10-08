import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { ExpoTokenRequest } from "../interfaces/ExpoTokenRequest";
import * as Device from "expo-device";
import { saveExpoPushToken } from "@services/notification/saveExpoPushToken";
import { showMessage } from "react-native-flash-message";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export default function useNotifications() {
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	const [notification, setNotification] =
		useState<Notifications.Notification | null>(null);
	const notificationListener = useRef<Notifications.Subscription | null>(
		null
	);
	const responseListener = useRef<Notifications.Subscription | null>(null);

	useEffect(() => {
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					console.log("Notification response received:", response);
				}
			);

		return () => {
			if (notificationListener.current) {
				Notifications.removeNotificationSubscription(
					notificationListener.current
				);
			}

			if (responseListener.current) {
				Notifications.removeNotificationSubscription(
					responseListener.current
				);
			}
		};
	}, []);

	const registerForPushNotificationsAsync = async (userId: number) => {
		let token;

		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
			console.log("Notification channel set for Android");
		}

		if (Device.isDevice) {
			console.log("Device is a physical device");
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			console.log("Existing status:", existingStatus);
			let finalStatus = existingStatus;

			if (existingStatus !== "granted") {
				const { status } =
					await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}

			if (finalStatus !== "granted") {
				showMessage({
					message: "Failed to get push token for push notification!",
					type: "danger",
				});
				console.log("Permission not granted for notifications");
				return;
			}

			console.log("Permission granted for notifications");
			const projectId = Constants.expoConfig?.extra?.eas?.projectId;

			if (!projectId) {
				console.error(
					"No projectId found. Make sure you have configured your app.json correctly."
				);
				return;
			}

			token = (await Notifications.getExpoPushTokenAsync({ projectId }))
				.data;
			console.log("Expo Push Token obtained:", token);
			const expoTokenRequest: ExpoTokenRequest = {
				expoPushToken: token,
			};
			await saveExpoPushToken(userId, expoTokenRequest);
			setExpoPushToken(token);
		} else {
			showMessage({
				message: "Must use physical device for Push Notifications",
				type: "warning",
			});
			console.log("Must use physical device for Push Notifications");
		}

		return token;
	};

	return {
		expoPushToken,
		notification,
		registerForPushNotificationsAsync,
	};
}
