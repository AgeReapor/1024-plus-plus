import Animated, {
	useDerivedValue,
	useSharedValue,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import Tile from "./Tile.component";

import calcGridCoords from "../utils/CalcGridCoords";

const CANVAS_SIZE = 350;
const GRID_SLOTS = 16;

export default function GameBoard({ tileNodes, deleteTile }) {
	return (
		<Animated.View style={[stylesheet.gameBoard]}>
			{tileNodes.map((tileNode) => {
				const { x, y } = calcGridCoords(tileNode.slot);
				return (
					<Tile
						key={tileNode.name}
						x={x}
						y={y}
						val={tileNode.val}
						isAlive={tileNode.isAlive}
						deathCB={() => deleteTile(tileNode.slot)}
					></Tile>
				);
			})}
		</Animated.View>
	);
}

const stylesheet = StyleSheet.create({
	gameBoard: {
		position: "absolute",
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
	},
});
