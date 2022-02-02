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

// Bind the UDP server
udp_socket.bind(PROTOCOL.PORT, function() {
   console.log("Joining multicast group");
   udp_socket.addMembership(PROTOCOL.MULTICAST_ADDRESS);
 });

 // Add musician data to musicians map
 udp_socket.on('message', function(msg, source) {
	const parsedMessage = JSON.parse(msg.toString());
	
	const lastEmitted = moment().toISOString()
	const activeSince = musicians.has(parsedMessage.uuid) ? musicians.get(parsedMessage.uuid).activeSince : lastEmitted
	
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);
   
   musicians.set(parsedMessage.uuid, {instrument: parsedMessage.instrument, activeSince : activeSince, lastActive : lastEmitted});
});

 // Check if musician is still active
setInterval(removeInactiveMusicians, 1000);

// Remove all musicians that have not send anything since 5 seconds
function removeInactiveMusicians (){
   musicians.forEach((value, key) => {
		
			if(moment().diff(value.lastActive, 's') > 5){
				musicians.delete(key)
			}
		
		})
}

	function sendTCPResponse(socket){
		removeInactiveMusicians();
		
		var output = [];
		
		musicians.forEach((value, key) => {
			output.push({
				uuid: key,
				instrument: value.instrument,
				lastActive: value.lastActive
			})
		})
		
		socket.write(JSON.stringify(output))
		socket.end()
	}

/* TCP server */
tcp_server = net.Server();

// The server listens to a socket for a client to make a connection request.
tcp_server.listen(PROTOCOL.TCP_INTERFACE_PORT, function() {
    console.log("Listening for connection on " + PROTOCOL.TCP_INTERFACE_PORT + ".");
});

//when a client connects via TCP
tcp_server.on('connection', function(socket){
    sendTCPResponse(socket)

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
})
