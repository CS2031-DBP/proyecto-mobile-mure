import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  TextInput,
} from "react-native-paper";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { useUserContext } from "@contexts/UserContext";
import useImagePicker from "@hooks/useImagePicker";
import { SongResponse } from "@features/song/interfaces/SongResponse";
import { getSongsByTitle } from "@features/song/services/getSongsByTitle";
import { PlaylistRequest } from "./interfaces/PlaylistRequest";
import { createPlaylistImage } from "./services/createPlaylistImage";

export default function AddPlaylistScreen() {
  const [title, setTitle] = useState("");
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<SongResponse[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  const userContext = useUserContext();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const imagePickerHook = useImagePicker();

  const fetchSongs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const songsData = await getSongsByTitle(title, page, 10);
      setSongs((prevSongs) => [...prevSongs, ...songsData.content]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(songsData.totalPages > page + 1);
      setError(null);
    } catch (error) {
      setError("That song doesn't exist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTrigger) {
      fetchSongs();
      setSearchTrigger(false);
    }
  }, [searchTrigger]);

  const handleSearch = () => {
    setPage(0);
    setSongs([]);
    setHasMore(true);
    setSearchTrigger(true);
  };

  const handleAddSong = (song: SongResponse) => {
    if (!selectedSongs.find((s) => s.id === song.id)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleRemoveSong = (songId: string) => {
    setSelectedSongs(selectedSongs.filter((song) => song.id !== songId));
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName) {
      setError("playlist name is required");
      return;
    }

    const songIds = selectedSongs.map((song) => Number(song.id));
    const playlistData: PlaylistRequest = {
      name: playlistName,
      userId: userContext.user!.id,
      songsIds: songIds,
      coverImage: imagePickerHook.image
        ? {
            uri: imagePickerHook.image,
            name: "playlist.jpg",
            type: "image/jpeg",
          }
        : undefined,
    };

    try {
      await createPlaylistImage(playlistData);
      Alert.alert(
        "playlist Created",
        "Your playlist has been created successfully.",
      );
      navigation.navigate("Main", { screen: "Library" });
    } catch (error) {
      setError("Failed to create playlist");
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent) && !loading) {
      fetchSongs();
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, marginTop: 32 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <TextInput
          mode="outlined"
          label="Enter playlist name"
          value={playlistName}
          onChangeText={setPlaylistName}
          style={{ flex: 1 }}
        />
        {imagePickerHook.image ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: imagePickerHook.image }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                marginLeft: 8,
              }}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => imagePickerHook.setImageUri(null)}
            />
          </View>
        ) : (
          <IconButton
            style={{ marginLeft: 8 }}
            icon="camera"
            size={30}
            onPress={imagePickerHook.pickImage}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <TextInput
          mode="outlined"
          label="Enter song title"
          value={title}
          onChangeText={setTitle}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button mode="contained" onPress={handleSearch}>
          Search
        </Button>
      </View>
      {error && <Text style={{ color: "red", marginBottom: 16 }}>{error}</Text>}
      <View style={{ flex: 1, flexDirection: "row", marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Search Results
          </Text>
          <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
            {songs.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 14 }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {item.artistsNames.join(", ")}
                  </Text>
                </View>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => handleAddSong(item)}
                />
              </View>
            ))}
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Selected Songs
          </Text>
          <ScrollView>
            {selectedSongs.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  borderBottomColor: "gray",
                  borderBottomWidth: 1,
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 14 }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {item.artistsNames.join(", ")}
                  </Text>
                </View>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() => handleRemoveSong(item.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <Button
        mode="contained"
        onPress={handleCreatePlaylist}
        style={{ marginTop: 16 }}
      >
        Create Playlist
      </Button>
    </SafeAreaView>
  );
}
