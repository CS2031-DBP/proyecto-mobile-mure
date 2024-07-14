import React, { useEffect, useState } from "react";
import { View, Text, Modal, TextInput, FlatList, ActivityIndicator, Alert, Button } from "react-native";
import { IconButton } from "react-native-paper";
import { CommentResponseDto, CommentRequestDto } from "@/interfaces/Comment";
import { createComment } from "@/services/comment/createComment";
import { getCommentsByPostId } from "@/services/comment/getCommentsByPostId";
import { deleteComment } from "@/services/comment/deleteComment";
import Comment from "./Comment";
import { useUserContext } from "@/contexts/UserContext";

interface CommentsModalProps {
    visible: boolean;
    postId: number;
    onClose: () => void;
}

export default function CommentsModal({ visible, postId, onClose }: CommentsModalProps) {
    const [comments, setComments] = useState<CommentResponseDto[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { user } = useUserContext();

    useEffect(() => {
        if (visible) {
            fetchComments(true);
        }
    }, [visible]);

    const fetchComments = async (reset: boolean = false) => {
        if (loading || (!reset && !hasMore)) return;

        setLoading(true);
        try {
            const response = await getCommentsByPostId(postId, reset ? 0 : page, 10);
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
    };

    const handleCreateComment = async () => {
        if (!newComment.trim()) return;

        const commentData: CommentRequestDto = {
            content: newComment,
            userId: user!.id,
            postId,
        };

        try {
            await createComment(commentData);
            setNewComment("");
            fetchComments(true);
        } catch (error) {
            Alert.alert("Error", "Failed to create comment");
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        } catch (error) {
            Alert.alert("Error", "Failed to delete comment");
        }
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
        >
            <View style={{ flex: 1, padding: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 24 }}>Comments</Text>
                    <IconButton icon="close" size={24} onPress={onClose} />
                </View>
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Comment comment={item} onDelete={handleDeleteComment} />
                    )}
                    onEndReached={() => fetchComments(false)}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
                />
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
                    <TextInput
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Write a comment"
                        style={{
                            flex: 1,
                            padding: 8,
                            borderColor: "gray",
                            borderWidth: 1,
                            borderRadius: 4,
                        }}
                    />
                    <Button title="Send" onPress={handleCreateComment} />
                </View>
            </View>
        </Modal>
    );
}
