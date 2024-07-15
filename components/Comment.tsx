import React from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { CommentResponseDto } from "@/interfaces/Comment";
import { useUserContext } from "@/contexts/UserContext";

interface CommentProps {
    comment: CommentResponseDto;
    onDelete: (commentId: number) => void;
    userRole: string | null;
}

export default function Comment({ comment, onDelete, userRole }: CommentProps) {
    const { user } = useUserContext();

    const handleDelete = () => {
        Alert.alert(
            "Delete Comment",
            "Are you sure you want to delete this comment?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => onDelete(comment.id), style: "destructive" },
            ]
        );
    };

    const isOwnerOrAdmin = user?.id === comment.userId || userRole === "ROLE_ADMIN";

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 8,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
            }}
        >
            <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 14 }}>{comment.content}</Text>
                <Text style={{ fontSize: 12, color: "gray" }}>{comment.nickname}</Text>
            </View>
            {isOwnerOrAdmin && (
                <IconButton icon="delete" size={20} onPress={handleDelete} />
            )}
        </View>
    );
}
