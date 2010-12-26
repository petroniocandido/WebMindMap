/* 
 Display = ( function(pheigth, pwidth) {
	screen_height : pheigth,
	screen_width: pwidth,
	middleX
 }
 );
 */

 function xMindMap() {
	return {
		root: null,
		selected: null,
		selected_lastcolor : 'white',
		bounds : { x_min : 0, x_max : 0, y_min : 0, y_max : 0 },
		OnChangeNodefn : null,
		OnChangeNode : function() {
			if(this.OnChangeNodefn != null)
				this.OnChangeNodefn();
		},
		setOnChangeNode : function(fn) {
			this.OnChangeNodefn = fn;
		},
		
		setRootNode : function(node) {
			this.root = node;
		},
		setSelectedNode : function(node) {
			if(this.selected != null) {
				this.selected.fill_color = this.selected_lastcolor;
			}
			this.selected_lastcolor = node.fill_color;
			this.selected = node;
			this.selected.setFillColor('white');
			this.Show();
			this.OnChangeNode();
		},
		addNode : function(parent,child) {
			child.setParent(parent);
		},
		removeNode : function(node) {
			node.parent.removeChild(node);
		},
		removeSelected : function() {			
			this.removeNode(this.selected);
			this.setSelectedNode(this.selected.parent);
			this.setSelectedNode(this.root);
		},
		appendChild : function(node) {
			if(this.selected != null) {
				this.addNode(this.selected,node);
				this.setSelectedNode(node);
			}
		},
		getNodeInXY : function(x,y) {
			return this.checkNodeInBounds(this.root,x,y) ;
		},		
		checkNodeInBounds : function(node, x,y) {
			if(x >= node.getX() && x <= node.getXMax()
				&& y >= node.getY() && y <= node.getYMax())
				return node;
			else {
				for(i in node.child){
					var tmp = this.checkNodeInBounds(node.child[i],x,y);
					if(tmp != null) return tmp;
				}
			}
			return null;
		},
		changeSelectedToPrevious : function() {
			if(this.selected != null){
				if(this.selected.parent_index != 0)
					this.setSelectedNode(this.selected.parent.child[this.selected.parent_index -1]);
				this.selected.Show();
			}
		},
		changeSelectedToNext : function() {
			if(this.selected != null){
				if(this.selected.parent_index < this.selected.parent.getChildLength()-1)
					this.setSelectedNode(this.selected.parent.child[this.selected.parent_index +1]);
				this.selected.Show();
			}
		},
		changeSelectedToParent : function() {
			if(this.selected != null){
				this.setSelectedNode(this.selected.parent);
				this.selected.Show();
			}
		},
		changeSelectedToChild : function() {
			if(this.selected != null){
				if(this.selected.getChildLength() > 0)
					this.setSelectedNode(this.selected.child[0]);
				this.selected.Show();
			}
		},
		Show : function() {
			clearCanvas();
			drawTree(this.root);
		}
	};
	
 }
 
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
		
		
		AdjustSize : function() { 
			this.position.height = 30; 
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
			drawRect(this);
		}
	};
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
	ctx.fillText(str, tx, ty);

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
	c.fillText(str, tx, centerY);
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
}

function clearCanvas() {
	var canvas=document.getElementById("myCanvas");
	var context=canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  var w = canvas.width;
  canvas.width = 1;
  canvas.width = w;
}