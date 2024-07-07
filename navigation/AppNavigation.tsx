import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "@/screens/Register";
import Login from "@/screens/Login";
import BottomTabsNavigator from "./BottomTabsNavigator";
import AddPost from "@/screens/AddPost";
import AddStory from "@/screens/AddStory";
import AddPlaylist from "@/screens/AddPlaylist";
import EditPlaylist from "@/screens/EditPlaylist";
import EditProfile from "@/screens/EditProfile";
import UserProfile from "@/screens/UserProfile";
import FriendList from "@/screens/FriendList";
import { PaperProvider } from "react-native-paper";

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
		<PaperProvider>
			<NavigationContainer>
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
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddStory"
						component={AddStory}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddPlaylist"
						component={AddPlaylist}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="EditPlaylist"
						component={EditPlaylist}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="EditProfile"
						component={EditProfile}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="UserProfile"
						component={UserProfile}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FriendList"
						component={FriendList}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	);
}
