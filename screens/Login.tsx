import { useState, useCallback } from "react";
import { View, StyleSheet, Alert, SafeAreaView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { login } from "@/services/auth/auth";
import {
	useNavigation,
	useFocusEffect,
	ParamListBase,
	NavigationProp,
} from "@react-navigation/native";

export default function Login() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState("");

	useFocusEffect(
		useCallback(() => {
			setErrors("");
		}, [])
	);

	async function handleLogin() {
		if (!email || !password) {
			setErrors("Email and password are required");
			return;
		}
		try {
			const response = await login({ email, password });
			if (response && response.data) {
				console.log(response.data.token);
				Alert.alert(
					"Login Successful",
					"You have successfully logged in."
				);
				navigation.navigate("Home");
			} else {
				setErrors("Email or password is incorrect");
			}
		} catch (error) {
			setErrors("Something went wrong");
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.formContainer}>
				<Text style={styles.title}>Login</Text>
				{errors ? <Text style={styles.errorText}>{errors}</Text> : null}
				<TextInput
					label="Email"
					mode="outlined"
					value={email}
					onChangeText={setEmail}
					style={styles.input}
					keyboardType="email-address"
					accessibilityLabel="email"
					autoCapitalize="none"
				/>
				<TextInput
					label="Password"
					mode="outlined"
					value={password}
					onChangeText={setPassword}
					style={styles.input}
					accessibilityLabel="password"
					autoCapitalize="none"
					secureTextEntry
				/>
				<Button
					mode="contained"
					onPress={handleLogin}
					style={styles.button}
				>
					Log In
				</Button>
				<Button
					mode="text"
					onPress={() => navigation.navigate("Register")}
					style={styles.registerText}
				>
					Don't have an account? Register
				</Button>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
	},
	formContainer: {
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		marginBottom: 16,
	},
	button: {
		width: "100%",
		padding: 8,
		marginTop: 16,
	},
	registerText: {
		textAlign: "center",
		marginTop: 16,
	},
	errorText: {
		color: "red",
		textAlign: "center",
		marginBottom: 16,
	},
});
