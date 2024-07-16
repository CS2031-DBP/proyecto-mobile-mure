import * as SplashScreen from "expo-splash-screen";
import AppNavigation from "@navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "@contexts/UserContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import FlashMessage from "react-native-flash-message";

export default function App() {
	const [loaded, error] = useFonts({
		"poppins-regular": require("assets/fonts/Poppins-Regular.ttf"),
		"oleo-script-regular": require("assets/fonts/OleoScriptSwashCaps-Regular.ttf"),
		"oleo-script-bold": require("assets/fonts/OleoScriptSwashCaps-Bold.ttf"),
	});
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
