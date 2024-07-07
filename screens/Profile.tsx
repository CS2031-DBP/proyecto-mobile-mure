import React, { useState, useCallback } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserResponse } from '@/interfaces/User';
import ProfileInfo from '@/components/ProfileInfo';
import { useUserContext } from '@/contexts/UserContext';
import { getUserFriends } from '@/services/profile/getUserFriends';

export default function Profile() {
    const { user, refreshUser } = useUserContext();
    const [friends, setFriends] = useState<UserResponse[]>([]);
    const [isFriend, setIsFriend] = useState<boolean>(false);

    const refreshFriends = async () => {
        if (user && user.friendsIds.length > 0) {
            const friendsData = await getUserFriends(user.friendsIds);
            setFriends(friendsData);
        }
    };

    useFocusEffect(
        useCallback(() => {
            (async () => {
                await refreshUser();
                await refreshFriends();
            })();
        }, [refreshUser])
    );

    if (!user) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingTop: 20 }}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <ProfileInfo
            user={user}
            isCurrentUser={true}
            isFriend={false}
            setIsFriend={() => {}}
            friends={friends}
            setFriends={setFriends}
        />
    );
}
