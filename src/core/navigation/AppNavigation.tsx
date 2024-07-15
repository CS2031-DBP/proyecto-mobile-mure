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
import Playlist from "@features/playlist/Playlist";
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

export type RootStackParamList = {
	Auth: undefined;
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
	Playlist: { playlistId: number };
	FavoriteSongs: undefined;
	Artist: undefined;
	Album: { albumId: number };
	AddSongToPlaylist: AddSongToPlaylistProps;
	Search: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
	const [initialRoute, setInitialRoute] =
		useState<keyof RootStackParamList>("AuthStack");

	useEffect(() => {
		const checkToken = async () => {
			const token = await SecureStorage.getItemAsync("token");
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
		<PaperProvider theme={theme}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName={"Auth"}
					screenOptions={{
						...defaultScreenOptions,
					}}
				>
					<Stack.Screen
						name="Auth"
						component={Auth}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Register"
						component={RegisterStackNavigator}
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
						component={Playlist}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="FavoriteSongs"
						component={FavoriteSongs}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Album"
						component={Album}
						options={{ headerShown: false }}
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
