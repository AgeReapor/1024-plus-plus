import { TileNode } from "./TileNode";

export class Board {
	#tileNodes;
	#isFullCB;
	constructor(
		tileNodes = [],
		isFullCB = () => {
			console.log("Tried to spawn tile on full board");
		}
	) {
		this.#tileNodes = tileNodes;
		this.#isFullCB = isFullCB;
	}

	get tileNodes() {
		return this.#tileNodes;
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
		if (emptyTiles.length === 0) return -1;

		return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
	}

	spawnTile(idx = -1, val = 2) {
		if (idx === -1) idx = this.randomEmptyTile;
		if (idx === -1) {
			this.#isFullCB();
			return false;
		}
		this.#tileNodes.push(new TileNode(idx, val));
		return true;
	}

	deleteTile(idx) {
		let tileNode = this.getTileNode(idx);
		if (tileNode === null) return false;
		this.#tileNodes.splice(this.#tileNodes.indexOf(tileNode), 1);
		tileNode.delete();

		return true;
	}

	moveTile(from, to) {
		if (this.getTileNode(from) === null) return false;
		if (this.getTileNode(to) !== null) return false;

		let from = this.getTileNode(from);
		tileNode.move(to);

		return true;
	}

	mergeTile(from, to) {
		let tileNodeFrom = this.getTileNode(from);
		let tileNodeTo = this.getTileNode(to);

		if (tileNodeFrom === null || tileNodeTo === null) return false;
		if (tileNodeFrom.val !== tileNodeTo.val) return false;

		tileNodeFrom.move(to);
		tileNodeFrom.doubleVal();
		this.deleteTile(to);

		return true;
	}
}
