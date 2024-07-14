import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import { CommentResponseDto } from "@/interfaces/Comment";
import { useUserContext } from "@/contexts/UserContext";

interface CommentProps {
    comment: CommentResponseDto;
    onDelete: (commentId: number) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
    const { user } = useUserContext();
    const isCommentOwner = user?.id === comment.userId;

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 8,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
            }}
        >
            <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 14 }}>{comment.content}</Text>
                <Text style={{ fontSize: 12, color: "gray" }}>User ID: {comment.userId}</Text>
            </View>
            {isCommentOwner && (
                <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => onDelete(comment.id)}
                />
            )}
        </View>
    );
}
