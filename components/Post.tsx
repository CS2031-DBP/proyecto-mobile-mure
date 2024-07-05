import { PostResponse } from "@/interfaces/Post";
import { Image, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";

export default function Post(props: PostResponse) {
	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Avatar.Image
					size={24}
					source={require("@/assets/favicon.png")}
				/>
				<Text>{props.owner}</Text>
			</View>
			<View>
				<Text>{props.description}</Text>
				<Image src={props.imageUrl} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	headerContainer: {
		flex: 1,
		flexDirection: "row",
	},
});
