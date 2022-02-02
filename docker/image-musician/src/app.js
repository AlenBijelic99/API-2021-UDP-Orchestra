const dgram = require('dgram')
const socket = dgram.createSocket('udp4')
const { v4: uuidv4 } = require('uuid')

// Multicast protocol information
const PROTOCOL = {
   MULTICAST_ADDRESS: "239.255.22.5",
   PORT: 9907
}

// Map of instruments and their sound
const instrumentSound = {
	piano: 'ti-ta-ti',
	trumpet: 'pouet',
	flute: 'trulu',
	violin: 'gzi-gzi',
	drum: 'boum-bpum'
}

if(process.argv.length != 3 || !(process.argv[2] in instrumentSound)){
	console.log(process.argv[0] + " " + process.argv[1] + " " + process.argv[2]);
	console.log("Invalid arguments");
	process.exit(1);
}

// Retrieve instrument passed in argument
const instrument = process.argv[2];

// Retrieve sound of the instrument from the map
const musicianSound = instrumentSound[instrument] || null;

// Check if the instrument and the sound exists in the map
if(musicianSound == null){
   console.log("ERROR: No such instrument");
   process.exit(1);
}

// Create uuid for the musician
const musician_uuid = uuidv4()
console.log('UUID : ' + musician_uuid);

// Play sound every second
setInterval(() => play(musician_uuid, instrument, musicianSound), 1000)

function play(musician_uuid, instrument, musicianSound){
   const data = {
      uuid : musician_uuid,
	  instrument : instrument,
      sound : musicianSound
   }

   const message = JSON.stringify(data);
      socket.send(message, 0, message.length, PROTOCOL.PORT, PROTOCOL.MULTICAST_ADDRESS, function(err, bytes) {
      console.log("Sending payload: " + message + " via port " + socket.address().port);
   });
}