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

	set posIdx(idx) {
		let oldVal = this.#posIdx;
		let newVal = (this.#posIdx = poidxsIdx);
		return this.#translateCB(oldVal, newVal);
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
		this.posIdx = idx;
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
