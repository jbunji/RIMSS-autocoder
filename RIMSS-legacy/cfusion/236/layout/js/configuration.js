

function  setupRemoveSRA(){
	
	$('.removeSRA').click(function(e){
		e.preventDefault();
		var c = confirm("Are you sure you want to remove this SRA?");
		if (c) {
			//alert('deleted');
			if($('#sraTable').length){
				removeSRA($(this));
			}else{
				return true;
			}
			
		}
	});
	
	
}


function removeSRA(sra){
	var s = getRootPath();
    var url = "../controller/configurationController.cfc";
	var d = {};

    d.method = "removeSRA";
	d.assetid = $(sra).attr('id');
    d.returnFormat = "json";
	
	var removeSRAByID = $.ajax({
            url: url,
            type: 'POST',
            data: d,
            dataType: 'json',
            success: function(response){
                if (response.success) {
				    $(sra).parents("tr").remove();
                        if($('#sraTable tbody tr').length <= 0){
                          $('#sraTable').remove();
                          $(document.createElement('div')).addClass('global_notice_msg').text("No Records Found").appendTo($('.mainContent'));  
                        }else{
							$('#sraTable').stripe();
						}
				}
                        
            }
        });

}


function createConfig(){
	var aidobj = $('#assetId');
	var aid = aidobj.val();
	var naid = $('#nhaassetId').val();

	var input = $(document.createElement('input'));
	var f = $('form[name=maintenance_menu_form]');
	var id = (aidobj.length)? aid : naid;
	input.attr({'name':'assetid','id':'newasset','hidden':'hidden','value':id});
	
	if(!$('#newasset').length){
		input.appendTo(f);
	}
}

function setupAddSNDialog() {
    var dialogLookup = $('#addSNConfig'); 
    //defined dialog div
    if($(dialogLookup).length <= 0) {
        $(document.createElement('div')).attr({'id':'addSNConfig'}).hide().appendTo('body');
        dialogLookup = $('#addSNConfig'); 
    }

    $(dialogLookup).dialog({
        autoOpen: false,
        draggable: true,
        title: 'Select',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Close": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('#btnAddSerno').click(function(event) {
        var title = "Add SN";
        if (typeof title !== 'undefined' && title !== false && title !== '') {
            $(dialogLookup).dialog({
                width: 500,
				height: 250,
                title: 'Select ' + title,
				buttons: {
		           "Insert": function() {
		              addSRA();
					  return false;
		           }
		        }
            });
        } else {
            $(dialogLookup).dialog({
                width: 500,
                title: 'Select'
            });
        }

        event.preventDefault();
        showAddSNDialog($(this));
        return false;
    });
}

function showAddSNDialog(obj) {
    var dialogLookup = $('#addSNConfig'); 

    //show dialog
    var d = {};
    if($('#partnoId').length > 0){
        d.partnoid = $.trim($('#partnoId').val());
		d.srapartnoid = $.trim($('#srapartnoid').val());
		d.sranoun = $.trim($('#sranoun').val());
    }
	
	
    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
    $(dialogLookup).html('Loading...');
    $(dialogLookup).load(ref,d);
    $(dialogLookup).dialog('open',function(e){alert('here');});
}


function addSRA(obj) {
  var d = $('#addSRAForm').serialize();
  $.ajax({            
		  url: '../controller/configurationController.cfc?method=addSRA&returnFormat=json',            
		  data: d, 
		  type:'POST',           
		  dataType: 'json',            
		  beforeSend:function(data) {            
		    return;            
		  },            
		  success: function(result) {
		  	$('#sraMessage').text(result.data.message); 
			if(result.success){
				console.log(result.data.serno);
				 $('#sraserno').val(result.data.serno);
				 
				 if($('#newassetId').length){
				 	$('#newassetId').val(result.data.assetid);
				 }else if($('#assetid').length){
				 	 $('#assetid').val(result.data.assetid);
				 }
				 
				 $('#sranoun').val(result.data.noun);
				 $('#sransn').val(result.data.nsn);
				 $('#srapartno').val(result.data.partno);
				 $('#srapartnoid').val(result.data.partnoid);
				 $('#newpartnoId').val(result.data.partnoid);
				 $('#addSNConfig').dialog("close");
				  
				  
			}  
		  	console.log(result);  
			$('#sraMessage').addClass('sraMessage');
			$('#sraMessage').text(result.message);          
		    //return;            
		  },            
		  error: function(data) { 
		    console.log('error');  
		  	console.log(data);
			$('#sraMessage').text(data.message);         
		    //return;            
		  },            
		  complete: function(data) {
		  	console.log('complete');
			            
		   //return;            
		  }            
	});
}


function showAssetLookupDialog(obj) {
    //show dialog
    var d = {};
    if($('.subSection').length > 0){
        d.systemcat = $.trim($('.subSection').attr('id')).toUpperCase();
    }

    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
	$('#assetlookup').html('Loading Assets...')
    $('#assetlookup').load(ref,d);
    $('#assetlookup').dialog('open');
}

function setupAssetLookupDialog() {
    //defined dialog div
    if($('#assetlookup').length <= 0) {
        $(document.createElement('div')).attr({'id':'assetlookup'}).hide().appendTo('body');
    }

    $('#assetlookup').dialog({
        autoOpen: false,
        draggable: false,
        title: 'Select Asset',
        model: true,
        width: 500,
        height: 500,
        buttons: {
           "Cancel": function() {
              $(this).dialog("close");
           }
        }
    });

    //show dialog
    $('#lookup_ref').click(function(event) {
        event.preventDefault();
        showAssetLookupDialog($(this));
        return false;
    });
	
}
