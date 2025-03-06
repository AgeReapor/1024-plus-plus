import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	interpolateColor,
} from "react-native-reanimated";
import { Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import * as style from "./utils/StyleUtilClasses";
import Canvas from "./components/Canvas.component";
import Tile from "./components/Tile.component";
import { TileNode } from "./models/TileNode";
const CANVAS_SIZE = 350;
const TILE_SIZE = 80;

const tileNodes = [new TileNode("1", 0, 2), new TileNode("2", 1, 4)];

export default function App() {
	const [state, setState] = useState({
		x: 0,
		y: 0,
		val: "",
	});

	return (
		<Animated.View
			style={[
				style.flex,
				style.flex_center,
				style.gap(),
				style.bgColor("#faf8ef"),
			]}
		>
			<Canvas tileNodes={tileNodes} />
			<Animated.View style={[stylesheet.canvas]}>
				<Tile
					x={state.x}
					y={state.y}
					val={state.val}
					size={TileNode.tileSize}
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
						if (newVal <= 1) newVal = 2;
						if (newVal > 2048) newVal = 0;

						setState({
							x: Math.random() * (CANVAS_SIZE - TILE_SIZE),
							y: Math.random() * (CANVAS_SIZE - TILE_SIZE),
							val: newVal,
						});
					}}
				/>
			</Animated.View>
			<Animated.View
				style={[
					style.flex_center,
					style.flex_row,
					style.gap(),
					stylesheet.toolbar,
				]}
			>
				<Button title="Spawn"></Button>
				<Button title="Delete"></Button>
				<Button title="Hidden"></Button>
				<Button title="Slide"></Button>
			</Animated.View>
		</Animated.View>
	);
}

const stylesheet = StyleSheet.create({
	canvas: {
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
		borderRadius: 7,
		backgroundColor: "#bbada0",
		position: "relative",
	},
	toolbar: {},
});

const onSpawn = () => {};

const onDelete = () => {};

const onSlide = () => {};

const onHidden = () => {};
