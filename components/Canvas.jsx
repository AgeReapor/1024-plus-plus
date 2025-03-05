import { StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useAnimatedRef,
} from "react-native-reanimated";
import * as style from "../utils/StyleUtilClasses";
import calcGridCoords from "../utils/CalcGridCoords";
import Tile from "./Tile";
import { useEffect } from "react";

const CANVAS_SIZE = 350;
const GRID_SIZE = 4;
const TILES_COUNT = GRID_SIZE ** 2;
const TILE_SIZE = 80;

export default function Canvas() {
	const canvasAnimStyles = useAnimatedStyle(() => {
		return {};
	});

	const bgAnimStyles = useAnimatedStyle(() => {
		return {
			width: TILE_SIZE,
			height: TILE_SIZE,
		};
	});

	useEffect(() => {}, [bgAnimStyles]);

	return (
		<Animated.View style={[stylesheet.canvas, canvasAnimStyles]}>
			<BackgroundGrid></BackgroundGrid>
		</Animated.View>
	);
}

const BackgroundGrid = () => {
	return (
		<Animated.View style={[stylesheet.bgGrid]}>
			{Array.from({ length: TILES_COUNT }, (_, i) => {
				const coords = calcGridCoords(
					i,
					CANVAS_SIZE,
					TILE_SIZE,
					GRID_SIZE
				);
				return (
					<Tile
						key={i}
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
		position: "relative",
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
		borderRadius: 7,
	},
});
