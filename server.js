import { log } from "./debug"
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
	await drone.after(3000)
	await drone.land()
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
