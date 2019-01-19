import ROT from 'rot-js'
import { computeBitmaskWalls, sumToTile, key, unkey, getVisibleTiles, createFovDijkstraMap, adjustBrightness } from './helper'
ROT.RNG.setSeed(1234)
const width = 75
const height = 50
const wallColor = '#C1AB89'
const floorColor = 'white'

let mapGenerator, map, player, display
export function init() {
	display = new ROT.Display({
		width,
		height,
		fontFamily: 'Fira Code',
		fontStyle: 'bold',
		fontSize: 16,
		forceSquareRatio: false,
		bg: '#0E3A39'
	})
	map = {}
	mapGenerator = new ROT.Map.Uniform(width, height, { roomWidth: [4, 8], roomHeight: [4, 8], roomDugPercentage: 0.3 })
	mapGenerator.create((x, y, blocked) => {
		map[key(x, y)] = blocked === 1
	})
	let room = mapGenerator.getRooms()[0]
	player = { x: room.getLeft(), y: room.getTop(), visibleTiles: {}, seenTiles: {} }
	addEventHandlers()
}

export function mountCanvas() {
	const container = document.getElementById('canvas_container')
	while (container.firstChild) container.removeChild(canvasContainer.firstChild)
	document.getElementById('canvas_container').appendChild(display.getContainer())
}

const blocked = (x, y) => {
	return key(x, y) in map && map[key(x, y)]
}

const movementHandler = evt => {
	const keyMap = {
		[ROT.VK_TAB]: 'autoexplore',
		// Arrow Pad
		39: 2,
		37: 6,
		38: 0,
		40: 4,
		// Num Pad Movement
		104: 0,
		105: 1,
		102: 2,
		99: 3,
		98: 4,
		97: 5,
		100: 6,
		103: 7,
		// vi movement
		75: 0,
		85: 1,
		76: 2,
		78: 3,
		74: 4,
		66: 5,
		72: 6,
		89: 7
	}
	let { keyCode } = evt
	if (!(keyCode in keyMap)) {
		// invalid key press, retry turn
		return
	}
	evt.preventDefault()
	const action = keyMap[keyCode]
	if (action === 'autoexplore') {
		autoExplore()
	} else {
		let diff = ROT.DIRS[8][action]
		let nx = player.x + diff[0]
		let ny = player.y + diff[1]
		if (!blocked(nx, ny)) {
			player = { ...player, x: nx, y: ny }
			render()
		}
	}
}

export const allExplored = () => {
	return Object.keys(getUnseenTiles(player)).length === 0
}

export const autoExplore = () => {
	window.removeEventListener('keydown', movementHandler)
	const move = (nx, ny) => {
		if (!blocked(nx, ny)) {
			player = { ...player, x: nx, y: ny }
			render()
		}
	}
	const turn = () => {
		if (!allExplored()) {
			let distances = createFovDijkstraMap(player, getUnseenTiles(player), blocked)
			const possiblePositions = []
			ROT.DIRS[8].forEach(([dx, dy]) => {
				if (key(player.x + dx, player.y + dy) in distances) possiblePositions.push([player.x + dx, player.y + dy])
			})
			const [dx, dy] = possiblePositions.sort().reduce(
				(a, b) => {
					const [ax, ay] = a
					const [bx, by] = b
					return distances[key(ax, ay)] <= distances[key(bx, by)] ? a : b
				},
				[player.x, player.y]
			)
			move(dx, dy)
		} else {
			endAutoExplore()
		}
	}

	const exploreInterval = setInterval(() => {
		turn()
	}, 30)

	const endAutoExplore = (...args) => {
		console.log('trying to end autoexplore')
		window.removeEventListener('keydown', endAutoExplore)
		clearInterval(exploreInterval)
		addEventHandlers()
	}
	window.addEventListener('keydown', endAutoExplore)
}

const getUnseenTiles = player => {
	let tiles = {}
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (!player.seenTiles[key(x, y)]) tiles[key(x, y)] = true
	return tiles
}

export function addEventHandlers() {
	window.addEventListener('keydown', movementHandler)
}

// Draw Functions
export function render() {
	display.clear()
	calculatePlayerFov()
	drawDungeonWithFov()
	// drawFov()
	drawDijkstraDistanceTransform()
	drawPlayer()
}

export function drawPlayer() {
	display.draw(player.x, player.y, '@', '#FFFF01')
}

const calculatePlayerFov = () => {
	let visibleTiles = getVisibleTiles(player, 7, map)
	let visibilityMap = {}
	visibleTiles.forEach(({ x, y }) => {
		visibilityMap[key(x, y)] = true
	})
	player.seenTiles = { ...player.visibleTiles, ...player.seenTiles, ...visibilityMap }
	player.visibleTiles = { ...visibilityMap }
}

export function drawFov() {
	console.log(player)
	for (let k of Object.keys(player.visibleTiles)) {
		let [x, y] = unkey(k)
		let fg = map[key(x, y)] ? wallColor : floorColor
		let char = getCharacter(x, y)
		if (player.x === x && player.y === y) {
			char = '@'
			fg = '#FFFF01'
		}
		display.draw(x, y, char, fg, 'rgba(250, 250, 0, 0.3)')
	}
}

export function drawDijkstraDistanceTransform() {
	let distances = createFovDijkstraMap(player, getUnseenTiles(player), blocked)
	for (let k of Object.keys(distances)) {
		if (distances[k] > 0) {
			let [x, y] = unkey(k)
			const distance = distances[k]
			const colors = ['yellow', 'orange', 'red', 'purple', 'blue']
			const mod = distance % 16
			const d = ~~(distance / 16)
			const fg = d < colors.length ? colors[d] : 'white'
			const char = mod.toString(36)
			const brightness = d % 2 === 0 ? 1 - mod / 16 : mod / 16
			display.draw(x, y, char, adjustBrightness(fg, brightness))
		}
	}
}

const getCharacter = (x, y) => {
	if (map[key(x, y)]) return sumToTile(computeBitmaskWalls(x, y, map))
	else if (!map[key(x, y)]) return '.'
}

export function drawDungeon() {
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (map[key(x, y)]) display.draw(x, y, getCharacter(x, y), wallColor)
			else if (!map[key(x, y)]) display.draw(x, y, '.', floorColor)
		}
	}
}

export function drawDungeonWithFov() {
	for (let k of Object.keys(player.seenTiles)) {
		let [x, y] = unkey(k)
		let fg = map[key(x, y)] ? wallColor : floorColor
		let char = getCharacter(x, y)
		display.draw(x, y, char, adjustBrightness(fg, 0.5))
	}

	for (let k of Object.keys(player.visibleTiles)) {
		let [x, y] = unkey(k)
		let fg = map[key(x, y)] ? wallColor : floorColor
		let char = getCharacter(x, y)
		if (player.x === x && player.y === y) {
			char = '@'
			fg = '#FFFF01'
		}
		display.draw(x, y, char, adjustBrightness(fg, 0.9))
	}
}
