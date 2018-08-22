import { log } from "./debug"
import throttle from "mout/function/throttle"
import Express from "express"
import http from "http"
import Drone from "./drone"
import { PORT } from "./constants"

const app = Express()
const drone = Drone()
var shutdown = false

// Don't accept any more connections if we're shutting down
app.use((req, res, next) => void (shutdown || next()))

// =============================================================================
// HTTP Routes

app.get("/", async (req, res) => {
	res.send("Engaging drone...")
	await drone.takeoff()
	await drone.delay(10000)
	await drone.land()
})

app.get("/battery", async (req, res) => {
	const battery = await drone.battery()
	res.send(`Battery: ${battery}`)
})

// =============================================================================
// Start listening for requests
const server = http.createServer(app)
server.listen(PORT, function() {
	log(`Listening on 127.0.0.1:${PORT}`)
})

process.on("SIGINT", async () => {
	log(`Shutting down...`)
	shutdown = true
	await server.close()
	await drone.close()
	log(`Byeeee`)
	process.exit()
})

// =============================================================================
// Listen for navdata from the drone
drone.on("lowBattery", throttle((val) => log(`Low Battery: ${val}%`), 10000))
drone.on("error", (err) => log(err))
