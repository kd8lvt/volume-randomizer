//const loudness = require("loudness");
const random = require("random-js");
const engine = random.engines.nativeMath;
const FastSimplexNoise = require("fast-simplex-noise").default;
const voll = require("vol");

const noiseGen = new FastSimplexNoise({frequency:0.01,max:80,min:10,octaves:8});
const biomeGen = new FastSimplexNoise({frequency:0.01,max:7,min:1,octaves:1});

var data = [];

function setVolume(vol) {
	voll.get().then(level => {
		oldVolume = level*100;
		if (oldVolume > vol) {
			for (var i = 0;oldVolume-i>=vol;i++) {
				//console.log("BIGGER");
				var newVolume = (oldVolume-i)/100;
				//loudness.setVolume(newVolume);
				voll.set(newVolume).then(()=>{});
				var waitTill = new Date(new Date().getTime()+0.25*1000);
				while (waitTill > new Date()) {};
				//console.log(newVolume);
			}
		} else if (oldVolume < vol) {
			for (var i = 0;oldVolume+i<=vol;i++) {
				//console.log("SMALLER");
				var newVolume = (oldVolume+i)/100;
				//loudness.setVolume(newVolume);
				voll.set(newVolume).then(()=>{});
				var waitTill = new Date(new Date().getTime()+0.25*1000);
				while (waitTill > new Date()) {};
				//console.log(newVolume);
			}
		}
		setTimeout(function(){
			main();
		},Math.random()*10000);
	});
}

function getNewVolume(x,y) {
	biomeX = x+100;
	biomeY = y+100;
	biome = null;
	
	biomeNatural = false;
	while (!biomeNatural) {
		biomeNatural = true;
		if (biome > 10 || biome == null) {
			biomeRaw = noiseGen.scaled([biomeX,biomeY]);
			biome = (Math.random()*10)*(biomeRaw*1.3)*0.7;
			biomeNatural = false;
		}
	}
	volumeNatural = false;
	volume = null;
	while (!volumeNatural) {
		volumeNatural = true;
		if (volume > 50 || volume<20 || volume == null) {
			volRaw = noiseGen.scaled([x,y]);
			volumeRaw = (Math.random()*10)*(volRaw*1.3)*0.3;
			volume = volumeRaw+biome;
			volumeNatural = false;
		}
	}
	
	return volume;
}

var x = 0;
var y = 0;

function main(){
	x=x+0.01;
	y=y+0.01;
	process.setMaxListeners(0);
	vol = Math.floor(getNewVolume(x,y));
	
	if (vol<=50 && vol>=20) {
		//console.log(vol);
		setVolume(vol);
	} else {
		//console.log(vol);
		main();
	}
}

main();