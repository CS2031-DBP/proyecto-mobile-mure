import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/Home";
import Library from "@/screens/Library";
import Profile from "@/screens/Profile";

const Tab = createBottomTabNavigator();

function BottomTabsNavigator() {
	return (
		<Tab.Navigator initialRouteName="Home">
			<Tab.Screen
				name="Home"
				options={{ headerShown: false }}
				component={Home}
			/>
			<Tab.Screen
				name="Library"
				options={{ headerShown: false }}
				component={Library}
			/>
			<Tab.Screen
				name="Profile"
				options={{ headerShown: false }}
				component={Profile}
			/>
		</Tab.Navigator>
	);
}

export default BottomTabsNavigator;
