import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { FAB, IconButton, Portal, Provider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
	const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	return (
		<Provider>
			<SafeAreaView style={styles.areaContainer}>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Text style={styles.title}>Mure</Text>
					<IconButton
						icon="magnify"
						size={30}
						onPress={() => navigation.navigate("Search")}
					/>
				</View>
				<ScrollView></ScrollView>
				<Portal>
					<FAB.Group
						open={isFabGroupOpen}
						visible
						icon={isFabGroupOpen ? "close" : "fruit-grapes"}
						actions={[
							{
								icon: "lead-pencil",
								label: "Add a post",
								onPress: () => navigation.navigate("AddPost"),
							},
							{
								icon: "camera",
								label: "Add a story",
								onPress: () => navigation.navigate("AddStory"),
							},
						]}
						onStateChange={() => setIsFabGroupOpen(!isFabGroupOpen)}
					/>
				</Portal>
			</SafeAreaView>
		</Provider>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 35,
		fontWeight: "bold",
		fontFamily: "Roboto",
	},
	areaContainer: {
		flex: 1,
		padding: 10,
	},
});

export default Home;
