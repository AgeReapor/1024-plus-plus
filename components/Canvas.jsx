import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import calcGridCoords from "../utils/CalcGridCoords";
import Tile from "./Tile.component";
import { useState } from "react";

const CANVAS_SIZE = 350;
const GRID_SIZE = 4;
const TILES_COUNT = GRID_SIZE ** 2;

export default function Canvas({ children }) {
	return (
		<Animated.View style={[stylesheet.canvas]}>
			<BackgroundGrid></BackgroundGrid>
			{children}
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
