UIController = (function () {

	var clipboard = "";
	
	function OnMouseClick(e) {
			xMindMap.setEditMode(false);
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			$('#xy').html("X: " + x + " Y: " + y); 
			var n = xMindMap.getNodeInXY(x,y);
			if(n != null){
				xMindMap.setSelectedNode(n);
			}
		}
		
		function OnMouseDblClick(e) {
			xMindMap.setEditMode(true);
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			$('#xy').html("X: " + x + " Y: " + y); 
			var n = xMindMap.getNodeInXY(x,y);
			if(n != null){
				xMindMap.setSelectedNode(n);
			}
		}
		
		var offsetX = 0;
		var offsetY = 0;
		
		function OnMouseMove(e) {
			var x = e.pageX; // - this.offsetLeft;
			var y = e.pageY; //- this.offsetTop;
			$('#xy').html("XX: " + x + " YY: " + y);
			xMindMap.getRootNode().Translate(x - offsetX,y - offsetY);
			xMindMap.Show();
			offsetX = x;
			offsetY = y;
		}
		
		function OnMouseDown(e) {	
			if(e.which == 1){
				offsetX = e.pageX - this.offsetLeft;
				offsetY = e.pageY - this.offsetTop;
				$('#myCanvas').mousemove(OnMouseMove);	
				$('#myCanvas').mouseup(OnMouseUp);
			}
			else {
				$('#myCanvas').unbind('mousemove',OnMouseMove);
			}
		}
		
		function OnMouseUp() {
            $('#myCanvas').unbind('mousemove');
			//return false;
        }
		
		function OnMouseRightButton(action,el,pos) { 
				var sel = xMindMap.getNodeInXY(pos.x,pos.y);
				if(sel != null){
					xMindMap.setSelectedNode(sel);
				}
				if(sel == null) {
					alert('Nenhum item selecionado!');
					return false;
				}
				if(action == 'color'){  
					$('#divColor').css('top',sel.position.y).css('left',sel.position.x).show();
				}
				if(action == 'content'){
					$('#node_content').css('top',sel.position.y).css('left',sel.position.x).show();
					$(document).unbind('keydown');
					$('#txtContent').val(sel.content).focusin();
				}
				if(action == 'insert'){
					var newNode = new Node();
					xMindMap.appendChild(newNode);
					xMindMap.Show();
				}
				if(action == 'delete'){
					xMindMap.removeSelected();
					xMindMap.Show();
				}
				if(action == 'copy'){
					clipboard = xMindMap.copy();					
				}
				if(action == 'cut'){
					clipboard = xMindMap.cut();					
				}
				if(action == 'paste'){
					xMindMap.paste(clipboard);
					xMindMap.Show();
				}
		}
		
		function OnKeyPressed(e) {
			$('#xy').html("KEY: " + e.keyCode); 
			if(!xMindMap.edit_mode){
				switch(parseInt(e.keyCode)){
					// enter
					case 13:
						if(xMindMap.getSelectedNode() != null){
							var n = new Node();
							//n.setParent(xMindMap.getSelectedNode().parent);
							xMindMap.changeSelectedToParent()
							xMindMap.appendChild(n);
							xMindMap.setSelectedNode(n);
						}
						break;
					// backspace
					case 8:
						xMindMap.getSelectedNode().setContent(xMindMap.getSelectedNode().content.substring(0,xMindMap.getSelectedNode().content.length-1));
						break;
					// space
					case 32:
						xMindMap.getSelectedNode().toggleChildremVisible();
						break;
					// insert
					case 45:
						var newNode = new Node();
						xMindMap.appendChild(newNode);
						break;
					// delete
					case 46:
						xMindMap.removeSelected();
						break;
					// left arrow
					case 37:
						if(e.ctrlKey)
							xMindMap.getRootNode().Translate(-5,0);
						else if(e.shiftKey) {
							if(xMindMap.getSelectedNode().parent == xMindMap.getRootNode()){
								xMindMap.toggleDirection();
							}
						}
						else {
							if(xMindMap.getSelectedNode().parent == null && xMindMap.getRootNode().parent_direction == 'right')
								xMindMap.getRootNode().toggleDirection();
							
							if(xMindMap.getRootNode().parent_direction == 'right')
								xMindMap.changeSelectedToParent();
							else
								xMindMap.changeSelectedToChild();
						}
						break;
					// up arrow
					case 38:
						if(e.ctrlKey)
							xMindMap.getRootNode().Translate(0,-5);
						else if(e.altKey)
							xMindMap.moveUp();
						else 
							xMindMap.changeSelectedToPrevious();
						break;
					// right arrow
					case 39:
						if(e.ctrlKey)
							xMindMap.getRootNode().Translate(5,0);
						else if(e.shiftKey) {
							if(xMindMap.getSelectedNode().parent == xMindMap.getRootNode()){
								xMindMap.toggleDirection();
							}
						}
						else {
							if(xMindMap.getSelectedNode().parent == null && xMindMap.getRootNode().parent_direction == 'left')
								xMindMap.getRootNode().toggleDirection();
							
							if(xMindMap.getRootNode().parent_direction == 'right')
								xMindMap.changeSelectedToChild();
							else
								xMindMap.changeSelectedToParent();
						}
						break;
					// down arrow
					case 40:
						if(e.ctrlKey)
							xMindMap.getRootNode().Translate(0,5);
						else if(e.altKey){
							xMindMap.moveDown();
							}
						else {
							xMindMap.changeSelectedToNext();
							}
						break;
					
					default:
						break;
					
				}
				if ((parseInt(e.keyCode) >= 48 && parseInt(e.keyCode) <= 90) 
						|| (parseInt(e.keyCode) >= 107 && parseInt(e.keyCode) <= 111) 
						|| parseInt(e.keyCode) >= 186 ) {
						xMindMap.getSelectedNode().appendContent(String.fromCharCode(e.keyCode));
						}
			}
			else {
				xMindMap.getSelectedNode().appendContent(String.fromCharCode(e.keyCode));
			}
			xMindMap.Show();
		}
		return {
				OnMouseClick:OnMouseClick,
				OnMouseDblClick:OnMouseDblClick,
				OnMouseDown:OnMouseDown,
				OnMouseUp:OnMouseUp,
				OnMouseMove:OnMouseMove,
				OnKeyPressed:OnKeyPressed,
				OnMouseRightButton:OnMouseRightButton
		};
	
 })();
 