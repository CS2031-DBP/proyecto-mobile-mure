import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import { Avatar, Button, IconButton } from 'react-native-paper';
import { UserResponse } from '@/interfaces/User';
import { addFriend } from '@/services/friend/addFriend';
import { deleteFriend } from '@/services/friend/deleteFriend';
import { getUserFriends } from '@/services/profile/getUserFriends';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { getRoleFromToken } from '@/services/auth/getRoleFromToken';
import { deleteUserById } from '@/services/profile/deleteUserById';

interface ProfileInfoProps {
    user: UserResponse;
    isCurrentUser: boolean;
    isFriend: boolean;
    setIsFriend: React.Dispatch<React.SetStateAction<boolean>>;
    friends: UserResponse[];
    setFriends: React.Dispatch<React.SetStateAction<UserResponse[]>>;
}

export default function ProfileInfo({ user, isCurrentUser, isFriend, setIsFriend, friends, setFriends }: ProfileInfoProps) {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [errors, setErrors] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const userRole = await getRoleFromToken();
                setRole(userRole);
                console.log('Fetched user role:', userRole);
            } catch (error) {
                console.error('Failed to fetch role', error);
            }
        };
        fetchRole();
    }, []);

    useEffect(() => {
        if (isFriend || isCurrentUser || role === 'ROLE_ADMIN') {
            getUserFriends(user.friendsIds).then(setFriends).catch(() => {
                setErrors('Failed to load friends data');
            });
        }
    }, [isFriend, isCurrentUser, role, user.friendsIds, setFriends]);

    const handleAddFriend = async () => {
        try {
            await addFriend(user.id);
            setIsFriend(true);
            Alert.alert('Friend Added', 'You have successfully added this user as a friend.');
            navigation.navigate('Profile');
        } catch (error) {
            setErrors('Failed to add friend');
        }
    };

    const handleDeleteFriend = async () => {
        try {
            await deleteFriend(user.id);
            setIsFriend(false);
            Alert.alert('Friend Removed', 'You have successfully removed this user from your friends.');
            navigation.navigate('Profile');
        } catch (error) {
            setErrors('Failed to delete friend');
        }
    };

    const handleDeleteProfile = async () => {
        Alert.alert(
            'Delete Profile',
            'Are you sure you want to delete this profile?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await deleteUserById(user.id);
                            Alert.alert('Profile Deleted', 'The user profile has been deleted successfully.');
                            if (isCurrentUser) {
                                navigation.navigate('Register');
                            } else {
                                navigation.navigate('Profile');
                            }
                        } catch (error) {
                            setErrors('Failed to delete profile');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingTop: 24 }}>
            <View>
                {!isCurrentUser && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <IconButton icon="arrow-left" size={24} onPress={() => navigation.navigate('Profile')} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>User Profile</Text>
                    </View>
                )}
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 20, paddingTop: 8}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Avatar.Image size={100} source={{ uri: user.profileImage }} style={{ marginRight: 20 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'left', marginBottom: 5 }}>{user.name}</Text>
                        <Text style={{ fontSize: 18, color: 'gray', textAlign: 'left' }}>{user.birthDate}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>{user.friendsIds.length} Friends</Text>
                        {(isFriend || isCurrentUser || role === 'ROLE_ADMIN') && (
                            <Button mode="outlined" onPress={() => navigation.navigate('FriendList', { friendIds: user.friendsIds })} style={{ marginTop: 4 }}>
                                View Friends
                            </Button>
                        )}
                        {(isFriend || (role === 'ROLE_ADMIN' && !isCurrentUser)) && (
                            <Button mode="contained" onPress={() => navigation.navigate('OtherLibrary', { userId: user.id })} style={{ marginTop: 8, width: '100%' }}>
                                View Playlists
                            </Button>
                        )}
                    </View>
                </View>
                {errors ? <Text style={{ color: 'red', textAlign: 'center', marginVertical: 16 }}>{errors}</Text> : null}
                <View style={{ width: '100%', marginTop: 0, alignItems: 'center' }}>
                    {isCurrentUser ? (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <Button mode="contained" onPress={() => navigation.navigate('EditProfile')} style={{ flex: 1, marginRight: 10 }}>
                                Edit Profile
                            </Button>
                            <Button mode="contained" onPress={handleDeleteProfile} style={{ flex: 1 }}>
                                Delete Profile
                            </Button>
                        </View>
                    ) : isFriend ? (
                        <>
                            <Button mode="contained" onPress={handleDeleteFriend} style={{ width: '60%' }}>
                                Delete Friend
                            </Button>
                        </>
                    ) : (
                        <Button mode="contained" onPress={handleAddFriend} style={{ width: '60%' }}>
                            Add Friend
                        </Button>
                    )}
                    {role === 'ROLE_ADMIN' && !isCurrentUser && (
                        <Button mode="contained" onPress={handleDeleteProfile} style={{ width: '60%', marginTop: 10 }}>
                            Delete Profile
                        </Button>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
