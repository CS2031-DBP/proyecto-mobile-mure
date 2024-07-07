import { AlbumResponse } from "@/interfaces/Album";
import { ArtistResponse } from "@/interfaces/Artist";
import { SongResponse } from "@/interfaces/Song";
import { getSongsByTitle } from "@/services/song/getSongsByTitle";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Searchbar } from "react-native-paper";
import SearchItem, { SearchItemProps } from "@/components/SearchItem";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getArtistsByName } from "@/services/artist/getArtistsByName";
import { getAlbumsBytitle as getAlbumsByTitle } from "@/services/album/getAlbumsByTitle";

export default function Search() {
	type SearchResult = SongResponse | ArtistResponse | AlbumResponse;
	const [searchText, setSearchText] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	useEffect(() => {
		if (searchText.length > 2) fetchData();
	}, [searchText]);

	async function fetchData() {
		setSearchText(searchText);

		try {
			const songs = await getSongsByTitle(searchText, 0, 10);
			const artists = await getArtistsByName(searchText, 0, 10);
			const albums = await getAlbumsByTitle(searchText, 0, 10);
			setResults([
				...songs.content,
				...artists.content,
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
				icon="arrow-left"
				onIconPress={() => navigation.goBack()}
			/>
			<ScrollView style={{ flex: 1, flexDirection: "column", gap: 10 }}>
				{results.map((result, key) => {
					const searchItemProps: SearchItemProps = {
						title: "",
						imageUrl: "",
						type: "song",
						artistName: "",
						mode: "interactive",
						onPress: () => {},
					};

					if (isArtistResponse(result)) {
						searchItemProps.title = result.name;
						searchItemProps.imageUrl = result.imageUrl;
						searchItemProps.artistName = result.name;
						searchItemProps.type = "artist";
						searchItemProps.onPress = () =>
							navigation.navigate("Artist", {
								artistId: result.id,
							});
					} else if (isSongResponse(result)) {
						searchItemProps.title = result.title;
						searchItemProps.imageUrl = result.coverImage;
						searchItemProps.artistName =
							result.artistsNames.join(", ");
						searchItemProps.type = "song";
						searchItemProps.onPress = () =>
							navigation.navigate("AddSongToPlaylist", {
								songId: result.id,
							});
					} else if (isAlbumResponse(result)) {
						searchItemProps.title = result.title;
						searchItemProps.imageUrl = result.coverImage;
						searchItemProps.artistName = result.artistName;
						searchItemProps.type = "album";
						searchItemProps.onPress = () =>
							navigation.navigate("Album", {
								albumId: result.id,
							});
					}

					return (
						<SearchItem
							key={key}
							title={searchItemProps.title}
							imageUrl={searchItemProps.imageUrl}
							type={searchItemProps.type}
							artistName={searchItemProps.artistName}
							onPress={searchItemProps.onPress}
							mode={searchItemProps.mode}
						/>
					);
				})}
			</ScrollView>
		</SafeAreaView>
	);
}
