import { useEffect, useState } from "react";
import { View, Image, ActivityIndicator, Linking } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
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
import { PostMediaCard } from "./PostMediaCard";
import { RootStackParamList } from "@navigation/AppNavigation";
import { theme } from "@navigation/Theme";

interface PostProps {
	post: PostResponse;
	onPostDeleted: (postId: number) => void;
}

export default function Post(props: PostProps) {
	const { user } = useUserContext();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
			showMessage({
				message: "Post deleted",
				type: "success",
			});
			props.onPostDeleted(props.post.id);
		} catch (error) {
			showMessage({
				message: "Failed to delete post",
				type: "danger",
			});
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
			<View>
				<View
					style={{
						backgroundColor: "#fff",
						borderRadius: 10,
						borderWidth: 1,
						borderColor: theme.colors.primary,
						padding: 10,
						paddingHorizontal: 15,
						marginBottom: 16,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.1,
						shadowRadius: 8,
						elevation: 1,
						flex: 1,
						flexDirection: "column",
						gap: 10,
					}}
				>
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<View
							style={{
								flex: 1,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Image
								source={{ uri: postOwner?.profileImageUrl }}
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
								}}
							>
								@{props.post.owner}
							</Text>
						</View>

						{props.post.song || props.post.album ? (
							<IconButton
								icon="spotify"
								size={35}
								iconColor={theme.colors.primary}
								onPress={() =>
									openLink(props.post.song.spotifyUrl)
								}
							/>
						) : null}
					</View>

					{props.post.album ? (
						<PostMediaCard
							type="album"
							media={props.post.album}
							onPress={() =>
								navigation.navigate("AlbumScreen", {
									albumId: props.post.album.id,
								})
							}
						/>
					) : props.post.song ? (
						<PostMediaCard type="song" media={props.post.song} />
					) : null}

					<Text style={{ fontSize: 16, flex: 1 }}>
						{props.post.description}
					</Text>

					{props.post.imageUrl ? (
						<Image
							style={{
								width: "100%",
								height: 200,
								borderRadius: 8,
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
							flex: 1,
							flexDirection: "row",
							alignContent: "space-between",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								flex: 1,
							}}
						>
							<IconButton
								icon={liked ? "heart" : "heart-outline"}
								iconColor={liked ? "red" : "black"}
								size={20}
								style={{
									alignItems: "flex-start",
									marginLeft: 0,
								}}
								onPress={handleLike}
							/>
							<Text style={{ marginLeft: -15 }}>
								{likesCount} likes
							</Text>
							<IconButton
								icon="comment-outline"
								size={20}
								onPress={() => setIsModalVisible(true)}
							/>
						</View>

						{isOwnerOrAdmin && (
							<View
								style={{
									flex: 1,
									flexDirection: "row",
									justifyContent: "flex-end",
								}}
							>
								<IconButton
									icon="pencil"
									size={20}
									onPress={() => {
										/* Edit post */
									}}
									iconColor={theme.colors.primary}
								/>
								<IconButton
									icon="delete"
									size={20}
									onPress={handleDelete}
									iconColor={theme.colors.primary}
								/>
							</View>
						)}
					</View>
				</View>
			</View>

			<CommentsModal
				visible={isModalVisible}
				postId={props.post.id}
				onClose={() => setIsModalVisible(false)}
			/>
		</>
	);
}
