import { useCallback, useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	BackHandler,
	Image,
	RefreshControl,
	View,
} from "react-native";
import {
	ActivityIndicator,
	FAB,
	IconButton,
	Portal,
	Provider,
	Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPosts } from "./services/getAllPosts";
import { useUserContext } from "@contexts/UserContext";
import {
	NavigationProp,
	useFocusEffect,
	useNavigation,
} from "@react-navigation/native";
import Post from "@features/post/components/Post";
import { PostResponse } from "@features/post/interfaces/PostResponse";
import { fonts, theme } from "@navigation/Theme";
import { logout } from "@services/logout";
import { showMessage } from "react-native-flash-message";
import { RootStackParamList } from "@navigation/AppNavigation";
import useNotifications from "@hooks/useNotifications";

export default function HomeScreen() {
	const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [posts, setPosts] = useState<PostResponse[]>([]);
	const [page, setPage] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const userContext = useUserContext();
	const { registerForPushNotificationsAsync } = useNotifications();

	useEffect(() => {
		(async () => {
			await userContext.refreshUser();
			console.log("User:", userContext.user);
			if (userContext.user)
				await registerForPushNotificationsAsync(userContext.user.id);
			fetchPosts(true);
		})();
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchPosts(true);
		}, [])
	);

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				Alert.alert(
					"Logout",
					"Do you want to logout?",
					[
						{
							text: "Cancel",
							style: "cancel",
						},
						{
							text: "Yes",
							onPress: async () => {
								try {
									await logout();
									navigation.reset({
										index: 0,
										routes: [{ name: "LoginScreen" }],
									});
								} catch (error) {
									showMessage({
										message: "Failed to logout",
										type: "danger",
									});
								}
							},
						},
					],
					{ cancelable: false }
				);
				return true;
			};

			BackHandler.addEventListener("hardwareBackPress", onBackPress);

			return () =>
				BackHandler.removeEventListener(
					"hardwareBackPress",
					onBackPress
				);
		}, [navigation])
	);

	async function fetchPosts(reset: boolean = false) {
		if (loading || (!reset && !hasMore)) return;
		setLoading(true);

		try {
			const response = await getAllPosts(reset ? 0 : page, 6);

			if (reset) {
				setPosts(response.content);
			} else {
				setPosts((prevPosts) => [
					...new Set(prevPosts),
					...response.content,
				]);
			}

			setHasMore(response.totalPages > (reset ? 1 : page + 1));
			setPage((prevPage) => (reset ? 1 : prevPage + 1));
		} catch (error) {
			showMessage({ message: "Failed to load posts", type: "danger" });
		} finally {
			setLoading(false);
		}
	}

	function handlePostDeleted(postId: number) {
		setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
	}

	async function handleRefresh() {
		setRefreshing(true);
		await fetchPosts(true);
		setRefreshing(false);
	}

	async function handleLoadMore() {
		if (hasMore && !loading) {
			await fetchPosts();
		}
	}

	return (
		<Provider>
			<View
				style={{
					paddingTop: 30,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					backgroundColor: theme.colors?.headerBackgroundColor,
				}}
			>
				<Image
					source={require("assets/images/mure-logo-transparent-background.png")}
					style={{
						width: 45,
						height: 45,
						resizeMode: "contain",
						borderRadius: 50,
						marginLeft: 10,
						marginVertical: 8,
					}}
				/>
				<Text
					style={{
						fontSize: 35,
						fontFamily: fonts.oleoScriptBold,
						color: theme.colors.mureLogo,
					}}
				>
					Mure
				</Text>
				<IconButton
					icon="magnify"
					size={30}
					onPress={() => navigation.navigate("SearchScreen")}
				/>
			</View>
			<SafeAreaView
				style={{
					flex: 1,
					padding: 10,
					backgroundColor: theme.colors?.background,
				}}
			>
				<FlatList
					data={posts}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<Post post={item} onPostDeleted={handlePostDeleted} />
					)}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					ListFooterComponent={
						null && (
							<ActivityIndicator size="large" color="#0000ff" />
						)
					}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
						/>
					}
				/>
				<Portal>
					<FAB.Group
						fabStyle={{ backgroundColor: theme.colors.primary }}
						color={theme.colors.background}
						backdropColor={theme.colors.background}
						open={isFabGroupOpen}
						visible
						icon={isFabGroupOpen ? "close" : "fruit-grapes"}
						actions={[
							{
								icon: "lead-pencil",
								label: "Add a post",
								onPress: () =>
									navigation.navigate("AddPostScreen"),
								color: theme.colors.primary,
							},
							{
								icon: "camera",
								label: "Add a story",
								onPress: () =>
									navigation.navigate("AddStoryScreen"),
								color: theme.colors.primary,
							},
						]}
						onStateChange={() => setIsFabGroupOpen(!isFabGroupOpen)}
					/>
				</Portal>
			</SafeAreaView>
		</Provider>
	);
}
