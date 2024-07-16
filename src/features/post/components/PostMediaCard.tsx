import { Image, View } from "react-native";
import { AlbumInfoForPost } from "../interfaces/AlbumInfoForPost";
import { SongResponseForPost } from "../interfaces/SongResponseForPost";
import { IconButton, Text } from "react-native-paper";
import AudioPlayer from "@components/AudioPlayer";

interface PostMediaCardProps {
	media: AlbumInfoForPost | SongResponseForPost;
	type: "album" | "song";
	onPress?: () => void;
}

export function PostMediaCard(props: PostMediaCardProps) {
	return (
		<View
			style={{
				flex: 1,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				gap: 15,
			}}
		>
			<Image
				source={{ uri: props.media.coverImageUrl }}
				style={{
					width: 70,
					height: 70,
					borderRadius: 4,
				}}
			/>
			<View style={{ flex: 2, flexDirection: "column" }}>
				<Text
					variant="bodyMedium"
					style={{ fontWeight: "bold" }}
					numberOfLines={1}
				>
					{props.media.title}
				</Text>
				<Text numberOfLines={1}>
					{props.type == "song"
						? (
								props.media as SongResponseForPost
							).artistsNames.join(", ")
						: (props.media as AlbumInfoForPost).artist}
				</Text>
				{props.type === "song" ? (
					<Text>{(props.media as SongResponseForPost).genre}</Text>
				) : null}
				<Text>{props.media.duration}</Text>
			</View>
			{props.type === "song" &&
			(props.media as SongResponseForPost).spotifyPreviewUrl ? (
				<AudioPlayer
					previewUrl={
						(props.media as SongResponseForPost).spotifyPreviewUrl
					}
					showRestartButton={false}
				/>
			) : props.type === "album" ? (
				<IconButton icon="album" onPress={props.onPress} />
			) : null}
		</View>
	);
}
