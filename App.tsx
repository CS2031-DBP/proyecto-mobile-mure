import AppNavigation from "@/navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { PaperProvider } from "react-native-paper";

export default function App() {
	return (
		<PaperProvider>
			<SafeAreaProvider>
				<AppNavigation />
			</SafeAreaProvider>
		</PaperProvider>
	);
}
