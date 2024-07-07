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
import SearchMediaEntity from "@/components/SearchMediaEntity";

export default function Search() {
	const navigation = useNavigation<NavigationProp<ParamListBase>>();

	return (
		<SafeAreaView style={{ flex: 1, padding: 5 }}>
			<SearchMediaEntity mode={"interactive"} navigation={navigation} />
		</SafeAreaView>
	);
}
