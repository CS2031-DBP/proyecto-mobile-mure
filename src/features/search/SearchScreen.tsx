import SearchMediaEntity from "@components/SearchMediaEntity";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <SafeAreaView style={{ flex: 1, padding: 5 }}>
      <SearchMediaEntity mode={"interactive"} navigation={navigation} />
    </SafeAreaView>
  );
}
