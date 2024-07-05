import React, { useEffect, useState, useCallback } from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useFocusEffect,
	useNavigation,
} from "@react-navigation/native";
import { Button, Text, Avatar, Divider } from "react-native-paper";
import { getCurrentUser } from "@/services/profile/getUserInfo";
import { UserResponse } from "@/interfaces/User";

export default function Profile() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [errors, setErrors] = useState("");

	useFocusEffect(
		useCallback(() => {
			setErrors("");
			getCurrentUser().then((response) => {
				if (response) {
					setUser(response.data);
				} else {
					setErrors("Failed to load user data");
				}
			});
		}, [])
	);

	if (!user) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.profileContainer}>
				<Avatar.Image size={100} source={{ uri: user.profileImage }} />
				<Text style={styles.name}>{user.name}</Text>
				<Text>{user.email}</Text>
				{errors ? <Text style={styles.errorText}>{errors}</Text> : null}
				<Divider style={styles.divider} />
				<View style={styles.buttonsContainer}>
					<Button
						mode="contained"
						onPress={() => Alert.alert("Edit Profile")}
						style={styles.button}
					>
						Edit profile
					</Button>
					<Button
						mode="outlined"
						onPress={() => Alert.alert("Share Profile")}
						style={styles.button}
					>
						Share profile
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	profileContainer: {
		alignItems: "center",
		paddingHorizontal: 20,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginVertical: 10,
	},
	divider: {
		marginVertical: 10,
		width: "80%",
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginTop: 20,
	},
	button: {
		width: "45%",
		padding: 8,
	},
	errorText: {
		color: "red",
		textAlign: "center",
		marginVertical: 16,
	},
});
