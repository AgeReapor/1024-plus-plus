import { StyleSheet } from "react-native";
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

export default function Tile(props) {
	const animStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: withTiming(
				interpolateColor(
					props.val,
					[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
					tileColors
				)
			),
			color: withTiming(
				interpolateColor(props.val, [2, 4, 8, 2048], textColors)
			),
			transform: [
				{ translateX: withTiming(props.x) },
				{ translateY: withTiming(props.y) },
			],
			width: props.size,
			height: props.size,
		};
	});

	return (
		<Animated.View style={[sheet.tile, animStyles]}>
			<Animated.Text>{props.val}</Animated.Text>
		</Animated.View>
	);
}

const sheet = StyleSheet.create({
	tile: {
		borderRadius: 7,

		position: "absolute",
		justifyContent: "center",
		alignItems: "center",

		fontWeight: "bold",

		// Anchor center of the tile
		// marginLeft: -SIDE / 2,
		// marginTop: -SIDE / 2,
	},
});

const tileColors = [
	"#eee4da", // 2
	"#ede0c8", // 4
	"#f2b179", // 8
	"#f59563", // 16
	"#f67c5f", // 32
	"#f65e3b", // 64
	"#edcf72", // 128
	"#edcc61", // 256
	"#edc850", // 512
	"#edc53f", // 1024
	"#3e3933", // 2048
];

const textColors = [
	"#776e65", // 2 onwards
	"#776e65",
	"#f8f3ee", // 8 onwards
	"#f8f3ee",
];
