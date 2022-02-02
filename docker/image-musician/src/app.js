const { v4: uuidv4 } = require('uuid')

// Map of instruments and their sound
const instrumentSound = new Map([
   ['piano', 'ti-ta-ti'],
   ['trumpet', 'pouet'],
   ['flute', 'trulu'],
   ['violin', 'gzi-gzi'],
   ['drum', 'boum-boum'],
]);

// Retrieve instrument passed in argument
const instrument = process.argv[2];

// Retrieve sound of the instrument from the map
const musicianSound = instrumentSound.get(instrument) || null;

// Check if the instrument and the sound exists in the map
if(musicianSound == null){
   console.log("ERROR: No such instrument");
   process.exit(1);
}

// Create uuid for the musician
const musician_uuid = uuidv4()

console.log('UUID : ' + musician_uuid);