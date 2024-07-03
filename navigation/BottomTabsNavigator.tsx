import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/Home";
import AddStory from "@/screens/AddStory";
import Library from "@/screens/Library"

const Tab = createBottomTabNavigator();

function BottomTabsNavigator() {
	return (
		<Tab.Navigator initialRouteName="Home">
			<Tab.Screen
				name="Home"
				options={{ headerShown: false, tabBarLabel: "Home" }}
				component={Home}
			/>
			<Tab.Screen
				name="AddStory"
				options={{ headerShown: false, tabBarLabel: "Add Story" }}
				component={AddStory}
			/>
			<Tab.Screen
				name="Library"
				options={{ headerShown: false }}
				component={Library}
			/>
		</Tab.Navigator>
	);
}

export default BottomTabsNavigator;
