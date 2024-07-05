import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "@/screens/Register";
import Login from "@/screens/Login";
import BottomTabsNavigator from "./BottomTabsNavigator";
import DarkTheme from "./Theme";
import AddPost from "@/screens/AddPost";
import AddStory from "@/screens/AddStory";

const Stack = createNativeStackNavigator();

function AuthStack() {
	return (
		<Stack.Navigator initialRouteName={"Register"}>
			<Stack.Screen
				name="Register"
				options={{ headerShown: false }}
				component={Register}
			/>
			<Stack.Screen
				name="Login"
				options={{ headerShown: false }}
				component={Login}
			/>
		</Stack.Navigator>
	);
}

export default function AppNavigation() {
	return (
		<NavigationContainer theme={DarkTheme}>
			<Stack.Navigator initialRouteName="AuthStack">
				<Stack.Screen
					name="AuthStack"
					component={AuthStack}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Main"
					component={BottomTabsNavigator}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="AddPost"
					component={AddPost}
					options={{ headerShown: true, title: "Add a post" }}
				/>
				<Stack.Screen
					name="AddStory"
					component={AddStory}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
