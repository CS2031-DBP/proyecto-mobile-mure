import React, { useEffect, useState } from "react";
import {
	Image,
	Text,
	View,
	ActivityIndicator,
	Linking,
	Alert,
} from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import { PostResponse } from "@/interfaces/Post";
import { UserResponse } from "@/interfaces/User";
import { getUserById } from "@/services/profile/getUserById";
import { useUserContext } from "@/contexts/UserContext";
import { likePost } from "@/services/post/likePost";
import { dislikePost } from "@/services/post/dislikePost";
import { deletePostById } from "@/services/post/deletePostById";
import { getRoleFromToken } from "@/services/auth/getRoleFromToken";

interface PostProps {
	post: PostResponse;
	onPostDeleted: (postId: number) => void;
}

export default function Post({ post, onPostDeleted }: PostProps) {
	const { user } = useUserContext();
	const [postOwner, setPostOwner] = useState<UserResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [liked, setLiked] = useState<boolean>(
		post.likedByUserIds.includes(user?.id || 0)
	);
	const [likesCount, setLikesCount] = useState<number>(post.likes);
	const [userRole, setUserRole] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUserById(post.ownerId);
				setPostOwner(userData);
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [post.ownerId, user?.id]);

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const role = await getRoleFromToken();
				setUserRole(role);
			} catch (error) {
				console.error("Failed to fetch user role:", error);
			}
		};
		fetchRole();
	}, []);

	const handleLike = async () => {
		try {
			if (liked) {
				await dislikePost(post.id);
				setLikesCount((prev) => prev - 1);
			} else {
				await likePost(post.id);
				setLikesCount((prev) => prev + 1);
			}
			setLiked(!liked);
		} catch (error) {
			console.error("Error updating like status:", error);
		}
	};

	const handleDelete = async () => {
		try {
			await deletePostById(post.id);
			Alert.alert(
				"Post Deleted",
				"Your post has been deleted successfully."
			);
			onPostDeleted(post.id);
		} catch (error) {
			console.error("Error deleting post:", error);
			Alert.alert("Error", "There was an error deleting the post.");
		}
	};

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	const openLink = (link: string) => {
		Linking.openURL(link);
	};

	const isOwnerOrAdmin =
		user?.id === post.ownerId || userRole === "ROLE_ADMIN";

	return (
		<View
			style={{
				backgroundColor: "#fff",
				borderRadius: 8,
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
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<Avatar.Image
							size={40}
							source={
								postOwner?.profileImageUrl
									? { uri: postOwner.profileImageUrl }
									: require("@/assets/favicon.png")
							}
						/>
						<Text
							style={{
								marginLeft: 8,
								fontSize: 16,
								fontWeight: "bold",
							}}
						>
							@{post.owner}
						</Text>
					</View>
					<Text style={{ fontSize: 10, marginTop: 8 }}>
						{post.description}
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
					{post.album && (
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
								{post.album.title}
							</Text>
							<Text style={{ fontSize: 10 }}>
								{post.album.artist}
							</Text>
							<Text style={{ fontSize: 10 }}>
								{post.album.duration}
							</Text>
						</View>
					)}
					{post.song && (
						<View
							style={{
								flexDirection: "column",
								alignItems: "flex-start",
							}}
						>
							<Text style={{ fontWeight: "bold", fontSize: 10 }}>
								{post.song.title}
							</Text>
							<Text style={{ fontSize: 10 }}>
								{post.song.artistsNames.join(", ")}
							</Text>
							<Text style={{ fontSize: 10 }}>
								{post.song.genre}
							</Text>
							<Text style={{ fontSize: 10 }}>
								{post.song.duration}
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
					{post.album && (
						<View
							style={{
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Image
								source={{ uri: post.album.coverUrl }}
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
									openLink(post.album.link);
								}}
							/>
						</View>
					)}
					{post.song && (
						<View
							style={{
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Image
								source={{ uri: post.song.coverUrl }}
								style={{
									width: 60,
									height: 60,
									borderRadius: 4,
								}}
							/>
							<IconButton
								icon="headphones"
								size={20}
								onPress={() => {
									openLink(post.song.link);
								}}
							/>
						</View>
					)}
				</View>
			</View>

			{post.imageUrl ? (
				<Image
					style={{
						width: "100%",
						height: 200,
						borderRadius: 8,
						marginTop: 0,
					}}
					source={{ uri: post.imageUrl }}
				/>
			) : null}

			{post.audioUrl ? (
				<View style={{ marginTop: 12 }}>
					{/* Insert audio player here */}
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
				<View style={{ flexDirection: "row", alignItems: "center" }}>
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
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<IconButton
							icon="pencil"
							size={20}
							onPress={() => {
								/* Edit post */
							}}
							iconColor="#750B97"
						/>
						<IconButton
							icon="delete"
							size={20}
							onPress={handleDelete}
							iconColor="#750B97"
						/>
					</View>
				)}
			</View>
		</View>
	);
}
