class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	set(x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z
		
		return this
	}
}

module.exports = Vector
