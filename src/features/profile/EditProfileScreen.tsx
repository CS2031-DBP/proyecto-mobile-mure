import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Image } from "react-native";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import {
	Avatar,
	Button,
	Dialog,
	IconButton,
	Portal,
	Text,
	TextInput,
} from "react-native-paper";
import { editProfile } from "./services/editProfile";
import { verifyPassword } from "./services/verifyPassword";
import { UserUpdate } from "./interfaces/UserUpdate";
import { useUserContext } from "@contexts/UserContext";
import useImagePicker from "@hooks/useImagePicker";
import { theme } from "@navigation/Theme";
import { showMessage } from "react-native-flash-message";

export default function EditProfileScreen() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();
	const { user, refreshUser } = useUserContext();
	const [userUpdate, setUserUpdate] = useState<UserUpdate>({
		name: "",
		email: "",
		password: "",
		profileImage: undefined,
		nickname: "",
	});
	const [currentPassword, setCurrentPassword] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [errors, setErrors] = useState<string | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const imagePickerHook = useImagePicker();

	useEffect(() => {
		if (user) {
			setUserUpdate({
				name: user.name,
				email: user.email,
				password: "",
				profileImage: undefined,
				nickname: user.nickname,
			});
		}
	}, [user]);

	function handleInputChange(field: keyof UserUpdate, value: string | File) {
		setUserUpdate((prevUser) => ({ ...prevUser, [field]: value }));
	}

	async function handleSave() {
		if (!user) {
			setErrors("User data not loaded");
			return;
		}

		try {
			const isValid = await verifyPassword(user.id, currentPassword);

			if (!isValid) {
				setErrors("The current password is incorrect");
				return;
			}

			const data: UserUpdate = {
				...userUpdate,
				profileImage: imagePickerHook.image
					? {
							uri: imagePickerHook.image,
							name: "profile.jpg",
							type: "image/jpeg",
						}
					: undefined,
			};

			await editProfile(data);
			await refreshUser();
			showMessage({
				message: "Profile Updated",
				description: "Your profile has been updated successfully.",
				type: "success",
			});
			navigation.navigate("MainScreen", { screen: "ProfileScreen" });
		} catch (error) {
			console.log(error);
			setErrors("Failed to update profile");
		}
	}

	async function handlePasswordChange() {
		try {
			if (!user) {
				setErrors("User data not loaded");
				return;
			}

			const isValid = await verifyPassword(user.id, oldPassword);

			if (!isValid) {
				showMessage({
					message: "Error",
					description: "The old password is incorrect",
					type: "danger",
				});
				setErrors("The old password is incorrect");
				return;
			}

			const data: UserUpdate = {
				...userUpdate,
				password: newPassword,
			};

			await editProfile(data);
			await refreshUser();
			showMessage({
				message: "Password Updated",
				description: "Your password has been updated successfully.",
				type: "success",
			});
			setIsModalVisible(false);
			navigation.navigate("MainScreen", { screen: "ProfileScreen" });
		} catch (error) {
			setErrors("Failed to update password");
		}
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				padding: 20,
				backgroundColor: theme.colors.background,
			}}
		>
			<ScrollView
				contentContainerStyle={{
					alignItems: "center",
					backgroundColor: theme.colors.background,
				}}
			>
				{imagePickerHook.image ? (
					<>
						<Image
							source={{ uri: imagePickerHook.image }}
							style={{
								width: 100,
								height: 100,
							}}
						/>
						<IconButton
							icon="delete"
							iconColor={theme.colors.primary}
							size={30}
							onPress={() => imagePickerHook.setImageUri(null)}
						/>
					</>
				) : (
					<Image
						source={{ uri: user?.profileImageUrl }}
						style={{
							width: 100,
							height: 100,
							borderRadius: 40,
							marginVertical: 20,
						}}
					></Image>
				)}
				<Button
					mode="text"
					onPress={imagePickerHook.pickImage}
					textColor={theme.colors.primary}
					style={{ marginBottom: 16 }}
				>
					Edit picture or avatar
				</Button>
				<TextInput
					label="Full Name"
					mode="outlined"
					value={userUpdate.name}
					onChangeText={(text) => handleInputChange("name", text)}
					style={{ width: "100%", marginBottom: 24 }}
					autoCapitalize="none"
					outlineColor={theme.colors.primary}
					activeOutlineColor={theme.colors.primary}
				/>
				<TextInput
					label="Nickname"
					mode="outlined"
					value={userUpdate.nickname}
					onChangeText={(text) => handleInputChange("nickname", text)}
					style={{ width: "100%", marginBottom: 24 }}
					autoCapitalize="none"
					outlineColor={theme.colors.primary}
					activeOutlineColor={theme.colors.primary}
				/>
				<TextInput
					label="Email"
					mode="outlined"
					value={userUpdate.email}
					onChangeText={(text) => handleInputChange("email", text)}
					style={{ width: "100%", marginBottom: 24 }}
					keyboardType="email-address"
					autoCapitalize="none"
					outlineColor={theme.colors.primary}
					activeOutlineColor={theme.colors.primary}
				/>
				<TextInput
					label="Current Password"
					mode="outlined"
					value={currentPassword}
					onChangeText={setCurrentPassword}
					style={{ width: "100%", marginBottom: 24 }}
					secureTextEntry={!showCurrentPassword}
					right={
						<TextInput.Icon
							icon={showCurrentPassword ? "eye-off" : "eye"}
							onPress={() =>
								setShowCurrentPassword(!showCurrentPassword)
							}
							color={theme.colors.primary}
						/>
					}
					autoCapitalize="none"
					outlineColor={theme.colors.primary}
					activeOutlineColor={theme.colors.primary}
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
					style={{
						width: "100%",
						padding: 8,
						marginVertical: 16,
						backgroundColor: theme.colors.primary,
					}}
				>
					Save
				</Button>
				<Button
					mode="text"
					onPress={() => setIsModalVisible(true)}
					textColor={theme.colors.primary}
					style={{ marginTop: 8 }}
				>
					Change Password
				</Button>
			</ScrollView>

			<Portal>
				<Dialog
					visible={isModalVisible}
					onDismiss={() => setIsModalVisible(false)}
					style={{
						backgroundColor: theme.colors.background,
						padding: 20,
					}}
				>
					<Dialog.Title>Change Password</Dialog.Title>
					<Dialog.Content>
						<TextInput
							label="Old Password"
							mode="outlined"
							value={oldPassword}
							onChangeText={setOldPassword}
							style={{ width: "100%", marginBottom: 24 }}
							secureTextEntry={!showOldPassword}
							right={
								<TextInput.Icon
									icon={showOldPassword ? "eye-off" : "eye"}
									onPress={() =>
										setShowOldPassword(!showOldPassword)
									}
									color={theme.colors.primary}
								/>
							}
							autoCapitalize="none"
							outlineColor={theme.colors.primary}
							activeOutlineColor={theme.colors.primary}
						/>
						<TextInput
							label="New Password"
							mode="outlined"
							value={newPassword}
							onChangeText={setNewPassword}
							style={{ width: "100%" }}
							secureTextEntry={!showNewPassword}
							right={
								<TextInput.Icon
									icon={showNewPassword ? "eye-off" : "eye"}
									onPress={() =>
										setShowNewPassword(!showNewPassword)
									}
									color={theme.colors.primary}
								/>
							}
							autoCapitalize="none"
							outlineColor={theme.colors.primary}
							activeOutlineColor={theme.colors.primary}
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setIsModalVisible(false)}>
							Cancel
						</Button>
						<Button onPress={handlePasswordChange}>Change</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</SafeAreaView>
	);
}
