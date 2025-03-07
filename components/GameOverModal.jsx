import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const GameOverModal = ({ restartHandler }) => {
	return (
		<View style={styles.overlay}>
			<View style={styles.modal}>
				<Text style={styles.modalTitle}>Game Over</Text>
				<Text style={styles.modalText}>
					Your game board is now full.
				</Text>
				<TouchableOpacity
					style={styles.button}
					onPress={restartHandler}
				>
					<Text style={styles.buttonText}>Restart Game</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modal: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		width: "80%",
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalText: {
		fontSize: 18,
		marginBottom: 20,
	},
	button: {
		backgroundColor: "rgb(4, 128, 56)",
		padding: 15,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		fontSize: 18,
		color: "white",
	},
});

export default GameOverModal;
