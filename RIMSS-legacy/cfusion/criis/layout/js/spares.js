
function setupNounPartRelated(){
	
	$('#spareNoun').on("change",function(){
		
		if(!$.trim($(this).val()).length){
		  $('#sparePartNo').children('option:not(:first)').remove();
          $('#spareNSN').children('option:not(:first)').remove();
		  return;		
		}
		
		var result = getSparesPartsByNoun(noun=$(this).val());
		$('#sparePartNo').children('option:not(:first)').remove();
		$('#spareNSN').children('option:not(:first)').remove();
		
		result.done(function(data, textStatus, jqXHR){
		  if(data.ROWCOUNT)	{
		  	
		  	partNoOption = "";
			NSNOption = "";
			partLength = data.DATA.PARTNO.length;
			nsnLength = data.DATA.NSN.length;

			$.each(data.DATA.PARTNO, function(e) {
				if (e == 0 && nsnLength ==1) {
					partNoOption += '<option selected="selected" value="' + data.DATA.PARTNO_ID[e] + '">'+ data.DATA.PARTNO[e] +'</option>';
                }else{
					partNoOption += '<option value="' + data.DATA.PARTNO_ID[e] + '">'+ data.DATA.PARTNO[e] +'</option>';
                }
 
			});
			$('#sparePartNo').append(partNoOption);
			
			$.each(data.DATA.NSN, function(e) {
				if (e == 0 && nsnLength ==1) {
					NSNOption += '<option selected="selected" value="' + data.DATA.NSN[e] + '">' + data.DATA.NSN[e] + '</option>';
				}else{
					NSNOption += '<option value="' + data.DATA.NSN[e] + '">' + data.DATA.NSN[e] + '</option>';
				}
            });
            $('#spareNSN').append(NSNOption);
			
			
			
		  }
		});

	});
	
	$('#sparePartNo').on("change",function(){
		
		$('#softwareContainer').empty();
        $('#spareSoftwareId').val('');
		
		if(!$.trim($(this).val()).length){
          $('#spareNSN').children('option:not(:first)').remove();
          return;       
        }
		
		
		
		var noun = $('#spareNoun option:selected').val();
        var result = getSparesPartsByNoun(noun=noun, partno=$(this).val());
        $('#spareNSN').children('option:not(:first)').remove();
        
        result.done(function(data, textStatus, jqXHR){
          if(data.ROWCOUNT) {

            NSNOption = "";
            nsnLength = data.DATA.NSN.length;

            $.each(data.DATA.NSN, function(e) {
                if (e == 0 && nsnLength ==1) {
                    NSNOption += '<option selected="selected" value="' + data.DATA.NSN[e] + '">' + data.DATA.NSN[e] + '</option>';
                }else{
                    NSNOption += '<option value="' + data.DATA.NSN[e] + '">' + data.DATA.NSN[e] + '</option>';
                }
            });
            $('#spareNSN').append(NSNOption);
            
            
            
          }
        });

    });
	
	
	
}

function setupSoftwareDelete(){
	var table = $('table.currentSoftware tbody');
	var dialog= $('#softwareDialogLookup');

	$('#softwareContainer').on("click", "td.deleteSoftware", function(event){
        if(!$(dialog).is(":visible")){
			
			$(this).closest("tr").remove();
			var tableRows = $('table.currentSoftware tbody tr');
			//console.log($(tableRows).length);
			if(!$(tableRows).length){
		       $('#softwareContainer').empty();
		        
		    }
			updateSWList();
			//var dt = $('table.currentSoftware').dataTables().fnDraw();
			
			//modifyDTColumns();
			
			
		}
		
		
    });
	
	

}


function updateTable(){
            addTable();
            var table = $('#softwareContainer table.currentSoftware');
            var rowsHTML = "";
            $(".loadedSoftware:checked").each(function(event){
                 var number = $(this).parents("tr").find(".number").text();
                 var title = $(this).parents("tr").find(".title").text();
                 var id = $(this).prop("id");
                 rowsHTML += '<tr><td>'+ number +'</td><td>'+ title +'</td><td class="deleteSoftware deleteIcon admin" id="' + id +'">&nbsp;</td></tr>';
                 
            });
            $(table).find("tbody").html(rowsHTML);
            
            
            try {
                   var dt = $('#softwareContainer table.currentSoftware').dataTable({ 
                      "sDom":"t"
                    });  
                    
                    dt.fnDraw();
                    modifyDTColumns();
                } catch (e) {   
                }
            
        }
        
        function addTable(){
            $('#softwareContainer').empty();
            if ($(".loadedSoftware:checked").length) {
                var tableHTML = '<table class="currentSoftware globalTable"><thead><tr><th>Number</th><th>Title</th><th class="noSort">&nbsp;</th></tr></thead><tbody></tbody></table>';
                $("#softwareContainer").attr("align","center").html(tableHTML);
                


            }
            
            
            
        }
        
        function getCheckedValues(){
            var names = [];
            
            $('input.loadedSoftware:checked').each(function() {
                names.push($(this).prop('id'));
            });
            
            
            
            return names.join(',');
    
        }

function getSparesPartsByNoun(noun,partno){
   
    var url = "../controller/sparesController.cfc?queryformat=column";
    var d = {};

    d.method = "getPartsByNoun";

	if(typeof noun != 'undefined'){
	   d.noun = noun;	
	}

	if(typeof partno != 'undefined'){
       d.partNoId = partno;   
    }

    d.returnFormat = "json";
    
    var getSpares = $.ajax({
            url: url,
            type: 'POST',
            data: d,
            dataType: 'json'
        });
		
	return getSpares;

}

function showSoftwareLookupDialog(obj) {
    var dialogLookup = $('#softwareDialogLookup'); 

    //show dialog
    var d = {};
    if($('#spareSoftwareId').length > 0){
        d.swId = $.trim($('#spareSoftwareId').val());
    }

    var ref = $(obj).attr('href') + "?d=" + new Date().getTime();
    $(dialogLookup).html('Loading...');
    $(dialogLookup).load(ref,d);
    $(dialogLookup).dialog('open',function(e){alert('here');});
}


function setupSoftwareDialog() {
    var dialogLookup = $('#softwareDialogLookup'); 
    //defined dialog div
    if($(dialogLookup).length <= 0) {
        $(document.createElement('div')).attr({'id':'softwareDialogLookup'}).hide().appendTo('body');
        dialogLookup = $('#softwareDialogLookup'); 
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
    $('a#sw_lookup_ref').click(function(event) {
        var title = "Software";
        if (typeof title !== 'undefined' && title !== false && title !== '') {
            $(dialogLookup).dialog({
                width: 500,
                title: 'Select ' + title
            });
        } else {
            $(dialogLookup).dialog({
                width: 500,
                title: 'Select'
            });
        }
        event.preventDefault();
        showSoftwareLookupDialog($(this));
        return false;
    });
}


function updateSWList(){
            var table = $('#softwareContainer table.currentSoftware');
			var tbody = $('#softwareContainer table.currentSoftware tbody');
			var names = [];
			
			$(table).find('td.deleteSoftware').each(function(event){
				 names.push($(this).prop('id'));
			});
			$("#spareSoftwareId").val(names.join(','));
			//$('table.currentSoftware').dataTable().fnDraw()
			$(tbody).find("tr:even").removeClass("even").addClass("odd");
			$(tbody).find("tr:odd").removeClass("odd").addClass("even");
    
}



