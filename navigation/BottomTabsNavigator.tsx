import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/Home";
import Library from "@/screens/Library";
import Profile from "@/screens/Profile";
import { Icon } from "react-native-paper";

type BottomTabsParamList = {
	Home: undefined;
	Library: undefined;
	Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
	const iconSize = 30;

	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={{
				tabBarShowLabel: false,
				tabBarStyle: { height: 60 },
			}}
		>
			<Tab.Screen
				name="Home"
				options={{
					headerShown: false,
					tabBarIcon: () => <Icon source="home" size={iconSize} />,
				}}
				component={Home}
			/>
			<Tab.Screen
				name="Library"
				options={{
					headerShown: false,
					tabBarIcon: () => <Icon source="library" size={iconSize} />,
				}}
				component={Library}
			/>
			<Tab.Screen
				name="Profile"
				options={{
					headerShown: false,
					tabBarIcon: () => <Icon source="account" size={iconSize} />,
				}}
				component={Profile}
			/>
		</Tab.Navigator>
	);
}
