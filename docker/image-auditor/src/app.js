const dgram = require('dgram')
const udp_socket = dgram.createSocket('udp4')
const net = require('net')
const moment = require('moment')

// Multicast protocol information
const PROTOCOL = {
   MULTICAST_ADDRESS: "239.255.22.5",
   PORT: 9907,
   TCP_INTERFACE_ADDR: "0.0.0.0",
   TCP_INTERFACE_PORT: 2205,
}

// Map of musicians
let musicians = new Map()

// Map of instruments and their sound
const instrumentSound = new Map([
   ['piano', 'ti-ta-ti'],
   ['trumpet', 'pouet'],
   ['flute', 'trulu'],
   ['violin', 'gzi-gzi'],
   ['drum', 'boum-boum'],
]);

// Bind the UDP server
udp_socket.bind(PROTOCOL.PORT, function() {
   console.log("Joining multicast group");
   udp_socket.addMembership(PROTOCOL.MULTICAST_ADDRESS);
 });

 // Add musician data to musicians map
 udp_socket.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);
   const parsedMessage = JSON.parse(msg.toString());
   musicians.set(parsedMessage.uuid, {instrument: instrumentSound.get(parsedMessage.instrumentSound), send: moment()});
});

// Listening on server
udp_socket.on('listening', () => {
   console.log(`client listening ${client.address().address}:${client.address().port}`)
 })

 // Check if musician is still active
setInterval(removeInactiveMusicians, 1000);

// Remove all musicians that have not send anything since 5 seconds
function removeInactiveMusicians (){
   for(let [key, value] of musicians.entries()){
      if(value.send < moment().substract(5, 'seconds')){
         musicians.delete(key);
      }
   }
}

// TCP server
const server = net.createServer(socket => {
   const data = []
   musicians.forEach((value, key) => data.push({ uuid: key, instrument: value.instrumentSound, send: value.send }))
   socket.write(Buffer.from(JSON.stringify(data)))
   socket.destroy()
 })
 
 server.listen(PROTOCOL.TCP_INTERFACE_PORT, PROTOCOL.TCP_INTERFACE_ADDR)