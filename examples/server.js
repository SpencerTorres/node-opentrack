const OpenTrack = require('opentrack')
const server = new OpenTrack.Server('127.0.0.1', 4242)

// Called when the server is listening
server.on('listening', address => {
    console.log(`Server listening on ${address}`)
})

// Called every time opentrack sends an update
server.on('transformUpdated', transform => {
	console.log(transform.toString())
})
