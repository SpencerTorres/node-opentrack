# Node OpenTrack
A package for communicating with opentrack via UDP over network.

# Install
```bash
npm install opentrack
```

# Examples
A couple examples are available in the `/examples` folder for both client and server.

## Client
The client is used when you want to **input** data to opentrack.

```js
const OpenTrack = require('opentrack')
const client = new OpenTrack.Client('127.0.0.1', 4243)

// Called every time data is sent
client.onUpdate((transform, delta) => {
  // The modified transform will be sent on the next update
  transform.rotation.z += delta * 15
})
```

## Server
The server is used when you want to **output** data from opentrack.

```js
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
```

# Documentation

## Client
The client is used to **send** data to opentrack.
```js
Client(host = '127.0.0.1', port = 4242, options = {})
```
- `host` The host address to send data to.
- `port` The port to use.
- `options`
  An object containing optional settings for the client.
  - `updateRate` (default `250`) How many updates to send per second. The default of `250` comes from opentrack's own output system.
  - `startPaused` (default `false`) Should the client start paused? When creating a new client, it will immediately begin sending data.
### Methods
#### onUpdate(handler)
  - `handler` A function to be called when the client sends an update to opentrack.
    - `transform` the current transform of the client.
    - `delta` the time delta since the last update.
    
  When the client sends data, it calls the handler function to allow changes to be applied to the transform object.
  Changes to the transform can be applied outside of the handler function, but it's easier and more game-like to handle it here as it provides the loop and delta time.
#### setPaused(paused)
  - `paused` (default `true`) A boolean to set the paused state of the client.

  When the client is paused, it will not send data, but will continue to loop in the background.
#### setUpdateRate(updateRate)
  - `updateRate` (default `250`) How many updates should be sent to opentrack per second.
  
  The loop is simple and relies on `setInterval`, so there may be a pause when changing the update rate.
#### setHost(host)
  - `host` the host address to send data to.
  
  Unlike the `Server`, the client can easily change its target host and port.
#### setPort(port)
  - `port` the host port to send data to.
#### getDelta()
  Returns the time delta since the last update.
#### getTransform()
  Returns the `Transform` object of the client.
#### setTransform(transform)
  - `transform` The new `Transform` object to be applied to the client.
#### getAddress()
Returns an object containing address data for the server.
- `Object`
  - `ip` string of the server's IP
  - `port` number of the server's port
  - `family` string of IP family (Example: `IPv4`)
#### getAddressString()
Returns a string of the server's address. (Example: `127.0.0.1:4242`)
#### close()
Closes the bound socket and stops the update loop.

## Server
The server is used to **receive** data from opentrack.
```js
Server(host = '127.0.0.1', port = 4242)
```
- `host` The host address to send data to.
- `port` The port to use.

### Events
The server object extends the default `EventEmitter`. Events can be bound like this:
```js
server.on('listening', address => {
  console.log(`Server listening on ${address}`)
})
```
#### listening
- `address` string containing the address of the server. Formatted by `getAddressString()`
Fired when the server begins to listen for data.
#### message
- `transform` a `Transform` object.
Fired when data is received from opentrack.
#### close
Fired when the server socket closes.
#### error
- `error` contains error from socket.
Fired when an error occurs with the server's socket.

### Methods
#### getTransform()
Returns the `transform` of the server. The transform is updated when the server receives an update from opentrack.
#### getAddress()
Returns an object containing address data for the server.
- `Object`
  - `ip` string of the server's IP
  - `port` number of the server's port
  - `family` string of IP family (Example: `IPv4`)
#### getAddressString()
Returns a string of the server's address. (Example: `127.0.0.1:4242`)
#### close()
Closes the bound socket.

## Transform
The Transform object holds data for `position` and `rotation`.
```js
Transform(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0)
```
- `x` x position.
- `y` y position.
- `z` z position.
- `rx` x euler rotation in degrees.
- `ry` y euler rotation in degrees.
- `rz` z euler rotation in degrees.
### Properties
  - `position` A vector object containing the position.
  - `rotation` A vector object containing the euler rotation in degrees.
### Methods
#### Transform.fromBuffer(buffer)
  - 'buffer' A buffer following the opentrack UDP protocol.
  
  Returns a new `Transform` object using data from the buffer.
#### setFromBuffer(buffer)
  - 'buffer' A buffer following the opentrack UDP protocol.
  
  Returns self.
  Sets the transform's data using data from the buffer.
#### setFromTransform(transform)
  - `transform` A Transform object.
  
  Applies the values from the given Transform to the current Transform.
#### toBuffer()
  Returns a new buffer in the format of the opentrack protocol.
#### toString()
  Returns a neatly formatted string for debugging purposes.
  
## Vector
The Transform object holds data for `position` and `rotation`.
```js
Vector(x = 0, y = 0, z = 0)
```
- `x` x value.
- `y` y value.
- `z` z value.

### Properties
  - `x` The x value.
  - `y` The y value.
  - `z` The z value.
### Methods
#### set(x, y, z)
  - `x` The x value to apply.
  - `y` The y value to apply.
  - `z` The z value to apply.
  
  Returns self.
  
# OpenTrack UDP Protocol
This is the format used by opentrack when sending and receiving data.

OpenTrack uses 6 little endian doubles for position and rotation.

48 bytes are used in the following format:

| octet | name       |
|-------|------------|
| 0     | position x |
| 8     | position y |
| 16    | position z |
| 24    | rotation x |
| 32    | rotation y |
| 40    | rotation z |
