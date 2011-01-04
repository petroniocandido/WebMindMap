function IncludeJavaScript(jsFile)
{
  document.write('<script type="text/javascript" src="'
    + jsFile + '"></scr' + 'ipt>'); 
}


IncludeJavaScript('js/node.js');
IncludeJavaScript('js/CanvasRenderer.js');
IncludeJavaScript('js/MindMap.js');
IncludeJavaScript('js/UIController.js');

$(document).ready(function() {
	var pai = new Node();
	pai
		.setX(250)
		.setY(200)
		.setContent('Pai - Nó raiz')
		.setFillColor('blue');
	xMindMap.setRootNode(pai);
	xMindMap.Show();
	
	$('#myCanvas')
		.click(UIController.OnMouseClick)
		.dblclick(function() {
			var sel = xMindMap.getSelectedNode();
			$('#node_content').css('top',sel.position.y).css('left',sel.position.x).show();
			$(document).unbind('keydown');
			$('#txtContent').val(sel.content).focusin();
		})
		.mousedown(UIController.OnMouseDown)					
		.mouseup(UIController.OnMouseUp)
		.contextMenu({menu:'ContextMenu'}, UIController.OnMouseRightButton);
	
	$(document).keydown(UIController.OnKeyPressed);
	
	$('#content')
		.focusin(function(){
			$(document).unbind('keydown');
		}).focusout(function(){
			$(document).keydown(UIController.OnKeyPressed);
			$('#content').unbind('keydown');
		}).change(function(){
			xMindMap.getSelectedNode().setContent($('#content').val()); 
			xMindMap.Show();
		}).keydown(function(){
			xMindMap.Show();
		});
	
	$('#node_content').hide();
	
	$('#btnOk').click(function(){
		$(document).keydown(UIController.OnKeyPressed);
		$('#node_content').hide();
		xMindMap.getSelectedNode().setContent($('#txtContent').val());
		xMindMap.Show();
	});
	
	$('#colorpicker').farbtastic(function(color){
		if(xMindMap.getSelectedNode() != null){
			xMindMap.getSelectedNode().setFillColor(color); 
			xMindMap.Show();
		}
	});
	
	$('#divColor').dblclick(function() { $('#divColor').hide('slow'); });
	
	xMindMap.setOnChangeNode(function() { 
		$('#details_panel').hide();
	});
	
	$('#btnExport').click(function() { 
		$('#txtSource').val(xMindMap.toJSON());
	});
	
	$('#btnLoad').click(function() { 
		xMindMap.load($('#txtSource').val());
	});
});
			


 
 