import { Platform } from "react-native";
import {
	configureFonts,
	MD3LightTheme as DefaultTheme,
} from "react-native-paper";

export const fonts = {
	poppinsRegular: "poppins-regular",
	oleoScriptRegular: "oleo-script-regular",
	oleoScriptBold: "oleo-script-bold",
};

const fontConfig = {
	fontFamily: Platform.select({
		default: fonts.poppinsRegular,
	}),
};

export const theme = {
	...DefaultTheme,
	dark: false,
	version: 3,
	fonts: configureFonts({ config: fontConfig }),
	roundness: 10,
	colors: {
		...DefaultTheme.colors,
		background: "#FFFDF1",
		mureLogo: "#FF820E",
		headerBackgroundColor: "#F8E8D5",
	},
} as const;
