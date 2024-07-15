import * as SplashScreen from "expo-splash-screen";
import AppNavigation from "@/navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider, useUserContext } from "./contexts/UserContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import NotificationDisplay from "./components/NotificationDisplay";
import useNotifications from "./hooks/useNotifications";

function MainApp() {
	const { user } = useUserContext();
	const userId = user ? user.id : 0;
	const { notification } = useNotifications(userId);

	return (
		<>
			<NotificationDisplay notification={notification} />
			<AppNavigation />
		</>
	);
}

export default function App() {
	const [loaded, error] = useFonts({
		"poppins-regular": require("./assets/fonts/Poppins-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<UserProvider>
			<SafeAreaProvider>
				<MainApp />
			</SafeAreaProvider>
		</UserProvider>
	);
}
