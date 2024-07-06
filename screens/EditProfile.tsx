import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { Button, Text, TextInput, Avatar } from "react-native-paper";
import { editProfile } from "@/services/profile/editProfile";
import { getCurrentUserInfo } from "@/services/profile/getUserInfo";
import { verifyPassword } from "@/services/profile/verifyPassword";
import { UserUpdate, UserResponse } from "@/interfaces/User";
import { useUserContext } from "@/contexts/UserContext";

export default function EditProfile() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const [userUpdate, setUser] = useState<UserUpdate>({
		name: "",
		email: "",
		password: "",
		profileImage: "",
	});
	const userContext = useUserContext();
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [errors, setErrors] = useState<string | null>(null);

	function handleInputChange(field: keyof UserUpdate, value: string) {
		setUser((prevUser) => ({ ...prevUser, [field]: value }));
	}

	async function handleSave() {
		if (!userContext.user) {
			setErrors("User data not loaded");
			return;
		}

		if (oldPassword && newPassword) {
			try {
				const isValid = await verifyPassword(
					userContext.user.id,
					oldPassword
				);

				if (!isValid) {
					setErrors("The current password is incorrect");
					return;
				}

				userUpdate.password = newPassword;
			} catch (error) {
				setErrors("Failed to verify the current password");
				return;
			}
		}

		try {
			const response = await editProfile(userUpdate);

			if (response) {
				Alert.alert(
					"Profile Updated",
					"Your profile has been updated successfully."
				);
				navigation.navigate("Profile");
			}
		} catch (error) {
			setErrors("Failed to update profile");
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.formContainer}>
				<Text style={styles.title}>Edit Profile</Text>
				<Avatar.Image
					size={100}
					source={{ uri: userUpdate.profileImage }}
					style={styles.avatar}
				/>
				<Button
					mode="text"
					onPress={() =>
						Alert.alert(
							"Change Picture",
							"Change picture functionality not implemented"
						)
					}
				>
					Edit picture or avatar
				</Button>
				<TextInput
					label="Name"
					mode="outlined"
					value={userUpdate.name}
					onChangeText={(text) => handleInputChange("name", text)}
					style={styles.input}
				/>
				<TextInput
					label="Email"
					mode="outlined"
					value={userUpdate.email}
					onChangeText={(text) => handleInputChange("email", text)}
					style={styles.input}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					label="Current Password"
					mode="outlined"
					value={oldPassword}
					onChangeText={setOldPassword}
					style={styles.input}
					secureTextEntry={!showOldPassword}
					right={
						<TextInput.Icon
							icon={showOldPassword ? "eye-off" : "eye"}
							onPress={() => setShowOldPassword(!showOldPassword)}
						/>
					}
					autoCapitalize="none"
				/>
				<TextInput
					label="New Password"
					mode="outlined"
					value={newPassword}
					onChangeText={setNewPassword}
					style={styles.input}
					secureTextEntry={!showNewPassword}
					right={
						<TextInput.Icon
							icon={showNewPassword ? "eye-off" : "eye"}
							onPress={() => setShowNewPassword(!showNewPassword)}
						/>
					}
					autoCapitalize="none"
				/>
				{errors ? <Text style={styles.errorText}>{errors}</Text> : null}
				<Button
					mode="contained"
					onPress={handleSave}
					style={styles.button}
				>
					Save
				</Button>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	formContainer: {
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	avatar: {
		marginBottom: 20,
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
	errorText: {
		color: "red",
		textAlign: "center",
		marginBottom: 16,
	},
});
