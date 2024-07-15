import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, ScrollView, View, Text, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { Avatar, Button, IconButton } from "react-native-paper";
import { UserResponse } from "@/interfaces/User";
import { addFriend } from "@/services/friend/addFriend";
import { deleteFriend } from "@/services/friend/deleteFriend";
import { getUserFriends } from "@/services/profile/getUserFriends";
import { getRoleFromToken } from "@/services/auth/getRoleFromToken";
import { deleteUserById } from "@/services/profile/deleteUserById";
import { getPostsByUserId } from "@/services/post/getPostsByUserId";
import { PostResponse } from "@/interfaces/Post";
import Post from "@/components/Post";
import { useUserContext } from "@/contexts/UserContext";
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native";

interface ProfileProps {
    user: UserResponse;
    isCurrentUser: boolean;
    isFriend: boolean;
    setIsFriend: React.Dispatch<React.SetStateAction<boolean>>;
    friends: UserResponse[];
    setFriends: React.Dispatch<React.SetStateAction<UserResponse[]>>;
    friendsCount: number;
    setFriendsCount: React.Dispatch<React.SetStateAction<number>>;
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
            const response = await getPostsByUserId(user.id, reset ? 0 : page, pageSize);
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
            Alert.alert("Friend Added", "You have successfully added this user as a friend.");
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
            Alert.alert("Friend Removed", "You have successfully removed this user from your friends.");
        } catch (error) {
            setErrors("Failed to delete friend");
        }
    };

    const handleDeleteProfile = async () => {
        Alert.alert(
            "Delete Profile",
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
                            Alert.alert("Profile Deleted", "The user profile has been deleted successfully.");
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
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
            <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
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
                        <Avatar.Image size={80} source={{ uri: user.profileImageUrl }} />
                        {!isFriend && !isCurrentUser ? (
                            <IconButton
                                icon="plus"
                                size={15}
                                style={{
                                    position: "absolute",
                                    top: -5,
                                    right: -5,
                                    backgroundColor: "#B0ACAC",
                                }}
                                onPress={handleAddFriend}
                            />
                        ) : null}
                        {isFriend && !isCurrentUser ? (
                            <IconButton
                                icon="trash-can"
                                size={15}
                                style={{
                                    position: "absolute",
                                    top: -5,
                                    right: -5,
                                    backgroundColor: "#B0ACAC",
                                }}
                                onPress={handleDeleteFriend}
                            />
                        ) : null}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                textAlign: "left",
                                marginBottom: 5,
                            }}
                        >
                            @{user.nickname}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "gray",
                                textAlign: "left",
                                marginBottom: 5,
                            }}
                        >
                            {user.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: "gray", textAlign: "left" }}>
                            {user.birthDate}
                        </Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 18 }}>{friendsCount} Friends</Text>
                        {(isFriend || isCurrentUser || role === "ROLE_ADMIN") && (
                            <Button
                                mode="outlined"
                                onPress={() =>
                                    navigation.navigate("FriendsPage", {
                                        friendIds: user.friendsIds,
                                        userId: user.id,
                                    })
                                }
                                style={{ marginTop: 4 }}
                            >
                                View Friends
                            </Button>
                        )}
                        {(isFriend || (role === "ROLE_ADMIN" && !isCurrentUser)) && (
                            <Button
                                mode="contained"
                                onPress={() =>
                                    isCurrentUser
                                        ? navigation.navigate("Main", { screen: "Library" })
                                        : navigation.navigate("Library", { userId: user.id })
                                }
                                style={{ marginTop: 8, width: "100%" }}
                            >
                                View Library
                            </Button>
                        )}
                    </View>
                </View>
                {errors ? (
                    <Text style={{ color: "red", textAlign: "center", marginVertical: 16 }}>
                        {errors}
                    </Text>
                ) : null}
                <View style={{ width: "100%", marginTop: 0, alignItems: "center" }}>
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
                                onPress={() => navigation.navigate("EditProfile")}
                                style={{ flex: 1, marginRight: 10 }}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleDeleteProfile}
                                style={{ flex: 1 }}
                            >
                                Delete Profile
                            </Button>
                        </View>
                    ) : null}
                    {role === "ROLE_ADMIN" && !isCurrentUser && (
                        <Button
                            mode="contained"
                            onPress={handleDeleteProfile}
                            style={{ width: "60%", marginTop: 10 }}
                        >
                            Delete Profile
                        </Button>
                    )}
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{ alignItems: "center", paddingHorizontal: 20 }}
                onScroll={({ nativeEvent }) => {
                    const isCloseToBottom =
                        nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
                        nativeEvent.contentSize.height - 20;
                    if (isCloseToBottom && !loading && hasMore) {
                        fetchPosts();
                    }
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                scrollEventThrottle={400}
            >
                <View style={{ width: "100%", marginTop: 20 }}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Post key={post.id} post={post} onPostDeleted={handlePostDeleted} />
                        ))
                    ) : (
                        <Text style={{ color: "gray", textAlign: "center" }}>No posts available</Text>
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
