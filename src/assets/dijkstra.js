import ROT from 'rot-js'
import { computeBitmaskWalls, sumToTile, key, unkey, getVisibleTiles, createFovDijkstraMap } from './helper'
ROT.RNG.setSeed(1234)
const width = 70
const height = 40
const wallColor = '#C1AB89'
const floorColor = 'white'

let mapGenerator, map, player, display
export function init() {
	display = new ROT.Display({
		width,
		height,
		fontFamily: 'Fira Code',
		fontStyle: 'bold',
		fontSize: 24,
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
	let diff = ROT.DIRS[8][action]
	let nx = player.x + diff[0]
	let ny = player.y + diff[1]
	if (!blocked(nx, ny)) {
		player = { ...player, x: nx, y: ny }
		render()
	}
}

const getUnseenTiles = player => {
	let tiles = {}
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (!player.visibleTiles[key(x, y)]) tiles[key(x, y)] = true
	console.log(tiles)
	return tiles
}

export function addEventHandlers() {
	window.addEventListener('keydown', movementHandler)
}

// Draw Functions
export function render() {
	display.clear()
	calculatePlayerFov()
	drawDungeon()
	drawFov()
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
	player.seenTiles = { ...player.visibleTiles, ...player.seenTiles }
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
			display.draw(x, y, distances[k].toString(36))
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

export function drawDungeonWithFov(fov) {
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (!fov[key(x, y)]) {
				if (map[key(x, y)]) display.draw(x, y, getCharacter(x, y), wallColor)
				else if (!map[key(x, y)]) display.draw(x, y, '.', floorColor)
			}
		}
	}
}
