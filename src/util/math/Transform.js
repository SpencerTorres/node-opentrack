const Vector = require('./Vector')

class Transform {
	constructor(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
		this.position = new Vector(x, y, z)
		this.rotation = new Vector(rx, ry, rz)
	}
	
	static fromBuffer(buf) {
		return new Transform(
			// Position
			buf.readDoubleLE(0),
			buf.readDoubleLE(8),
			buf.readDoubleLE(16),

			// Rotation
			buf.readDoubleLE(24),
			buf.readDoubleLE(32),
			buf.readDoubleLE(40)
		)
	}

	setFromBuffer(buf) {
		this.setFromTransform(Transform.fromBuffer(buf))
		return this
	}

	setFromTransform(transform) {
		this.position.set(transform.position.x, transform.position.y, transform.position.z)
		this.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z)

		return this
	}

	toBuffer() {
		let buf = new Buffer(48)

		// Position
		buf.writeDoubleLE(this.position.x, 0)
		buf.writeDoubleLE(this.position.y, 8)
		buf.writeDoubleLE(this.position.z, 16)

		// Rotation
		buf.writeDoubleLE(this.rotation.x, 24)
		buf.writeDoubleLE(this.rotation.y, 32)
		buf.writeDoubleLE(this.rotation.z, 40)

		return buf
	}

	toString() {
		return (
			`${this.position.x}\t${this.rotation.x}\n` +
			`${this.position.y}\t${this.rotation.y}\n` +
			`${this.position.z}\t${this.rotation.z}`
		)
	}
}

module.exports = Transform
