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
		var ax = (nodeB.parent_direction == 'right') ? nodeA.getXMax() : nodeA.position.x;
		var ay = nodeA.position.y+nodeA.position.height/2;
		var bx = (nodeB.parent_direction == 'right') ? nodeB.position.x : nodeB.getXMax();
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
