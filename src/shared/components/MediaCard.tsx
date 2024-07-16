import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Linking } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { SongResponse } from "@features/song/interfaces/SongResponse";
import { dislikeAlbum } from "@features/album/services/dislikeAlbum";
import { isSongLikedByUser } from "@features/song/services/isSongLikedByUser";
import { isAlbumLikedByUser } from "@features/album/services/isAlbumLikedByUser";
import { useUserContext } from "@contexts/UserContext";
import AudioPlayer from "@components/AudioPlayer";
import { AlbumResponse } from "@features/album/interfaces/AlbumResponse";
import { getSongById } from "@features/song/services/getSongById";
import { getAlbumById } from "@features/album/services/getAlbumById";
import { likeAlbum } from "@features/album/services/likeAlbum";
import { likeSong } from "@features/song/services/likeSong";
import { dislikeSong } from "@features/song/services/dislikeSong";
import { theme } from "@navigation/Theme";

interface MediaCardProps {
	type: "song" | "album";
	mediaId: number;
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

export default function MediaCard({ type, mediaId }: MediaCardProps) {
	type Media = SongResponse | AlbumResponse;
	const [error, setError] = useState<string | null>(null);
	const [media, setMedia] = useState<Media | null>(null);
	const [liked, setLiked] = useState<boolean>(false);
	const { user } = useUserContext();

	useEffect(() => {
		async function fetchMedia() {
			try {
				let mediaData: Media | null = null;
				let likedStatus: boolean = false;
				if (!user) throw new Error("User not logged in");

				if (type === "song") {
					mediaData = await getSongById(mediaId);
					likedStatus = await isSongLikedByUser(mediaId, user?.id);
				} else if (type === "album") {
					mediaData = await getAlbumById(mediaId);
					likedStatus = await isAlbumLikedByUser(mediaId, user?.id);
				}
				setMedia(mediaData);
				setLiked(likedStatus);
			} catch (err) {
				setError(
					`Failed to load media data for ID ${mediaId}: ${
						(err as Error).message
					}`
				);
			}
		}

		fetchMedia();
	}, [mediaId]);

	function openLink() {
		if (media?.spotifyUrl) {
			Linking.openURL(media.spotifyUrl);
		}
	}

	const handleLike = async () => {
		try {
			if (liked) {
				if (type === "song") {
					await dislikeSong(mediaId);
				} else if (type === "album") {
					await dislikeAlbum(mediaId);
				}
			} else {
				if (type === "song") {
					await likeSong(mediaId);
				} else if (type === "album") {
					await likeAlbum(mediaId);
				}
			}
			setLiked(!liked);
		} catch (err) {
			setError(`Failed to update like status for ID ${mediaId}`);
		}
	};

	if (error)
		return (
			<Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
		);

	if (!media) return <Text style={{ textAlign: "center" }}>Loading...</Text>;

	return (
		<Card
			style={{
				padding: 10,
				borderRadius: 8,
				borderColor: theme.colors.primary,
				borderWidth: 1,
				backgroundColor: "#FFF7E7",
				marginVertical: 10,
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				{media.coverImageUrl ? (
					<Image
						source={{ uri: media.coverImageUrl }}
						style={{ width: 80, height: 80, borderRadius: 8 }}
					/>
				) : (
					<View
						style={{
							width: 80,
							height: 80,
							borderRadius: 8,
							backgroundColor: "gray",
						}}
					/>
				)}
				<View style={{ marginLeft: 16, flex: 1 }}>
					<Text
						style={{
							fontSize: 14,
							fontWeight: "bold",
							color: theme.colors.primary,
							marginBottom: 4,
						}}
					>
						{media.title}
					</Text>
					<Text style={{ fontSize: 12, color: "gray" }}>
						{type === "song"
							? (media as SongResponse).artistsNames.join(", ")
							: (media as AlbumResponse).artistName}
					</Text>
					{type === "song" ? (
						<>
							<Text style={{ fontSize: 12, color: "gray" }}>
								{(media as SongResponse).genre}
							</Text>
							<Text style={{ fontSize: 12, color: "gray" }}>
								{(media as SongResponse).duration}
							</Text>
						</>
					) : null}
				</View>
				<View
					style={{
						flexDirection: "column",
						alignItems: "flex-end",
						justifyContent: "space-between",
					}}
				>
					{type === "song" &&
					(media as SongResponse).spotifyPreviewUrl ? (
						<AudioPlayer
							previewUrl={
								(media as SongResponse).spotifyPreviewUrl
							}
							showRestartButton
						/>
					) : (
						<IconButton
							icon="spotify"
							size={24}
							iconColor={theme.colors.primary}
							onPress={openLink}
							style={{ marginBottom: 16 }}
						/>
					)}
					<HeartIcon liked={liked} onPress={handleLike} />
				</View>
			</View>
		</Card>
	);
}
