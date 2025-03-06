import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import calcGridCoords from "../utils/CalcGridCoords";
import Tile from "./Tile.component";
import { useEffect } from "react";
import GameBoard from "./GameBoard.component";

const CANVAS_SIZE = 350;
const GRID_SIZE = 4;
const TILES_COUNT = GRID_SIZE ** 2;
const TILE_SIZE = 80;

export default function Canvas({ tileNodes }) {
	return (
		<Animated.View style={[stylesheet.canvas]}>
			<BackgroundGrid></BackgroundGrid>
			<GameBoard tileNodes={tileNodes}></GameBoard>
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
});
