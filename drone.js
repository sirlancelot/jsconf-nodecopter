import ArDrone from "ar-drone"
import { log } from "./debug"

export default function createDrone(options) {
	return new Drone(options)
}

class Drone {
	constructor(options) {
		const drone = this._drone = ArDrone.createClient(options)

		drone.config("control:altitude_max", 3000)
	}

	command(type, hasCb = false, args = []) {
		return new Promise((resolve, reject) => {
			const { _drone } = this
			const method = _drone[type]

			if (!hasCb) {
				log(`Dispatch ${type} (no feedback)`)
				resolve(method.apply(_drone, args))
			} else {
				log(`Dispatch ${type}`)

				const complete = (output) => {
					log(`Completed ${type}`)
					resolve(output)
				}
				method.apply(_drone, args.concat([complete]))
			}
		})
	}

	async after(duration) { return this.command('after', true, [duration]) }
	async createRepl() { return this.command('createRepl') }
	async getPngStream() { return this.command('getPngStream') }
	async getVideoStream() { return this.command('getVideoStream') }
	async resume() { return this.command('resume') }
	async disableEmergency() { return this.command('disableEmergency') }
	async takeoff() { return this.command('takeoff') }
	async land() { return this.command('land') }
	async stop() { return this.command('stop') }
	async calibrate(deviceNum) { return this.command('calibrate', false, [deviceNum]) }
	async ftrim() { return this.command('ftrim') }
	async config(key, value) { return this.command('config', true, [key, value]) }
	async ctrl(mode, other) { return this.command('ctrl', false, [mode, other]) }
	async animate(animation, duration) { return this.command('animate', false, [animation, duration]) }
	async animateLeds(animation, hz, duration) { return this.command('animateLeds', false, [animation, hz, duration]) }
	async battery() { return this.command('battery') }
	async up(speed) { return this.command('up', false, [speed]) }
	async down(speed) { return this.command('down', false, [speed]) }
	async left(speed) { return this.command('left', false, [speed]) }
	async right(speed) { return this.command('right', false, [speed]) }
	async front(speed) { return this.command('front', false, [speed]) }
	async back(speed) { return this.command('back', false, [speed]) }
	async clockwise(speed) { return this.command('clockwise', false, [speed]) }
	async counterClockwise(speed) { return this.command('counterClockwise', false, [speed]) }
}
