import ROT from 'rot-js'
import { getWallCharacter, unicodeWalls, computeBitmaskWalls, sumToTile } from './helper'

ROT.RNG.setSeed(1234)
export const width = 70
export const height = 40
export const display = new ROT.Display({ width, height, fontFamily: 'Courier', fontSize: 18, forceSquareRatio: true, bg: '#0E3A39' })
export const mapGenerator = new ROT.Map.Uniform(width, height, { roomWidth: [4, 8], roomHeight: [4, 8], roomDugPercentage: 0.3 })
export const map = {}
const blockedMap = {}

export function mountCanvas() {
	const container = document.getElementById('canvas_container')
	while (container.firstChild) container.removeChild(canvasContainer.firstChild)
	document.getElementById('canvas_container').appendChild(display.getContainer())
}

const key = (x, y) => {
	return x + ',' + y
}
const unkey = k => {
	return k.split(',').map(s => parseInt(s))
}

// const hasFloorAdjacent = (x, y) => ROT.DIRS[8].some(([dx, dy]) => key(x + dx, y + dy) in map && !map[key(x + dx, y + dy)])
const allWallsAdjacent = (x, y) => ROT.DIRS[8].every(([dx, dy]) => !(key(x + dx, y + dy) in blockedMap) || blockedMap[key(x + dx, y + dy)])

export function drawDungeon() {
	mapGenerator.create((x, y, blocked) => {
		blockedMap[key(x, y)] = blocked
	})
	for (let k of Object.keys(blockedMap)) {
		// let [x, y] = unkey(k)
		map[k] = ((k in blockedMap) && blockedMap[k]) //|| allWallsAdjacent(x, y)
	}
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (map[key(x, y)])
				display.draw(x, y, sumToTile(computeBitmaskWalls(x, y, map)), '#C1AB89')
			else if (!map[key(x, y)]) display.draw(x, y, '.')
		}
	}
	// Grab a room and put the player in it
	let room = mapGenerator.getRooms()[0]
	display.draw(room.getLeft(), room.getTop(), '@', '#FFFF01')
}
