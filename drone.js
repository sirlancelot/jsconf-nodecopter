import ArDrone from "ar-drone"

export default function Drone(options) {
	const drone = ArDrone.createClient(options)

	drone.config("control:altitude_max", 3000)

	return drone
}
