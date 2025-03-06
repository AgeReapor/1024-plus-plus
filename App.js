import Animated, { useSharedValue } from "react-native-reanimated";
import { Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import * as style from "./utils/StyleUtilClasses";
import Canvas from "./components/Canvas.component";
import { GameManager } from "./models/GameManager";
const CANVAS_SIZE = 350;

export default function App() {
	const [tileNodes, setTileNodes] = useState([]);
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);

	const mngr = new GameManager(tileNodes, setTileNodes, fullBoardHandler);

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
						mngr.spawnTile();
					}}
				></Button>
				<Button
					title="Move"
					onPress={() => {
						if (tileNodes.length === 0)
							throw new Error("No tiles to move");
						for (let i = 15; i >= 0; i--) {
							const node = mngr.getTileNode(i);
							if (node === null) continue;
							try {
								mngr.getTileNode(i).move((i + 1) % 16);
							} catch (e) {
								if (e.message !== "Tried moving empty tile")
									throw e;
							}
						}
						forceUpdate();
					}}
				></Button>
				<Button
					title="Delete"
					onPress={() => {
						if (tileNodes.length === 0)
							throw new Error("No tiles to delete");
						let idx = tileNodes[0].posIdx;
						mngr.deleteTile(idx);
					}}
				></Button>
				<Button
					title="Clear"
					onPress={() => {
						mngr.clearBoard();
					}}
				></Button>
				<Button
					title="Merge"
					onPress={() => {
						if (tileNodes.length > 1) {
							mngr.mergeTiles(
								tileNodes[0].posIdx,
								tileNodes[1].posIdx
							);
						}
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

const fullBoardHandler = () => {};
