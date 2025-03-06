import Animated from "react-native-reanimated";
import { Button, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";

import * as style from "./utils/StyleUtilClasses";
import Canvas from "./components/Canvas.component";
import { GameManager } from "./models/GameManager";
const CANVAS_SIZE = 350;

export default function App() {
	const [tileNodes, setTileNodes] = useState([]);
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

const fullBoardHandler = () => {
	const [showModal, setShowModal] = useState(false);

	const handleConfirm = () => {
		setShowModal(false);
		mngr.clearBoard();
	};

	const handleCancel = () => {
		setShowModal(false);
	};

	return (
		<>
			{showModal && (
				<Modal
					animationType="fade"
					transparent={true}
					visible={showModal}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>Game Over</Text>

							<Text style={styles.modalText}>
								Are you sure you want to restart the game?
							</Text>

							<View style={{ flexDirection: "row" }}>
								<Button title="Cancel" onPress={handleCancel} />
								<Button
									title="Confirm"
									onPress={handleConfirm}
								/>
							</View>
						</View>
					</View>
				</Modal>
			)}

			{fullBoardHandler && (
				<Button
					title="Full Board"
					onPress={() => {
						setShowModal(true);
					}}
				></Button>
			)}
		</>
	);

	const styles = StyleSheet.create({
		centeredView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "rgba(0,0,0,0.5)",
		},
		modalView: {
			backgroundColor: "white",
			borderRadius: 20,
			padding: 35,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5,
		},
		modalText: {
			marginBottom: 15,
			textAlign: "center",
		},
	});
};
