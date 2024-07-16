import React, { useState } from "react";
import { Image, SafeAreaView, View } from "react-native";
import {
	NavigationProp,
	ThemeProvider,
	useNavigation,
} from "@react-navigation/native";
import { Button, Text, TextInput } from "react-native-paper";
import RegisterLink from "../components/RegisterLink";
import { RootStackParamList } from "@navigation/AppNavigation";
import { showMessage } from "react-native-flash-message";
import { login } from "./services/login";
import { theme } from "@navigation/Theme";

export default function LoginScreen() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function handleLogin() {
		if (!email || !password) {
			showMessage({
				message: "Please fill in all fields",
				type: "warning",
			});
			return;
		}

		try {
			const response = await login({ email, password });
			if (response.token) navigation.navigate("MainScreen");
		} catch (error) {
			showMessage({ message: "Something went wrong", type: "danger" });
		}
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				padding: 30,
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 40,
				backgroundColor: theme.colors?.background,
			}}
		>
			<Text variant="displaySmall">Login to Mure</Text>
			<Image
				source={require("assets/images/mure-logo-transparent-background.png")}
				style={{ width: 125, height: 125 }}
			/>
			<View style={{ flexDirection: "column", gap: 20, width: "100%" }}>
				<TextInput
					style={{ width: "100%" }}
					mode="outlined"
					label="Email"
					value={email}
					onChangeText={setEmail}
				/>
				<TextInput
					style={{ width: "100%" }}
					mode="outlined"
					label="Password"
					value={password}
					onChangeText={setPassword}
				/>
			</View>
			<Button
				style={{ width: "100%" }}
				mode="contained"
				onPress={handleLogin}
			>
				Log in
			</Button>
			<RegisterLink navigation={navigation} />
		</SafeAreaView>
	);
}
