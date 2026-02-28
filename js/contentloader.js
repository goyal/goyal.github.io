var contentToLoad = new Array("l.png", "t.png", "n.png", "l-sm.png", "t-sm.png", "n-sm.png");
var totalCompounds = contentToLoad.length / 2;
var content = new Array();
var totalContentToLoad = contentToLoad.length;
var totalContentLoaded = 0;

function loadContent(context)
{
	for(var idx = 0; idx < contentToLoad.length; idx++)
	{
		var image = new Image();
		image.src = "images/games/web/" + contentToLoad[idx];
		image.onload = function() {
			++totalContentLoaded;
		}
		content[idx] = image;
	}
}

function isContentLoaded()
{
	return (totalContentLoaded == totalContentToLoad);
}

function getContentById(id)
{
	return (id < 0) ? null : content[id];
}

function getSubContentById(id)
{
	return (id < 0) ? null : content[id + totalCompounds];
}