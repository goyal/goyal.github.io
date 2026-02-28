
function showResume(path)
{
	window.location.href = path;
}

function navigateToUrl(url)
{
	//window.location.href = url;
	window.open(url, '_blank');
}

function showPopup(element)
{
	var ele = document.createElement('div');
	var frame = document.createElement('iframe');
	frame.setAttribute('id', 'frame');
	frame.setAttribute('src', element.id);
	frame.setAttribute('width', '800');
	frame.setAttribute('height', '600');
	ele.appendChild(frame);
	
	$(ele).dialog({ 
		modal: true,
		resizable:false,
		draggable:false,
		title:element.name,
		width: 840, 
		height: 690,
		hide: 'fadeout',
		autoResize: true,
		closeOnEscape: true,
		close: function() {
			//$("#iframeDialog").dialog("close"); //This will close the dialog but will not remove it from the dom.
			$('.ui-widget-overlay , .ui-dialog, .ui-widget-content', window.parent.document).remove();
		}
	});
}