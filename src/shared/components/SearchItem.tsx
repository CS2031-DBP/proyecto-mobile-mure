import { Image, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import {
	useNavigation,
	NavigationProp,
	ParamListBase,
} from "@react-navigation/native";
import { useUserContext } from "@contexts/UserContext";
import { likeSong } from "@features/song/services/likeSong";
import { likeAlbum } from "@features/album/services/likeAlbum";
import { useState, useEffect } from "react";
import { isSongLikedByUser } from "@features/song/services/isSongLikedByUser";
import { isAlbumLikedByUser } from "@features/album/services/isAlbumLikedByUser";
import { dislikeSong } from "@features/song/services/dislikeSong";
import { dislikeAlbum } from "@features/album/services/dislikeAlbum";

export interface SearchItemProps {
	mediaId: number;
	title: string;
	mode: "static" | "interactive";
	imageUrl: string;
	type: "song" | "album" | "artist";
	artistName: string;
	onPress: (id: number) => void;
}

export default function SearchItem(props: SearchItemProps) {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const { user } = useUserContext();
	const [liked, setLiked] = useState<boolean>(false);

	useEffect(() => {
		async function fetchLikeStatus() {
			if (props.type === "song") {
				const likedStatus = await isSongLikedByUser(
					props.mediaId,
					user?.id
				);
				setLiked(likedStatus);
			} else if (props.type === "album") {
				const likedStatus = await isAlbumLikedByUser(
					props.mediaId,
					user?.id
				);
				setLiked(likedStatus);
			}
		}

		fetchLikeStatus();
	}, [props.mediaId, props.type, user?.id]);

	const handleLike = async () => {
		try {
			if (liked) {
				if (props.type === "song") {
					await dislikeSong(props.mediaId);
				} else if (props.type === "album") {
					await dislikeAlbum(props.mediaId);
				}
			} else {
				if (props.type === "song") {
					await likeSong(props.mediaId);
				} else if (props.type === "album") {
					await likeAlbum(props.mediaId);
				}
			}
			setLiked(!liked);
		} catch (error) {
			console.error(
				`Failed to update like status for ID ${props.mediaId}`
			);
		}
	};

	const handlePress = () => {
		if (props.mode === "static") {
			props.onPress(props.mediaId);
		} else if (props.type === "album") {
			navigation.navigate("AlbumScreen", { albumId: props.mediaId });
		}
	};

	return (
		<TouchableOpacity
			style={{
				flex: 1,
				flexDirection: "row",
				alignItems: "center",
				marginVertical: 5,
			}}
			onPress={handlePress}
		>
			<Image
				src={props.imageUrl}
				style={{
					width: 50,
					height: 50,
					borderRadius: 5,
					marginRight: 10,
				}}
			/>
			<View style={{ flex: 1 }}>
				<Text style={{ fontSize: 16, fontWeight: "500" }}>
					{props.title}
				</Text>
				{props.type == "album" ? (
					<Text>Album • {props.artistName}</Text>
				) : props.type == "artist" ? (
					<Text>Artist</Text>
				) : (
					<Text>Song • {props.artistName}</Text>
				)}
			</View>
			{props.mode === "interactive" && (
				<IconButton
					icon={liked ? "heart" : "heart-outline"}
					onPress={handleLike}
					iconColor={liked ? "red" : "black"}
				/>
			)}
		</TouchableOpacity>
	);
}
