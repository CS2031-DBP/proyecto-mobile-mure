import { NavigationContainer } from "@react-navigation/native";
import BottomTabsNavigator from "./BottomTabsNavigator";
import AddPost from "@features/post/AddPost";
import AddStory from "@features/story/AddStory";
import AddPlaylist from "@features/playlist/AddPlaylist";
import EditPlaylist from "@features/playlist/EditPlaylist";
import EditProfile from "@features/profile/EditProfile";
import Profile from "@features/profile/Profile";
import FriendsPage from "@features/profile/FriendsPage";
import Library from "@features/library/Library";
import FavoriteSongs from "@features/song/FavoriteSongs";
import { PaperProvider } from "react-native-paper";
import Album from "@features/album/Album";
import AddSongToPlaylist, {
	AddSongToPlaylistProps,
} from "@features/song/AddSongToPlaylist";
import Search from "@features/search/Search";
import Auth from "@features/auth/Auth";
import theme from "./Theme";
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
	FriendsPageScreen: { friendIds: number[]; userId?: number };
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
						component={Auth}
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
						component={AddPost}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddStoryScreen"
						component={AddStory}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddPlaylistScreen"
						component={AddPlaylist}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="EditPlaylistScreen"
						component={EditPlaylist}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="EditProfileScreen"
						component={EditProfile}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="ProfileScreen"
						component={Profile}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FriendsPageScreen"
						component={FriendsPage}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="LibraryScreen"
						component={Library}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="PlaylistScreen"
						component={PlaylistScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FavoriteSongsScreen"
						component={FavoriteSongs}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AlbumScreen"
						component={Album}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="AddSongToPlaylistScreen"
						component={AddSongToPlaylist}
						options={{ headerShown: false }}
						initialParams={{ songId: -1 }}
					/>
					<Stack.Screen
						name="SearchScreen"
						component={Search}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	);
}
