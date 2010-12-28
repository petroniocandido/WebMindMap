 
function Node() {
	return {
		position: { x: 0, y: 0, height: 0, width: 0 },
		fill_color: 'white',
		border_color: 'black',
		visible: true,
		content: '',
		parent: null,
		parent_index: 0,
		child: [],
		
		Translate : function(x,y) {
			this.position.x += x;
			this.position.y += y;
			this.RecalculateChild();
		},
		
		AdjustSize : function() { 
			this.position.height = this.content.split('\n').length*30; 
			this.position.width = this.content.length*10 + 10; 
		},
		
		setVisible : function(t) { 
			this.visible = t; 
			return this;
		},
		
		toggleVisible : function() { 
			this.visible = !(this.visible) ; 
			return this;
		},
		
		toggleChildVisible : function() { 
			for(i in this.child)
				this.child[i].toggleVisible();
				
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
			this.child.push(pchild); 
			pchild.parent_index = this.child.length -1;
			this.RecalculateChild();			
			return this;
		},
		
		removeChild : function(pchild) { 
			this.child.splice(pchild.parent_index,1);
			for(i in this.child)
				this.child[i].parent_index = i;
			this.RecalculateChild();			
			return this;
		},
		
		getChildLength : function() {
			return this.child.length;
		},
		
		getTotalHeight : function() {
			var tmp = 0;
			if(this.child.length > 0) {
				for(i in this.child)
					if(this.child[i].visible)
						tmp += parseInt(this.child[i].getTotalHeight());
			}
			else
				tmp = this.position.height;
				
			return tmp;
		},
		
		getTotalWidth : function() {
			var tmp = 0;
			if(this.child.length > 0) {
				for(i in this.child)
					if(this.child[i].visible)
						tmp += parseInt(this.child[i].getTotalWidth());
			}
			else
				tmp = this.position.width;
				
			return tmp;
		},
		
		RecalculateChild : function() {
			if(this.parent != null)
				this.parent.RecalculateChild();
				
			var ypos = parseInt(this.position.y) - (this.getTotalHeight() / 2);
			for(i in this.child)
				if(this.child[i].visible)
				{
					this.child[i].setX(this.getXMax() + 50);
					this.child[i].setY(ypos + this.child[i].getTotalHeight() / 2);				
					ypos += parseInt(this.child[i].getTotalHeight() + this.child[i].getChildLength()*10 + 10) ;
				}
		},
		
		Show : function() {
			CanvasRenderer.drawRect(this);
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
		var tx = x + w/2 - (str.length * 5 / 2);
		var ty = y + h/2;
		printText(str, node.position.x + 10, node.position.y+5);
		
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
		printText(str, node.position.x + 10, centerY);
		
		c.translate(translatex,translatey);
	}

	function drawTree(node) {
		if(node.parent == null) drawElement(node);
		else drawRect(node);
		if(node.getChildLength() > 0)
			for(i in node.child) 
				if(node.child[i].visible)
				{
					drawEdge(node, node.child[i]);
					drawTree(node.child[i]);			
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

		for (var i = 0; i<lines.length; i++)
			c.fillText(lines[i], x, y + (i*lineheight) );
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
				addNode(node_selected,node);
				setSelectedNode(node);
				setEditMode(true);
			}
		}
		
		function getNodeInXY (x,y) {
			return checkNodeInBounds(root,x,y) ;
		}		
		
		function checkNodeInBounds (node, x,y) {
			if(x >= node.getX() && x <= node.getXMax()
				&& y >= node.getY() && y <= node.getYMax())
				return node;
			else {
				for(i in node.child){
					var tmp = checkNodeInBounds(node.child[i],x,y);
					if(tmp != null) return tmp;
				}
			}
			return null;
		}
		
		function changeSelectedToPrevious () {
			if(node_selected != null){
				if(node_selected.parent_index != 0)
					setSelectedNode(node_selected.parent.child[node_selected.parent_index -1]);
				node_selected.Show();
			}
		}
		
		function changeSelectedToNext () {
			if(node_selected != null && node_selected.parent != null){
				if(node_selected.parent_index < node_selected.parent.getChildLength()-1)
					setSelectedNode(node_selected.parent.child[node_selected.parent_index +1]);
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
				if(node_selected.getChildLength() > 0)
					setSelectedNode(node_selected.child[0]);
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
			offsetX = e.pageX - this.offsetLeft;
			offsetY = e.pageY - this.offsetTop;
			$(document).mousemove(OnMouseMove);
		}
		
		function OnMouseUp() {
            $(document).unbind('mousemove');
        }
		
		function OnKeyPressed(e) {
			$('#xy').html("KEY: " + e.keyCode); 
			if(!xMindMap.edit_mode){
				// enter
				if (e.keyCode == '13') {
					if(xMindMap.getSelectedNode() != null){
						var n = new Node();
						n.setParent(xMindMap.getSelectedNode().parent);
						xMindMap.setSelectedNode(n);
					}
				}
				// backspace
				else if (e.keyCode == '8') {
					xMindMap.getSelectedNode().setContent(xMindMap.getSelectedNode().content.substring(0,xMindMap.getSelectedNode().content.length-1));
				}
				// space
				else if (e.keyCode == '32') {
					xMindMap.getSelectedNode().toggleChildVisible();
				}
				// insert
				else if (e.keyCode == '45') {
					var newNode = new Node();
					xMindMap.appendChild(newNode);
				}
				// delete
				else if (e.keyCode == '46') {
					xMindMap.removeSelected();
				}
				// left arrow
				else if (e.keyCode == '37') {
					if(e.ctrlKey)
						xMindMap.getRootNode().Translate(-5,0);
					else	
						xMindMap.changeSelectedToParent();
				}
				// up arrow
				else if (e.keyCode == '38') {
					if(e.ctrlKey)
						xMindMap.getRootNode().Translate(0,-5);
					else 
						xMindMap.changeSelectedToPrevious();
				}
				// right arrow
				else if (e.keyCode == '39') {
					if(e.ctrlKey)
						xMindMap.getRootNode().Translate(5,0);
					else 
						xMindMap.changeSelectedToChild();
				}
				// down arrow
				else if (e.keyCode == '40') {
					if(e.ctrlKey)
						xMindMap.getRootNode().Translate(0,5);
					else 
						xMindMap.changeSelectedToNext();
				}
				/*
				else if ((parseInt(e.keyCode) >= 48 && parseInt(e.keyCode) <= 90) 
					|| (parseInt(e.keyCode) >= 107 && parseInt(e.keyCode) <= 111) 
					|| parseInt(e.keyCode) >= 186 ) {
					xMindMap.selected.appendContent(String.fromCharCode(e.keyCode));
				}
				*/
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