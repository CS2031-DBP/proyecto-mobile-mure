import * as SplashScreen from "expo-splash-screen";
import AppNavigation from "@/navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "./contexts/UserContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";

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
				<AppNavigation />
			</SafeAreaProvider>
		</UserProvider>
	);
}
