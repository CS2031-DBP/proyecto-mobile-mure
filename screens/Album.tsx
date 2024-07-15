import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	Linking,
} from "react-native";
import { getAlbumById } from "@/services/album/getAlbumById";
import { isAlbumLikedByUser } from "@/services/album/isAlbumLikedByUser";
import { likeAlbum } from "@/services/album/likeAlbum";
import { dislikeAlbum } from "@/services/album/dislikeAlbum";
import { AlbumResponse } from "@/interfaces/Album";
import MediaCard from "@/components/MediaCard";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { useUserContext } from "@/contexts/UserContext";

interface AlbumProps {
	albumId: number;
}

export default function Album() {
	const route = useRoute<RouteProp<{ params: AlbumProps }, "params">>();
	const navigation = useNavigation();
	const { albumId } = route.params;
	const { user } = useUserContext();
	const [album, setAlbum] = useState<AlbumResponse | null>(null);
	const [liked, setLiked] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchAlbum() {
			try {
				const albumData = await getAlbumById(albumId);
				setAlbum(albumData);
				const likedStatus = await isAlbumLikedByUser(albumId, user?.id);
				setLiked(likedStatus);
			} catch (err) {
				setError(
					`Failed to load album data: ${(err as Error).message}`
				);
			}
		}

		fetchAlbum();
	}, [albumId]);

	const handleLike = async () => {
		try {
			if (liked) {
				await dislikeAlbum(albumId);
			} else {
				await likeAlbum(albumId);
			}
			setLiked(!liked);
		} catch (err) {
			setError(`Failed to update like status: ${(err as Error).message}`);
		}
	};

	const openLink = (link: string) => {
		Linking.openURL(link);
	};

	if (error) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "red" }}>{error}</Text>
			</View>
		);
	}

	if (!album) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={{ padding: 16, backgroundColor: "#fff" }}
		>
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={{ position: "absolute", top: 32, left: 16, zIndex: 1 }}
			>
				<IconButton icon="arrow-left" size={24} />
			</TouchableOpacity>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 16,
					marginTop: 40,
				}}
			>
				<Image
					source={{ uri: album.coverImageUrl }}
					style={{ width: 100, height: 100, borderRadius: 8 }}
				/>
				<View style={{ marginLeft: 16, flex: 1 }}>
					<Text style={{ fontSize: 24, fontWeight: "bold" }}>
						{album.title}
					</Text>
					<Text style={{ fontSize: 18, color: "gray" }}>
						by {album.artistName}
					</Text>

					<View
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<View style={{ marginTop: 8 }}>
							<Text style={{ fontSize: 14 }}>
								{album.songsCount} songs{" "}
							</Text>
							<Text style={{ fontSize: 14 }}>
								Total Duration: {album.totalDuration}
							</Text>
							<Text style={{ fontSize: 14 }}>
								Release Date: {album.releaseDate}
							</Text>
						</View>
						<View
							style={{
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<TouchableOpacity onPress={handleLike}>
								<IconButton
									icon={liked ? "heart" : "heart-outline"}
									size={24}
									iconColor={liked ? "red" : "black"}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => openLink(album.spotifyUrl)}
							>
								<IconButton
									icon="spotify"
									size={24}
									iconColor="green"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
			<Text style={{ fontSize: 16, marginVertical: 0 }}>
				{album.description}
			</Text>
			<View style={{ marginTop: 16 }}>
				{album.songsIds.map((songId) => (
					<View key={songId} style={{ marginBottom: 16 }}>
						<MediaCard mediaId={songId} type="song" />
					</View>
				))}
			</View>
		</ScrollView>
	);
}
