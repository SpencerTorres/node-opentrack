const EventEmitter = require('events').EventEmitter
const dgram = require('dgram')
const Transform = require('./math/Transform')

class Server extends EventEmitter {
	constructor(host = '127.0.0.1', port = 4242) {
		super()
		this.socket = dgram.createSocket('udp4')
		this.host = host
		this.port = port
		this.transform = new Transform()

		this.socket.on('listening', () => {
			this.emit('listening', this.getAddressString())
		})

		this.socket.on('close', (error) => {
			this.emit('close')
		})

		this.socket.on('error', error => {
			this.emit('error', error)
			this.socket.close()
		})

		this.socket.on('message', message => {
			this.emit('transformUpdated', this.transform.setFromBuffer(message))
		})		

		this.socket.bind(this.port, this.host)
	}

	getTransform() {
		return this.transform
	}

	getAddress() {
		let host = this.socket.address()

		return {
			ip: host.address,
			port: host.port,
			family: host.family
		}
	}

	getAddressString() {
		let address = this.getAddress()
		return `${address.ip}:${address.port}`
	}

	close() {
		this.socket.close()
	}
}

module.exports = Server