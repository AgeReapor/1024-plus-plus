import Animated from "react-native-reanimated";
import { Button } from "react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";

import Canvas from "./components/Canvas";
import GameBoard from "./components/GameBoard.component";

import * as style from "./utils/StyleUtilClasses";

const CANVAS_SIZE = 350;
const GRID_SLOTS = 16;

class TileNode {
	constructor(name, slot, val = 2) {
		this.name = name;
		this.slot = slot;
		this.val = val;
		this.isAlive = true;
	}
}

export default function App() {
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const idxTracker = React.useRef(0);

	const [tileNodes, setTileNodes] = useState([]);

	const getTileNode = (idx) =>
		tileNodes.find((tileNode) => tileNode.slot === idx) || null;

	const getEmptySlots = () =>
		Array.from({ length: GRID_SLOTS }, (_, i) => i).filter(
			(i) => !tileNodes.find((tileNode) => tileNode.slot === i)
		);

	const setTileDead = (idx) => {
		// set specific Tile to isAlive = false using setTileNodes
		setTileNodes((oldTileNodes) =>
			oldTileNodes.map((tileNode) =>
				tileNode.slot === idx
					? { ...tileNode, isAlive: false }
					: tileNode
			)
		);
	};

	const moveTile = (idxFrom, idxTo) => {
		if (
			idxFrom < 0 ||
			idxFrom >= GRID_SLOTS ||
			idxTo < 0 ||
			idxTo >= GRID_SLOTS
		)
			throw new Error("Invalid Indices: " + idxFrom + ", " + idxTo);

		if (getTileNode(idxFrom) === null) throw new Error("No Tile Found");

		if (getTileNode(idxTo) !== null)
			throw new Error("Tried moving to Occupied Slot");

		setTileNodes((oldTileNodes) =>
			oldTileNodes.map((tileNode) =>
				tileNode.slot === idxFrom
					? { ...tileNode, slot: idxTo }
					: tileNode
			)
		);
	};

	// Handlers

	const spawnRandomHandler = () => {
		const emptySlotsCount = getEmptySlots().length;
		if (emptySlotsCount <= 0) throw new Error("Board is Full");

		const randIdx = Math.floor(Math.random() * emptySlotsCount);

		const idx = getEmptySlots()[randIdx];

		spawnTile(idx);

		// forceUpdate();
	};
	const moveAllHandler = () => {
		for (let i = 0; i < GRID_SLOTS; i++) {
			try {
				moveTile(i, (i + 1) % GRID_SLOTS);
			} catch (e) {
				if (e.message === "No Tile Found") continue;
			}
		}

		forceUpdate();
	};
	const deleteRandomHandler = () => {
		if (tileNodes.length <= 0) throw new Error("Board is Empty");

		const randIdx = Math.floor(Math.random() * tileNodes.length);

		setTileDead(tileNodes[randIdx].slot);
	};

	const clearHandler = async () => {
		for (let i = 0; i < GRID_SLOTS; i++) {
			try {
				setTileDead(i);
				await new Promise((resolve) => setTimeout(resolve, 10));
			} catch (e) {
				if (e.message === "Board is Empty") break;

				if (e.message === "No Tile Found") continue;

				throw e;
			}
		}
	};
	const mergeHandler = () => {
		forceUpdate();
	};

	const spawnTile = (idx, val = 2) => {
		if (idx < 0 || idx >= GRID_SLOTS)
			throw new Error("Invalid Index:" + idx);

		const tileNode = new TileNode("tile_" + idxTracker.current++, idx, val);
		setTileNodes((oldTileNodes) => [...oldTileNodes, tileNode]);
	};

	const deleteTile = (idx) => {
		if (idx < 0 || idx >= GRID_SLOTS)
			throw new Error("Invalid Index:" + idx);

		const tileNode = getTileNode(idx);
		if (tileNode === null) throw new Error("No Tile Found");

		setTileNodes((oldTileNodes) =>
			oldTileNodes.filter((tileNode) => tileNode.slot !== idx)
		);
	};

	return (
		<Animated.View
			style={[
				style.flex,
				style.flex_center,
				style.gap(),
				style.bgColor("#faf8ef"),
			]}
		>
			<Canvas>
				<GameBoard
					tileNodes={tileNodes}
					deleteTile={deleteTile}
				></GameBoard>
			</Canvas>

			<Animated.View
				style={[
					style.flex_center,
					style.flex_row,
					style.gap(),
					stylesheet.toolbar,
				]}
			>
				<Button title="Spawn" onPress={spawnRandomHandler}></Button>
				<Button title="Move" onPress={moveAllHandler}></Button>
				<Button title="Delete" onPress={deleteRandomHandler}></Button>
				<Button title="Clear" onPress={clearHandler}></Button>
				<Button title="Merge" onPress={mergeHandler}></Button>
			</Animated.View>
		</Animated.View>
	);
}

const fullBoardHandler = () => {
	console.log("Modal Should Appear Here");
};

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
