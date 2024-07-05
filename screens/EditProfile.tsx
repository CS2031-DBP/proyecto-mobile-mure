import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { Button, Text, TextInput, Avatar } from 'react-native-paper';
import { editProfile } from '@/services/profile/editProfile';
import { fetchCurrentUser } from '@/services/profile/getUserInfo';
import { verifyPassword } from '@/services/profile/verifyPassword';
import { UserUpdate, UserResponse } from '@/interfaces/User';

export default function EditProfile() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [user, setUser] = useState<UserUpdate>({
        profileImage: '',
        name: '',
        password: '',
        email: ''
    });
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errors, setErrors] = useState<string | null>(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const userResponse = await fetchCurrentUser();
                const userData = userResponse.data;
                setCurrentUser(userData);
                setUser({
                    profileImage: userData.profileImage,
                    name: userData.name,
                    password: '',
                    email: userData.email
                });
            } catch (error) {
                setErrors('Failed to load user data');
            }
        })();
    }, []);

    const handleInputChange = (field: keyof UserUpdate, value: string) => {
        setUser(prevUser => ({ ...prevUser, [field]: value }));
    };

    const handleSave = async () => {
        if (!currentUser) {
            setErrors('User data not loaded');
            return;
        }

        if (oldPassword && newPassword) {
            try {
                const isValid = await verifyPassword(currentUser.id, oldPassword);
                if (!isValid) {
                    setErrors('The current password is incorrect');
                    return;
                }
                user.password = newPassword;
            } catch (error) {
                setErrors('Failed to verify the current password');
                return;
            }
        }

        try {
            const response = await editProfile(user);
            if (response) {
                Alert.alert("Profile Updated", "Your profile has been updated successfully.");
                navigation.navigate('Profile');
            }
        } catch (error) {
            setErrors("Failed to update profile");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text style={styles.title}>Edit Profile</Text>
                <Avatar.Image size={100} source={{ uri: user.profileImage }} style={styles.avatar} />
                <Button mode="text" onPress={() => Alert.alert('Change Picture', 'Change picture functionality not implemented')}>
                    Edit picture or avatar
                </Button>
                <TextInput
                    label="Name"
                    mode="outlined"
                    value={user.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Email"
                    mode="outlined"
                    value={user.email}
                    onChangeText={(text) => handleInputChange('email', text)}
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
                    right={<TextInput.Icon icon={showOldPassword ? "eye-off" : "eye"} onPress={() => setShowOldPassword(!showOldPassword)} />}
                    autoCapitalize="none"
                />
                <TextInput
                    label="New Password"
                    mode="outlined"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                    secureTextEntry={!showNewPassword}
                    right={<TextInput.Icon icon={showNewPassword ? "eye-off" : "eye"} onPress={() => setShowNewPassword(!showNewPassword)} />}
                    autoCapitalize="none"
                />
                {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
                <Button mode="contained" onPress={handleSave} style={styles.button}>
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
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    avatar: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 16,
    },
    button: {
        width: '100%',
        padding: 8,
        marginTop: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
});
