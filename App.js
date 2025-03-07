import "@expo/metro-runtime";

import Animated from "react-native-reanimated";
import { Button } from "react-native";
import { StyleSheet } from "react-native";
import React, { useEffect, useReducer, useState } from "react";

import Canvas from "./components/Canvas";
import GameBoard from "./components/GameBoard.component";

import * as style from "./utils/StyleUtilClasses";
import GameOverModal from "./components/GameOverModal";

const CANVAS_SIZE = 350;
const GRID_SLOTS = 16;

const CHANCE_OF_4 = 0.1;
const SPAWN_TIME = 200;

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
	const [tileNodes, setTileNodes] = useState([]);

	const idxTracker = React.useRef(0);

	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);

	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		spawnRandomHandler(2);
	}, []);

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

	const spawnRandomHandler = (val = null) => {
		const emptySlotsCount = getEmptySlots().length;
		// if (emptySlotsCount <= 0) throw new Error("Board is Full");
		if (emptySlotsCount <= 0) {
			setGameOver(true);
			return;
		}

		const randIdx = Math.floor(Math.random() * emptySlotsCount);

		const idx = getEmptySlots()[randIdx];

		if (val === null) spawnTile(idx, val);
		else spawnTile(idx, get2or4());

		// forceUpdate();
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
	const mergeHandler = () => {
		mergeTiles(8, 9, 11);
	};

	const swipeLeftHandler = () => {
		let newTileNodes = [
			swipeLeft(0, 1, 2, 3),
			swipeLeft(4, 5, 6, 7),
			swipeLeft(8, 9, 10, 11),
			swipeLeft(12, 13, 14, 15),
		].flat();

		setTileNodes(newTileNodes);
	};

	const swipeRightHandler = () => {
		let newTileNodes = [
			swipeLeft(3, 2, 1, 0),
			swipeLeft(7, 6, 5, 4),
			swipeLeft(11, 10, 9, 8),
			swipeLeft(15, 14, 13, 12),
		].flat();

		setTileNodes(newTileNodes);
	};

	const swipeUpHandler = () => {
		let newTileNodes = [
			swipeLeft(0, 4, 8, 12),
			swipeLeft(1, 5, 9, 13),
			swipeLeft(2, 6, 10, 14),
			swipeLeft(3, 7, 11, 15),
		].flat();

		setTileNodes(newTileNodes);
	};

	const swipeDownHandler = () => {
		let newTileNodes = [
			swipeLeft(12, 8, 4, 0),
			swipeLeft(13, 9, 5, 1),
			swipeLeft(14, 10, 6, 2),
			swipeLeft(15, 11, 7, 3),
		].flat();

		setTileNodes(newTileNodes);
	};

	//  Board Actions

	// TODO: Fix this buggy shit
	const swipeLeft = (idx1, idx2, idx3, idx4) => {
		const indices = [idx1, idx2, idx3, idx4];

		let actions = indices
			.filter((idx) => getTileNode(idx) !== null)
			.map((idx) => {
				return {
					name: getTileNode(idx).name,
					action: "move",
					val: getTileNode(idx).val,
					from: idx,
				};
			})
			.reduce((acc, curr) => {
				let last = acc[acc.length - 1];
				if (last && last.action === "move" && last.val === curr.val) {
					last.with = curr.from;
					last.action = "merge";
					last.val += curr.val;
					return acc;
				} else {
					acc.push(curr);
				}
				return acc;
			}, []);

		for (let i = 0; i < actions.length; i++) {
			actions[i].to = indices[i];
		}

		// turn actions to tilenodes
		let newTilenodes = actions.map((action) => {
			return new TileNode(action.name, action.to, action.val, true);
		});

		return newTilenodes;
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

	const mergeTiles = (idxFrom, idxWith, idxTo, newVal = null) => {
		if (
			idxFrom < 0 ||
			idxFrom >= GRID_SLOTS ||
			idxWith < 0 ||
			idxWith >= GRID_SLOTS
		)
			throw new Error("Invalid Indices: " + idxFrom + ", " + idxTo);

		const tileNodeFrom = getTileNode(idxFrom);
		const tileNodeWith = getTileNode(idxWith);

		if (tileNodeFrom === null)
			throw new Error(
				"Tried merging with an empty tile:" +
					idxFrom +
					", " +
					idxWith +
					", " +
					idxTo
			);
		if (tileNodeWith === null)
			throw new Error(
				"Tried merging to an empty tile:" +
					idxFrom +
					", " +
					idxWith +
					", " +
					idxTo
			);
		// if (tileNodeFrom.val !== tileNodeTo.val)
		// 	throw new Error("Tried merging tiles with different values");

		const nameFrom = tileNodeFrom.name;
		const nameWith = tileNodeWith.name;
		const sum = newVal || tileNodeFrom.val + tileNodeWith.val;

		setTileNodes((oldTileNodes) =>
			oldTileNodes.map((tileNode) => {
				if (tileNode.name === nameFrom)
					return { ...tileNode, isAlive: false };
				else if (tileNode.name === nameWith)
					return { ...tileNode, slot: idxTo, val: sum };
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
				<Button
					title="Spawn Random"
					onPress={spawnRandomHandler}
				></Button>
				<Button title="Move All" onPress={moveAllHandler}></Button>
				<Button
					title="Delete Random"
					onPress={deleteRandomHandler}
				></Button>
				<Button title="Clear All" onPress={clearHandler}></Button>
			</Animated.View>
			<Animated.View
				style={[
					style.flex_center,
					style.flex_row,
					style.gap(),
					stylesheet.toolbar,
				]}
			>
				<Button
					title="Left"
					onPress={async () => {
						swipeLeftHandler();
						setTimeout(spawnRandomHandler, SPAWN_TIME);
					}}
				></Button>
				<Button
					title="Up"
					onPress={async () => {
						swipeUpHandler();
						setTimeout(spawnRandomHandler, SPAWN_TIME);
					}}
				></Button>
				<Button
					title="Down"
					o
					onPress={async () => {
						swipeDownHandler();
						setTimeout(spawnRandomHandler, SPAWN_TIME);
					}}
				></Button>
				<Button
					title="Right"
					onPress={async () => {
						swipeRightHandler();
						setTimeout(spawnRandomHandler, SPAWN_TIME);
					}}
				></Button>
			</Animated.View>
			{gameOver && (
				<GameOverModal
					restartHandler={() => {
						setGameOver(false);
						clearHandler();
					}}
				></GameOverModal>
			)}
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
