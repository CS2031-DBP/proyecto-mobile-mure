import { AlbumResponse } from "@/interfaces/Album";
import { ArtistResponse } from "@/interfaces/Artist";
import { SongResponse } from "@/interfaces/Song";
import { getSongsByTitle } from "@/services/song/getSongsByTitle";
import { useState } from "react";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";
import SearchItem, { SearchItemProps } from "@/components/SearchItem";
import {
	NavigationProp,
	ParamListBase,
	useNavigation,
} from "@react-navigation/native";

export function Search() {
	type SearchResult = SongResponse | ArtistResponse | AlbumResponse;
	const [searchText, setSearchText] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	async function handleSearchText() {
		setSearchText(searchText);

		try {
			const songs = await getSongsByTitle(searchText, 0, 10);
			const artists = await getSongsByTitle(searchText, 0, 10);
			const albums = await getSongsByTitle(searchText, 0, 10);
			setResults([...songs, ...artists, ...albums]);
		} catch (error) {
			console.error("Error in handleSearchText:", error);
		}
	}

	<View style={{ flex: 1, flexDirection: "column" }}>
		<Searchbar value={searchText} onChangeText={handleSearchText} />
		{results.map((result, key) => {
			const searchItemProps: SearchItemProps = {
				title: "",
				imageUrl: "",
				type: "song",
				artistName: "",
				mode: "interactive",
				onPress: () => {},
			};

			if ("name" in result) {
				searchItemProps.title = result.name;
				searchItemProps.imageUrl = result.imageUrl;
				searchItemProps.artistName = result.name;
				searchItemProps.type = "artist";
				searchItemProps.onPress = () =>
					navigation.navigate("Artist", { artistId: result.id });
			} else if ("duration" in result) {
				searchItemProps.title = result.title;
				searchItemProps.imageUrl = result.coverImage;
				searchItemProps.artistName = result.artistsNames.join(", ");
				searchItemProps.type = "song";
				searchItemProps.onPress = () =>
					navigation.navigate("AddSongToPlaylist", {
						songId: result.id,
					});
			} else if ("albumTitle" in result) {
				searchItemProps.title = result.title;
				searchItemProps.imageUrl = result.coverImage;
				searchItemProps.artistName = result.artistName;
				searchItemProps.type = "album";
				searchItemProps.onPress = () =>
					navigation.navigate("Album", { albumId: result.id });
			}

			return (
				<SearchItem
					key={key}
					title={searchItemProps.title}
					imageUrl={searchItemProps.imageUrl}
					type="song"
					artistName={searchItemProps.artistName}
					onPress={searchItemProps.onPress}
					mode={searchItemProps.mode}
				/>
			);
		})}
	</View>;
}
