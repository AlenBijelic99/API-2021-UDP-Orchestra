const instrumentSound = new Map([
   ['piano', 'ti-ta-ti'],
   ['trumpet', 'pouet'],
   ['flute', 'trulu'],
   ['violin', 'gzi-gzi'],
   ['drum', 'boum-boum'],
]);

console.log(process.argv[2]);

const instrument = process.argv[2];

const musicianSound = instrumentSound.get(instrument) || null;

console.log(musicianSound);

if(musicianSound == null){
   console.log("ERROR: No such instrument");
   process.exit(1);
}