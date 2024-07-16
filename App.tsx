import * as SplashScreen from "expo-splash-screen";
import AppNavigation from "@navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "@contexts/UserContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import FlashMessage from "react-native-flash-message";
import { fonts } from "@navigation/Theme";

export default function App() {
	const [loaded, error] = useFonts(fonts);

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
				<AppNavigation />
				<FlashMessage position="top" />
			</UserProvider>
		</SafeAreaProvider>
	);
}
