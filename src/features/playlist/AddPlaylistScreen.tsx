import React, { useEffect, useState } from "react";
import {
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
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
import { theme } from "@navigation/Theme";
import { showMessage } from "react-native-flash-message";

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

	const handleRemoveSong = (songId: number) => {
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
			showMessage({
				message: "playlist Created",
				description: "Your playlist has been created successfully.",
				type: "success",
			});
			navigation.navigate("MainScreen", { screen: "LibraryScreen" });
		} catch (error) {
			setError("Failed to create playlist");
		}
	};

	const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
		if (isCloseToBottom(nativeEvent) && !loading) {
			fetchSongs();
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
			<View
				style={{
					marginBottom: 16,
					marginTop: 32,
				}}
			>
				<View style={{ flexDirection: "row" }}>
					<IconButton
						icon="arrow-left"
						onPress={() => navigation.goBack()}
						size={24}
						style={{ marginBottom: 16 }}
						iconColor={theme.colors.primary}
					></IconButton>
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
						height: 300,
						width: "100%",
						borderRadius: 8,
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
					}}
					onPress={imagePickerHook.pickImage}
				>
					{imagePickerHook.image ? (
						<>
							<Image
								source={{ uri: imagePickerHook.image }}
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 8,
								}}
							/>
							<IconButton
								icon="close"
								size={24}
								onPress={() =>
									imagePickerHook.setImageUri(null)
								}
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
				onPress={handleCreatePlaylist}
				style={{ marginTop: 16 }}
			>
				Create Playlist
			</Button>
		</SafeAreaView>
	);
}
