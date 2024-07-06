import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { register } from "../services/auth/auth";
import {
	useNavigation,
	useFocusEffect,
	NavigationProp,
	ParamListBase,
} from "@react-navigation/native";

const { height } = Dimensions.get("window");

function Register() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [birthdate, setBirthdate] = useState("");
	const [errors, setErrors] = useState("");

	useFocusEffect(
		useCallback(() => {
			setErrors("");
		}, [])
	);

	const handleRegister = async () => {
		if (!name || !email || !password || !birthdate) {
			setErrors("All fields are required");
			return;
		}
		if (password.length < 6 || !email.includes("@")) {
			setErrors("Enter a valid email and password");
			return;
		}
		try {
			const response = await register({
				name,
				email,
				password,
				birthdate,
			});
			if (response && response.token) {
				Alert.alert(
					"Registration Successful",
					"You have successfully registered."
				);
				navigation.navigate("Main");
			} else {
				setErrors("One or more fields are invalid");
			}
		} catch (error) {
			setErrors("Something went wrong");
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.lottie}>
				<Text style={styles.title}>Register</Text>
				{errors ? <Text style={styles.errorText}>{errors}</Text> : null}
				<TextInput
					label="Name"
					mode="outlined"
					value={name}
					onChangeText={setName}
					accessibilityLabel="name"
					style={styles.input}
				/>
				<TextInput
					label="Email"
					mode="outlined"
					value={email}
					onChangeText={setEmail}
					accessibilityLabel="email"
					autoCapitalize="none"
					style={styles.input}
					keyboardType="email-address"
				/>
				<TextInput
					label="Password"
					mode="outlined"
					value={password}
					onChangeText={setPassword}
					accessibilityLabel="password"
					style={styles.input}
					secureTextEntry
					autoCapitalize="none"
				/>
				<TextInput
					label="Birthdate"
					mode="outlined"
					value={birthdate}
					onChangeText={setBirthdate}
					accessibilityLabel="birthdate"
					style={styles.input}
					keyboardType="numeric"
					placeholder="YYYY-MM-DD"
				/>
				<Button
					mode="contained"
					onPress={handleRegister}
					style={styles.button}
					accessibilityRole="button"
				>
					Register
				</Button>
				<Button
					mode="text"
					onPress={() => navigation.navigate("Login")}
					style={styles.loginText}
				>
					Already have an account? Log In
				</Button>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	lottie: {
		minHeight: height,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 24,
	},
	input: {
		width: "100%",
		marginBottom: 16,
	},
	button: {
		width: "100%",
		padding: 8,
		marginTop: 16,
	},
	loginText: {
		textAlign: "center",
		marginTop: 16,
	},
	errorText: {
		color: "red",
		textAlign: "center",
		marginBottom: 16,
	},
});

export default Register;
