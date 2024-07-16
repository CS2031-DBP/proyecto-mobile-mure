import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Modal,
	TextInput,
	FlatList,
	ActivityIndicator,
	Alert,
	TouchableOpacity,
} from "react-native";
import { IconButton } from "react-native-paper";
import Comment from "./Comment";
import { useUserContext } from "@contexts/UserContext";
import { CommentRequestDto, CommentResponseDto } from "@interfaces/Comment";
import { getRoleFromToken } from "@services/getRoleFromToken";
import { createComment } from "@services/comment/createComment";
import { deleteComment } from "@services/comment/deleteComment";
import { getCommentsByPostId } from "@services/comment/getCommentsByPostId";
import { theme } from "@navigation/Theme";

interface CommentsModalProps {
	visible: boolean;
	postId: number;
	onClose: () => void;
}

export default function CommentsModal(props: CommentsModalProps) {
	const [comments, setComments] = useState<CommentResponseDto[]>([]);
	const [newComment, setNewComment] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const { user } = useUserContext();
	const [userRole, setUserRole] = useState<string | null>(null);

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

	useEffect(() => {
		if (props.visible) {
			fetchComments(true);
		}
	}, [props.visible]);

	async function fetchComments(reset: boolean = false) {
		if (loading || (!reset && !hasMore)) return;

		setLoading(true);
		try {
			const response = await getCommentsByPostId(
				props.postId,
				reset ? 0 : page,
				10
			);
			if (reset) {
				setComments(response.content);
			} else {
				setComments((prev) => [...prev, ...response.content]);
			}
			setHasMore(response.totalPages > (reset ? 1 : page + 1));
			setPage((prev) => (reset ? 1 : prev + 1));
		} catch (error) {
			Alert.alert("Error", "Failed to load comments");
		} finally {
			setLoading(false);
		}
	}

	async function handleCreateComment() {
		if (!newComment.trim()) return;

		const commentData: CommentRequestDto = {
			content: newComment,
			userId: user!.id,
			postId: props.postId,
		};

		try {
			await createComment(commentData);
			setNewComment("");
			fetchComments(true);
		} catch (error) {
			Alert.alert("Error", "Failed to create comment");
		}
	}

	async function handleDeleteComment(commentId: number) {
		try {
			await deleteComment(commentId);
			setComments((prev) =>
				prev.filter((comment) => comment.id !== commentId)
			);
		} catch (error) {
			Alert.alert("Error", "Failed to delete comment");
		}
	}

	return (
		<Modal
			visible={props.visible}
			onRequestClose={props.onClose}
			animationType="slide"
			style={{ flex: 1, backgroundColor: theme.colors.background }}
		>
			<View
				style={{
					flex: 1,
					padding: 16,
					backgroundColor: theme.colors.background,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 16,
					}}
				>
					<Text style={{ fontSize: 24, fontWeight: "bold" }}>
						Comments
					</Text>
					<IconButton
						icon="close"
						size={24}
						onPress={props.onClose}
					/>
				</View>
				<FlatList
					data={comments}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<Comment
							comment={item}
							onDelete={handleDeleteComment}
							userRole={userRole}
						/>
					)}
					onEndReached={() => fetchComments(false)}
					onEndReachedThreshold={0.5}
					ListFooterComponent={
						loading && (
							<ActivityIndicator size="large" color="#0000ff" />
						)
					}
					style={{ marginBottom: 16 }}
				/>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						borderTopWidth: 1,
						paddingTop: 16,
						borderTopColor: theme.colors.primary,
					}}
				>
					<TextInput
						value={newComment}
						onChangeText={setNewComment}
						placeholder="Write a comment"
						style={{
							flex: 1,
							padding: 8,
							borderColor: theme.colors.primary,
							borderWidth: 1,
							borderRadius: 4,
							marginRight: 8,
						}}
					/>
					<TouchableOpacity
						onPress={handleCreateComment}
						style={{
							backgroundColor: theme.colors.primary,
							padding: 10,
							borderRadius: 4,
						}}
					>
						<Text
							style={{
								color: "white",
								fontWeight: "bold",
							}}
						>
							Send
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}
