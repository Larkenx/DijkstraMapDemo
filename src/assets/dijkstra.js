import ROT from 'rot-js'
import { getWallCharacter, unicodeWalls, computeBitmaskWalls } from './helper'

ROT.RNG.setSeed(1234)
export const width = 70
export const height = 40
export const display = new ROT.Display({ width, height, fontFamily: 'monospace', forceSquareRatio: false, bg: '#0E3A39' })
export const mapGenerator = new ROT.Map.Uniform(width, height, { roomWidth: [4, 8], roomHeight: [4, 8], roomDugPercentage: 0.3 })
export const map = {}

export function mountCanvas() {
	const container = document.getElementById('canvas_container')
	while (container.firstChild) container.removeChild(canvasContainer.firstChild)
	document.getElementById('canvas_container').appendChild(display.getContainer())
}

const key = (x, y) => {
	return x + ',' + y
}

const hasFloorAdjacent = (x, y) => ROT.DIRS[8].some(([dx, dy]) => key(x + dx, y + dy) in map && !map[key(x + dx, y + dy)])

export function drawDungeon() {
	mapGenerator.create((x, y, blocked) => {
		map[key(x, y)] = blocked
	})
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (map[key(x, y)] && hasFloorAdjacent(x, y))
				display.draw(x, y, getWallCharacter(unicodeWalls, computeBitmaskWalls(x, y, map)), '#C1AB89')
			else if (!map[key(x, y)]) display.draw(x, y, '.')
		}
	}
	// Grab a room and put the player in it
	let room = mapGenerator.getRooms()[0]
	display.draw(room.getLeft(), room.getTop(), '@', '#FFFF01')
}
