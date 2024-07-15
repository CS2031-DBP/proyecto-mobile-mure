import { RootStackParamList } from "@navigation/AppNavigation";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import RegisterLink from "./components/RegisterLink";

export default function Auth() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const iconSize = 30;

	return (
		<SafeAreaView
			style={{
				padding: 20,
				flex: 1,
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 20,
			}}
		>
			<Text variant="displaySmall">Welcome to Mure</Text>
			<Image
				source={require("../../../assets/images/mure-logo-transparent-background.png")}
				style={{ width: 150, height: 150 }}
			/>
			<Text variant="titleLarge">Share your music taste!</Text>
			<IconButton
				icon={require("../../../assets/images/mure-logo-transparent-background.png")}
				mode="outlined"
				size={iconSize}
			/>
			<IconButton icon="google" mode="outlined" size={iconSize} />
			<IconButton
				icon="email"
				mode="outlined"
				size={iconSize}
				onPress={() => navigation.navigate("LoginScreen")}
			/>
			<RegisterLink navigation={navigation} />
		</SafeAreaView>
	);
}
