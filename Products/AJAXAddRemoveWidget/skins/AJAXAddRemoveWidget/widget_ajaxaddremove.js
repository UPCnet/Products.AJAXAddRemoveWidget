/*_addremove_updateSubmitField
 * Helper javascript function for addremove widget;
 */
 

function populate(base_url,field) {
 var inputBox   = document.getElementById(field + "_search");
 var targetList = document.getElementById(field + "_unselected");
 var errorLabel = document.getElementById(field + "_error_label");
 var spinner = document.getElementById(field + "_spinner");
 
spinner.style.display='';
 if (inputBox.value.length>=4)
    {
     url = base_url+"/ajaxaddremove-"+field+"?filter="+inputBox.value;
     var xmlhttp = new XMLHttpRequest();
     xmlhttp.open("GET", url, false);
     xmlhttp.send('');
     if (window.ActiveXObject) 
	 {
	 var parser=new DOMParser();
	 var doc=parser.parseFromString(xmlhttp.responseText,"text/xml");
	 xml = doc.documentElement;
	 
	 }
     else
	 {
	 xml = xmlhttp.responseXML;
	 }
     spinner.style.display='none'; 
     items = xml.getElementsByTagName('option');
     count = items.length;

     if (count > 0)
       {
        targetList.length=0;       
        for (var i=1;i<=count;i++)
          {
          if (!check_item_exists(field,items[i-1].getAttribute("value")))
             {
	      	newIdx = targetList.length;      
	  	targetList[newIdx]       = new Option(items[i-1].getAttribute("text"));
	  	targetList[newIdx].value = items[i-1].getAttribute("value")

             }
          }
  	  errorLabel.textContent=count+' Resultats' 
       }
     else
       {
         item = xml.getElementsByTagName('error')
         count = item.length;
         if (count==1)
           {
              errorLabel.textContent=item[0].getAttribute("message")
           }
       }  

    }
    else
{       errorLabel.textContent="Escriu 4 caràcters com a mínim" 	    }
 spinner.style.display='none'; 
}



// update the hidden field we use to actually submit the values as a pipe-
//  separated list
function check_item_exists(field,item) {

	var submitContainer  = document.getElementById(field + "_container");

	for (var i = 0; i < submitContainer.childNodes.length; ++i) {
           if (submitContainer.childNodes[i].value==item)	    
              {return true}
        return false 
	}
	
}


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
