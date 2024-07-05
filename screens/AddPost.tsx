import { Text, View } from "react-native";
import { Avatar, Button, Divider, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";

export default function AddPost() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	return (
		<SafeAreaView>
			<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
				<IconButton icon="close" size={10} onPress={() => navigation.goBack()} />
				<Button>Post</Button>
			</View>
			<View>
				<Avatar.Icon icon="account" />
				<Text>What's happenning?</Text>
			</View>
			<Divider />
			<View>
				<IconButton icon="image" />
				<IconButton icon="microphone-outline" />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({});
