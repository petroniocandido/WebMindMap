xMindMap = (function () {
		var root = null;
		var node_selected = null;
		var selected_lastcolor = 'white';
		var edit_mode = false;
		var bounds = { x_min : 0, x_max : 0, y_min : 0, y_max : 0 };
		var OnChangeNodefn = null;
	
		function copy() {
			return '[' +node_selected.toJSON()+']';
		}
		
		function cut() {
			var ret = copy();
			removeSelected();
			return ret;			
		}
		
		function paste(src) {
			var obj = eval(src);
			var node = new Node();
			node.eval(obj[0]);
			appendChild(node);
		}
	
		function toggleDirection() {
			root.toggleDirection();
			node_selected.toggleDirection();
		}

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
			//setSelectedNode(root);
		}
		
		function appendChild (node) {
			if(node_selected != null) {
				node_selected.setChildremVisible(true);
				addNode(node_selected,node);
				node.setDirection(node_selected.parent_direction);
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
				if(node_selected.prev_index != null)
					setSelectedNode(node_selected.parent.childrem[node_selected.prev_index]);
				node_selected.Show();
			}
		}
		
		function changeSelectedToNext () {
			if(node_selected != null){
				if(node_selected.next_index != null)
					setSelectedNode(node_selected.parent.childrem[node_selected.next_index]);
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
		
		function toJSON() {
			return "[" + root.toJSON() + "]";
		}
		
		function load(str) {
			var obj = eval(str);
			root.eval(obj[0]);
			Show();
		}
		
		
	return { 	root:root, 
				node_selected: node_selected,
				Show:Show, 
				moveUp:moveUp,
				moveDown:moveDown,
				copy: copy,
				cut: cut,
				paste: paste,
				toggleDirection: toggleDirection,
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
				setOnChangeNode:setOnChangeNode,
				toJSON:toJSON,
				load:load
			};
	
 })();
 