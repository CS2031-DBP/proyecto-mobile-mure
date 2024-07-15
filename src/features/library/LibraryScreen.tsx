import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FAB, Portal, Provider } from "react-native-paper";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useUserContext } from "@contexts/UserContext";
import { PlaylistResponse } from "@features/playlist/interfaces/PlaylistResponse";
import { SongResponse } from "@features/song/interfaces/SongResponse";
import { AlbumResponse } from "@features/album/interfaces/AlbumResponse";
import { getPlaylistsByUserId } from "@features/playlist/services/getPlaylistsByUserId";
import { getFavoriteSongs } from "@features/song/services/getFavoriteSongs";
import { getFavoriteAlbums } from "@features/album/services/getFavoriteAlbums";

interface LibraryProps {
  userId?: number;
}

export default function LibraryScreen() {
  const route = useRoute<RouteProp<{ params: LibraryProps }, "params">>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const userContext = useUserContext();
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<SongResponse[]>([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState<AlbumResponse[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
  const isFocused = useIsFocused();
  const scrollViewRef = useRef<ScrollView>(null);

  const size = 10;

  const userId = route.params?.userId || userContext.user?.id;
  const isCurrentUser = userId === userContext.user?.id;

  const loadPlaylists = async (currentPage: number, reset: boolean = false) => {
    if (!userId) {
      setErrors("User ID not provided");
      return;
    }

    setLoading(true);

    try {
      const playlistsData = await getPlaylistsByUserId(
        userId,
        currentPage,
        size,
      );
      const favoriteSongsData = await getFavoriteSongs(userId);
      const favoriteAlbumsData = await getFavoriteAlbums(userId);

      if (playlistsData.length < size) {
        setHasMore(false);
      }
      setPlaylists((prevPlaylists) =>
        reset ? playlistsData : [...prevPlaylists, ...playlistsData],
      );
      setFavoriteSongs(favoriteSongsData);
      setFavoriteAlbums(favoriteAlbumsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      setErrors("Failed to load data");
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
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      loadMore();
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
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
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("FavoriteSongs", {
                    userId,
                  })
                }
              >
                <View
                  style={{
                    padding: 16,
                    marginBottom: 16,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        flex: 1,
                      }}
                    >
                      Favorite Songs
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "gray",
                        flex: 1,
                      }}
                    >
                      {favoriteSongs.length} songs
                    </Text>
                  </View>
                  <Image
                    source={require("../../../assets/images/liked-songs.jpeg")}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </TouchableOpacity>
              {favoriteAlbums.map((album) => (
                <TouchableOpacity
                  key={album.id}
                  onPress={() =>
                    navigation.navigate("Album", {
                      albumId: album.id,
                    })
                  }
                >
                  <View
                    style={{
                      padding: 16,
                      marginBottom: 16,
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri: album.coverImageUrl,
                      }}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 4,
                        marginRight: 16,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {truncateText(album.title, 25)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                        }}
                      >
                        {truncateText(album.artistName, 20)}
                      </Text>
                      <Text>album</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  onPress={() =>
                    navigation.navigate("PlaylistPage", {
                      playlistId: playlist.id,
                    })
                  }
                >
                  <View
                    style={{
                      padding: 16,
                      marginBottom: 16,
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {truncateText(playlist.name, 20)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                        }}
                      >
                        {playlist.songsIds.length} songs
                      </Text>
                      <Text>playlist</Text>
                    </View>
                    {playlist.coverImageUrl ? (
                      <Image
                        source={{
                          uri: playlist.coverImageUrl,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/images/mure-logo-solid-background.jpg")}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 4,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
                  label: "Add playlist",
                  onPress: () => navigation.navigate("AddPlaylist"),
                },
              ]}
              onStateChange={() => setIsFabGroupOpen(!isFabGroupOpen)}
            />
          </Portal>
        )}
      </SafeAreaView>
    </Provider>
  );
}