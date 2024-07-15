import { AlbumResponse } from "@/interfaces/Album";
import { ArtistResponse } from "@/interfaces/Artist";
import { SongResponse } from "@/interfaces/Song";
import { getSongsByTitle } from "@/services/song/getSongsByTitle";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleProp } from "react-native";
import { Searchbar } from "react-native-paper";
import SearchItem, {
  SearchItemProps,
} from "@/src/shared/components/SearchItem";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { getArtistsByName } from "@/services/artist/getArtistsByName";
import { getAlbumsBytitle as getAlbumsByTitle } from "@/services/album/getAlbumsByTitle";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";

interface SocialMediaEntityProps {
  mode: "interactive" | "static";
  navigation?: NavigationProp<ParamListBase>;
  style?: StyleProp<SafeAreaView>;
  onMediaEntityPres?: (mediaId: number) => void;
}

export default function SearchMediaEntity(props: SocialMediaEntityProps) {
  type SearchResult = SongResponse | ArtistResponse | AlbumResponse;
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (searchText.length > 2) fetchData();
  }, [searchText]);

  async function fetchData() {
    setSearchText(searchText);

    try {
      let artists: PaginatedResponse<ArtistResponse> = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        last: true,
        size: 0,
      };
      const songs = await getSongsByTitle(searchText, 0, 10);
      const albums = await getAlbumsByTitle(searchText, 0, 10);

      if (props.mode === "interactive")
        artists = await getArtistsByName(searchText, 0, 10);

      setResults([
        ...songs.content,
        ...(artists?.content ?? []),
        ...albums.content,
      ]);
    } catch (error) {
      console.error("Error in handleSearchText:", error);
    }
  }

  function isSongResponse(result: SearchResult): result is SongResponse {
    return (result as SongResponse).duration !== undefined;
  }

  function isArtistResponse(result: SearchResult): result is ArtistResponse {
    return (
      (result as ArtistResponse).name !== undefined &&
      (result as ArtistResponse).imageUrl !== undefined
    );
  }

  function isAlbumResponse(result: SearchResult): result is AlbumResponse {
    return (result as AlbumResponse).releaseDate !== undefined;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", padding: 10, gap: 20 }}
    >
      <Searchbar
        value={searchText}
        onChangeText={setSearchText}
        icon={props.mode === "interactive" ? "arrow-left" : "magnify"}
        onIconPress={() =>
          props.mode === "interactive" && props.navigation?.goBack()
        }
      />
      <ScrollView style={{ flex: 1, flexDirection: "column" }}>
        {results.map((result, key) => {
          const searchItemProps: SearchItemProps = {
            title: "",
            imageUrl: "",
            type: "song",
            artistName: "",
            mode: props.mode,
            onPress: () => {},
            mediaId: 0,
          };

          if (isArtistResponse(result)) {
            searchItemProps.title = result.name;
            searchItemProps.mediaId = result.id;
            searchItemProps.imageUrl = result.imageUrl;
            searchItemProps.artistName = result.name;
            searchItemProps.type = "artist";
            searchItemProps.onPress = () =>
              props.navigation?.navigate("Artist", {
                artistId: result.id,
              });
          } else if (isSongResponse(result)) {
            searchItemProps.title = result.title;
            searchItemProps.imageUrl = result.coverImageUrl;
            searchItemProps.mediaId = result.id;
            searchItemProps.artistName = result.artistsNames.join(", ");
            searchItemProps.type = "song";
            searchItemProps.onPress = () =>
              props.navigation?.navigate("AddSongToPlaylist", {
                songId: result.id,
              });
          } else if (isAlbumResponse(result)) {
            searchItemProps.title = result.title;
            searchItemProps.mediaId = result.id;
            searchItemProps.imageUrl = result.coverImageUrl;
            searchItemProps.artistName = result.artistName;
            searchItemProps.type = "album";
            searchItemProps.onPress = () =>
              props.navigation?.navigate("Album", {
                albumId: result.id,
              });
          }

          return (
            <SearchItem
              key={key}
              mediaId={searchItemProps.mediaId}
              title={searchItemProps.title}
              imageUrl={searchItemProps.imageUrl}
              type={searchItemProps.type}
              artistName={searchItemProps.artistName}
              onPress={
                props.navigation == undefined
                  ? () => props.onMediaEntityPres?.(result.id)
                  : () => props.navigation
              }
              mode={searchItemProps.mode}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
