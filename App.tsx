import * as SplashScreen from "expo-splash-screen";
import AppNavigation from "@navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider, useUserContext } from "@contexts/UserContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import NotificationDisplay from "@components/NotificationDisplay";
import useNotifications from "@hooks/useNotifications";
import FlashMessage from "react-native-flash-message";
import { fonts } from "@navigation/Theme";

export default function App() {
	const [loaded, error] = useFonts(fonts);
	// const { user } = useUserContext();
	// const userId = user ? user.id : 0;
	// const { notification } = useNotifications(userId);

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<SafeAreaProvider>
			<UserProvider>
				{/* <NotificationDisplay notification={notification} /> */}
				<AppNavigation />
				<FlashMessage position="top" />
			</UserProvider>
		</SafeAreaProvider>
	);
}
