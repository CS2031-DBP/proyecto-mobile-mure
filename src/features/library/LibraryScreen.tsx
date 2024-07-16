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
import {
	NavigationProp,
	ParamListBase,
	RouteProp,
	useRoute,
	useIsFocused,
	useNavigation,
} from "@react-navigation/native";
import { useUserContext } from "@contexts/UserContext";
import { PlaylistResponse } from "@features/playlist/interfaces/PlaylistResponse";
import { SongResponse } from "@features/song/interfaces/SongResponse";
import { AlbumResponse } from "@features/album/interfaces/AlbumResponse";
import { getPlaylistsByUserId } from "@features/playlist/services/getPlaylistsByUserId";
import { getFavoriteSongs } from "@features/song/services/getFavoriteSongs";
import { getFavoriteAlbums } from "@features/album/services/getFavoriteAlbums";
import { IconButton, Provider } from "react-native-paper";
import { theme } from "@navigation/Theme";

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
	const isFocused = useIsFocused();
	const scrollViewRef = useRef<ScrollView>(null);

	const size = 10;

	const userId = route.params?.userId || userContext.user?.id;
	const isCurrentUser = userId === userContext.user?.id;

	const loadPlaylists = async (
		currentPage: number,
		reset: boolean = false
	) => {
		if (!userId) {
			setErrors("User ID not provided");
			return;
		}

		setLoading(true);

		try {
			const playlistsData = await getPlaylistsByUserId(
				userId,
				currentPage,
				size
			);
			const favoriteSongsData = await getFavoriteSongs(userId);
			const favoriteAlbumsData = await getFavoriteAlbums(userId);

			if (playlistsData.length < size) {
				setHasMore(false);
			}
			setPlaylists((prevPlaylists) =>
				reset ? playlistsData : [...prevPlaylists, ...playlistsData]
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
		if (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - 20
		) {
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
			<SafeAreaView
				style={{
					flex: 1,
					backgroundColor: theme.colors.primary,
					paddingTop: 24,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						paddingHorizontal: 16,
						backgroundColor: theme.colors.primary,
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							color: "white",
							marginBottom: 8,
						}}
					>
						{isCurrentUser
							? "Your Library"
							: "Your Friend's Library"}
					</Text>
					{isCurrentUser && (
						<IconButton
							icon="plus"
							size={24}
							iconColor="white"
							onPress={() =>
								navigation.navigate("AddPlaylistScreen")
							}
							style={{ marginBottom: 8 }}
						/>
					)}
				</View>
				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={{ padding: 16 }}
					onScroll={handleScroll}
					scrollEventThrottle={16}
					style={{ backgroundColor: theme.colors.background }}
				>
					{errors ? (
						<Text style={{ color: "red" }}>{errors}</Text>
					) : (
						<>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("FavoriteSongsScreen", {
										userId,
									})
								}
							>
								<View
									style={{
										padding: 16,
										marginBottom: 16,
										backgroundColor: "#FFF7E7",
										borderRadius: 8,
										borderColor: theme.colors.primary,
										borderWidth: 1,
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<View style={{ flex: 1 }}>
										<Text
											style={{
												fontSize: 16,
												fontWeight: "bold",
												color: theme.colors.primary,
												flex: 1,
												overflow: "hidden",
											}}
											numberOfLines={1}
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
										source={require("../../../assets/images/favorite-songs-playlist-image.png")}
										style={{ width: 80, height: 80 }}
									></Image>
								</View>
							</TouchableOpacity>
							{favoriteAlbums.map((album) => (
								<TouchableOpacity
									key={album.id}
									onPress={() =>
										navigation.navigate("AlbumScreen", {
											albumId: album.id,
										})
									}
								>
									<View
										style={{
											padding: 16,
											marginBottom: 16,
											backgroundColor: "#FFF7E7",
											borderRadius: 8,
											borderColor: theme.colors.primary,
											borderWidth: 1,
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<View style={{ flex: 1 }}>
											<Text
												style={{
													fontSize: 16,
													fontWeight: "bold",
													color: theme.colors.primary,
													overflow: "hidden",
												}}
												numberOfLines={1}
											>
												{truncateText(album.title, 25)}
											</Text>
											<Text
												style={{
													fontSize: 14,
													color: "gray",
												}}
											>
												{truncateText(
													album.artistName,
													30
												)}
											</Text>
											<Text>album</Text>
										</View>
										<Image
											source={{
												uri: album.coverImageUrl,
											}}
											style={{
												width: 80,
												height: 80,
												borderRadius: 4,
											}}
										/>
									</View>
								</TouchableOpacity>
							))}
							{playlists.map((playlist) => (
								<TouchableOpacity
									key={playlist.id}
									onPress={() =>
										navigation.navigate("PlaylistScreen", {
											playlistId: playlist.id,
										})
									}
								>
									<View
										style={{
											padding: 16,
											marginBottom: 16,
											backgroundColor: "#FFF7E7",
											borderRadius: 8,
											borderColor: theme.colors.primary,
											borderWidth: 1,
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<View style={{ flex: 1 }}>
											<Text
												style={{
													fontSize: 16,
													fontWeight: "bold",
													color: theme.colors.primary,
													overflow: "hidden",
												}}
												numberOfLines={1}
											>
												{truncateText(
													playlist.name,
													20
												)}
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
													width: 80,
													height: 80,
													borderRadius: 4,
												}}
											/>
										) : (
											<Image
												source={require("../../../assets/images/mure-logo-solid-background.jpg")}
												style={{
													width: 80,
													height: 80,
													borderRadius: 4,
												}}
											/>
										)}
									</View>
								</TouchableOpacity>
							))}
						</>
					)}
					{loading && (
						<ActivityIndicator size="large" color="#0000ff" />
					)}
				</ScrollView>
			</SafeAreaView>
		</Provider>
	);
}
