import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Avatar, Button } from 'react-native-paper';
import { fetchCurrentUser } from '@/services/profile/getUserInfo';
import { UserResponse, UserFriends } from '@/interfaces/User';
import { fetchUserFriends } from '@/services/profile/getUserFriends';

export default function Profile() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [friends, setFriends] = useState<UserFriends[]>([]);
    const [errors, setErrors] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                try {
                    const response = await fetchCurrentUser();
                    const userData = response.data;
                    setUser(userData);

                    const friendsData = await fetchUserFriends(userData.friendsIds);
                    setFriends(friendsData);
                } catch (error) {
                    setErrors('Failed to load user data');
                }
            };

            loadUserData();
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
            <ScrollView contentContainerStyle={styles.profileContainer}>
                <View style={styles.topContainer}>
                    <Avatar.Image size={100} source={{ uri: user.profileImage }} style={styles.avatar} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.birthDate}>{user.birthDate}</Text>
                    </View>
                    <View style={styles.friendsContainer}>
                        <Text style={styles.friendsCount}>{friends.length} Friends</Text>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('FriendList', { friendIds: user.friendsIds })}
                            style={styles.viewFriendsButton}
                        >
                            View Friends
                        </Button>
                    </View>
                </View>
                {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
                <View style={styles.buttonsContainer}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('EditProfile')}
                        style={styles.editProfileButton}
                    >
                        Edit Profile
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 20,
		marginTop: 20,
    },
    profileContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        marginRight: 20,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 5,
    },
    birthDate: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'left',
    },
    friendsContainer: {
        alignItems: 'center',
    },
    friendsCount: {
        fontSize: 18,
    },
    viewFriendsButton: {
        marginTop: 10,
    },
    buttonsContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    editProfileButton: {
        width: '60%',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 16,
    },
});
