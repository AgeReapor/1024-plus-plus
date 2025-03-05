import { StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

const SIDE = 50;

export default function Tile(props) {
	const animStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: withTiming(props.x) },
				{ translateY: withTiming(props.y) },
			],
			width: SIDE,
			height: SIDE,
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
		backgroundColor: "#38ACDD",
		position: "absolute",

		// Anchor center of the tile
		// marginLeft: -SIDE / 2,
		// marginTop: -SIDE / 2,
	},
});
