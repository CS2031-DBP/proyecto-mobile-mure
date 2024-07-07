import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { SongResponse } from "@/interfaces/Song";
import { getSongById } from "@/services/song/getSongById";
import { AlbumResponse } from "@/interfaces/Album";
import { getAlbumById } from "@/services/album/getAlbumById";

interface MediaCard {
	type: "song" | "album";
	mediaId: number;
}

export default function MediaCard(props: MediaCard) {
	type Media = SongResponse | AlbumResponse;
	const [error, setError] = useState<string | null>(null);
	const [media, setMedia] = useState<Media | null>(null);

	useEffect(() => {
		async function fetchSong() {
			try {
				if (props.type === "song") {
					const songData = await getSongById(props.mediaId);
					setMedia(songData);
				} else if (props.type === "album") {
					const albumData = await getAlbumById(props.mediaId);
					setMedia(albumData);
				}
			} catch (err) {
				setError(
					`Failed to load song data for ID ${props.mediaId}: ${
						(err as Error).message
					}`
				);
			}
		}

		fetchSong();
	}, [props.mediaId]);

	function openLink() {
		if (media?.link) {
			Linking.openURL(media.link);
		}
	}

	if (error)
		return (
			<Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
		);

	if (!media) return <Text style={{ textAlign: "center" }}>Loading...</Text>;

	return (
		<Card style={{ padding: 10 }}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				{media.coverImage ? (
					<Image
						source={{ uri: media.coverImage }}
						style={{ width: 60, height: 60, borderRadius: 30 }}
					/>
				) : (
					<View
						style={{
							width: 60,
							height: 60,
							borderRadius: 30,
							backgroundColor: "gray",
						}}
					/>
				)}
				<View style={{ marginLeft: 10, flex: 1 }}>
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>
						{media.title}
					</Text>
					<Text style={{ color: "gray" }}>
						{props.type === "song"
							? (media as SongResponse).artistsNames.join(", ")
							: (media as AlbumResponse).artistName}
					</Text>
					{props.type === "song" ? (
						<>
							<Text style={{ color: "gray" }}>
								{(media as SongResponse).albumTitle}
							</Text>
							<Text style={{ color: "gray" }}>
								{(media as SongResponse).genre}
							</Text>
							<Text style={{ color: "gray" }}>
								{(media as SongResponse).duration}
							</Text>
						</>
					) : null}
				</View>
				<TouchableOpacity
					onPress={openLink}
					style={{ position: "absolute", right: 0, bottom: 0 }}
				>
					<IconButton
						icon="headphones"
						size={24}
						onPress={openLink}
					/>
				</TouchableOpacity>
			</View>
		</Card>
	);
}
