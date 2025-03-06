import calcGridCoords from "../utils/CalcGridCoords";
import Tile from "../components/Tile.component";
const TILE_SIZE = 80;

export class TileNode {
	#name;
	#posIdx;
	#val;
	#translateCB;
	#deleteCB;

	constructor(
		name,
		posIdx,
		val = 2,
		createdCB = () => {
			console.log(
				"Tile created: ",
				name,
				"at",
				posIdx,
				"with value",
				val
			);
		},
		translateCB = (a, b) => {
			console.log("Tile " + name + " moved from", a, "to", b);
		},
		deleteCB = () => {
			console.log("Tile " + name + " deleted");
		}
	) {
		this.#name = name;
		this.#posIdx = posIdx;
		this.#val = val;
		this.#translateCB = translateCB;
		this.#deleteCB = deleteCB;

		createdCB(this);
	}

	get posIdx() {
		return this.#posIdx;
	}

	get name() {
		return this.#name;
	}

	get coords() {
		return calcGridCoords(this.#posIdx);
	}

	get val() {
		return this.#val;
	}

	move(idx) {
		if (idx < 0 || idx > 15) throw new Error("Invalid move index: ", idx);

		let oldVal = this.#posIdx;
		let newVal = (this.#posIdx = idx);
		this.#translateCB(oldVal, newVal);
		console.log("posIdx " + this.#posIdx);
	}

	doubleVal() {
		this.val *= 2;
	}

	delete() {
		this.#deleteCB(this);
	}

	static get tileSize() {
		return TILE_SIZE;
	}
}
