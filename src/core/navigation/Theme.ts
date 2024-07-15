import { Platform } from "react-native";
import {
	configureFonts,
	MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

export const fonts = {
	"poppins-regular": require("assets/fonts/Poppins-Regular.ttf"),
	"oleo-script-regular": require("assets/fonts/OleoScriptSwashCaps-Regular.ttf"),
	"oleo-script-bold": require("assets/fonts/OleoScriptSwashCaps-Bold.ttf"),
};

const fontConfig = {
	fontFamily: Platform.select({
		default: fonts["poppins-regular"],
	}),
};

export const theme: ThemeProp = {
	...DefaultTheme,
	dark: false,
	version: 3,
	// fonts: configureFonts({ config: fontConfig }),
	roundness: 10,
	colors: {
		...DefaultTheme.colors,
		background: "#FFFDF1",
	},
};
