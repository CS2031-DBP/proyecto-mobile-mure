import { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	Linking,
	Alert,
	TouchableOpacity,
} from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { useUserContext } from "@contexts/UserContext";
import { UserResponse } from "@interfaces/UserResponse";
import { getRoleFromToken } from "@services/getRoleFromToken";
import { getUserById } from "@services/getUserById";
import AudioPlayer from "@components/AudioPlayer";
import CommentsModal from "@components/CommentsModal";
import { deletePostById } from "../services/deletePostById";
import { dislikePost } from "../services/dislikePost";
import { likePost } from "../services/likePost";
import { PostResponse } from "../interfaces/PostResponse";
import { showMessage } from "react-native-flash-message";

interface PostProps {
	post: PostResponse;
	onPostDeleted: (postId: number) => void;
}

export default function Post(props: PostProps) {
	const { user } = useUserContext();
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [postOwner, setPostOwner] = useState<UserResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [liked, setLiked] = useState<boolean>(
		props.post.likedByUserIds.includes(user?.id || 0)
	);
	const [likesCount, setLikesCount] = useState<number>(props.post.likes);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUserById(props.post.ownerId);
				setPostOwner(userData);
			} catch (error) {
				showMessage({
					message: "Failed to fetch user data",
					type: "danger",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [props.post.ownerId, user?.id]);

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const role = await getRoleFromToken();
				setUserRole(role);
			} catch (error) {
				showMessage({
					message: "Failed to fetch user role",
					type: "danger",
				});
			}
		};

		fetchRole();
	}, []);

	async function handleLike() {
		try {
			if (liked) {
				await dislikePost(props.post.id);
				setLikesCount((prev) => prev - 1);
			} else {
				await likePost(props.post.id);
				setLikesCount((prev) => prev + 1);
			}
			setLiked(!liked);
		} catch (error) {
			console.error("Error updating like status:", error);
		}
	}

	async function handleDelete() {
		try {
			await deletePostById(props.post.id);
			Alert.alert(
				"post Deleted",
				"Your post has been deleted successfully."
			);
			props.onPostDeleted(props.post.id);
		} catch (error) {
			console.error("Error deleting post:", error);
			Alert.alert("Error", "There was an error deleting the post.");
		}
	}

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	function openLink(link: string) {
		Linking.openURL(link);
	}

	const isOwnerOrAdmin =
		user?.id === props.post.ownerId || userRole === "ROLE_ADMIN";

	return (
		<>
			<TouchableOpacity onPress={() => setIsModalVisible(true)}>
				<View
					style={{
						backgroundColor: "#fff",
						borderRadius: 10,
						padding: 16,
						marginBottom: 16,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.1,
						shadowRadius: 8,
						elevation: 1,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginBottom: 12,
						}}
					>
						<View
							style={{
								flexDirection: "column",
								alignItems: "flex-start",
								flex: 2,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Image
									source={
										postOwner?.profileImageUrl
											? { uri: postOwner.profileImageUrl }
											: require("assets/images/favicon.png")
									}
									style={{
										width: 40,
										height: 40,
										borderRadius: 20,
									}}
								/>
								<Text
									style={{
										marginLeft: 8,
										fontSize: 16,
										fontWeight: "bold",
									}}
								>
									@{props.post.owner}
								</Text>
							</View>
							<Text style={{ fontSize: 10, marginTop: 8 }}>
								{props.post.description}
							</Text>
						</View>

						<View
							style={{
								flexDirection: "column",
								alignItems: "flex-start",
								flex: 1,
								marginLeft: 64,
							}}
						>
							{props.post.album && (
								<View
									style={{
										flexDirection: "column",
										alignItems: "flex-start",
									}}
								>
									<Text
										style={{
											fontWeight: "bold",
											fontSize: 10,
											marginTop: 4,
										}}
									>
										{props.post.album.title}
									</Text>
									<Text style={{ fontSize: 10 }}>
										{props.post.album.artist}
									</Text>
									<Text style={{ fontSize: 10 }}>
										{props.post.album.duration}
									</Text>
								</View>
							)}
							{props.post.song && (
								<View
									style={{
										flexDirection: "column",
										alignItems: "flex-start",
									}}
								>
									<Text
										style={{
											fontWeight: "bold",
											fontSize: 10,
										}}
									>
										{props.post.song.title}
									</Text>
									<Text style={{ fontSize: 10 }}>
										{props.post.song.artistsNames.join(
											", "
										)}
									</Text>
									<Text style={{ fontSize: 10 }}>
										{props.post.song.genre}
									</Text>
									<Text style={{ fontSize: 10 }}>
										{props.post.song.duration}
									</Text>
								</View>
							)}
						</View>

						<View
							style={{
								flexDirection: "column",
								alignItems: "center",
								flex: 1,
							}}
						>
							{props.post.album && (
								<View
									style={{
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Image
										source={{
											uri: props.post.album.coverImageUrl,
										}}
										style={{
											width: 60,
											height: 60,
											borderRadius: 4,
										}}
									/>
									<IconButton
										icon="album"
										size={20}
										onPress={() => {
											navigation.navigate("AlbumScreen", {
												albumId: props.post.album.id,
											});
										}}
									/>
								</View>
							)}
							{props.post.song && (
								<View
									style={{
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Image
										source={{
											uri: props.post.song.coverImageUrl,
										}}
										style={{
											width: 60,
											height: 60,
											borderRadius: 4,
										}}
									/>
									{props.post.song.spotifyPreviewUrl ? (
										<AudioPlayer
											previewUrl={
												props.post.song
													.spotifyPreviewUrl
											}
										/>
									) : (
										<IconButton
											icon="spotify"
											size={20}
											onPress={() => {
												openLink(
													props.post.song.spotifyUrl
												);
											}}
											iconColor="green"
										/>
									)}
								</View>
							)}
						</View>
					</View>

					{props.post.imageUrl ? (
						<Image
							style={{
								width: "100%",
								height: 200,
								borderRadius: 8,
								marginTop: 0,
							}}
							source={{ uri: props.post.imageUrl }}
						/>
					) : null}

					{props.post.audioUrl ? (
						<View style={{ marginTop: 12 }}>
							<AudioPlayer previewUrl={props.post.audioUrl} />
						</View>
					) : null}

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: 12,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<IconButton
								icon={liked ? "heart" : "heart-outline"}
								iconColor={liked ? "red" : "black"}
								size={20}
								onPress={handleLike}
							/>
							<Text>{likesCount} Likes</Text>
						</View>
						{isOwnerOrAdmin && (
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<IconButton
									icon="pencil"
									size={20}
									onPress={() => {
										/* Edit post */
									}}
								/>
								<IconButton
									icon="delete"
									size={20}
									onPress={handleDelete}
								/>
							</View>
						)}
					</View>
				</View>
			</TouchableOpacity>
			<CommentsModal
				visible={isModalVisible}
				postId={props.post.id}
				onClose={() => setIsModalVisible(false)}
			/>
		</>
	);
}
