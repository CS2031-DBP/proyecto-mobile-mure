import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { Audio } from "expo-av";

interface AudioPlayerProps {
    previewUrl: string;
}

export default function AudioPlayer({ previewUrl }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const handlePlayPause = async () => {
        if (isPlaying) {
            await sound?.pauseAsync();
            setIsPlaying(false);
        } else {
            if (!sound) {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: previewUrl },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        }
    };

    const handleRestart = async () => {
        if (sound) {
            await sound.setPositionAsync(0);
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={handlePlayPause}>
                <IconButton icon={isPlaying ? "pause" : "play"} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRestart}>
                <IconButton icon="restart" size={24} />
            </TouchableOpacity>
        </View>
    );
}
