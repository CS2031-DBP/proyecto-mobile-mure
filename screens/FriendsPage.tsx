import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, Text, Alert } from "react-native";
import { NavigationProp, ParamListBase, useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { UserResponse } from "@/interfaces/User";
import { getUserFriends } from "@/services/profile/getUserFriends";
import { deleteFriend } from "@/services/friend/deleteFriend";
import { addFriend } from "@/services/friend/addFriend";
import { useUserContext } from "@/contexts/UserContext";
import FriendList from "@/components/FriendList";

export default function FriendsPage() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const route = useRoute();
    const { friendIds, userId } = route.params as { friendIds: number[], userId?: number };
    const { user: currentUser, refreshUser } = useUserContext();
    const [friends, setFriends] = useState<UserResponse[]>([]);
    const [errors, setErrors] = useState<string | null>(null);

    const loadFriends = async () => {
        try {
        const friendsData = await getUserFriends(friendIds);
        setFriends(friendsData);
        } catch (error) {
        setErrors("Failed to load friends data");
        }
    };

    useFocusEffect(
        useCallback(() => {
        loadFriends();
        }, [friendIds])
    );

    useEffect(() => {
        (async () => {
        await refreshUser();
        loadFriends();
        })();
    }, []);

    const handleFriendPress = (friendId: number) => {
        if (currentUser?.id === friendId) {
        navigation.navigate("Main", { screen: "Profile", params: { userId: friendId } });
        } else {
        navigation.navigate("Profile", { userId: friendId });
        }
    };

    const handleDeleteFriendCurrentUser = async (friendId: number) => {
        console.log("Deleting friend for current user");
        try {
        await deleteFriend(friendId);
        const updatedFriends = friends.filter(friend => friend.id !== friendId);
        setFriends(updatedFriends);
        await refreshUser();
        Alert.alert("Friend Removed", "You have successfully removed this friend.");
        } catch (error) {
        setErrors("Failed to remove friend");
        }
    };

    const handleDeleteFriendOtherUser = async (friendId: number) => {
        console.log("Deleting friend for other user");
        try {
        await deleteFriend(friendId);
        await refreshUser();
        loadFriends();
        Alert.alert("Friend Removed", "You have successfully removed this friend.");
        } catch (error) {
        setErrors("Failed to remove friend");
        }
    };

    const handleAddFriend = async (friendId: number) => {
        console.log("Adding friend");
        try {
        await addFriend(friendId);
        await refreshUser();
        loadFriends();
        Alert.alert("Friend Added", "You have successfully added this user as a friend.");
        } catch (error) {
        setErrors("Failed to add friend");
        }
    };

    const isCurrentUser = userId === currentUser?.id;

    console.log("Is current user:", isCurrentUser);
    console.log("User ID from route:", userId);
    console.log("Current user ID:", currentUser?.id);

    return (
        <SafeAreaView style={{ flex: 1 }}>
        {errors ? (
            <Text style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{errors}</Text>
        ) : null}
        <FriendList
            friends={friends}
            currentUser={currentUser}
            onFriendPress={handleFriendPress}
            onAddFriend={handleAddFriend}
            onDeleteFriend={isCurrentUser ? handleDeleteFriendCurrentUser : handleDeleteFriendOtherUser}
        />
        </SafeAreaView>
    );
}
