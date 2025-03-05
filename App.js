import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	interpolateColor,
} from "react-native-reanimated";
import { Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useState, View } from "react";

import * as style from "./utils/StyleUtilClasses";
import Tile from "./components/Tile";

const CANVAS_SIZE = 350;
const TILE_SIZE = 60;

export default function App() {
	const [state, setState] = useState({
		x: 0,
		y: 0,
		val: 1,
	});

	return (
		<Animated.View style={[style.flex, style.flex_center, style.gap()]}>
			<Animated.View style={[styles.canvas]}>
				<Tile
					x={state.x}
					y={state.y}
					val={state.val}
					size={TILE_SIZE}
				/>
			</Animated.View>
			<Animated.View style={[style.alignItems("start"), style.gap()]}>
				<Text>
					Position: {Math.round(state.x)}, {Math.round(state.y)}
				</Text>
				<Button
					title="Change Position"
					onPress={() => {
						var newVal = state.val * 2;
						if (newVal >= 2048) newVal = 1;

						setState({
							x: Math.random() * (CANVAS_SIZE - TILE_SIZE),
							y: Math.random() * (CANVAS_SIZE - TILE_SIZE),
							val: newVal,
						});
					}}
				/>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	canvas: {
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
		backgroundColor: "#eee",
		position: "relative",
	},
});
