import Animated from "react-native-reanimated";
import { Button } from "react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";

import Canvas from "./components/Canvas";
import GameBoard from "./components/GameBoard.component";

import * as style from "./utils/StyleUtilClasses";

const CANVAS_SIZE = 350;
const GRID_SLOTS = 16;

const CHANCE_OF_4 = 0.2;

class TileNode {
	constructor(name, slot, val = 2) {
		this.name = name;
		this.slot = slot;
		this.val = val;
		this.isAlive = true;
	}
}

const get2or4 = () => (Math.random() < CHANCE_OF_4 ? 4 : 2);

export default function App() {
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const idxTracker = React.useRef(0);

	const [tileNodes, setTileNodes] = useState([]);

	//  Derived Values
	const getTileNode = (idx) =>
		tileNodes.find((tileNode) => tileNode.slot === idx) || null;

	const getEmptySlots = () =>
		Array.from({ length: GRID_SLOTS }, (_, i) => i).filter(
			(i) => !tileNodes.find((tileNode) => tileNode.slot === i)
		);

	// Board Setters
	const setTileDead = (idx) => {
		setTileNodes((oldTileNodes) =>
			oldTileNodes.map((tileNode) =>
				tileNode.slot === idx
					? { ...tileNode, isAlive: false }
					: tileNode
			)
		);
	};

	const setTileDeadByName = (name) => {
		setTileNodes((oldTileNodes) =>
			oldTileNodes.map((tileNode) =>
				tileNode.name === name
					? { ...tileNode, isAlive: false }
					: tileNode
			)
		);
	};

	const setTileVal = (idx, val) => {
		setTileNodes((oldTileNodes) =>
			oldTileNodes.map((tileNode) =>
				tileNode.slot === idx ? { ...tileNode, val } : tileNode
			)
		);
	};

	// Handlers

	const spawnRandomHandler = (val = 2) => {
		const emptySlotsCount = getEmptySlots().length;
		if (emptySlotsCount <= 0) throw new Error("Board is Full");

		const randIdx = Math.floor(Math.random() * emptySlotsCount);

		const idx = getEmptySlots()[randIdx];

		spawnTile(idx, get2or4());

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
		mergeTiles(12, 8);
	};

	const swipeLeftHandler = () => {
		let hasAction = false;
		hasAction ||= swipeLeft(0, 1, 2, 3);
		hasAction ||= swipeLeft(4, 5, 6, 7);
		hasAction ||= swipeLeft(8, 9, 10, 11);
		hasAction ||= swipeLeft(12, 13, 14, 15);

		try {
			if (hasAction) spawnRandomHandler();
		} catch (e) {
			if (e.message !== "Board is Full") throw e;
			gameOverHandler();
		}
	};

	const swipeRightHandler = () => {
		let hasAction = false;
		hasAction ||= swipeLeft(3, 2, 1, 0);
		hasAction ||= swipeLeft(7, 6, 5, 4);
		hasAction ||= swipeLeft(11, 10, 9, 8);
		hasAction ||= swipeLeft(15, 14, 13, 12);

		try {
			if (hasAction) spawnRandomHandler();
		} catch (e) {
			if (e.message !== "Board is Full") throw e;
			gameOverHandler();
		}
	};

	const swipeUpHandler = () => {
		let hasAction = false;
		hasAction ||= swipeLeft(0, 4, 8, 12);
		hasAction ||= swipeLeft(1, 5, 9, 13);
		hasAction ||= swipeLeft(2, 6, 10, 14);
		hasAction ||= swipeLeft(3, 7, 11, 15);

		try {
			if (hasAction) spawnRandomHandler();
		} catch (e) {
			if (e.message !== "Board is Full") throw e;
			gameOverHandler();
		}
	};

	const swipeDownHandler = () => {
		let hasAction = false;
		hasAction ||= swipeLeft(12, 8, 4, 0);
		hasAction ||= swipeLeft(13, 9, 5, 1);
		hasAction ||= swipeLeft(14, 10, 6, 2);
		hasAction ||= swipeLeft(15, 11, 7, 3);

		try {
			if (hasAction) spawnRandomHandler();
		} catch (e) {
			if (e.message !== "Board is Full") throw e;
			gameOverHandler();
		}
	};

	//  Board Actions

	// TODO: Fix this buggy shit
	const swipeLeft = (idx1, idx2, idx3, idx4) => {
		const indices = [idx1, idx2, idx3, idx4];

		let hasAction = false;

		// for (let cur = 0; cur < 4; cur++) {
		// 	// i = 0, max of 4
		// 	// pick i, if empty find next non-empty tile j and try to move j to i, pick i+1
		// 	if (getTileNode(indices[cur]) === null) {
		// 		for (let next = cur + 1; next < 4; next++) {
		// 			if (getTileNode(indices[next]) !== null) {
		// 				moveTile(indices[next], indices[cur]);
		// 				hasAction = true;
		// 				break;
		// 			}
		// 		}

		// 		// pick i, if not empty find next non-empty tile j,
		// 		// 		if same value merge j to i, pick i+1
		// 		// 		else move j to i + 1, pick i+2
		// 	} else {
		// 		let val = getTileNode(indices[cur]).val;
		// 		for (let next = cur + 1; next < 4; next++) {
		// 			if (getTileNode(indices[next]) === null) continue;
		// 			if (getTileNode(indices[next]).val === val) {
		// 				mergeTiles(indices[next], indices[cur]);
		// 				val = getTileNode(indices[cur]).val;
		// 				hasAction = true;
		// 				break;
		// 			} else {
		// 				moveTile(indices[next], indices[cur + 1]);
		// 				cur++;
		// 				hasAction = true;
		// 				break;
		// 			}
		// 		}
		// 	}
		// }

		return hasAction;
	};

	const spawnTile = (idx, val = 2) => {
		if (idx < 0 || idx >= GRID_SLOTS)
			throw new Error("Invalid Index:" + idx);

		const tileNode = new TileNode("tile_" + idxTracker.current++, idx, val);
		setTileNodes((oldTileNodes) => [...oldTileNodes, tileNode]);
	};

	const deleteTileFactory = (idx) => {
		if (idx < 0 || idx >= GRID_SLOTS)
			throw new Error("Invalid Index:" + idx);

		const tileNode = getTileNode(idx);
		if (tileNode === null) throw new Error("No Tile Found");

		setTileNodes((oldTileNodes) =>
			oldTileNodes.filter((tileNode) => tileNode.slot !== idx)
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

		if (idxFrom === idxTo) return;

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

	const mergeTiles = (idxFrom, idxTo, newVal = null) => {
		if (
			idxFrom < 0 ||
			idxFrom >= GRID_SLOTS ||
			idxTo < 0 ||
			idxTo >= GRID_SLOTS
		)
			throw new Error("Invalid Indices: " + idxFrom + ", " + idxTo);

		const tileNodeFrom = getTileNode(idxFrom);
		const tileNodeTo = getTileNode(idxTo);

		if (tileNodeFrom === null)
			throw new Error("Tried merging with an empty tile");
		if (tileNodeTo === null)
			throw new Error("Tried merging to an empty tile");
		if (tileNodeFrom.val !== tileNodeTo.val)
			throw new Error("Tried merging tiles with different values");

		const nameFrom = tileNodeFrom.name;
		const nameTo = tileNodeTo.name;
		const sum = newVal || tileNodeFrom.val * 2;

		setTileNodes((oldTileNodes) =>
			oldTileNodes.map((tileNode) => {
				if (tileNode.name === nameFrom)
					return { ...tileNode, isAlive: false };
				else if (tileNode.name === nameTo)
					return { ...tileNode, val: sum };
				else return tileNode;
			})
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
					deleteTileFactory={deleteTileFactory}
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
			<Animated.View
				style={[
					style.flex_center,
					style.flex_row,
					style.gap(),
					stylesheet.toolbar,
				]}
			>
				<Button title="Left" onPress={swipeLeftHandler}></Button>
				<Button title="Right" onPress={swipeRightHandler}></Button>
				<Button title="Up" onPress={swipeUpHandler}></Button>
				<Button title="Down" onPress={swipeDownHandler}></Button>
			</Animated.View>
		</Animated.View>
	);
}

const gameOverHandler = () => {
	console.log("Game Over Modal should appear here");
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
