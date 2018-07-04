const dgram = require('dgram')
const Transform = require('./math/Transform')

const getTime = () => {
	return new Date().getTime()
}

class Client {
	constructor(host = '127.0.0.1', port = 4242, options = {}) {
		this.socket = dgram.createSocket('udp4')
		this.host = host
		this.port = port
		this.paused = options.startPaused ? true : false
		this.transform = new Transform()
		this.lastUpdate = getTime()
		this.delta = 0
		this.onUpdateHandler = () => {}
		this.setUpdateRate(options.updateRate || 250)
	}

	sendUpdate() {
		let currentUpdate = getTime()
		this.delta = (currentUpdate - this.lastUpdate) * 0.001
		this.lastUpdate = currentUpdate
		
		if(this.paused)
			return

		this.socket.send(this.transform.toBuffer(), this.port, this.host)

		if(this.onUpdateHandler)
			this.onUpdateHandler(this.transform, this.delta)
	}

	setPaused(paused = true) {
		this.paused = paused
	}

	onUpdate(onUpdateHandler) {
		this.onUpdateHandler = onUpdateHandler
	}

	getDelta() {
		return this.delta
	}

	getTransform() {
		return this.transform
	}

	setTransform(transform) {
		this.transform = transform
	}

	setUpdateRate(updateRate = 250) {
		this.updateRate = updateRate
		clearInterval(this.interval)
		this.interval = setInterval(() => this.sendUpdate(), 1000 / this.updateRate)
	}

	setHost(host) {
		this.host = host
	}
	setPort(port) {
		this.port = port
	}

	getAddress() {
		return {
			ip: this.host,
			port: this.port
		}
	}

	getAddressString() {
		return `${this.host}:${this.port}`
	}

	close() {
		clearInterval(this.interval)
		this.socket.close()
	}
}

module.exports = Client