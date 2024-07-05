import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { FAB, Portal, Provider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
	const [isFabGroupOpen, setIsFabGroupOpen] = useState(false);
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	return (
		<Provider>
			<SafeAreaView style={styles.areaContainer}>
				<View>
					<Text style={styles.title}>Mure</Text>
				</View>
				<View>
					{/* <Stories
					stories={}
					defaultInterval={1500}
					width={432}
					height={768}
					/> */}
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
		color: "#ffffff",
	},
	areaContainer: {
		flex: 1,
		padding: 5,
	},
});

export default Home;
