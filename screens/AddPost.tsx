import { View } from "react-native";
import {
	Avatar,
	Button,
	Divider,
	IconButton,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { useState } from "react";

export default function AddPost() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [postText, setPostText] = useState("");

	return (
		<SafeAreaView
			style={{ flex: 1, flexDirection: "column", gap: 5, margin: 5 }}
		>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<IconButton
					icon="close"
					size={30}
					onPress={() => navigation.goBack()}
				/>
				<Button mode="contained">Post</Button>
			</View>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					gap: 10,
				}}
			>
				<Avatar.Icon icon="account" size={40} />
				<TextInput
					mode="outlined"
					placeholder="What's happennig?"
					style={{ flex: 1 }}
					onChangeText={setPostText}
				/>
			</View>
			<Divider />
			<View style={{ flexDirection: "row" }}>
				<IconButton icon="image" />
				<IconButton icon="microphone-outline" />
				<IconButton icon="music" />
			</View>
		</SafeAreaView>
	);
}
