import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	FlatList,
	TextInput,
	Text,
	View,
	Alert,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import { getSongsByTitle } from "@/services/song/getSongsByTitle";
import { addSongToPlaylist } from "@/services/playlist/addSongToPlaylist";
import { removeSongFromPlaylist } from "@/services/playlist/removeSongFromPlaylist";
import { getSongById } from "@/services/song/getSongById";
import { SongResponse } from "@/interfaces/Song";
import { useUserContext } from "@/contexts/UserContext";
import {
	RouteProp,
	useRoute,
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";

interface EditPlaylistRouteParams {
	playlist: {
		id: number;
		name: string;
		userId: number;
		songsIds: number[];
	};
}

export default function EditPlaylist() {
	const [title, setTitle] = useState("");
	const [songs, setSongs] = useState<SongResponse[]>([]);
	const [selectedSongs, setSelectedSongs] = useState<SongResponse[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const userContext = useUserContext();
	const route =
		useRoute<RouteProp<{ params: EditPlaylistRouteParams }, "params">>();
	const { playlist } = route.params;
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	useEffect(() => {
		const loadInitialSongs = async () => {
			try {
				const initialSongs = await Promise.all(
					playlist.songsIds.map(async (id) => {
						try {
							const song = await getSongById(id);
							return song;
						} catch (error) {
							console.error(
								`Failed to load song with id ${id}`,
								error
							);
							return null;
						}
					})
				);
				setSelectedSongs(
					initialSongs.filter(
						(song) => song !== null
					) as SongResponse[]
				);
			} catch (error) {
				setError("Failed to load initial songs");
			}
		};

		loadInitialSongs();
	}, [playlist.songsIds]);

	const handleSearch = async () => {
		setError(null);
		setPage(0);
		setHasMore(true);
		try {
			const songsData = await getSongsByTitle(title, 0, 10);
			setSongs(songsData.content);
		} catch (error) {
			setError("Failed to load songs");
		}
	};

	const loadMoreSongs = async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		try {
			const nextPage = page + 1;
			const songsData = await getSongsByTitle(title, nextPage, 10);
			if (songsData.content.length > 0) {
				setSongs([...songs, ...songsData.content]);
				setPage(nextPage);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			setError("Failed to load more songs");
		} finally {
			setLoading(false);
		}
	};

	const handleAddSong = async (song: SongResponse) => {
		setError(null);
		try {
			await addSongToPlaylist(playlist.id, Number(song.id));
			setSelectedSongs([...selectedSongs, song]);
		} catch (error) {
			setError("Failed to add song to playlist");
		}
	};

	const handleRemoveSong = async (songId: string) => {
		setError(null);
		try {
			await removeSongFromPlaylist(playlist.id, Number(songId));
			setSelectedSongs(
				selectedSongs.filter((song) => song.id !== songId)
			);
		} catch (error) {
			setError("Failed to remove song from playlist");
		}
	};

	const handleSave = () => {
		Alert.alert(
			"Playlist Updated",
			"Your playlist has been updated successfully."
		);
		navigation.navigate("Library");
	};

	return (
		<SafeAreaView style={{ flex: 1, padding: 16, marginTop: 32 }}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<IconButton
					icon="arrow-left"
					size={24}
					onPress={() => navigation.goBack()}
				/>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "bold",
						flex: 1,
						textAlign: "center",
						marginRight: 32,
					}}
				>
					{playlist.name}
				</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<TextInput
					placeholder="Enter song title"
					value={title}
					onChangeText={setTitle}
					style={{
						flex: 1,
						padding: 8,
						borderColor: "gray",
						borderWidth: 1,
						borderRadius: 4,
					}}
				/>
				<Button
					mode="contained"
					onPress={handleSearch}
					style={{ marginLeft: 8 }}
				>
					Search
				</Button>
			</View>
			{error && <Text style={{ color: "red" }}>{error}</Text>}
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					flex: 1,
				}}
			>
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
					<FlatList
						data={songs}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
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
									<Text
										style={{ fontSize: 14, flexShrink: 1 }}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										{item.title}
									</Text>
									<Text
										style={{
											fontSize: 12,
											color: "gray",
											flexShrink: 1,
										}}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										{item.artistsNames.join(", ")}
									</Text>
								</View>
								<IconButton
									icon="plus"
									size={24}
									onPress={() => handleAddSong(item)}
								/>
							</View>
						)}
						onEndReached={loadMoreSongs}
						onEndReachedThreshold={0.5}
						ListFooterComponent={
							loading && (
								<Text style={{ textAlign: "center" }}>
									Loading...
								</Text>
							)
						}
					/>
				</View>
				<View style={{ flex: 1, marginLeft: 8 }}>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							marginBottom: 8,
						}}
					>
						Selected Songs
					</Text>
					<FlatList
						data={selectedSongs}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
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
									<Text
										style={{ fontSize: 14, flexShrink: 1 }}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										{item.title}
									</Text>
									<Text
										style={{
											fontSize: 12,
											color: "gray",
											flexShrink: 1,
										}}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										{item.artistsNames.join(", ")}
									</Text>
								</View>
								<IconButton
									icon="minus"
									size={24}
									onPress={() => handleRemoveSong(item.id)}
								/>
							</View>
						)}
					/>
				</View>
			</View>
			<Button
				mode="contained"
				onPress={handleSave}
				style={{ marginTop: 16 }}
			>
				Save Changes
			</Button>
		</SafeAreaView>
	);
}
