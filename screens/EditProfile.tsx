import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView } from "react-native";
import {
    NavigationProp,
    ParamListBase,
    useNavigation,
} from "@react-navigation/native";
import {
    Button,
    Text,
    TextInput,
    Avatar,
    Portal,
    Dialog,
    IconButton,
} from "react-native-paper";
import { editProfile } from "@/services/profile/editProfile";
import { verifyPassword } from "@/services/profile/verifyPassword";
import { UserUpdate } from "@/interfaces/User";
import { useUserContext } from "@/contexts/UserContext";
import useImagePicker from "@/hooks/useImagePicker"; 

export default function EditProfile() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { user, refreshUser } = useUserContext();
    const [userUpdate, setUserUpdate] = useState<UserUpdate>({
        name: "",
        email: "",
        password: "",
        profileImage: null,
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
                profileImage: null,
                nickname: user.nickname,
            });
        }
    }, [user]);

    const handleInputChange = (field: keyof UserUpdate, value: string | File) => {
        setUserUpdate((prevUser) => ({ ...prevUser, [field]: value }));
    };

    const handleSave = async () => {
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
            Alert.alert(
                "Profile Updated",
                "Your profile has been updated successfully."
            );
            navigation.navigate("Main", { screen: "Profile" });
        } catch (error) {
            setErrors("Failed to update profile");
        }
    };

    const handlePasswordChange = async () => {
        try {
            const isValid = await verifyPassword(user.id, oldPassword);
            if (!isValid) {
                setErrors("The old password is incorrect");
                return;
            }

            const data: UserUpdate = {
                ...userUpdate,
                password: newPassword,
            };

            await editProfile(data);
            await refreshUser();
            Alert.alert(
                "Password Updated",
                "Your password has been updated successfully."
            );
            setIsModalVisible(false);
            navigation.navigate("Main", { screen: "Profile" });
        } catch (error) {
            setErrors("Failed to update password");
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
                {imagePickerHook.image ? (
                    <>
                        <Avatar.Image
                            size={100}
                            source={{ uri: imagePickerHook.image }}
                            style={{ marginBottom: 20 }}
                        />
                        <IconButton
                            icon="delete"
                            iconColor="red"
                            size={30}
                            onPress={() => imagePickerHook.setImageUri(null)}
                        />
                    </>
                ) : user?.profileImageUrl ? (
                    <Avatar.Image
                        size={100}
                        source={{ uri: user.profileImageUrl }}
                        style={{ marginBottom: 20 }}
                    />
                ) : (
                    <Avatar.Icon
                        size={100}
                        icon="account"
                        style={{ marginBottom: 20 }}
                    />
                )}
                <Button mode="text" onPress={imagePickerHook.pickImage}>
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
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    style={{ width: "100%", marginBottom: 16 }}
                    secureTextEntry={!showCurrentPassword}
                    right={
                        <TextInput.Icon
                            icon={showCurrentPassword ? "eye-off" : "eye"}
                            onPress={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                            }
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
                <Button
                    mode="text"
                    onPress={() => setIsModalVisible(true)}
                    style={{ marginTop: 8 }}
                >
                    Change Password
                </Button>
            </ScrollView>

            <Portal>
                <Dialog
                    visible={isModalVisible}
                    onDismiss={() => setIsModalVisible(false)}
                >
                    <Dialog.Title>Change Password</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Old Password"
                            mode="outlined"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            style={{ width: "100%", marginBottom: 16 }}
                            secureTextEntry={!showOldPassword}
                            right={
                                <TextInput.Icon
                                    icon={showOldPassword ? "eye-off" : "eye"}
                                    onPress={() =>
                                        setShowOldPassword(!showOldPassword)
                                    }
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
                                    onPress={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                />
                            }
                            autoCapitalize="none"
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
