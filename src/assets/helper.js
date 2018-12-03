import ROT from 'rot-js'

const key = (x, y) => x + ',' + y
const unkey = k => {
	return k.split(',').map(s => parseInt(s))
}
export function computeBitmaskFloors(x, y, freeCells) {
	let sum = 0
	let above = `${x},${y - 1}`
	let below = `${x},${y + 1}`
	let left = `${x - 1},${y}`
	let right = `${x + 1},${y}`

	let ur = `${x + 1},${y - 1}`
	let ll = `${x - 1},${y + 1}`

	let ul = `${x - 1},${y - 1}`
	let lr = `${x + 1},${y + 1}`

	let free = coord => {
		return coord in freeCells && !freeCells[coord]
	}

	if (free(above)) sum += 1
	if (free(right)) sum += 2
	if (free(below)) sum += 4
	if (free(left)) sum += 8
	if (sum == 0) {
		if (free(ul)) {
			return 16
		} else if (free(ur)) {
			return 17
		} else if (free(ll)) {
			return 18
		} else if (free(lr)) {
			return 19
		}
	}
	return sum
}

export function computeBitmaskWalls(x, y, blockedCells) {
	let sum = 0
	let above = `${x},${y - 1}`
	let below = `${x},${y + 1}`
	let left = `${x - 1},${y}`
	let right = `${x + 1},${y}`
	let ur = `${x + 1},${y - 1}`
	let ll = `${x - 1},${y + 1}`
	let ul = `${x - 1},${y - 1}`
	let lr = `${x + 1},${y + 1}`

	let blocked = coord => {
		return !(coord in blockedCells) || blockedCells[coord]
	}

	// let neighborsAreCardinal = coord => {
	// 	let [x, y] = unkey(coord)
	// 	return ROT.DIRS[4].some(([dx, dy]) => blocked(x + dx, y + dy)) && blocked(coord)
	// }

	if (blocked(above)) sum += 2
	if (blocked(right)) sum += 16
	if (blocked(below)) sum += 64
	if (blocked(left)) sum += 8
	if (blocked(ul) && blocked(above) && blocked(left)) sum += 1
	if (blocked(ur) && blocked(above) && blocked(right)) sum += 4
	if (blocked(ll) && blocked(below) && blocked(left)) sum += 32
	if (blocked(lr) && blocked(below) && blocked(right)) sum += 128
	return sum
}

// export function computeBitmaskWalls(x, y, freeCells) {
// 	let sum = 0
// 	let above = `${x},${y - 1}`
// 	let below = `${x},${y + 1}`
// 	let left = `${x - 1},${y}`
// 	let right = `${x + 1},${y}`

// 	let ur = `${x + 1},${y - 1}`
// 	let ll = `${x - 1},${y + 1}`

// 	let ul = `${x - 1},${y - 1}`
// 	let lr = `${x + 1},${y + 1}`

// 	let free = coord => {
// 		return coord in freeCells && !freeCells[coord]
// 	}

// 	if (free(above)) sum += 1
// 	if (free(right)) sum += 2
// 	if (free(below)) sum += 4
// 	if (free(left)) sum += 8
// 	if (free(above) && !free(below) && !free(right) && !free(left) && (free(ll) || free(lr))) {
// 		return 20
// 	}
// 	// if (free(below) && !free(above) && !free(right) && !free(left) && (free(ul) || free(ur))) {
// 	// 	return 21
// 	// }

// 	// if (!free(left) && !free(right) && free(above) && free(below) && (free(ll) || free(lr))) {
// 	// 	return 23
// 	// }
// 	if (sum == 0) {
// 		if (free(ul)) return 16
// 		else if (free(ur)) return 17
// 		else if (free(ll)) return 18
// 		else if (free(lr)) return 19
// 	}

// 	// if (!free(left) && !free(above) && !free(below) && (free(ur) || free(ll))) {
// 	// 	return 22
// 	// }

// 	// if (!free(right) && !free(above) && !free(below) && (free(ur) || free(ll))) {
// 	// 	return 23
// 	// }

// 	return sum
// }

export function getFloorCharacter(floor, sum) {
	const mapping = {
		0: floor.single,
		1: floor.endBottom,
		2: floor.endLeft,
		3: floor.lowerLeft,
		4: floor.endTop,
		5: floor.middleCorridorVertical,
		6: floor.upperLeft,
		7: floor.left,
		8: floor.endRight,
		9: floor.lowerRight,
		10: floor.middleCorridorHorizontal,
		11: floor.bottom,
		12: floor.upperRight,
		13: floor.right,
		14: floor.top,
		15: floor.center,
		16: floor.single,
		17: floor.single,
		18: floor.single,
		19: floor.lowerLeft
	}
	return mapping[sum]
}



export function getWallCharacter(walls, sum) {
	const wallSums = {
		0: walls.single,
		1: walls.bottom,
		2: walls.left,
		3: walls.upperRight,
		4: walls.top,
		5: walls.top,
		6: walls.lowerRight,
		7: walls.bottom,
		8: walls.right,
		9: walls.upperLeft,
		10: walls.left,
		11: walls.endTop,
		12: walls.lowerLeft,
		13: walls.bottom,
		14: walls.endBottom,
		15: walls.center,
		16: walls.lowerRight,
		17: walls.lowerLeft,
		18: walls.upperRight,
		19: walls.upperLeft,
		20: walls.topT,
		21: walls.bottomT,
		22: walls.rightT,
		23: walls.leftT
	}
	return wallSums[sum]
}

export const unicodeWalls = {
	single: ' ',
	bottom: '═',
	left: '║',
	top: '═',
	right: '║',
	endTop: '╥',
	endBottom: '╨',
	center: '#',
	lowerRight: '╝',
	lowerLeft: '╚',
	upperRight: '╗',
	upperLeft: '╔',
	topT: '╦',
	leftT: '╠',
	rightT: '╣',
	centerT: '╬'
}

// export const unicodeWalls = {
// 	single: " ",
// 	bottom: "─",
// 	left: "│",
// 	top: "─",
// 	right: "│",
// 	endTop: "┬",
// 	endBottom: "┴",
// 	center: "#",
// 	lowerRight: "┘",
// 	lowerLeft: "└",
// 	upperRight: "┐",
// 	upperLeft: "┌",
// 	topT: "┬",
// 	leftT: "├",
// 	rightT: "┤",
// 	centerT: "┼",
// 	bottomT: "┴"
// }

// export const unicodeWalls = {
// 	single: ' ',
// 	bottom: '━',
// 	left: '┃',
// 	top: '━',
// 	right: '┃',
// 	endTop: '┃',
// 	endBottom: '┃',
// 	center: '█',
// 	lowerRight: '┛',
// 	lowerLeft: '┗',
// 	upperRight: '┓',
// 	upperLeft: '┏',
// 	topT: '┳',
// 	leftT: '┫',
// 	rightT: '',
// 	centerT: '╋'
// }

export const sumToTileIdMap = {
	2: 1,
	8: 2,
	10: 3,
	11: 4,
	16: 5,
	18: 6,
	22: 7,
	24: 8,
	26: 9,
	27: 10,
	30: 11,
	31: 12,
	64: 13,
	66: 14,
	72: 15,
	74: 16,
	75: 17,
	80: 18,
	82: 19,
	86: 20,
	88: 21,
	90: 22,
	91: 23,
	94: 24,
	95: 25,
	104: 26,
	106: 27,
	107: 28,
	120: 29,
	122: 30,
	123: 31,
	126: 32,
	127: 33,
	208: 34,
	210: 35,
	214: 36,
	216: 37,
	218: 38,
	219: 39,
	222: 40,
	223: 41,
	246: 36,
	248: 42,
	250: 43,
	251: 44,
	254: 45,
	255: 46,
	0: 47
}


// ╔═╗   ╦
// ║#║  ╠╬╣  
// ╚═╝  ╞╩╡

// 8 x 6
export const unicodeBoxTiles = [
	//    0    1
	[' ', '╨', '╡', '╝', '╝', '╞', '╚', '╚'],
	//    7    8
	['═', '╩', '═', '═', '═', '╥', '║', '╗'],
	//    14   15
	['╣', '╣', '╔', '╠', '╠', '╦', ' ', ' '],
	//    21   22  23   24    25
	['═', ' ', '╗', '╣', '║', '╦', ' ', ' '],
	['╬', '╔', '╔', '╠', '║', '╗', '╬', '!'],
	['╣', '╗', '═', '╩', '╚', '╝', ' ', ' ']
]


// happy little accident - makes it look like 3d?!
// export const unicodeBoxTiles = [
// 	['#', '╨', '╡', '╝', '╝', '╞', '╚', '╚'],
// 	['═', '╩', '╩', '╩', '═', '╥', '║', '╗'],
// 	['╣', '╣', '╔', '╠', '╠', '╦', '╬', '╬'],
// 	['╬', '╬', '╗', '╣', '║', '╦', '╬', '╬'],
// 	['╬', '╔', '╔', '╠', '║', '╗', '╬', '╬'],
// 	['╬', '╗', '═', '╩', '╬', '╬', '#', '#']
// ]

export function sumToTile(sum) {
	let arr = unicodeBoxTiles.reduce((a, b) => a.concat(b))
	console.assert(!(sumToTileIdMap[sum] in arr), sumToTileIdMap[sum])
	return !(sumToTileIdMap[sum] in arr) ? sum : arr[sumToTileIdMap[sum]]
}