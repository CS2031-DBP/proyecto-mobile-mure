import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { Button, Text, TextInput, Avatar } from "react-native-paper";
import { editProfile } from "@/services/profile/editProfile";
import { verifyPassword } from "@/services/profile/verifyPassword";
import { UserUpdate } from "@/interfaces/User";
import { useUserContext } from "@/contexts/UserContext";

export default function EditProfile() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const { user, refreshUser } = useUserContext();
	const [userUpdate, setUserUpdate] = useState<UserUpdate>({
		name: user?.name || "",
		email: user?.email || "",
		password: "",
		profileImage: user?.profileImageUrl || "",
		nickname: user?.nickname || "",
	});
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [errors, setErrors] = useState<string | null>(null);

	useEffect(() => {
		if (user) {
			setUserUpdate({
				name: user.name,
				email: user.email,
				password: "",
				profileImage: user.profileImageUrl,
				nickname: user.nickname,
			});
		}
	}, [user]);

	const handleInputChange = (field: keyof UserUpdate, value: string) => {
		setUserUpdate((prevUser) => ({ ...prevUser, [field]: value }));
	};

	const handleSave = async () => {
		if (!user) {
			setErrors("User data not loaded");
			return;
		}

		if (oldPassword && newPassword) {
			try {
				const isValid = await verifyPassword(user.id, oldPassword);

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
				await refreshUser();
				Alert.alert(
					"Profile Updated",
					"Your profile has been updated successfully."
				);
				navigation.navigate("MainTabs", { screen: "Profile" });
			}
		} catch (error) {
			setErrors("Failed to update profile");
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, padding: 20 }}>
			<ScrollView contentContainerStyle={{ alignItems: "center" }}>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "bold",
						marginBottom: 20,
					}}
				>
					Edit Profile
				</Text>
				{userUpdate.profileImage ? (
					<Avatar.Image
						size={100}
						source={{ uri: userUpdate.profileImage }}
						style={{ marginBottom: 20 }}
					/>
				) : (
					<Avatar.Icon
						size={100}
						icon="account"
						style={{ marginBottom: 20 }}
					/>
				)}
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
					label="Full Name"
					mode="outlined"
					value={userUpdate.name}
					onChangeText={(text) => handleInputChange("name", text)}
					style={{ width: "100%", marginBottom: 16 }}
					autoCapitalize="none"
				/>
				<TextInput
					label="Nickname"
					mode="outlined"
					value={userUpdate.nickname}
					onChangeText={(text) => handleInputChange("nickname", text)}
					style={{ width: "100%", marginBottom: 16 }}
					autoCapitalize="none"
				/>
				<TextInput
					label="Email"
					mode="outlined"
					value={userUpdate.email}
					onChangeText={(text) => handleInputChange("email", text)}
					style={{ width: "100%", marginBottom: 16 }}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<TextInput
					label="Current Password"
					mode="outlined"
					value={oldPassword}
					onChangeText={setOldPassword}
					style={{ width: "100%", marginBottom: 16 }}
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
					style={{ width: "100%", marginBottom: 16 }}
					secureTextEntry={!showNewPassword}
					right={
						<TextInput.Icon
							icon={showNewPassword ? "eye-off" : "eye"}
							onPress={() => setShowNewPassword(!showNewPassword)}
						/>
					}
					autoCapitalize="none"
				/>
				{errors ? (
					<Text
						style={{
							color: "red",
							textAlign: "center",
							marginBottom: 16,
						}}
					>
						{errors}
					</Text>
				) : null}
				<Button
					mode="contained"
					onPress={handleSave}
					style={{ width: "100%", padding: 8, marginTop: 16 }}
				>
					Save
				</Button>
			</ScrollView>
		</SafeAreaView>
	);
}
