import AppNavigation from "@/navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
	return (
		<UserProvider>
			<SafeAreaProvider>
				<AppNavigation />
			</SafeAreaProvider>
		</UserProvider>
	);
}
