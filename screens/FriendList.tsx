import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Avatar, Button } from 'react-native-paper';
import { UserResponse } from '@/interfaces/User';
import { fetchUserFriends } from '@/services/profile/getUserFriends';
import { fetchCurrentUser } from '@/services/profile/getUserInfo';

export default function FriendList() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const route = useRoute();
    const { friendIds } = route.params as { friendIds: number[] };

    const [friends, setFriends] = useState<UserResponse[]>([]);
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
    const [errors, setErrors] = useState<string | null>(null);

    const loadFriends = async () => {
        try {
            const currentUserResponse = await fetchCurrentUser();
            setCurrentUser(currentUserResponse.data);

            const friendsData = await fetchUserFriends(friendIds);
            setFriends(friendsData);
        } catch (error) {
            setErrors('Failed to load friends data');
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFriends();
        }, [friendIds])
    );

    const handleFriendPress = (friendId: number) => {
        if (currentUser && friendId === currentUser.id) {
            navigation.navigate('Profile');
        } else {
            navigation.navigate('UserProfile', { userId: friendId });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.friendsContainer}>
                {errors ? <Text style={styles.errorText}>{errors}</Text> : null}
                {friends.length > 0 ? (
                    friends.map(friend => (
                        <TouchableOpacity
                            key={friend.id}
                            style={styles.friendContainer}
                            onPress={() => handleFriendPress(friend.id)}
                        >
                            <Avatar.Image size={50} source={{ uri: friend.profileImage }} />
                            <View style={styles.friendInfo}>
                                <Text style={styles.friendName}>{friend.name}</Text>
                                <Text style={styles.friendBirthDate}>{friend.birthDate}</Text>
                            </View>
                            <View style={styles.friendStats}>
                                <Text>{friend.friendsIds.length} Friends</Text>
                                <Button
                                    mode="outlined"
                                    onPress={() => handleFriendPress(friend.id)}
                                    style={styles.viewProfileButton}
                                >
                                    View Profile
                                </Button>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text>No friends found</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    friendsContainer: {
        padding: 16,
    },
    friendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    friendInfo: {
        flex: 1,
        marginLeft: 16,
    },
    friendName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    friendBirthDate: {
        color: 'gray',
    },
    friendStats: {
        alignItems: 'flex-end',
    },
    viewProfileButton: {
        marginTop: 8,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
});
