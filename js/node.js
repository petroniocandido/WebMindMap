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
