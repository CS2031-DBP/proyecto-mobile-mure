import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { fonts, theme } from "./Theme";

export const defaultScreenOptions: NativeStackNavigationOptions = {
	headerTitleStyle: {
		fontFamily: fonts.poppinsRegular,
	},
	headerBackVisible: true,
	headerTitleAlign: "center",
	headerStyle: {
		backgroundColor: theme.colors.headerBackgroundColor,
	},
};
