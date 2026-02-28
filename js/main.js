var UPDATE_TIME_MS = 33;	//33 MS
var GRAVITY = 25;
var MAX_DISPLACEMENT = 3;
var TTL = 3000;	//3sec
var MAX_COMPOUND_STRENGTH = 4;
var MAX_VELOCITY = 1;
var MAX_POPULATION = 100;
var UPDATE_POPULATION_AT_FRAME = 100;	//update population every 100 frames
var SPAWN_LIMIT = 8;	//spawn limit on each run
var canvasWidth = 1024, canvasHeight = 768;	//Default values

var context = null;
var canvas = null;
var compoundSpawnLogic = null;

function main()
{
	if(!Modernizr.canvas)
		return;
		
	calculateScreenSize();
	
	canvas = document.getElementById('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	context = canvas.getContext("2d");
	
	loadContent(context);
	while(!isContentLoaded) {
		//console.log("Loading content...");
	}
	
	canvas.addEventListener('mousemove', onCanvasMouseMove, false);
	//set up a wrapper to pass events to canvas
	var eleBody = document.getElementById('root');
    eleBody.addEventListener('mousemove', onBodyMouseMove, false);
    
	compoundSpawnLogic = new CompoundSpawnLogic();
	setInterval(gameLoop, UPDATE_TIME_MS);	//maintain 30fps
}

function onBodyMouseMove(evt)
{
	evt.stopPropagation();
    var newEvent = document.createEvent("MouseEvents");
    newEvent.initMouseEvent("mousemove", false, true, window, 0, evt.screenX, evt.screenY, evt.clientX, evt.clientY, false, false, false, false, 0, null);
    canvas.dispatchEvent(newEvent);
}

function calculateScreenSize()
{
	if (document.body && document.body.offsetWidth) {
	 canvasWidth = document.body.offsetWidth;
	 canvasHeight = document.body.offsetHeight;
	}
	if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
	 canvasWidth = document.documentElement.offsetWidth;
	 canvasHeight = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
	 canvasWidth = window.innerWidth;
	 canvasHeight = window.innerHeight;
	}	
}

function gameLoop()
{
	//perform update first
	updateCompounds();
	
	//render game objects
	draw();
}

function draw()
{
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	drawCompounds();
}
