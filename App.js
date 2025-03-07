import Animated from "react-native-reanimated";
import { Button } from "react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";

import Canvas from "./components/Canvas";
import GameBoard from "./components/GameBoard.component";

import * as style from "./utils/StyleUtilClasses";

const CANVAS_SIZE = 350;

class TileNode {
	constructor(name, slot, val = 2) {
		this.name = name;
		this.slot = slot;
		this.val = val;
	}
}

export default function App() {
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);

	const [tileNodes, setTileNodes] = useState([]);

	const spawnHandler = () => {
		forceUpdate();
	};
	const moveHandler = () => {
		forceUpdate();
	};
	const deleteHandler = () => {
		forceUpdate();
	};
	const clearHandler = () => {
		forceUpdate();
	};
	const mergeHandler = () => {
		forceUpdate();
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
				<GameBoard tileNodes={tileNodes}></GameBoard>
			</Canvas>

			<Animated.View
				style={[
					style.flex_center,
					style.flex_row,
					style.gap(),
					stylesheet.toolbar,
				]}
			>
				<Button title="Spawn" onPress={spawnHandler}></Button>
				<Button title="Move" onPress={moveHandler}></Button>
				<Button title="Delete" onPress={deleteHandler}></Button>
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
