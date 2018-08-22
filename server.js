import Express from "express"
import drone from "ar-drone"
import { PORT } from "./constants"
import { log } from "./debug"

const server = Express()

server.get("/", (req, res) => {
	res.send("hello world")
})

server.listen(PORT, function(...args) {
	log(`Listening on 127.0.0.1:${PORT}`)
})
