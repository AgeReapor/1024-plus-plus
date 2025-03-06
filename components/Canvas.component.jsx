import { StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import * as style from "../utils/StyleUtilClasses";
import calcGridCoords from "../utils/CalcGridCoords";
import Tile from "./Tile.component";
import { TileNode } from "../models/TileNode";
import { useEffect } from "react";

const CANVAS_SIZE = 350;
const GRID_SIZE = 4;
const TILES_COUNT = GRID_SIZE ** 2;
const TILE_SIZE = 80;

export default function Canvas(props) {
	const canvasAnimStyles = useAnimatedStyle(() => {
		return {};
	});

	const bgAnimStyles = useAnimatedStyle(() => {
		return {
			width: TILE_SIZE,
			height: TILE_SIZE,
		};
	});

	useEffect(() => {}, []);

	return (
		<Animated.View style={[stylesheet.canvas, canvasAnimStyles]}>
			<BackgroundGrid></BackgroundGrid>
			<GameGrid tileNodes={props.tileNodes}></GameGrid>
		</Animated.View>
	);
}

const BackgroundGrid = () => {
	return (
		<Animated.View style={[stylesheet.bgGrid]}>
			{Array.from({ length: TILES_COUNT }, (_, i) => {
				const coords = calcGridCoords(i);
				return (
					<Tile
						key={"bgTile_" + i}
						x={coords.x}
						y={coords.y}
						val={0}
						size={TILE_SIZE}
					></Tile>
				);
			})}
		</Animated.View>
	);
};

const GameGrid = (props) => {
	let tileNodes = props.tileNodes;
	return (
		<Animated.View style={[stylesheet.fgGrid]}>
			{/* <Tile key={"test2"} x={203} y={2} val={2} size={TILE_SIZE} />
			<Tile key={"test1"} x={103} y={2} val={2} size={TILE_SIZE} />
			<Tile key={"test3"} x={0} y={2} val={4} size={TILE_SIZE} /> */}

			{tileNodes.map((tileNode) => {
				return (
					<Tile
						key={tileNode.name}
						x={tileNode.coords.x}
						y={tileNode.coords.y}
						val={tileNode.val}
						size={TileNode.tileSize}
					></Tile>
				);
			})}
		</Animated.View>
	);
};

const stylesheet = StyleSheet.create({
	canvas: {
		position: "relative",
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
	},
	bgGrid: {
		backgroundColor: "#bbada0",
		position: "absolute",
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
		borderRadius: 7,
	},
	fgGrid: {
		position: "absolute",
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
	},
});
