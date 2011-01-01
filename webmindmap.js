
function Node() {
	return {
		//id : 0,
		position: { x: 0, y: 0, height: 0, width: 0 },
		fill_color: 'white',
		border_color: 'black',
		visible: true,
		content: '',
		parent: null,
		parent_index: 0,
		childrem: [],
		
		Translate : function(x,y) {
			this.position.x += x;
			this.position.y += y;
			for(i in this.childrem)
				this.childrem[i].Translate(x,y);
		},
		
		AdjustSize : function() { 
			var lines = this.content.split('\n');
			this.position.height = (lines.length > 0) ? (lines.length+1)*15 : 15;
			var max = 0;
			for(i in lines)
				if(max < lines[i].length)
					max = lines[i].length;
			this.position.width = max*10 + 10; 
		},
		
		setVisible : function(t) { 
			this.visible = t; 
			return this;
		},
		
		toggleVisible : function() { 
			this.visible = !(this.visible) ; 
			return this;
		},
		
		toggleChildremVisible : function() { 
			for(i in this.childrem)
				this.childrem[i].toggleVisible();
			this.RecalculateChildrem(true);	
			return this;
		},
		
		setChildremVisible : function(t) { 
			for(i in this.childrem)
				this.childrem[i].setVisible(t);
				
			return this;
		},
		
		setX : function(px) { 
			this.position.x = px; 
			return this;
		},
				
		setY : function(py) { 
			this.position.y = py; 
			return this;
		},
		
		getX : function() { 
			return this.position.x;
		},
		
		getY : function() { 
			return this.position.y;
		},
		
		getXMax : function() { 
			return this.position.x + this.position.width;
		},
		
		getYMax : function() { 
			return this.position.y + this.position.height;
		},
				
		setFillColor : function(color) { 
			this.fill_color = color; 
			return this;
		},
		
		setBorderColor : function(color) { 
			this.border_color = color; 
			return this;
		},
		
		setContent : function(c) { 
			this.content = c; 
			this.AdjustSize();
			return this;
		},
		
		appendContent : function(c) { 
			this.content = this.content+c; 
			this.AdjustSize();
			return this;
		},
		
		setParent : function(pparent) { 
			if(pparent != null) {
				this.parent = pparent; 
				pparent.addChild(this); 
			}
			return this;
		},
		
		addChild : function(pchild) { 
			this.childrem.push(pchild); 
			pchild.parent_index = this.childrem.length -1;
			this.RecalculateChildrem(true);			
			return this;
		},
		
		removeChild : function(pchild) { 
			this.childrem.splice(pchild.parent_index,1);
			for(i in this.childrem)
				this.childrem[i].parent_index = i;
			this.RecalculateChildrem(true);			
			return this;
		},
		
		swapChildPosition : function(indexA,indexB) {
			if(indexA >= 0 && indexA < this.getChildremLength() && indexB >= 0 && indexB < this.getChildremLength()){
				var childA = this.childrem[indexA];
				childA.parent_index = indexB;
				var childB = this.childrem[indexB];
				childB.parent_index = indexA;
				this.childrem[indexA] = childB;
				this.childrem[indexB] = childA;
			}
		},
		
		getChildremLength : function() {
			return this.childrem.length;
		},
		
		getTotalHeight : function() {
			var tmp = 0;
			if(this.childrem.length > 0) {
				for(i in this.childrem)
					if(this.childrem[i].visible)
						tmp += parseInt(this.childrem[i].getTotalHeight());
			}
			else
				tmp = this.position.height;
				
			return tmp;
		},
		
		getTotalWidth : function() {
			var tmp = 0;
			if(this.childrem.length > 0) {
				for(i in this.childrem)
					if(this.childrem[i].visible)
						tmp += parseInt(this.childrem[i].getTotalWidth());
			}
			else
				tmp = this.position.width;
				
			return tmp;
		},
		
		RecalculateChildrem : function(fromroot) {
			if(this.parent != null && fromroot)
				this.parent.RecalculateChildrem(true);
				
			var ypos = parseInt(this.position.y) - (this.getTotalHeight() / 2);
			for(i in this.childrem){
				var childnode = this.childrem[i];
				if(childnode.visible)
				{
					childnode.setX(this.getXMax() + 50);
					childnode.setY(ypos + childnode.getTotalHeight() / 2);				
					ypos += parseInt(childnode.getTotalHeight() + childnode.getChildremLength()*10 + 10);
					childnode.RecalculateChildrem(false);
				}
			}
		},
		
		Show : function() {
			CanvasRenderer.drawRect(this);
		},
		
		toJSON : function() {
			var chldrm = '';
			for(i in this.childrem)
				chldrm += ((chldrm.length > 0)? ',' : '') + this.childrem[i].toJSON() ;
			
			var ret = "{" +
				"position: { x:" + this.position.x +",y:" + this.position.y +",width:" + this.position.width +",height:" + this.position.height +" },"+
				"fill_color: '" + this.fill_color+"',"+
				"border_color: '" + this.border_color+"',"+
				"visible:" + this.visible+","+
				"content: '" + this.content+"',"+
				"childrem: [" + chldrm +"]}";
			
			return ret;
		},
		
		eval : function(str) {
			this.childrem = [];
			this.parent = null;
			this.parent_index = 0;
			this.position = str.position;
			this.fill_color = str.fill_color;
			this.border_color = str.border_color;
			this.visible = str.visible;
			this.content = str.content;
			for(i = 0; i < str.childrem.length; i++){
				var n = new Node();
				n.eval(str.childrem[i]);
				n.setParent(this);
			}
		}
	};
 }

 CanvasRenderer = (function () {
	 var translatex = 0;
	 var translatey = 0;
	 
	 function setTranslate(x,y) {
		translatex += x;
		translatey += y;
	 }
	 
	 function drawRect(node) {
		var canvas=document.getElementById("myCanvas");
		var ctx=canvas.getContext("2d");
		var x = node.position.x;
		var y = node.position.y;
		var w = node.position.width;
		var h = node.position.height;
		ctx.beginPath();
		ctx.moveTo(x+10, y);
		ctx.lineTo(x+w-10, y);
		ctx.quadraticCurveTo(x+w, y, x+w, y+10);
		ctx.lineTo(x+w, y+h-10);
		ctx.quadraticCurveTo(x+w, y+h, x+w-10, y+h);
		ctx.lineTo(x+10, y+h);
		ctx.quadraticCurveTo(x, y+h, x, y+h-10);
		ctx.lineTo(x, y+10);
		ctx.quadraticCurveTo(x, y, x+10, y);
		ctx.fillStyle=node.fill_color;
		ctx.fill();
		ctx.lineWidth=1;
		ctx.strokeStyle=node.border_color; 
		ctx.stroke();	
		ctx.closePath();
		
		ctx.fillStyle='black';
		var str = node.content;
		var tx = x + w/2; // - (str.length * 5 / 2);
		var ty = y + h/2;
		printText(str, tx, ty);
		
		ctx.translate(translatex,translatey);

	 }
	  
	function drawElement(node) {
		var canvas=document.getElementById("myCanvas");
		var c=canvas.getContext("2d");
	 
		// define center of oval
		var centerX = parseInt(node.position.x+node.position.width/2);
		var centerY = parseInt(node.position.y+node.position.height/2);
	 
		// define size of oval
		var height =  parseInt(node.position.height);
		var width = parseInt(node.position.width);
	 
		var controlRectWidth = width * 1.33;
	 
		c.beginPath();
		c.moveTo(centerX,centerY - height/2);
		// draw left side of oval
		c.bezierCurveTo(centerX-controlRectWidth/2,centerY-height/2,
			centerX-controlRectWidth/2,centerY+height/2,
			centerX,centerY+height/2);
	 
		// draw right side of oval
		c.bezierCurveTo(centerX+controlRectWidth/2,centerY+height/2,
			centerX+controlRectWidth/2,centerY-height/2,
			centerX,centerY-height/2);
	 
		c.fillStyle=node.fill_color;
		c.fill();
		c.lineWidth=1;
		c.strokeStyle=node.border_color; 
		c.stroke();	
		c.closePath();
		
		c.fillStyle='black';
		var str = node.content;
		var tx = centerX - (str.length * 5 / 2);
		printText(str, centerX, centerY);
		
		c.translate(translatex,translatey);
	}

	function drawTree(node) {
		if(node.parent == null) drawElement(node);
		else drawRect(node);
		if(node.getChildremLength() > 0)
			for(i in node.childrem) 
				if(node.childrem[i].visible)
				{
					drawEdge(node, node.childrem[i]);
					drawTree(node.childrem[i]);			
				}
	}

	function drawEdge(nodeA, nodeB) {
		var canvas=document.getElementById("myCanvas");
		var context=canvas.getContext("2d");
		var ax = nodeA.getXMax();
		var ay = nodeA.position.y+nodeA.position.height/2;
		var bx = nodeB.position.x;
		var by = nodeB.position.y + nodeB.position.height/2;
		context.beginPath();
		context.strokeStyle='rgb(0,0,0)';
		context.moveTo(ax,ay);
		context.bezierCurveTo(ax-10,ay-10,bx-10,by-10,bx,by);
		context.stroke();
		context.translate(translatex,translatey);
	}
	
	function printText(content, x, y) {
		var canvas=document.getElementById("myCanvas");
		var c=canvas.getContext("2d");
		var lineheight = 15;
		var lines = content.split('\n');
		var offset = (lines.length > 0)? lines.length*lineheight / 2 : 0;
		for (var i = 0; i<lines.length; i++)
			c.fillText(lines[i], x-(lines[i].length*5)/2, y + (i*lineheight) - offset );
	}

	function clearCanvas() {
		var canvas=document.getElementById("myCanvas");
		var context=canvas.getContext("2d");
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  var w = canvas.width;
	  canvas.width = 1;
	  canvas.width = w;
	}
	return {
			clearCanvas:clearCanvas,
			drawEdge: drawEdge,
			drawTree: drawTree,
			drawElement:drawElement,
			drawRect: drawRect,
			printText:printText,
			setTranslate:setTranslate
		};
 })();
 
 xMindMap = (function () {
		var root = null;
		var node_selected = null;
		var selected_lastcolor = 'white';
		var edit_mode = false;
		var bounds = { x_min : 0, x_max : 0, y_min : 0, y_max : 0 };
		var OnChangeNodefn = null;

		function setEditMode(t) {
			edit_mode = t;
		}
		
		function toggleEditMode() {
			edit_mode = !(edit_mode);
		}
		
		function OnChangeNode () {
			if(OnChangeNodefn != null)
				OnChangeNodefn();
		}
		
		function setOnChangeNode(fn) {
			OnChangeNodefn = fn;
		}
		
		function setRootNode (node) {
			root = node;
			setSelectedNode(root);
		}
		function getRootNode () {
			return root;
		}
		
		function setSelectedNode(node) {
			if(node != null) {
				if(node_selected != null) {
					node_selected.border_color = selected_lastcolor;
				}
				selected_lastcolor = node.border_color;
				node_selected = node;
				node_selected.setBorderColor('red');
				Show();
				OnChangeNode();
			}
		}
		
		function getSelectedNode() {
			return node_selected;
		}
		
		function addNode(parent,child) {
			child.setParent(parent);
		}
		
		function removeNode(node) {
			if(node.parent != null)
				node.parent.removeChild(node);
		}
		
		function removeSelected () {			
			removeNode(node_selected);
			setSelectedNode(node_selected.parent);
			setSelectedNode(root);
		}
		
		function appendChild (node) {
			if(node_selected != null) {
				node_selected.setChildremVisible(true);
				addNode(node_selected,node);
				setSelectedNode(node);
				setEditMode(true);
			}
		}
		
		function moveUp() {
			if(node_selected.parent_index > 0)
				node_selected.parent.swapChildPosition(node_selected.parent_index,node_selected.parent_index-1);
		}
		
		function moveDown() {
			if(node_selected.parent_index < node_selected.parent.getChildremLength())
				node_selected.parent.swapChildPosition(node_selected.parent_index,node_selected.parent_index+1);
		}
		
		function getNodeInXY (x,y) {
			return checkNodeInBounds(root,x,y) ;
		}		
		
		function checkNodeInBounds (node, x,y) {
			if(x >= node.getX() && x <= node.getXMax()
				&& y >= node.getY() && y <= node.getYMax())
				return node;
			else {
				for(i in node.childrem){
					var tmp = checkNodeInBounds(node.childrem[i],x,y);
					if(tmp != null) return tmp;
				}
			}
			return null;
		}
		
		function changeSelectedToPrevious () {
			if(node_selected != null){
				if(node_selected.parent_index != 0)
					setSelectedNode(node_selected.parent.childrem[node_selected.parent_index -1]);
				node_selected.Show();
			}
		}
		
		function changeSelectedToNext () {
			if(node_selected != null && node_selected.parent != null){
				if(node_selected.parent_index < node_selected.parent.getChildremLength()-1)
					setSelectedNode(node_selected.parent.childrem[node_selected.parent_index +1]);
				node_selected.Show();
			}
		}
		
		function changeSelectedToParent () {
			if(node_selected != null){
				setSelectedNode(node_selected.parent);
				node_selected.Show();
			}
		}
		
		function changeSelectedToChild () {
			if(node_selected != null){
				if(node_selected.getChildremLength() > 0)
					setSelectedNode(node_selected.childrem[0]);
				node_selected.Show();
			}
		}
		
		function Show () {
			CanvasRenderer.clearCanvas();
			CanvasRenderer.drawTree(root);
		}
		
		
	return { 	root:root, 
				node_selected: node_selected,
				Show:Show, 
				moveUp:moveUp,
				moveDown:moveDown,
				changeSelectedToChild:changeSelectedToChild,
				changeSelectedToParent:changeSelectedToParent,
				changeSelectedToNext:changeSelectedToNext,
				changeSelectedToPrevious: changeSelectedToPrevious,
				getNodeInXY:getNodeInXY,
				checkNodeInBounds:checkNodeInBounds,
				OnChangeNode:OnChangeNode,
				appendChild:appendChild,
				removeSelected:removeSelected,
				setEditMode:setEditMode,
				toggleEditMode: toggleEditMode,
				removeNode:removeNode,
				addNode:addNode,
				setRootNode: setRootNode,
				getRootNode: getRootNode,
				setSelectedNode: setSelectedNode,
				getSelectedNode: getSelectedNode,
				setOnChangeNode:setOnChangeNode				
			};
	
 })();
 
 UIController = (function () {
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
				$(document).mousemove(OnMouseMove);			
			}
		}
		
		function OnMouseUp() {
            $(document).unbind('mousemove');
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
						else	
							xMindMap.changeSelectedToParent();
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
						else 
							xMindMap.changeSelectedToChild();
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
				OnKeyPressed:OnKeyPressed
		};
	
 })();