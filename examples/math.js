const OpenTrack = require('opentrack')

let transform = new OpenTrack.Transform(1, 2, 3, 4, 5, 6)

transform.position.x = 2
transform.position.y += 16
transform.position.z -= 21

transform.rotation = new OpenTrack.Vector(15, 45, 90)

console.log(transform.toString())
