import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
	return (
		<SafeAreaView style={styles.areaContainer}>
			<View>
				<Text style={styles.title}>Mure</Text>
			</View>
			<View>stories</View>
			<View>posts</View>
		</SafeAreaView>
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
		padding: 5,
	},
});

export default Home;
