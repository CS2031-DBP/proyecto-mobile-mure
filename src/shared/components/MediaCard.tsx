import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { SongResponse } from "@/interfaces/Song";
import { getSongById } from "@/services/song/getSongById";
import { AlbumResponse } from "@/interfaces/Album";
import { getAlbumById } from "@/services/album/getAlbumById";
import { likeSong } from "@/services/song/likeSong";
import { dislikeSong } from "@/services/song/dislikeSong";
import { likeAlbum } from "@/services/album/likeAlbum";
import { dislikeAlbum } from "@/services/album/dislikeAlbum";
import { isSongLikedByUser } from "@/services/song/isSongLikedByUser";
import { isAlbumLikedByUser } from "@/services/album/isAlbumLikedByUser";
import { useUserContext } from "@/src/core/contexts/UserContext";
import AudioPlayer from "@/src/shared/components/AudioPlayer";

interface MediaCardProps {
  type: "song" | "album";
  mediaId: number;
}

export default function MediaCard({ type, mediaId }: MediaCardProps) {
  type Media = SongResponse | AlbumResponse;
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<Media | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const { user } = useUserContext();

  useEffect(() => {
    async function fetchMedia() {
      try {
        let mediaData: Media | null = null;
        let likedStatus: boolean = false;
        if (!user) throw new Error("User not logged in");

        if (type === "song") {
          mediaData = await getSongById(mediaId);
          likedStatus = await isSongLikedByUser(mediaId, user?.id);
        } else if (type === "album") {
          mediaData = await getAlbumById(mediaId);
          likedStatus = await isAlbumLikedByUser(mediaId, user?.id);
        }
        setMedia(mediaData);
        setLiked(likedStatus);
      } catch (err) {
        setError(
          `Failed to load media data for ID ${mediaId}: ${
            (err as Error).message
          }`,
        );
      }
    }

    fetchMedia();
  }, [mediaId]);

  function openLink() {
    if (media?.spotifyUrl) {
      Linking.openURL(media.spotifyUrl);
    }
  }

  const handleLike = async () => {
    try {
      if (liked) {
        if (type === "song") {
          await dislikeSong(mediaId);
        } else if (type === "album") {
          await dislikeAlbum(mediaId);
        }
      } else {
        if (type === "song") {
          await likeSong(mediaId);
        } else if (type === "album") {
          await likeAlbum(mediaId);
        }
      }
      setLiked(!liked);
    } catch (err) {
      setError(`Failed to update like status for ID ${mediaId}`);
    }
  };

  if (error)
    return <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>;

  if (!media) return <Text style={{ textAlign: "center" }}>Loading...</Text>;

  return (
    <Card style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {media.coverImageUrl ? (
          <Image
            source={{ uri: media.coverImageUrl }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "gray",
            }}
          />
        )}
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {media.title}
          </Text>
          <Text style={{ color: "gray" }}>
            {type === "song"
              ? (media as SongResponse).artistsNames.join(", ")
              : (media as AlbumResponse).artistName}
          </Text>
          {type === "song" ? (
            <>
              <Text style={{ color: "gray" }}>
                {(media as SongResponse).albumTitle}
              </Text>
              <Text style={{ color: "gray" }}>
                {(media as SongResponse).genre}
              </Text>
              <Text style={{ color: "gray" }}>
                {(media as SongResponse).duration}
              </Text>
            </>
          ) : null}
        </View>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          {type === "song" && (media as SongResponse).spotifyPreviewUrl ? (
            <AudioPlayer
              previewUrl={(media as SongResponse).spotifyPreviewUrl}
            />
          ) : (
            <TouchableOpacity onPress={openLink}>
              <IconButton icon="spotify" size={24} iconColor="green" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleLike}>
            <IconButton
              icon={liked ? "heart" : "heart-outline"}
              size={24}
              iconColor={liked ? "red" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}
