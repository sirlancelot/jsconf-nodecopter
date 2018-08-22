import Express from "express"
import Drone from "./drone"
import { PORT } from "./constants"
import { log } from "./debug"

const server = Express()
const drone = Drone()

server.get("/", async (req, res) => {
	res.send("Engaging drone...")
	await drone.takeoff()
	await drone.after(3000)
	await drone.land()
})

server.listen(PORT, function() {
	log(`Listening on 127.0.0.1:${PORT}`)
})
