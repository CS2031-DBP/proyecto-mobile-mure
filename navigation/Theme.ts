import {
	DarkTheme as NavigationDarkTheme,
	Theme,
} from "@react-navigation/native";

const DarkTheme: Theme = {
	...NavigationDarkTheme,
	colors: {
		...NavigationDarkTheme.colors,
		primary: "#1f1f1f",
		background: "#121212",
		card: "#1f1f1f",
		text: "#ffffff",
		border: "#272727",
		notification: "#ff453a",
	},
};

export default DarkTheme;
