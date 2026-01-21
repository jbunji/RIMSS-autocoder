$(function() {
	
	$( '.globalTable' ).tooltip({
      show: {
        effect: "slideDown",
        delay: 250
      },
	   position: {
        my: "left top",
        at: "right+5 top-5"
      }
    }); // Initialize the tooltips

	if ($('.globalTable').length) {
		var expr = new RegExp('>[ \t\r\n\v\f]*<', 'g');
		var tbhtml = $('.globalTable').html();
		$('.globalTable').html(tbhtml.replace(expr, '><'));	
	}
	
	var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67;   

    //attach timePicker to maintStartDate & maintStopDate (old date format dd-M-yy)
    $('.calendar_field').datepicker({
        dateFormat: "dd-M-yy",
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText, inst) {
            var tmpDate = $(this).val();
            $(this).val(tmpDate.toUpperCase());
        }
    });
    
	$(document).keydown(function(e){
	        if (e.keyCode == ctrlKey) {
				ctrlDown = true
			};   
        }).keyup(function(e){
            if (e.keyCode == ctrlKey) {
				ctrlDown = false;
			}
        });
	
    $(document).delegate(".touppercase", "keyup", function(e) {
		var ctrlv = false;
		var ctrlc = false;

		if(!e.charCode){
			return;
		}
		
		//Detect "ctrl+v" key is pressed
		if (ctrlDown && (e.keyCode == vKey)){
            ctrlv = true;
                   
        }   
		
		//Detect "ctrl+c" key is pressed
		if (ctrlDown && (e.keyCode == cKey)){
            ctrlc = true;
                   
        }
		
		//If ctrl+c or ctrl+v is pressed uppercase once keyup is fired
		if((ctrlc || ctrlv) && ctrlDown &&  e.type=='keyup'){
			this.value = this.value.toUpperCase();
		}else{
			this.value = this.value.toUpperCase();
		}   
		
    });
    
	
	   

	// Prevent the backspace key from navigating back on readonly/disabled fields.
	$(document).unbind('keydown').bind('keydown', function (event) {
	    var doPrevent = false;
	    if (event.keyCode === 8) {
	        var d = event.srcElement || event.target;
	        if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD')) 
	             || d.tagName.toUpperCase() === 'TEXTAREA'
	             || d.tagName.toUpperCase() === 'SELECT'
	             ) {
	            doPrevent = d.readOnly || d.disabled;
	        }
	        else {
	            doPrevent = true;
	        }
	    }
	
	    if (doPrevent) {
	        event.preventDefault();
	    }
	}); 
 
	try{
	   setupAjaxErrorCheck();
	   addTextAreaMaxLength();
	   addNumeric();
	   addAlphaNumeric();
       
	   addRequiredtoLabels();
	}catch(err){	
	}
	
	
	
	
});



function isCharacterKeyPress(evt) {
    if (typeof evt.which == "undefined") {
        // This is IE, which only fires keypress events for printable keys
        return true;
    } else if (typeof evt.which == "number" && evt.which > 0) {
        // In other browsers except old versions of WebKit, evt.which is
        // only greater than zero if the keypress is a printable key.
        // We need to filter out backspace and ctrl/alt/meta key combinations
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
    }
    return false;
}




