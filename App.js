import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	interpolateColor,
} from "react-native-reanimated";
import { Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";

import * as style from "./utils/StyleUtilClasses";
import Canvas from "./components/Canvas.component";
import Tile from "./components/Tile.component";
import { TileNode } from "./models/TileNode";
const CANVAS_SIZE = 350;
const TILE_SIZE = 80;

export default function App() {
	const [state, setState] = useState({
		x: 0,
		y: 0,
		val: "",
	});

	const [tileNodes, setTileNodes] = useState([]);
	const tracker = useRef(0);

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

			<Animated.View
				style={[
					style.flex_center,
					style.flex_row,
					style.gap(),
					stylesheet.toolbar,
				]}
			>
				<Button
					title="Spawn"
					onPress={() => {
						setTileNodes([new TileNode(tracker.current++, 0)]);
					}}
				></Button>
				<Button
					title="Move"
					onPress={() => {
						if (tileNodes.length === 0) return;
						let oldTileNode = tileNodes[0];

						setTileNodes([
							new TileNode(
								oldTileNode.name,
								(oldTileNode.posIdx + 1) % 15
							),
						]);
					}}
				></Button>
				<Button
					title="Delete"
					onPress={() => {
						tileNodes.forEach((tileNode) => tileNode.delete());
						setTileNodes([]);
					}}
				></Button>
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
