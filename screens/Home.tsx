import Post from "@/components/Post";
import { useUserContext } from "@/contexts/UserContext";
import { PostResponse } from "@/interfaces/Post";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, ScrollView, Alert, Image } from "react-native";
import {
	ActivityIndicator,
	FAB,
	IconButton,
	Portal,
	Provider,
	Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPosts } from "@/services/post/getAllPosts";

function Home() {
	const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [posts, setPosts] = useState<PostResponse[]>([]);
	const [page, setPage] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const userContext = useUserContext();

	useEffect(() => {
		(async () => {
			await userContext.refreshUser();
		})();
		fetchPosts();
	}, []);
	const fetchPosts = async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		try {
			const response = await getAllPosts(page, 10);
			setPosts((prevPosts) => [...prevPosts, ...response.content]);
			setHasMore(response.totalPages > page + 1);
			setPage(page + 1);
		} catch (error) {
			console.error("Failed to load posts:", error);
			Alert.alert("Error", "Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	const handlePostDeleted = (postId: number) => {
		setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
	};

	return (
		<Provider>
			<SafeAreaView style={{ flex: 1, padding: 10 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Image
						source={require("@/assets/logo-mure.jpg")}
						style={{
							width: 60,
							height: 60,
							resizeMode: "contain",
							borderRadius: 50,
							marginLeft: 10,
							marginVertical: 8,
						}}
					/>
					<Text
						style={{
							fontSize: 35,
							fontWeight: "bold",
							fontFamily: "Roboto",
						}}
					>
						Mure
					</Text>
					<IconButton
						icon="magnify"
						size={30}
						onPress={() => navigation.navigate("Search")}
					/>
				</View>
				<ScrollView
					onScroll={({ nativeEvent }) => {
						const isCloseToBottom =
							nativeEvent.layoutMeasurement.height +
								nativeEvent.contentOffset.y >=
							nativeEvent.contentSize.height - 20;
						if (isCloseToBottom && !loading && hasMore) {
							fetchPosts();
						}
					}}
					scrollEventThrottle={400}
				>
					{posts.map((post) => (
						<Post
							key={post.id}
							post={post}
							onPostDeleted={handlePostDeleted}
						/>
					))}
					{loading && (
						<View style={{ padding: 16 }}>
							<ActivityIndicator size="large" color="#0000ff" />
						</View>
					)}
				</ScrollView>
				<Portal>
					<FAB.Group
						open={isFabGroupOpen}
						visible
						icon={isFabGroupOpen ? "close" : "fruit-grapes"}
						actions={[
							{
								icon: "lead-pencil",
								label: "Add a post",
								onPress: () => navigation.navigate("AddPost"),
							},
							{
								icon: "camera",
								label: "Add a story",
								onPress: () => navigation.navigate("AddStory"),
							},
						]}
						onStateChange={() => setIsFabGroupOpen(!isFabGroupOpen)}
					/>
				</Portal>
			</SafeAreaView>
		</Provider>
	);
}

export default Home;
