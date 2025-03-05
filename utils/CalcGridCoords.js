export default function calcGridCoords(
	i,
	canvasSize = 350,
	tileSize = 80,
	gridSize = 4
) {
	const total_gap = canvasSize - gridSize * tileSize;
	const gap = total_gap / (gridSize + 1);

	const x = gap + (i % gridSize) * (tileSize + gap);
	const y = gap + Math.floor(i / gridSize) * (tileSize + gap);

	return { x, y };
}
