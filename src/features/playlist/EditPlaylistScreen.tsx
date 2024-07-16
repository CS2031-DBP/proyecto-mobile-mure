import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	Image,
} from "react-native";
import {
	Button,
	IconButton,
	TextInput,
	ActivityIndicator,
} from "react-native-paper";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
	useRoute,
	RouteProp,
} from "@react-navigation/native";
import { useUserContext } from "@contexts/UserContext";
import useImagePicker from "@hooks/useImagePicker";
import { SongResponse } from "@features/song/interfaces/SongResponse";
import { getSongById } from "@features/song/services/getSongById";
import { getSongsByTitle } from "@features/song/services/getSongsByTitle";
import { addSongToPlaylist } from "./services/addSongToPlaylist";
import { removeSongFromPlaylist } from "./services/removeSongFromPlaylist";
import { UpdatePlaylistRequest } from "./interfaces/UpdatePlaylistRequest";
import { updatePlaylist } from "./services/updatePlaylist";
import { theme } from "@navigation/Theme";
import { showMessage } from "react-native-flash-message";

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
			showMessage({
				message: "Playlist updated successfully",
				type: "success",
			});
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

	const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
		if (isCloseToBottom(nativeEvent) && !loading) {
			loadMoreSongs();
		}
	};

	const isCloseToBottom = ({
		layoutMeasurement,
		contentOffset,
		contentSize,
	}: {
		layoutMeasurement: { height: number };
		contentOffset: { y: number };
		contentSize: { height: number };
	}) => {
		const paddingToBottom = 20;
		return (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - paddingToBottom
		);
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				padding: 16,
				backgroundColor: theme.colors.background,
			}}
		>
			<View style={{ marginBottom: 16, marginTop: 32 }}>
				<View style={{ flexDirection: "row" }}>
					<IconButton
						icon="arrow-left"
						onPress={() => navigation.goBack()}
						size={24}
						style={{ marginBottom: 16 }}
						iconColor={theme.colors.primary}
					/>
					<TextInput
						mode="outlined"
						label="Enter playlist name"
						value={playlistName}
						onChangeText={setPlaylistName}
						style={{ marginBottom: 16, width: "85%" }}
					/>
				</View>
				<TouchableOpacity
					style={{
						backgroundColor: "#FFF",
						borderColor: theme.colors.primary,
						borderWidth: 1,
						height: 200,
						width: "100%",
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
			{error && (
				<Text style={{ color: "red", marginBottom: 16 }}>{error}</Text>
			)}
			<View style={{ flex: 1, flexDirection: "row", marginBottom: 16 }}>
				<View style={{ flex: 1, marginRight: 8 }}>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							marginBottom: 8,
							color: theme.colors.primary,
						}}
					>
						Search Results
					</Text>
					<ScrollView
						onScroll={handleScroll}
						scrollEventThrottle={16}
					>
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
									<Text style={{ fontSize: 14 }}>
										{item.title}
									</Text>
									<Text
										style={{ fontSize: 12, color: "gray" }}
									>
										{item.artistsNames.join(", ")}
									</Text>
								</View>
								<IconButton
									icon="plus"
									size={30}
									onPress={() => handleAddSong(item)}
									style={{
										backgroundColor: theme.colors.primary,
										width: 30,
										height: 30,
									}}
									iconColor="#FFF"
								/>
							</View>
						))}
						{loading && (
							<ActivityIndicator size="small" color="#0000ff" />
						)}
					</ScrollView>
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							marginBottom: 8,
							color: theme.colors.primary,
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
									<Text style={{ fontSize: 14 }}>
										{item.title}
									</Text>
									<Text
										style={{ fontSize: 12, color: "gray" }}
									>
										{item.artistsNames.join(", ")}
									</Text>
								</View>
								<IconButton
									icon="minus"
									size={30}
									onPress={() => handleRemoveSong(item.id)}
									style={{
										backgroundColor: theme.colors.primary,
										width: 30,
										height: 30,
									}}
									iconColor="#FFF"
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
					position: "absolute",
					bottom: 16,
					left: 16,
					right: 16,
				}}
			>
				Save Changes
			</Button>
		</SafeAreaView>
	);
}
