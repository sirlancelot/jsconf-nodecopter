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

	async close() {
		await this.stop()
		await this.delay(800)

		const drone = this._drone
		drone._udpControl.close()
		drone._udpNavdatasStream.destroy()
	}

	command(type, hasCb = false, args = []) {
		return new Promise((resolve) => {
			const drone = this._drone
			const method = drone[type]

			if (!hasCb) {
				log(`Dispatch ${type} (no feedback)`)
				resolve(method.apply(drone, args))
			} else {
				log(`Dispatch ${type}`)

				const complete = (output) => {
					log(`Completed ${type}`)
					resolve(output)
				}
				method.apply(drone, args.concat([complete]))
			}
		})
	}

	delay(duration) {
		return new Promise((resolve) => setTimeout(resolve, duration))
	}

	on(...args) {
		return this._drone.on(...args)
	}

	async animate(animation, duration) { return this.command('animate', false, [animation, duration]) }
	async animateLeds(animation, hz, duration) { return this.command('animateLeds', false, [animation, hz, duration]) }
	async back(speed) { return this.command('back', false, [speed]) }
	async battery() { return this.command('battery') }
	async calibrate(deviceNum) { return this.command('calibrate', false, [deviceNum]) }
	async clockwise(speed) { return this.command('clockwise', false, [speed]) }
	async config(key, value) { return this.command('config', true, [key, value]) }
	async counterClockwise(speed) { return this.command('counterClockwise', false, [speed]) }
	async createRepl() { return this.command('createRepl') }
	async ctrl(mode, other) { return this.command('ctrl', false, [mode, other]) }
	async disableEmergency() { return this.command('disableEmergency') }
	async down(speed) { return this.command('down', false, [speed]) }
	async front(speed) { return this.command('front', false, [speed]) }
	async ftrim() { return this.command('ftrim') }
	async getPngStream() { return this.command('getPngStream') }
	async getVideoStream() { return this.command('getVideoStream') }
	async land() { return this.command('land') }
	async left(speed) { return this.command('left', false, [speed]) }
	async resume() { return this.command('resume') }
	async right(speed) { return this.command('right', false, [speed]) }
	async stop() { return this.command('stop') }
	async takeoff() { return this.command('takeoff') }
	async up(speed) { return this.command('up', false, [speed]) }
}
