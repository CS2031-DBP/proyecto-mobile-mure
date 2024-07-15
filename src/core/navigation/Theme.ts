import { Platform } from "react-native";
import {
	configureFonts,
	MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

const fontConfig = {
	fontFamily: Platform.select({
		default: "poppins-regular",
	}),
};

const theme: ThemeProp = {
	...DefaultTheme,
	dark: false,
	version: 3,
	fonts: configureFonts({ config: fontConfig }),
};

export default theme;
