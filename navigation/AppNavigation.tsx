import { NavigationContainer } from "@react-navigation/native";
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
import FavoriteSongs from "@/screens/FavoriteSongs";
import { PaperProvider } from "react-native-paper";
import Album from "@/screens/Album";
import AddSongToPlaylist, {
	AddSongToPlaylistProps,
} from "@/screens/AddSongToPlaylist";
import Search from "@/screens/Search";
import Auth from "@/screens/Auth";
import theme from "./Theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterStackNavigator from "./RegisterStackNavigator";
import { defaultScreenOptions } from "./ScreenOptions";

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
	PlaylistPage: { playlistId: number };
	FavoriteSongs: undefined;
	Artist: undefined;
	Album: { albumId: number };
	AddSongToPlaylist: AddSongToPlaylistProps;
	Search: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
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
						component={PlaylistPage}
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
