import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "@/screens/Register";
import Login from "@/screens/Login";
import Home from "@/screens/Home";

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
		<NavigationContainer>
			<Stack.Navigator initialRouteName="AuthStack">
				<Stack.Screen
					name="AuthStack"
					component={AuthStack}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Home"
					component={Home}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
