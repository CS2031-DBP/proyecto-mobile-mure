import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import { Avatar, Button, IconButton } from 'react-native-paper';
import { UserResponse } from '@/interfaces/User';
import { addFriend } from '@/services/friend/addFriend';
import { deleteFriend } from '@/services/friend/deleteFriend';
import { getUserFriends } from '@/services/profile/getUserFriends';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

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

    useEffect(() => {
        if (isFriend || isCurrentUser) {
            getUserFriends(user.friendsIds).then(setFriends).catch(() => {
                setErrors('Failed to load friends data');
            });
        }
    }, [isFriend, isCurrentUser, user.friendsIds, setFriends]);

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

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingTop: 20 }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 20 }}>
                {!isCurrentUser && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 10, marginBottom: 20 }}>
                        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>User Profile</Text>
                    </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Avatar.Image size={100} source={{ uri: user.profileImage }} style={{ marginRight: 20 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'left', marginBottom: 5 }}>{user.name}</Text>
                        <Text style={{ fontSize: 18, color: 'gray', textAlign: 'left' }}>{user.birthDate}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>{user.friendsIds.length} Friends</Text>
                        {(isFriend || isCurrentUser) && (
                            <Button mode="outlined" onPress={() => navigation.navigate('FriendList', { friendIds: user.friendsIds })} style={{ marginTop: 10 }}>
                                View Friends
                            </Button>
                        )}
                        {(isFriend) && (
                           <Button mode="contained" onPress={() => navigation.navigate('OtherLibrary', { userId: user.id })} style={{ width: '100%' }}>
                           View Playlists
                            </Button>
                        )}
                        
                    </View>
                </View>
                {errors ? <Text style={{ color: 'red', textAlign: 'center', marginVertical: 16 }}>{errors}</Text> : null}
                <View style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
                    {isCurrentUser ? (
                        <Button mode="contained" onPress={() => navigation.navigate('EditProfile')} style={{ width: '60%' }}>
                            Edit Profile
                        </Button>
                    ) : isFriend ? (
                        <>
                            <Button mode="contained" onPress={handleDeleteFriend} style={{ width: '60%', marginBottom: 10 }}>
                                Delete Friend
                            </Button>
                        </>
                    ) : (
                        <Button mode="contained" onPress={handleAddFriend} style={{ width: '60%' }}>
                            Add Friend
                        </Button>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
