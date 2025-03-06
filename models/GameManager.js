import { TileNode } from "./TileNode";

export class GameManager {
	#tileNodes;
	#setTileNodes;
	#isFullCB;
	static #keyTracker = 0;
	constructor(
		tileNodes,
		setTileNodes,
		isFullCB = () => {
			console.log("Tried to spawn tile on full board");
		}
	) {
		this.#tileNodes = tileNodes;
		this.#setTileNodes = setTileNodes;
		this.#isFullCB = isFullCB;
	}

	get keyTracker() {
		return GameManager.#keyTracker;
	}

	set keyTracker(keyTracker) {
		GameManager.#keyTracker = keyTracker;
	}

	get tileNodes() {
		return this.#tileNodes;
	}

	set tileNodes(tileNodes) {
		this.#setTileNodes(tileNodes);
	}

	get board() {
		let board = [];
		for (let i = 0; i < 16; i++) {
			board.push([]);
		}

		for (let tileNode of this.#tileNodes) {
			board[tileNode.posIdx].push(tileNode);
		}
	}

	set tileNodes(tileNodes) {
		this.#tileNodes = tileNodes;
	}

	getTileNode(idx) {
		for (let tileNode of this.#tileNodes) {
			if (tileNode.posIdx === idx) return tileNode;
		}
		return null;
	}

	get emptyTiles() {
		let emptyTiles = [];
		for (let i = 0; i < 16; i++) {
			if (this.getTileNode(i) === null) emptyTiles.push(i);
		}
		return emptyTiles;
	}

	get randomEmptyTile() {
		let emptyTiles = this.emptyTiles;
		if (emptyTiles.length === 0) throw new Error("No empty tiles on board");

		return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
	}

	spawnTile(idx = -1, val = 2, name = null) {
		if (idx < -1 || idx > 15) throw new Error("Invalid spawn index: ", idx);

		try {
			if (idx === -1) idx = this.randomEmptyTile;
		} catch (e) {
			if (e.message !== "No empty tiles on board") throw e;

			this.#isFullCB();
		}

		if (name === null) name = ++GameManager.#keyTracker;

		let newTileNode = new TileNode(name, idx, val);

		let newTileNodes = [...this.#tileNodes, newTileNode];
		this.#setTileNodes(newTileNodes);
	}

	deleteTile(idx) {
		let tileNode = this.getTileNode(idx);
		if (tileNode === null)
			throw new Error("Tried deleting empty tile", idx);

		const newTileNodes = this.#tileNodes.filter(
			(tileNode) => tileNode.posIdx !== idx
		);
		this.#setTileNodes(newTileNodes);

		tileNode.delete();
	}

	moveTile(from, to) {
		if (this.getTileNode(from) === null)
			throw new Error("Tried moving empty tile", from);
		if (this.getTileNode(to) !== null)
			throw new Error("Tried moving " + from + " to occupied tile", to);

		let tileNodeFrom = this.getTileNode(from);
		let nameFrom = tileNodeFrom.name;

		this.deleteTile(from);
		this.spawnTile(to, tileNodeFrom.val, nameFrom);

		tileNodeFrom.move(to);
	}

	mergeTiles(from, to) {
		console.log("Call to merge tiles: " + from + " to " + to);

		// let tileNodeFrom = this.getTileNode(from);
		// let tileNodeTo = this.getTileNode(to);

		// if (tileNodeFrom === null || tileNodeTo === null)
		// 	throw new Error("Missing tiles to merge: ", from, to);
		// if (tileNodeFrom.val !== tileNodeTo.val)
		// 	throw new Error(
		// 		"Tried merging tiles with different values: ",
		// 		from,
		// 		"=" + tileNodeFrom.val,
		// 		"; ",
		// 		to + "=" + tileNodeTo.val
		// 	);
		// tileNodeFrom.move(to);
		// tileNodeFrom.doubleVal();
		// this.deleteTile(to);
	}

	clearBoard() {
		for (let tileNode of this.#tileNodes) {
			tileNode.delete();
		}

		const newTileNodes = this.#tileNodes.filter(
			(tileNode) => tileNode.posIdx < -1
		);
		this.#setTileNodes(newTileNodes);
	}
}
