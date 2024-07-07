import { Image, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";

export interface SearchItemProps {
	title: string;
	mode: "picker" | "interactive";
	imageUrl: string;
	type: "song" | "album" | "artist";
	artistName: string;
	onPress: () => void;
}

export default function SearchItem(props: SearchItemProps) {
	return (
		<TouchableOpacity
			style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
			onPress={() => (props.type == "song" ? null : props.onPress)}
		>
			<Image src={props.imageUrl} />
			<View style={{ flex: 1 }}>
				<Text>{props.title}</Text>
				{props.type == "album" ? (
					<Text>Album • {props.artistName}</Text>
				) : props.type == "artist" ? (
					<Text>Artist</Text>
				) : (
					<Text>Song • {props.artistName}</Text>
				)}
			</View>
			{props.mode == "interactive" && props.type == "song" ? (
				<IconButton
					icon="plus-circle-outline"
					onPress={props.onPress}
				/>
			) : null}
		</TouchableOpacity>
	);
}
