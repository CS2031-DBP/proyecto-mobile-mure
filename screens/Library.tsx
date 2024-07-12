import React, { useEffect, useState, useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    ActivityIndicator,
} from "react-native";
import { PlaylistResponse } from "@/interfaces/Playlist";
import { getPlaylistsByUserId } from "@/services/playlist/getPlaylistsByUserId";
import Playlist from "@/components/Playlist";
import { useUserContext } from "@/contexts/UserContext";
import { FAB, Portal, Provider } from "react-native-paper";
import {
    NavigationProp,
    ParamListBase,
    useNavigation,
    useIsFocused,
    RouteProp,
    useRoute,
} from "@react-navigation/native";

interface LibraryProps {
    userId?: number;
}

export default function Library() {
    const route = useRoute<RouteProp<{ params: LibraryProps }, "params">>();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const userContext = useUserContext();
    const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
    const [errors, setErrors] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
    const isFocused = useIsFocused();
    const scrollViewRef = useRef<ScrollView>(null);

    const size = 6;

    const userId = route.params?.userId || userContext.user?.id;
    const isCurrentUser = userId === userContext.user?.id;

    const loadPlaylists = async (currentPage: number, reset: boolean = false) => {
        if (!userId) {
            setErrors("User ID not provided");
            return;
        }

        setLoading(true);

        try {
            const playlistsData = await getPlaylistsByUserId(userId, currentPage, size);
            if (playlistsData.length < size) {
                setHasMore(false);
            }
            setPlaylists((prevPlaylists) =>
                reset
                    ? playlistsData
                    : [...new Set([...prevPlaylists, ...playlistsData])]
            );
        } catch (error) {
            setErrors("Failed to load playlists");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            setPage(0);
            setHasMore(true);
            setPlaylists([]);
            loadPlaylists(0, true);
        }
    }, [userId, isFocused]);

    const loadMore = () => {
        if (hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadPlaylists(nextPage);
        }
    };

    const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
        ) {
            loadMore();
        }
    };

    return (
        <Provider>
            <SafeAreaView style={{ flex: 1, marginTop: 16 }}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{ padding: 16 }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {errors ? (
                        <Text style={{ color: "red" }}>{errors}</Text>
                    ) : (
                        playlists.map((playlist) => (
                            <Playlist
                                key={playlist.id}
                                playlist={playlist}
                                onDelete={() => loadPlaylists(0, true)}
                                isCurrentUser={isCurrentUser}
                                isAdmin={userContext.user?.role === "ROLE_ADMIN"}
                            />
                        ))
                    )}
                    {loading && (
                        <ActivityIndicator size="large" color="#0000ff" />
                    )}
                </ScrollView>
                {isCurrentUser && (
                    <Portal>
                        <FAB.Group
                            open={isFabGroupOpen}
                            visible
                            icon={isFabGroupOpen ? "close" : "playlist-plus"}
                            actions={[
                                {
                                    icon: "playlist-plus",
                                    label: "Add Playlist",
                                    onPress: () =>
                                        navigation.navigate("AddPlaylist"),
                                },
                            ]}
                            onStateChange={() =>
                                setIsFabGroupOpen(!isFabGroupOpen)
                            }
                        />
                    </Portal>
                )}
            </SafeAreaView>
        </Provider>
    );
}
