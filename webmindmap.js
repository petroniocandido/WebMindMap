/* 
 Display = ( function(pheigth, pwidth) {
	screen_height : pheigth,
	screen_width: pwidth,
	middleX
 }
 );
 */
 
function Node() {
	return {
		position: { x: 0, y: 0, height: 0, width: 0 },
		fill_color: 'white',
		border_color: 'black',
		content: '',
		parent: null,
		child: [],
		
		AdjustSize : function() { 
			this.position.height = 30; 
			this.position.width = this.content.length*5 + 10; 
		},
		
		setX : function(px) { 
			this.position.x = px; 
			return this;
		},
				
		setY : function(py) { 
			this.position.y = py; 
			return this;
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
		
		setParent : function(pparent) { 
			if(pparent != null) {
				this.parent = pparent; 
				pparent.addChild(this); 
			}
			return this;
		},
		
		addChild : function(pchild) { 
			this.child.push(pchild); 
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
					tmp += parseInt(this.child[i].getTotalHeight());
			}
			else
				tmp = this.position.height;
				
			return tmp;
		},
		
		RecalculateChild : function() {
			var ypos = parseInt(this.position.y) - (this.getTotalHeight() / 2);
			for(i in this.child){
				this.child[i].setX(this.getXMax() + 50);
				this.child[i].setY(ypos + this.child[i].getTotalHeight()/2);
				ypos += parseInt(this.child[i].getTotalHeight() + this.child[i].getChildLength()*10 + 10) ;
			}
		}
	};
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
	drawElement(node);
	if(node.getChildLength() > 0)
		for(i in node.child) {
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