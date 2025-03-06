import Animated, { useSharedValue } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { TileNode } from "../models/TileNode";
import Tile from "./Tile.component";

const CANVAS_SIZE = 350;

export default function GameBoard({ tileNodes }) {
	return (
		<Animated.View style={[stylesheet.gameBoard]}>
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
}

const stylesheet = StyleSheet.create({
	gameBoard: {
		position: "absolute",
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
	},
});
