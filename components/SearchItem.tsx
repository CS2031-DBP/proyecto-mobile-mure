import { Image, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";

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
	return (
		<TouchableOpacity
			style={{
				flex: 1,
				flexDirection: "row",
				alignItems: "center",
				marginVertical: 5,
			}}
			onPress={() =>
				props.mode == "static" ? props.onPress(props.mediaId) : null
			}
		>
			<Image src={props.imageUrl} />
			<View style={{ flex: 1 }}>
				<Text style={{ fontSize: 16, fontWeight: 500 }}>
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
			{props.mode == "interactive" && props.type == "song" ? (
				<IconButton icon="plus-circle-outline" />
			) : null}
		</TouchableOpacity>
	);
}
