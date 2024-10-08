import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	Image,
	Alert,
	ActivityIndicator,
	RefreshControl,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import {
	useNavigation,
	NavigationProp,
	ParamListBase,
} from "@react-navigation/native";
import { UserResponse } from "@interfaces/UserResponse";
import { useUserContext } from "@contexts/UserContext";
import { PostResponse } from "@features/post/interfaces/PostResponse";
import { getRoleFromToken } from "@services/getRoleFromToken";
import { getUserFriends } from "@features/profile/services/getUserFriends";
import { deleteFriend } from "@services/friend/deleteFriend";
import { deleteUserById } from "@features/profile/services/deleteUserById";
import Post from "@features/post/components/Post";
import { addFriend } from "@services/friend/addFriend";
import { getPostsByUserId } from "@features/post/services/getPostsByUserId";
import { theme } from "@navigation/Theme";
import { showMessage } from "react-native-flash-message";

interface ProfileProps {
	user: UserResponse;
	isCurrentUser: boolean;
	isFriend: boolean;
	setIsFriend: Dispatch<SetStateAction<boolean>>;
	friends: UserResponse[];
	setFriends: Dispatch<SetStateAction<UserResponse[]>>;
	friendsCount: number;
	setFriendsCount: Dispatch<SetStateAction<number>>;
}

export default function ProfileInfo({
	user,
	isCurrentUser,
	isFriend,
	setIsFriend,
	friends,
	setFriends,
	friendsCount,
	setFriendsCount,
}: ProfileProps) {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const { refreshUser } = useUserContext();
	const [errors, setErrors] = useState<string | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [posts, setPosts] = useState<PostResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const pageSize = 10;

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const userRole = await getRoleFromToken();
				setRole(userRole);
			} catch (error) {
				console.error("Failed to fetch role", error);
			}
		};
		fetchRole();
	}, []);

	useEffect(() => {
		if (isFriend || isCurrentUser || role === "ROLE_ADMIN") {
			getUserFriends(user.friendsIds)
				.then(setFriends)
				.catch(() => {
					setErrors("Failed to load friends data");
				});
		}
	}, [isFriend, isCurrentUser, role, user.friendsIds, setFriends]);

	const fetchPosts = async (reset: boolean = false) => {
		if (loading || (!reset && !hasMore)) return;

		setLoading(true);
		try {
			const response = await getPostsByUserId(
				user.id,
				reset ? 0 : page,
				pageSize
			);
			if (reset) {
				setPosts(response.content);
				setPage(1);
			} else {
				setPosts((prevPosts) => [...prevPosts, ...response.content]);
				setPage(page + 1);
			}
			setHasMore(response.totalPages > (reset ? 1 : page + 1));
		} catch (error) {
			console.error("Failed to load posts:", error);
			setErrors("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await fetchPosts(true);
		setRefreshing(false);
	};

	useEffect(() => {
		fetchPosts();
	}, [user.id]);

	const handleAddFriend = async () => {
		try {
			await addFriend(user.id);
			setIsFriend(true);
			setFriendsCount(friendsCount + 1);
			await refreshUser();
			showMessage({
				message: "Friend added",
				type: "success",
			});
		} catch (error) {
			setErrors("Failed to add friend");
		}
	};

	const handleDeleteFriend = async () => {
		try {
			await deleteFriend(user.id);
			setIsFriend(false);
			setFriendsCount(friendsCount - 1);
			await refreshUser();
			showMessage({
				message: "Friend removed",
				type: "success",
				color: theme.colors.primary,
			});
		} catch (error) {
			setErrors("Failed to delete friend");
		}
	};

	const handleDeleteProfile = async () => {
		Alert.alert(
			"Delete profile",
			"Are you sure you want to delete this profile?",
			[
				{
					text: "No",
					style: "cancel",
				},
				{
					text: "Yes",
					onPress: async () => {
						try {
							await deleteUserById(user.id);
							showMessage({
								message: "Profile deleted",
								type: "success",
							});
							if (isCurrentUser) {
								navigation.navigate("Register");
							} else {
								navigation.goBack();
							}
						} catch (error) {
							setErrors("Failed to delete profile");
						}
					},
				},
			]
		);
	};

	const handlePostDeleted = (postId: number) => {
		setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: "center",
				backgroundColor: theme.colors.background,
				paddingTop: 28,
			}}
		>
			<View
				style={{
					alignItems: "center",
					paddingHorizontal: 20,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 8,
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							color: theme.colors.primary,
							flex: 1,
							marginLeft: 16,
						}}
					>
						@{user.nickname}
					</Text>
				</View>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<View
						style={{
							width: "30%",
							alignItems: "center",
						}}
					>
						<View
							style={{
								position: "relative",
								width: 100,
								height: 100,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Image
								style={{
									width: 80,
									height: 80,
									borderRadius: 50,
								}}
								source={{ uri: user.profileImageUrl }}
							/>
							{!isFriend && !isCurrentUser ? (
								<IconButton
									icon="plus"
									size={30}
									style={{
										position: "absolute",
										top: -5,
										right: -5,
										backgroundColor: theme.colors.primary,
										width: 30,
										height: 30,
									}}
									iconColor="white"
									onPress={handleAddFriend}
								/>
							) : null}
							{isFriend && !isCurrentUser ? (
								<IconButton
									icon="trash-can"
									size={30}
									style={{
										position: "absolute",
										top: -5,
										right: -5,
										backgroundColor: theme.colors.primary,
										width: 30,
										height: 30,
									}}
									iconColor="white"
									onPress={handleDeleteFriend}
								/>
							) : null}
						</View>
					</View>
					<View
						style={{
							width: "40%",
							paddingLeft: 10,
						}}
					>
						<Text
							style={{
								fontSize: 16,
								color: theme.colors.primary,
								textAlign: "left",
								marginBottom: 5,
							}}
						>
							{user.name}
						</Text>
						<Text
							style={{
								fontSize: 12,
								color: "gray",
								textAlign: "left",
								marginBottom: 5,
							}}
						>
							{user.birthDate}
						</Text>
					</View>
					<View
						style={{
							width: "30%",
							alignItems: "flex-end",
							flexDirection: "row",
							justifyContent: "flex-end",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							{friendsCount > 0 && (
								<Text
									style={{
										fontSize: 16,
									}}
								>
									{friendsCount + " "}
								</Text>
							)}
							{friendsCount === 1 ? (
								<Text
									style={{
										fontSize: 16,
									}}
								>
									Friend
								</Text>
							) : (
								<Text
									style={{
										fontSize: 16,
									}}
								>
									Friends
								</Text>
							)}
							{(isFriend ||
								isCurrentUser ||
								role === "ROLE_ADMIN") && (
								<IconButton
									mode="outlined"
									onPress={() =>
										navigation.navigate("FriendsScreen", {
											friendIds: user.friendsIds,
											userId: user.id,
										})
									}
									icon="eye"
									size={30}
									style={{
										backgroundColor:
											theme.colors.background,
										borderColor: theme.colors.background,
									}}
									iconColor={theme.colors.primary}
								/>
							)}
						</View>
					</View>
				</View>
				{isFriend && !isCurrentUser && (
					<Button
						mode="contained"
						onPress={() =>
							navigation.navigate("LibraryScreen", {
								userId: user.id,
							})
						}
						style={{
							marginTop: 8,
							width: "100%",
							backgroundColor: theme.colors.primary,
						}}
						labelStyle={{
							color: theme.colors.background,
						}}
					>
						View Library
					</Button>
				)}
				{errors ? (
					<Text
						style={{
							color: "red",
							textAlign: "center",
							marginVertical: 16,
						}}
					>
						{errors}
					</Text>
				) : null}
				<View
					style={{
						width: "100%",
						marginTop: 0,
						alignItems: "center",
					}}
				>
					{isCurrentUser ? (
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<Button
								mode="contained"
								onPress={() =>
									navigation.navigate("EditProfileScreen")
								}
								style={{
									flex: 1,
									marginRight: 10,
									backgroundColor: theme.colors.primary,
								}}
								labelStyle={{ color: theme.colors.background }}
							>
								Edit Profile
							</Button>
							<Button
								mode="contained"
								onPress={handleDeleteProfile}
								style={{
									flex: 1,
									backgroundColor: theme.colors.primary,
								}}
								labelStyle={{ color: theme.colors.background }}
							>
								Delete Profile
							</Button>
						</View>
					) : null}
					{role === "ROLE_ADMIN" && !isCurrentUser && (
						<Button
							mode="contained"
							onPress={handleDeleteProfile}
							style={{
								width: "60%",
								marginTop: 10,
								backgroundColor: theme.colors.primary,
							}}
							labelStyle={{ color: theme.colors.background }}
						>
							Delete Profile
						</Button>
					)}
				</View>
			</View>
			<ScrollView
				contentContainerStyle={{
					alignItems: "center",
					paddingHorizontal: 20,
				}}
				onScroll={({ nativeEvent }) => {
					const isCloseToBottom =
						nativeEvent.layoutMeasurement.height +
							nativeEvent.contentOffset.y >=
						nativeEvent.contentSize.height - 20;
					if (isCloseToBottom && !loading && hasMore) {
						fetchPosts();
					}
				}}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
					/>
				}
				scrollEventThrottle={400}
			>
				<View style={{ width: "100%", marginTop: 20 }}>
					{posts.length > 0 ? (
						posts.map((post) => (
							<Post
								key={post.id}
								post={post}
								onPostDeleted={handlePostDeleted}
							/>
						))
					) : (
						<Text style={{ color: "gray", textAlign: "center" }}>
							No posts available
						</Text>
					)}
					{loading && (
						<View style={{ padding: 16 }}>
							<ActivityIndicator size="large" color="#0000ff" />
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
