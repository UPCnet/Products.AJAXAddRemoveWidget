/*
 * Helper javascript function for addremove widget;
 */
 

// add input from an inputbox
function addremove_addNewItem(field) {

  	var inputBox   = document.getElementById(field + "_new");
  	var targetList = document.getElementById(field + "_selected");
  
 	if(_addremove_addToList(targetList, inputBox.value, inputBox.value)) {
  		_addremove_updateSubmitField(field);
		inputBox.value = "";
		return true;
	} else {
		return false;
	}
}

// add the selected item from the "from" box to the "to" box
function addremove_addItem(field) {

	var sourceList = document.getElementById(field + "_unselected");
	var targetList = document.getElementById(field + "_selected");
	
	var idx = sourceList.selectedIndex;

	if(_addremove_moveItem(sourceList, idx, targetList)) {
		_addremove_updateSubmitField(field);
		return true;
	} else {
		return false;
	}

}

// remove the selected item from to "to" box and put it in the "from" box
function addremove_removeItem(field) {

	var sourceList = document.getElementById(field + "_selected");
	var targetList = document.getElementById(field + "_unselected");
	
	var idx = sourceList.selectedIndex;

	if(_addremove_moveItem(sourceList, idx, targetList)) {
		_addremove_updateSubmitField(field);
		return true;
	} else {
		return false;
	}

}

/*
 * Helper functions
 */
 
// Move an item from one list to another
function _addremove_moveItem(sourceList, idx, targetList) {

  var success = false;

  if(idx >= 0) {
	success = _addremove_addToList(targetList, 
									sourceList[idx].text, 
  								    sourceList[idx].value)
  	if(success)
	  sourceList[idx] = null;
  } else {
    alert(string_addremove_moveItem);
  }

  return success;
}

// add a new item to the given list
function _addremove_addToList(targetList, newText, newValue) {

  	// ensure we don't have it already
  	for(var i = 0; i < targetList.length; ++i) {
    	if(targetList[i].text == _trimString(newText) || 
    	        targetList[i].value == _trimString(newValue))
      	    return false;
  	}
  
  	newIdx = targetList.length;
  
  	targetList[newIdx]       = new Option(_trimString(newText));
  	targetList[newIdx].value = _trimString(newValue);
	
	_addremove_sortListBox(targetList);

  	return true;
}

// update the hidden field we use to actually submit the values as a pipe-
//  separated list
function _addremove_updateSubmitField(field) {

	var submitContainer  = document.getElementById(field + "_container");
	var selectedList = document.getElementById(field + "_selected");
	
	// get rid of the hidden fields we have now
	while(submitContainer.hasChildNodes()) {
        var node = submitContainer.childNodes[0];
        var removed = submitContainer.removeChild(node);
	}

    // Then add them
	for(var i = 0; i < selectedList.length; ++i) {
	    var value = selectedList[i].value;
	    var node = document.createElement('input');
	    node.type = "hidden";
	    node.name = field + ":list";
		node.value = value;
		submitContainer.appendChild(node);
	}
	
}

// Sort the submit box
function _addremove_sortListBox(list) {

	options = Array();

	if(list.options == null)
		return;

	for(var i = 0; i < list.options.length; ++i) {
		options[options.length] = new Option(list.options[i].text, 
											 list.options[i].value, 
											 list.options[i].defaultSelected, 
											 list.options[i].selected);
	}

	if(options.length == 0)
		return;

	options = options.sort( 
		function(a, b) { 
			if((a.text+"") < (b.text+"")) return -1;
			if((a.text+"") > (b.text+"")) return  1;
			return 0;
			} 
		);

	for(var i = 0; i < options.length; ++i) {
		list.options[i] = new Option(options[i].text, 
									 options[i].value, 
									 options[i].defaultSelected, 
									 options[i].selected);
	}
}

function _printTree(node, str) {
    str += node.nodeName + ' -> ' + node.nodeValue + '\n'
    if (node.hasChildNodes()) {
        for(var i = 0; i < node.childNodes; ++i)
            str += _printTree(node.childNodes[i], str)
    }
    return str
}

function _trimString(str) { 
    // skip leading and trailing whitespace 
    // and return everything in between 
    var ret = str.replace(/^\s+/, ""); 
    ret = ret.replace(/\s+$/, ""); 
    ret = ret.replace(/\s+/g, " "); 
    return ret; 
}
