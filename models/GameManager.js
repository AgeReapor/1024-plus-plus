import { TileNode } from "./TileNode";

export class GameManager {
	#tileNodes;
	#setTileNodes;
	#isFullCB;
	#keyTracker;
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
		this.#keyTracker = 0;
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

	spawnTile(idx = -1, val = 2) {
		if (idx < -1 || idx > 15) throw new Error("Invalid spawn index: ", idx);

		try {
			if (idx === -1) idx = this.randomEmptyTile;
		} catch (e) {
			if (e.message !== "No empty tiles on board") throw e;

			this.#isFullCB();
			throw new Error("Tried to spawn tile on full board");
		}

		// this.#tileNodes.push(new TileNode(this.#keyTracker++, idx, val));

		let tileNodes = this.#tileNodes;
		tileNodes.push(new TileNode(this.#keyTracker++, idx, val));
		this.#setTileNodes(tileNodes);
	}

	deleteTile(idx) {
		let tileNode = this.getTileNode(idx);
		if (tileNode === null)
			throw new Error("Tried deleting empty tile", idx);

		let tileNodes = this.#tileNodes;
		tileNodes.splice(tileNodes.indexOf(tileNode), 1);
		this.#setTileNodes(tileNodes);

		tileNode.delete();
	}

	moveTile(from, to) {
		if (this.getTileNode(from) === null)
			throw new Error("Tried moving empty tile", from);
		if (this.getTileNode(to) !== null)
			throw new Error("Tried moving " + from + " to occupied tile", to);

		let tileNodeFrom = this.getTileNode(from);
		tileNodeFrom.move(to);
	}

	mergeTile(from, to) {
		let tileNodeFrom = this.getTileNode(from);
		let tileNodeTo = this.getTileNode(to);

		if (tileNodeFrom === null || tileNodeTo === null)
			throw new Error("Missing tiles to merge: ", from, to);
		if (tileNodeFrom.val !== tileNodeTo.val)
			throw new Error(
				"Tried merging tiles with different values: ",
				from,
				"=" + tileNodeFrom.val,
				"; ",
				to + "=" + tileNodeTo.val
			);
		tileNodeFrom.move(to);
		tileNodeFrom.doubleVal();
		this.deleteTile(to);
	}

	clearBoard() {
		while (this.#tileNodes.length > 0) {
			this.deleteTile(this.#tileNodes[0].posIdx);
		}
	}
}
