	var x;
	function add_data(data_from_popup) {
				 document.getElementById(x).value = data_from_popup; 
		}
	function wopen(formelem)
	{
		var type = 'all';
		wopentype(formelem,type);
	}

	function wopentype(formelem,type)
	{
		
		defpath = document.getElementById(formelem).value;
		var dialogResults ="";
		x=formelem;
		if (window.showModalDialog) 
		{
			 dialogResults = window.showModalDialog("../filedialog/index.cfm?type=" +  type +   "&fromjscript=true&dialogStyle=selectDirectory&formelem=" + formelem + "&defaultPath=" + escape(defpath), "NewWindow","dialogWidth=475px;dialogHeight=420px;dependent=true;resizable=no;ceter=yes");
		
		   
		}
        else
		{			
			var windowObjectReference;
		    windowObjectReference = window.open("../filedialog/index.cfm?type=" +  type +   "&fromjscript=true&dialogStyle=selectDirectory&formelem=" + formelem + "&defaultPath=" + escape(defpath), "_blank","height=475;width=420;dependent=true;resizable=no;modal=yes;ceter=yes");
		}
		
		if ( (dialogResults != undefined) && (dialogResults != '') && (dialogResults != false) )
             {
               document.getElementById(formelem).value = dialogResults;
             }
	
	return false;
	}


   function showhide(ref) {

    var ele = document.getElementById(ref);
	
	if(ele.style.display == '') {
    		ele.style.display = "none";
		
  	}
	else {
		ele.style.display = '';
	}
		
	}

	
   function toggletext(id,text1,text2)
   {
     var element = document.getElementById(id)
     var text = element.value;
     if(text == text1)
        {
             text = text2;
	}
	else
	{
             text = text1;
	}

       element.value = text;
   }
 
	
