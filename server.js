import Express from "express"
import Drone from "./drone"
import { PORT } from "./constants"
import { log } from "./debug"

const server = Express()
const drone = Drone()

server.get("/", (req, res) => {
	res.send("Engaging drone...")
	drone.takeoff()
	setTimeout(() => drone.land(), 3000)
})

server.listen(PORT, function(...args) {
	log(`Listening on 127.0.0.1:${PORT}`)
})
