import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/Home";
import Library from "@/screens/Library";
import Profile from "@/screens/Profile";
import { Icon } from "react-native-paper";

const Tab = createBottomTabNavigator();

function BottomTabsNavigator() {
	const iconSize = 30;

	return (
		<Tab.Navigator initialRouteName="Home">
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

export default BottomTabsNavigator;
