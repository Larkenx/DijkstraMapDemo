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

export function computeBitmaskWalls(x, y, freeCells) {
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
	if (free(above) && !free(below) && !free(right) && !free(left) && (free(ll) || free(lr))) {
		return 20
	}
	if (free(below) && !free(above) && !free(right) && !free(left) && (free(ul) || free(ur))) {
		return 21
	}

	// if (!free(left) && !free(right) && free(above) && free(below) && (free(ll) || free(lr))) {
	// 	return 23
	// }
	if (sum == 0) {
		if (free(ul)) return 16
		else if (free(ur)) return 17
		else if (free(ll)) return 18
		else if (free(lr)) return 19
	}

	// if (!free(left) && !free(above) && !free(below) && (free(ur) || free(ll))) {
	// 	return 22
	// }

	// if (!free(right) && !free(above) && !free(below) && (free(ur) || free(ll))) {
	// 	return 23
	// }

	return sum
}

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

// export const unicodeWalls = {
// 	single: ' ',
// 	bottom: '═',
// 	left: '║',
// 	top: '═',
// 	right: '║',
// 	endTop: '╥',
// 	endBottom: '╨',
// 	center: '#',
// 	lowerRight: '╝',
// 	lowerLeft: '╚',
// 	upperRight: '╗',
// 	upperLeft: '╔',
// 	topT: '┳',
// 	leftT: '╠',
// 	rightT: '╣',
// 	centerT: '╬'
// }

export const unicodeWalls = {
	single: ' ',
	bottom: '─',
	left: '|',
	top: '─',
	right: '|',
	endTop: '┬',
	endBottom: '┴',
	center: '#',
	lowerRight: '┘',
	lowerLeft: '└',
	upperRight: '┐',
	upperLeft: '┌',
	topT: '┬',
	leftT: '├',
	rightT: '┤',
	centerT: '┼',
	bottomT: '┴'
}

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
