import React, { useEffect, useState, useCallback } from "react";
import { View, Alert, Image, RefreshControl, FlatList } from "react-native";
import { ActivityIndicator, FAB, IconButton, Portal, Provider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPosts } from "@/services/post/getAllPosts";
import Post from "@/components/Post";
import { useUserContext } from "@/contexts/UserContext";
import { PostResponse } from "@/interfaces/Post";
import { NavigationProp, ParamListBase, useNavigation, useFocusEffect } from "@react-navigation/native";

export default function Home() {
    const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const userContext = useUserContext();

    useEffect(() => {
        (async () => {
            await userContext.refreshUser();
            fetchPosts(true);
        })();
    }, []);

    const fetchPosts = async (reset: boolean = false) => {
        if (loading || (!reset && !hasMore)) return;

        setLoading(true);
        try {
            const response = await getAllPosts(reset ? 0 : page, 6);
            if (reset) {
                setPosts(response.content);
            } else {
                setPosts((prevPosts) => [...new Set(prevPosts), ...response.content]);
            }
            setHasMore(response.totalPages > (reset ? 1 : page + 1));
            setPage((prevPage) => (reset ? 1 : prevPage + 1));
        } catch (error) {
            console.error("Failed to load posts:", error);
            Alert.alert("Error", "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPosts(true);
        }, [])
    );

    const handlePostDeleted = (postId: number) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPosts(true);
        setRefreshing(false);
    };

    const handleLoadMore = async () => {
        if (hasMore && !loading) {
            await fetchPosts();
        }
    };

    return (
        <Provider>
            <SafeAreaView style={{ flex: 1, padding: 10 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={require("@/assets/logo-mure.jpg")}
                        style={{
                            width: 60,
                            height: 60,
                            resizeMode: "contain",
                            borderRadius: 50,
                            marginLeft: 10,
                            marginVertical: 8,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 35,
                            fontWeight: "bold",
                            fontFamily: "Roboto",
                        }}
                    >
                        Mure
                    </Text>
                    <IconButton
                        icon="magnify"
                        size={30}
                        onPress={() => navigation.navigate("Search")}
                    />
                </View>
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Post post={item} onPostDeleted={handlePostDeleted} />
                    )}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                />
                <Portal>
                    <FAB.Group
                        open={isFabGroupOpen}
                        visible
                        icon={isFabGroupOpen ? "close" : "fruit-grapes"}
                        actions={[
                            {
                                icon: "lead-pencil",
                                label: "Add a post",
                                onPress: () => navigation.navigate("AddPost"),
                            },
                            {
                                icon: "camera",
                                label: "Add a story",
                                onPress: () => navigation.navigate("AddStory"),
                            },
                        ]}
                        onStateChange={() => setIsFabGroupOpen(!isFabGroupOpen)}
                    />
                </Portal>
            </SafeAreaView>
        </Provider>
    );
}
