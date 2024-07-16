import React, { useEffect, useState } from "react";
import {
	Alert,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	View,
	TouchableOpacity,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import {
	NavigationProp,
	ParamListBase,
	RouteProp,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { SongResponse } from "@features/song/interfaces/SongResponse";
import { useUserContext } from "@contexts/UserContext";
import useImagePicker from "@hooks/useImagePicker";
import { getSongById } from "@features/song/services/getSongById";
import { getSongsByTitle } from "@features/song/services/getSongsByTitle";
import { addSongToPlaylist } from "./services/addSongToPlaylist";
import { removeSongFromPlaylist } from "./services/removeSongFromPlaylist";
import { UpdatePlaylistRequest } from "./interfaces/UpdatePlaylistRequest";
import { updatePlaylist } from "./services/updatePlaylist";
import { theme } from "@navigation/Theme";

interface EditPlaylistRouteParams {
	playlist: {
		id: number;
		name: string;
		userId: number;
		songsIds: number[];
		coverImageUrl?: string;
	};
}

export default function EditPlaylistScreen() {
	const [title, setTitle] = useState("");
	const [songs, setSongs] = useState<SongResponse[]>([]);
	const [selectedSongs, setSelectedSongs] = useState<SongResponse[]>([]);
	const [playlistName, setPlaylistName] = useState<string>("");
	const [coverImage, setCoverImage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const userContext = useUserContext();
	const route =
		useRoute<RouteProp<{ params: EditPlaylistRouteParams }, "params">>();
	const { playlist } = route.params;
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const imagePickerHook = useImagePicker();

	useEffect(() => {
		setPlaylistName(playlist.name);
		setCoverImage(playlist.coverImageUrl || null);
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

	const handleSave = async () => {
		setError(null);
		const updatedPlaylistData: UpdatePlaylistRequest = {
			id: playlist.id,
			name: playlistName,
			coverImage: coverImage
				? {
						uri: coverImage,
						name: "image.jpg",
						type: "image/jpeg",
					}
				: undefined,
		};
		try {
			await updatePlaylist(updatedPlaylistData);
			Alert.alert(
				"Playlist Updated",
				"Your playlist has been updated successfully."
			);
			navigation.navigate("PlaylistScreen", { playlistId: playlist.id });
		} catch (error) {
			setError("Failed to update playlist");
		}
	};

	const handleImageChange = async () => {
		await imagePickerHook.pickImage();
		if (imagePickerHook.image) {
			setCoverImage(imagePickerHook.image);
		}
	};

	const handleImageReset = () => {
		setCoverImage(null);
		imagePickerHook.setImageUri(null);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, padding: 16, backgroundColor: "#FEF5E7" }}
		>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
				}}
			>
				<View style={{ alignItems: "center", marginBottom: 16 }}>
					<TouchableOpacity
						style={{
							backgroundColor: "#FFF",
							borderColor: theme.colors.primary,
							borderWidth: 1,
							height: 150,
							width: 150,
							borderRadius: 8,
							alignItems: "center",
							justifyContent: "center",
							position: "relative",
						}}
						onPress={handleImageChange}
					>
						{coverImage ? (
							<>
								<Image
									source={{ uri: coverImage }}
									style={{
										width: "100%",
										height: "100%",
										borderRadius: 8,
									}}
								/>
								<IconButton
									icon="close"
									size={24}
									onPress={handleImageReset}
									style={{
										position: "absolute",
										top: 8,
										right: 8,
										backgroundColor: "#FFF",
										borderRadius: 12,
									}}
									iconColor={theme.colors.primary}
								/>
							</>
						) : (
							<IconButton
								icon="camera"
								size={50}
								iconColor={theme.colors.primary}
							/>
						)}
					</TouchableOpacity>
					<TextInput
						value={playlistName}
						onChangeText={setPlaylistName}
						style={{
							marginTop: 16,
							padding: 8,
							borderColor: "gray",
							borderWidth: 1,
							borderRadius: 4,
							width: "80%",
							textAlign: "center",
						}}
					/>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
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
							marginRight: 8,
						}}
					/>
					<Button
						mode="contained"
						onPress={handleSearch}
						style={{
							backgroundColor: theme.colors.primary,
							justifyContent: "center",
						}}
					>
						Search
					</Button>
				</View>
				{error && (
					<Text style={{ color: "red", textAlign: "center" }}>
						{error}
					</Text>
				)}
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
						<ScrollView
							onScroll={({ nativeEvent }) => {
								if (isCloseToBottom(nativeEvent) && !loading) {
									loadMoreSongs();
								}
							}}
							scrollEventThrottle={16}
						>
							{songs.map((item) => (
								<View
									key={item.id}
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
											style={{
												fontSize: 14,
												flexShrink: 1,
											}}
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
							))}
							{loading && (
								<Text style={{ textAlign: "center" }}>
									Loading...
								</Text>
							)}
						</ScrollView>
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
						<ScrollView>
							{selectedSongs.map((item) => (
								<View
									key={item.id}
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
											style={{
												fontSize: 14,
												flexShrink: 1,
											}}
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
										onPress={() =>
											handleRemoveSong(item.id)
										}
									/>
								</View>
							))}
						</ScrollView>
					</View>
				</View>
				<Button
					mode="contained"
					onPress={handleSave}
					style={{
						marginTop: 16,
						backgroundColor: theme.colors.primary,
						alignSelf: "center",
						width: "80%",
					}}
				>
					Save Changes
				</Button>
			</ScrollView>
		</SafeAreaView>
	);
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
	const paddingToBottom = 20;
	return (
		layoutMeasurement.height + contentOffset.y >=
		contentSize.height - paddingToBottom
	);
};
