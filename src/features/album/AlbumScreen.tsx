import { useEffect, useState } from "react";
import {
	Image,
	Linking,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
import { getAlbumById } from "./services/getAlbumById";
import { isAlbumLikedByUser } from "./services/isAlbumLikedByUser";
import { likeAlbum } from "./services/likeAlbum";
import { dislikeAlbum } from "./services/dislikeAlbum";
import { AlbumResponse } from "./interfaces/AlbumResponse";
import MediaCard from "@components/MediaCard";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { IconButton, Text } from "react-native-paper";
import { useUserContext } from "@contexts/UserContext";
import { theme } from "@navigation/Theme";

interface AlbumProps {
	albumId: number;
}

const HeartIcon = ({
	liked,
	onPress,
}: {
	liked: boolean;
	onPress: () => void;
}) => {
	return (
		<TouchableOpacity onPress={onPress}>
			{liked ? (
				<IconButton
					icon="heart"
					size={24}
					iconColor={theme.colors.primary}
				/>
			) : (
				<IconButton
					icon="heart-outline"
					size={24}
					iconColor={theme.colors.primary}
				/>
			)}
		</TouchableOpacity>
	);
};

export default function AlbumScreen() {
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
				if (!user) throw new Error("User not found");
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
			contentContainerStyle={{
				padding: 16,
				backgroundColor: theme.colors.background,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<Image
					source={{ uri: album.coverImageUrl }}
					style={{ width: 160, height: 160, borderRadius: 8 }}
				/>
				<View style={{ marginLeft: 16, flex: 1 }}>
					<Text style={{ fontSize: 16, fontWeight: "bold" }}>
						{album.title}
					</Text>
					<View
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<Text style={{ fontSize: 14, color: "gray" }}>
							by {album.artistName}
						</Text>
						<HeartIcon liked={liked} onPress={handleLike} />
						<IconButton
							icon="spotify"
							size={24}
							iconColor={theme.colors.primary}
							onPress={() => openLink(album.spotifyUrl)}
						/>
					</View>
					<View style={{ marginTop: 8 }}>
						<Text style={{ fontSize: 12 }}>
							{album.songsCount} songs
						</Text>
						<Text style={{ fontSize: 12 }}>
							Total Duration: {album.totalDuration}
						</Text>
						<Text style={{ fontSize: 12 }}>
							Release Date: {album.releaseDate}
						</Text>
					</View>
				</View>
			</View>
			<Text style={{ fontSize: 16 }}>{album.description}</Text>
			<View>
				{album.songsIds.map((songId) => (
					<View key={songId} style={{ marginVertical: 0 }}>
						<MediaCard mediaId={songId} type="song" />
					</View>
				))}
			</View>
		</ScrollView>
	);
}
