import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@features/home/HomeScreen";
import LibraryScreen from "@features/library/LibraryScreen";
import ProfileScreen from "@features/profile/ProfileScreen";
import { Icon } from "react-native-paper";
import { theme } from "./Theme";

type BottomTabsParamList = {
	HomeScreen: undefined;
	LibraryScreen: undefined;
	ProfileScreen: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
	const iconSize = 30;

	return (
		<Tab.Navigator
			initialRouteName="HomeScreen"
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: {
					height: 60,
					backgroundColor: theme.colors.background,
					borderTopColor: theme.colors.primary,
					borderTopWidth: 1,
				},
			}}
		>
			<Tab.Screen
				name="HomeScreen"
				options={{
					headerShown: false,
					tabBarIcon: () => (
						<Icon
							source="home"
							size={iconSize}
							color={theme.colors.primary}
						/>
					),
				}}
				component={HomeScreen}
			/>
			<Tab.Screen
				name="LibraryScreen"
				options={{
					headerShown: false,
					tabBarIcon: () => (
						<Icon
							source="library"
							size={iconSize}
							color={theme.colors.primary}
						/>
					),
				}}
				component={LibraryScreen}
			/>
			<Tab.Screen
				name="ProfileScreen"
				options={{
					headerShown: false,
					tabBarIcon: () => (
						<Icon
							source="account"
							size={iconSize}
							color={theme.colors.primary}
						/>
					),
				}}
				component={ProfileScreen}
			/>
		</Tab.Navigator>
	);
}
