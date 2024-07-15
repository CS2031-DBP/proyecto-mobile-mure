import { RootStackParamList } from "@navigation/AppNavigation";
// import { GoogleLogin } from "@/services/auth/googleAuth";
// import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { Link, NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Auth() {
	const [isLoading, setIsLoading] = useState(false);
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	// async function handleGoogleLogin() {
	// 	setIsLoading(true);

	// 	try {
	// 		const user = await GoogleLogin();

	// 		if (user) {
	// 		}
	// 	} catch (error) {
	// 		navigation.navigate("Login");
	// 		console.log(error);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// }

	const iconSize = 30;

	return (
		<SafeAreaView
			style={{
				padding: 20,
				flex: 1,
				flexDirection: "column",
				alignItems: "center",
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
			<IconButton icon="email" mode="outlined" size={iconSize} />
			<Text onPress={() => navigation.navigate("Register")}>
				Don't have an account? Register
			</Text>
		</SafeAreaView>
	);
}
