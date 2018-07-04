const OpenTrack = require('opentrack')
const client = new OpenTrack.Client('127.0.0.1', 4243)

// Called every time data is sent
client.onUpdate((transform, delta) => {
	// The modified transform will be sent on the next update
	transform.rotation.z += delta * 15
})
