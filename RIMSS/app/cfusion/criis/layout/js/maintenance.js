var bitPc = new Array();	

function createNewJobId(newJobIdUrl) {
    //create new job id
    return $.post(
        newJobIdUrl,
        {
         method: "getNewJobId",
         returnFormat: "json"
        }, "json"
    );
}


function setupBitPcDialog(){
	//defined dialog div
	if ($('#bitPcDlg').length <= 0) {
		$(document.createElement('div')).attr({
			'id': 'bitPcDlg'
		}).hide().appendTo('body');
	}
	
	
	$('#bitPcDlg').dialog({
		autoOpen: false,
		draggable: false,
		title: 'Bit Pc',
		model: true,
		width: 300,
		height: 300,
		buttons: {
			"Create": function(){
				$("#list_bitPc").html($("#bpPartno").val());
				$(this).dialog("close");
			}
		}
	});
	
	$("#bitPc_ref").click(function(event){
		
        event.preventDefault();
		showBitPcDialog($(this));
		return false;
	});
	
}	


function showBitPcDialog(obj) {
	var dialogLookup = $('#bitPcDlg'); 
	//show dialog
    var d = {};
   
    var ref = $(obj).attr('href');
	$(dialogLookup).html('Loading...');
    $(dialogLookup).load(ref,d);
    $(dialogLookup).dialog('open',function(e){alert('here');});
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
		//d.srapartnoid = $.trim($('#srapartnoid').val());
		d.sranoun = $.trim($('#remSraNoun').val());
		d.SraPartnoid = $.trim($('#remSraPartnoid').val());
		
		
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
				 $('#insSraSerno').val(result.data.serno);
				 
				 if($('#newassetId').length){
				 	$('#newassetId').val(result.data.assetid);
				 }else if($('#insSraAssetId').length){
				 	 $('#insSraAssetId').val(result.data.assetid);
				 }
				 
				 
				 $('#insSraNoun').val(result.data.noun);
				 $('#insSraNsn').val(result.data.nsn);
				 $('#insSraPartno').val(result.data.partno);
				 $('#inssrapartnoid').val(result.data.partnoid);
				 $('#insnewpartnoId').val(result.data.partnoid);
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

$(function() {
	//setup asset lookup dialog
	setupAssetLookupDialog();
	setupLookupDialog();
	setupPartNoDialog();
	setupLookupSRAAssetsDialog();
	setupSRANounLookupDialog();
	setupSRAAssetLookupDialog();
	setupLookupPartOrderSRAByNhaPartno();
	setupSRAPartOrderAssetLookupDialog();
	setupTrackingDialog();
	setupBitPcDialog();
	setupAddSNDialog();

    //attach timePicker to maintStartTime & maintStopTime
    $('.time_field').timePicker();

});


