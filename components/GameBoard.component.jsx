import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { TileNode } from "../models/TileNode";
import Tile from "./Tile.component";
import { useEffect } from "react";

const CANVAS_SIZE = 350;

export default function GameBoard(props) {
	return (
		<Animated.View style={[stylesheet.gameBoard]}>
			{props.tileNodes.map((tileNode) => {
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
}

const stylesheet = StyleSheet.create({
	gameBoard: {
		position: "absolute",
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
	},
});
