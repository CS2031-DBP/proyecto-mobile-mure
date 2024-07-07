import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
} from "react-native";
import {
    NavigationProp,
    ParamListBase,
    useNavigation,
    useRoute,
    useFocusEffect,
} from "@react-navigation/native";
import { Avatar, Button } from "react-native-paper";
import { UserResponse } from "@/interfaces/User";
import { getUserFriends } from "@/services/profile/getUserFriends";
import { useUserContext } from "@/contexts/UserContext";

export default function FriendList() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const route = useRoute();
    const { friendIds } = route.params as { friendIds: number[] };
    const [friends, setFriends] = useState<UserResponse[]>([]);
    const { user: currentUser, refreshUser } = useUserContext();
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
        if (currentUser && friendId === currentUser.id) {
            navigation.navigate("Profile");
        } else {
            navigation.navigate("UserProfile", { userId: friendId });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16, marginTop: 16 }}>
                {errors ? <Text style={{ color: "red", textAlign: "center", marginBottom: 16 }}>{errors}</Text> : null}
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <TouchableOpacity
                            key={friend.id}
                            style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, padding: 16, backgroundColor: "#f9f9f9", borderRadius: 8 }}
                            onPress={() => handleFriendPress(friend.id)}
                        >
                            <Avatar.Image size={50} source={{ uri: friend.profileImage }} />
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{friend.name}</Text>
                                <Text style={{ color: "gray" }}>{friend.birthDate}</Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text>{friend.friendsIds.length} Friends</Text>
                                <Button mode="outlined" onPress={() => handleFriendPress(friend.id)} style={{ marginTop: 8 }}>
                                    View Profile
                                </Button>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text>No friends found</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
