import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	TextInput,
	Button,
	FlatList,
	Text,
	View,
	Alert,
} from "react-native";
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
		try {
			const songsData = await getSongsByTitle(title, 0, 10);
			setSongs(songsData);
			setError(null);
		} catch (error) {
			setError("Failed to load songs");
		}
	};

	const handleAddSong = async (song: SongResponse) => {
		try {
			await addSongToPlaylist(playlist.id, Number(song.id));
			setSelectedSongs([...selectedSongs, song]);
		} catch (error) {
			setError("Failed to add song to playlist");
		}
	};

	const handleRemoveSong = async (songId: string) => {
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
			<Text
				style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}
			>
				Edit Playlist: {playlist.name}
			</Text>
			<TextInput
				placeholder="Enter song title"
				value={title}
				onChangeText={setTitle}
				style={{
					marginBottom: 16,
					padding: 8,
					borderColor: "gray",
					borderWidth: 1,
					borderRadius: 4,
				}}
			/>
			<Button title="Search" onPress={handleSearch} />
			{error && <Text style={{ color: "red" }}>{error}</Text>}

			<FlatList
				data={songs}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							padding: 16,
							borderBottomColor: "gray",
							borderBottomWidth: 1,
						}}
					>
						<View>
							<Text style={{ fontSize: 16 }}>{item.title}</Text>
							<Text style={{ fontSize: 14, color: "gray" }}>
								{item.artistsNames.join(", ")}
							</Text>
						</View>
						<Button
							title="Add"
							onPress={() => handleAddSong(item)}
						/>
					</View>
				)}
				ListHeaderComponent={
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						Search Results
					</Text>
				}
			/>

			<FlatList
				data={selectedSongs}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							padding: 16,
							borderBottomColor: "gray",
							borderBottomWidth: 1,
						}}
					>
						<View>
							<Text style={{ fontSize: 16 }}>{item.title}</Text>
							<Text style={{ fontSize: 14, color: "gray" }}>
								{item.artistsNames.join(", ")}
							</Text>
						</View>
						<Button
							title="Remove"
							onPress={() => handleRemoveSong(item.id)}
						/>
					</View>
				)}
				ListHeaderComponent={
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						Selected Songs
					</Text>
				}
			/>

			<Button title="Save Changes" onPress={handleSave} />
		</SafeAreaView>
	);
}
