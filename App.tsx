import AppNavigation from "@/navigation/AppNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { UserProvider, useUserContext } from "./contexts/UserContext";
import useNotifications from "./hooks/useNotifications";
import NotificationDisplay from './components/NotificationDisplay';

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
	return (
	<UserProvider>
		<SafeAreaProvider>
			<MainApp />
		</SafeAreaProvider>
	</UserProvider>
	);
}