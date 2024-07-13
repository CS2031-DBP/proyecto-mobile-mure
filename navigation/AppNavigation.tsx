import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "@/screens/Register";
import Login from "@/screens/Login";
import BottomTabsNavigator from "./BottomTabsNavigator";
import AddPost from "@/screens/AddPost";
import AddStory from "@/screens/AddStory";
import AddPlaylist from "@/screens/AddPlaylist";
import EditPlaylist from "@/screens/EditPlaylist";
import EditProfile from "@/screens/EditProfile";
import Profile from "@/screens/Profile";
import FriendsPage from "@/screens/FriendsPage";
import Library from "@/screens/Library";
import PlaylistPage from "@/screens/PlaylistPage";
import { PaperProvider } from "react-native-paper";
import Artist, { ArtistProps } from "@/screens/Artist";
import { Album, AlbumProps } from "@/screens/Album";
import AddSongToPlaylist, {
	AddSongToPlaylistProps,
} from "@/screens/AddSongToPlaylist";
import Search from "@/screens/Search";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type RootStackParamList = {
	Home: undefined;
	Register: undefined;
	Login: undefined;
	Main: undefined;
	AddPost: undefined;
	AuthStack: undefined;
	AddStory: undefined;
	AddPlaylist: undefined;
	EditPlaylist: undefined;
	EditProfile: undefined;
	Profile: { userId: number };
	FriendsPage: { friendIds: number[]; userId?: number };
	Library: { userId: number };
	PlaylistPage: { playlistId: number };
	Artist: ArtistProps;
	Album: AlbumProps;
	AddSongToPlaylist: AddSongToPlaylistProps;
	Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
	const [initialRoute, setInitialRoute] =
		useState<keyof RootStackParamList>("AuthStack");

	useEffect(() => {
		const checkToken = async () => {
			const token = await SecureStore.getItemAsync("userToken");
			console.log(token);

			if (token) {
				setInitialRoute("Main");
			} else {
				setInitialRoute("AuthStack");
			}
		};

		checkToken();
	}, []);

	return (
		<PaperProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName={initialRoute}>
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
						name="Profile"
						component={Profile}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FriendsPage"
						component={FriendsPage}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
                        name="Library"
                        component={Library}
                        options={{ headerShown: false }}
                    />
					<Stack.Screen
						name="PlaylistPage"
						component={PlaylistPage}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Artist"
						// @ts-expect-error
						component={Artist}
						options={{ headerShown: false }}
						initialParams={{ artistId: -1 }}
					/>
					<Stack.Screen
						name="Album"
						// @ts-expect-error
						component={Album}
						options={{ headerShown: false }}
						initialParams={{ albumId: -1 }}
					/>
					<Stack.Screen
						name="AddSongToPlaylist"
						component={AddSongToPlaylist}
						options={{ headerShown: false }}
						initialParams={{ songId: -1 }}
					/>
					<Stack.Screen
						name="Search"
						component={Search}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	);
}
