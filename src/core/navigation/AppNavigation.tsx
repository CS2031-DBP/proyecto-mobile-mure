import { NavigationContainer } from "@react-navigation/native";
import BottomTabsNavigator from "./BottomTabsNavigator";
import AddPostScreen from "@features/post/AddPostScreen";
import AddStoryScreen from "@features/story/AddStoryScreen";
import AddPlaylistScreen from "@features/playlist/AddPlaylistScreen";
import EditPlaylistScreen from "@features/playlist/EditPlaylistScreen";
import EditProfileScreen from "@features/profile/EditProfileScreen";
import ProfileScreen from "@features/profile/ProfileScreen";
import FriendsScreen from "@features/profile/FriendsScreen";
import LibraryScreen from "@features/library/LibraryScreen";
import FavoriteSongsScreen from "@features/song/FavoriteSongsScreen";
import { PaperProvider } from "react-native-paper";
import AlbumScreen from "@features/album/AlbumScreen";
import AddSongToPlaylistScreen, {
	AddSongToPlaylistProps,
} from "@features/song/AddSongToPlaylistScreen";
import SearchScreen from "@features/search/SearchScreen";
import AuthScreen from "@features/auth/AuthScreen";
import { theme } from "./Theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterStackNavigator from "./RegisterStackNavigator";
import { defaultScreenOptions } from "./ScreenOptions";
import { useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import PlaylistScreen from "@features/playlist/PlaylistScreen";
import LoginScreen from "@features/auth/login/LoginScreen";

export type RootStackParamList = {
	RegisterScreen: undefined;
	LoginScreen: undefined;
	MainScreen: undefined;
	AddPostScreen: undefined;
	AuthStackScreen: undefined;
	AddStoryScreen: undefined;
	AddPlaylistScreen: undefined;
	EditPlaylistScreen: undefined;
	EditProfileScreen: undefined;
	ProfileScreen: { userId: number };
	FriendsScreen: { friendIds: number[]; userId?: number };
	LibraryScreen: { userId: number };
	PlaylistScreen: { playlistId: number };
	FavoriteSongsScreen: undefined;
	ArtistScreen: undefined;
	AlbumScreen: { albumId: number };
	AddSongToPlaylistScreen: AddSongToPlaylistProps;
	SearchScreen: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
	const [initialRoute, setInitialRoute] =
		useState<keyof RootStackParamList>("AuthStackScreen");

	useEffect(() => {
		const checkToken = async () => {
			const token = await SecureStorage.getItemAsync("token");
			console.log(token);

			if (token) {
				setInitialRoute("MainScreen");
			} else {
				setInitialRoute("AuthStackScreen");
			}
		};

		checkToken();
	}, []);

	return (
		<PaperProvider theme={theme}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName={"AuthStackScreen"}
					screenOptions={{
						...defaultScreenOptions,
					}}
				>
					<Stack.Screen
						name="AuthStackScreen"
						component={AuthScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="RegisterScreen"
						component={RegisterStackNavigator}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="LoginScreen"
						component={LoginScreen}
						options={{ headerTitle: "" }}
					/>
					<Stack.Screen
						name="MainScreen"
						component={BottomTabsNavigator}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddPostScreen"
						component={AddPostScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddStoryScreen"
						component={AddStoryScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddPlaylistScreen"
						component={AddPlaylistScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="EditPlaylistScreen"
						component={EditPlaylistScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="EditProfileScreen"
						component={EditProfileScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ProfileScreen"
						component={ProfileScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FriendsScreen"
						component={FriendsScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="LibraryScreen"
						component={LibraryScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="PlaylistScreen"
						component={PlaylistScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FavoriteSongsScreen"
						component={FavoriteSongsScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AlbumScreen"
						component={AlbumScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddSongToPlaylistScreen"
						component={AddSongToPlaylistScreen}
						options={{ headerShown: false }}
						initialParams={{ songId: -1 }}
					/>
					<Stack.Screen
						name="SearchScreen"
						component={SearchScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	);
}
