try {
	
	//Get User from function.js
    var user = getUser();
    var program = "acts";
	var unit = "";
	var rootPath = getRootPath();

	function getInstanceUser()
	{
	    return user;
	}
	
	function setInstanceUser(user)
	{
	    user = user;
	    return this;
	}
	
	function getInstanceProgram()
    {
        return program;
    }
    
    function setInstanceProgram(program)
    {
        program = program;
        return this;
    }
	
	function getInstanceUnit()
    {
        return unit;
    }
    
    function setInstanceUnit(unit)
    {
        unit = unit;
        return this;
    }
	
	$(document).ready(function(){
        
		setupAjaxErrorCheck();
		
		$(".importListing li.excel,.importListing li.access").click(function(e){
			
		readColumns($(this));	
			
			
		});
		
		$(".importListing li").mouseover(function(e){
			$(this).addClass("hilight");
		});
		
		$(".importListing li").mouseout(function(e){
			$(this).removeClass("hilight");
		});
		
		$("#btnMapColumns").click(function(e){
          if($('#importColumns option:selected').length > 0 && $('#sortieColumns option:selected').length > 0){
		      createRowMapping();
              
		  }   
        });
		
		//Input click events
		$("#removeAllMappings").click(function(e){
          removeAllRowMappings();
        });
		
		
		$('#loadMapping').click(function(e){
				  var load = loadMappings(); 
				  
		});
		
		
		$('#saveSortieImport').bind("click",function(event){
          var sortieImport = importSortie();
		      
        });
        
		
		$(document).on("click",".removeMapping",function(event){
		  var row = $(this).parents('tr'); 	
          removeRowMapping(row);
        });

        $('#saveMapping').bind("click",function(event){
			
		  clearMsg();	
		  var mappings = saveMapping();	
    
		});

		
		$('#selectAll').click(function(){
			if($(this).is(':checked')){
				$('.autoFill').attr("checked","checked");
			}else{
				$('.autoFill').removeAttr("checked");
			}
		});
		
		
        
		if ($('table#tblMappings tbody tr').length > 0) {
		  $('#mappingsInfo').show();
			
		}
		
		loadSortieColumns();
		
	});
}catch(err){
    var txt="There was an error on this page.\n\n";
        txt+="Error description: " + err.message + "\n\n";
        txt+="Click OK to continue.\n\n";
        alert(txt);	
}

//function to make sorting easier
$.fn.sort_select_box = function(){
    // Get options from select box
    var my_options = $("#" + this.attr('id') + ' option');
	
    // sort alphabetically
    my_options.sort(function(a,b) {
        if (parseInt(a.value,10) > parseInt(b.value,10)) return 1;
        else if (parseInt(a.value,10) < parseInt(b.value,10)) return -1;
        else return 0
    })
   //replace with sorted my_options;
   $(this).empty().append( my_options );

   // clearing any selections
   $("#"+this.attr('id')+" option").attr('selected', false);
}


function sendMappings(ev){
    

    if(ev){

        //Add action field if doesn't exist in form
        var findForm = $(ev).parents("form");
        var findAction = $(findForm).find("input[name=mappings]");
        
        if ($(findAction).length <= 0) {
            $(document.createElement('input')).attr({
                'name': 'mappings',
                'readonly': 'readonly',
                'type': 'hidden'
            }).hide().appendTo($(findForm));
            
            
        }
        var inputMappings = JSON.stringify(getInputMappings());
        $(findForm).find("input[name=mappings]").val(inputMappings);
        
    }

    
    return true;
}

function sortOptions(){
	
	$("#importColumns").sort_select_box();
	$("#sortieColumns").sort_select_box();
	
}

function removeRowMapping(row){
	clearMsg();
	var importColumn = $(row).find('.importColumn');
	var importPosition = $(row).find('.importColumnPosition');
	var sortieColumn = $(row).find('.sortieColumn');
	var sortiePosition = $(row).find('.sortieColumnPosition');
	var importColumnName = $(importColumn).val();
	var sortieColumnName = $(sortieColumn).val();
	var importColumnPosition = $(importPosition).val();
	var sortieColumnPosition = $(sortiePosition).val();
	
	
	$(document.createElement('option')).attr({'value': importColumnPosition}).text(importColumnName).appendTo($('#importColumns'));
	$(document.createElement('option')).attr({'value':sortieColumnPosition}).text(sortieColumnName).appendTo($('#sortieColumns'));
	$(row).remove()
	
	if($('table#tblMappings tbody tr').length <=0){
	   $('div#mappingsInfo').hide();
	   $('input.mappingData').attr('disabled','disabled');	
	}
	$('#idx').val($('table#tblMappings tbody tr').length);
	sortOptions();
	 	   
}


function removeMappings(){
	clearMsg();
	$('#importColumns option').remove();
	
    $('#idx').val(0);
    $('div#mappingsInfo').hide();
    $('input.mappingData').attr('disabled','disabled'); 
	
	$('table#tblMappings tbody tr').each( function(e){
       row = $(this);
	    
		
	    var sortieColumn = $(row).find('.sortieColumn');
		var sortiePosition = $(row).find('.sortieColumnPosition');
	    var sortieColumnName = $(sortieColumn).val();
	    var sortieColumnPosition = $(sortiePosition).val();
	
	    $(document.createElement('option')).attr({'value':sortieColumnPosition}).text(sortieColumnName).appendTo($('#sortieColumns'));
	    $(row).remove()
    });
	$('div#mappingsInfo').hide();
    $('input.mappingData').attr('disabled','disabled'); 
	$('#idx').val($('table#tblMappings tbody tr').length);
	
    
	$("#sortieColumns").sort_select_box();
	
    
	      
}


function removeAllRowMappings(){
    clearMsg();
    $('table#tblMappings tbody tr').each( function(e){
	   removeRowMapping($(this));
	});
	
	
	$('#idx').val(0);
    $('div#mappingsInfo').hide();
	$('input.mappingData').attr('disabled','disabled');       
    sortOptions();
           
}

function createRowMapping(){
	var importColumn = $('#importColumns option:selected');
	var sortieColumn = $('#sortieColumns option:selected');
	var importColumnText = $(importColumn).text();
    var sortieColumnText = $(sortieColumn).text();
	var importColumnVal = $(importColumn).val();
    var sortieColumnVal = $(sortieColumn).val();
    var tableMappingHeader = $('#tblMappings tbody');
	var rowCount = $('#tblMappings tbody tr').length + 1;
	var newRow = $(document.createElement('tr')).appendTo(tableMappingHeader);
	var newCell = $(document.createElement('td')).appendTo(newRow);
	var newAutoFill = $(document.createElement('input')).addClass("autoFill").attr({'type':'checkbox','name':'autoFill' + rowCount,'id':'autoFill' + rowCount}).appendTo(newCell);
	var newCell = $(document.createElement('td')).appendTo(newRow);
	var newInputColumn = $(document.createElement('input')).addClass("importColumn").attr({'type':'text','name':'importColumn' + rowCount,'id':'importColumn' + rowCount,'readOnly':'readOnly'}).val(importColumnText).appendTo(newCell);
	var newInputPosition = $(document.createElement('input')).addClass("importColumnPosition").attr({'type':'hidden','name':'importColumnPosition' + rowCount,'id':'importColumnPosition' + rowCount,'readOnly':'readOnly'}).val(importColumnVal).appendTo(newCell);
	var newCell = $(document.createElement('td')).appendTo(newRow);
	var newInputColumn = $(document.createElement('input')).addClass("sortieColumn").attr({'type':'text','name':'sortieColumn' + rowCount,'id':'sortieColumn' + rowCount,'readOnly':'readOnly'}).val(sortieColumnText).appendTo(newCell);
	var newInputPosition = $(document.createElement('input')).addClass("sortieColumnPosition").attr({'type':'hidden','name':'sortieColumnPosition' + rowCount,'id':'sortieColumnPosition' + rowCount,'readOnly':'readOnly'}).val(sortieColumnVal).appendTo(newCell);
	var newCell = $(document.createElement('td')).appendTo(newRow);
	var newInputColumn = $(document.createElement('input')).addClass("constantColumn").attr({'type':'text','name':'constant' + rowCount,'id':'constant' + rowCount}).val('').appendTo(newCell);
	var newCell = $(document.createElement('td')).appendTo(newRow); 
	var newInputColumn = $(document.createElement('input')).addClass("removeMapping").attr({'type':'button','name':'btnRemoveMapping','id':'btnRemoveMapping'}).val('Remove').appendTo(newCell);
	$(importColumn).remove(); 
	$(sortieColumn).remove();
	
	$('#idx').val($('table#tblMappings tbody tr').length);
	
	$('div#mappingsInfo').show();
	$('input.mappingData').removeAttr('disabled');   	
	
}

function loadRowMapping(row){
	
	
    var tableMappingHeader = $('#tblMappings tbody');
	var importColumn = $('#importColumns');
    var sortieColumn = $('#sortieColumns');
    var rowCount = $('#tblMappings tbody tr').length + 1;
	var newRow = $(document.createElement('tr')).appendTo(tableMappingHeader);
    var newCell = $(document.createElement('td')).appendTo(newRow);
	
	var autoFill = false;
	var rampodPosition = rowCount;
	var rampodValue = rowCount;
	var rampodName = "";
	var constantValue = "";

	
	var foreignPosition = rowCount;
	var foreignValue = rowCount;
	var foreignName = "";
	
	if(row.auto_fill && row.auto_fill=='on'){
		autoFill = true;	
	}

	if(isDefined(row.rampod_field_name)){
		
        var rampodName = row.rampod_field_name;
    }
    
	
	
	if(isDefined(row.rampod_field_position)){
		var rampodPosition = row.rampod_field_position;
	}
	
	if(isDefined(row.foreign_field_name)){
        var foreignName = row.foreign_field_name;
    }
	
	if(isDefined(row.foreign_field_position)){
        var foreignPosition = row.foreign_field_position;
    }
	
	if(isDefined(row.constant_field_value)){
        var constantValue = row.constant_field_value;
    }
	
	
	
	
    var newAutoFill = $(document.createElement('input')).addClass("autoFill").attr({'type':'checkbox','name':'autoFill' + rowCount,'id':'autoFill' + rowCount}).val('on')
	if(autoFill){$(newAutoFill).attr("checked","checked");}
	$(newAutoFill).appendTo(newCell);
	
    var newCell = $(document.createElement('td')).appendTo(newRow);
    var newInputColumn = $(document.createElement('input')).addClass("importColumn").attr({'type':'text','name':'importColumn' + rowCount,'id':'importColumn' + rowCount,'readOnly':'readOnly'}).val(foreignName).appendTo(newCell);
	var newInputPosition = $(document.createElement('input')).addClass("importColumnPosition").attr({'type':'hidden','name':'importColumnPosition' + rowCount,'id':'importColumnPosition' + rowCount,'readOnly':'readOnly'}).val(foreignPosition).appendTo(newCell);

    var newCell = $(document.createElement('td')).appendTo(newRow);
    var newInputColumn = $(document.createElement('input')).addClass("sortieColumn").attr({'type':'text','name':'sortieColumn' + rowCount,'id':'sortieColumn' + rowCount,'readOnly':'readOnly'}).val(rampodName).appendTo(newCell);
    var newInputPosition = $(document.createElement('input')).addClass("sortieColumnPosition").attr({'type':'hidden','name':'sortieColumnPosition' + rowCount,'id':'sortieColumnPosition' + rowCount,'readOnly':'readOnly'}).val(rampodPosition).appendTo(newCell);
    var newCell = $(document.createElement('td')).appendTo(newRow);
    var newInputColumn = $(document.createElement('input')).addClass("constantColumn").attr({'type':'text','name':'constant' + rowCount,'id':'constant' + rowCount}).val(constantValue).appendTo(newCell);
    var newCell = $(document.createElement('td')).appendTo(newRow); 
    var newInputColumn = $(document.createElement('input')).addClass("removeMapping").attr({'type':'button','name':'btnRemoveMapping','id':'btnRemoveMapping'}).val('Remove').appendTo(newCell);
    //$('#importColumns').filter('option[text="' + foreignName+'"]').remove(); 
    //$('#sortieColumns').filter('option[text="' + rampodName+'"]').remove(); 
	
	removeExistingMappingOptions();
	
		
}

function removeExistingMappingOptions(){
	
	
	
	$('table#tblMappings tbody tr').each( function(e){
	
	   var rowCount = 1;
	   var rampodPosition = rowCount;
	   var rampodValue = rowCount;
	   var rampodName = "";
	
	    
	   var foreignPosition = rowCount;
	   var foreignValue = "";
	   var foreignName = "";

	   if($(this).find(".sortieColumn").length){
	        
	        var rampodName = $(this).find(".sortieColumn").val();
	    }
	
	    if($(this).find(".sortieColumnPosition").length){
	        var rampodPosition = $(this).find(".sortieColumnPosition").val();
	    }
	    
	    if($(this).find(".importColumn").length){
	        var foreignName = $(this).find(".importColumn").val();
	    }
	    
	    if($(this).find(".importColumnPosition").length){
	        var foreignPosition = $(this).find(".importColumnPosition").val();
	    }
	   	
		$('#importColumns option').each(function(e){
			
	        if($(this).text() == foreignName){
	            $(this).remove();
	        }
	    });

	    $('#sortieColumns option').each(function(e){
			if($(this).text() == rampodName){
	            $(this).remove();
	        }
	    });
	
	 });

	 if($('table#tblMappings tbody tr').length > 0){
        $('.mappingData').removeAttr('disabled');
     }
	 
}

function isDefined(variable){
	var test = typeof variable === 'undefined';
	return !test;
}

function readColumns(uploadType){
	var url = "../controller/sortieController.cfc";
    var method = "";
    $('.importListing li.selected').removeClass("selected rightArrow");
    $(uploadType).addClass("selected rightArrow");
	//$('#sortieImportType').val(uploadType);
    var d = {};
    d.method = "readColumns";
    d.returnFormat = "json";
    d.action = "";
    d.filepath = $("#filePath").val();
    
	clearMsg();
	
	$('#sortieCurrentItem').val('');
	
	d.item = $(uploadType).text();


    if ($(uploadType).hasClass("excel")) {
        d.action = "excel";
    }
    else if ($(uploadType).hasClass("access")) {
        d.action = "access";
    }

    $('#sortieCurrentItem').val($(uploadType).text());

    removeMappings();
    
    if (url.length > 0) {
        var readFile = $.ajax({
            url: url,
            type: 'POST',
            data: d,
            dataType: 'json',
            success: function(response){
                
                if ($.isArray(response)) {
                    
                    if(response.length <=0){
                        $('.mapColumns').attr('disabled','disabled');
                    }else{
                        $('.mapColumns').removeAttr('disabled');
                    }
                    $.each(response, function(key, value){
                        
                        if ($.trim(value).length > 0) {
                            key++;
                            $('#importColumns').append($('<option>', {
                                value: key
                            }).text(value));
                        }
                    });

                }else{
					$('.mapColumns').attr('disabled','disabled');
                }
                
                //removeAllRowMappings();

            },
            error: function(ErrorMsg,detail,thrown){
				
				if (thrown) {
                    $('.message').addClass("global_error_msg").text(thrown);
                }else{
                    if(detail){ msg += " " + detail;}
                    $('.message').addClass("global_error_msg").text(msg);
                }
				
            }
        });

        
    }	
	
}


/*
function checkForAjaxError(response){
	
	try {
		var msgObj = $(response).find("div.errorInfo div.errorMsg");
		var globalClass="global_error_msg";
		if ($(msgObj).length > 0) {
			if($(msgObj).hasClass("global_notice_msg")){
				globalClass="global_notice_msg";
			}
			
			if($(msgObj).hasClass("global_info_msg")){
                globalClass="global_info_msg";
            }
			
			if($(msgObj).hasClass("global_success_msg")){
                globalClass="global_success_msg";
            }
			
			if($(msgObj).hasClass("global_error_msg")){
                globalClass="global_error_msg";
            }
			
			$('.message').addClass(globalClass).text($(msgObj).text());
			return;
		}
	}catch(err){
		
	}
}
*/

function loadMappings(){
	var url = "../controller/sortieController.cfc";	   
	var d = {};
	
	clearMsg();
	
    $('div#mappingsInfo').hide();
    if($('#tblMappings tbody tr').length <= 0 && $('#importColumns option').length <=0){
		return [];
	}

    d.method = "loadMappings";
    d.returnFormat = "json";
        $('#tblMappings tbody tr').remove();
         try {
		var readMapping = $.ajax({
            url: url,
            type: 'POST',
            data: d,
			cache:false,
		    dataType: 'json',
            success: function(response){
				clearMsg();
				if (isDefined(response.load) && isDefined(response.load.FIELDMAPPINGS) && $.isArray(response.load.FIELDMAPPINGS)) {
	                //console.log(response.load.FIELDMAPPINGS);   			
					$.each(response.load.FIELDMAPPINGS, function(key, value){
						loadRowMapping(value);
					});
					
					
					
					
					if ($('#tblMappings tbody tr').length > 0) {
						$('div#mappingsInfo').show();
						$('input.mappingData').removeAttr('disabled');
						
						if ($('.autoFill:checked').length == $('.autoFill').length) {
							$('#selectAll').attr("checked", "checked");
						}
						
						
					}
					
					
				}
											
            },
            error: function(msg,detail,thrown){
            	
                clearMsg();    
                if (thrown) {
					$('.message').addClass("global_error_msg").text(thrown);
				}else{
					if(detail){ msg += " " + detail;}
					$('.message').addClass("global_error_msg").text(msg);
				}


            }
        });
        }catch(err){}
	return readMapping;
	
}




function loadSortieColumns(){
    var url = "../controller/sortieController.cfc";    
    var d = {};
    //clearMsg();
    //$('div#mappingsInfo').hide();
    
    d.method = "getSortieColumns";
    d.returnFormat = "json";
        $('#sortieColumns option').remove();
        var readSortieOptions = $.ajax({
            url: url,
            type: 'POST',
            data: d,
            dataType: 'json',
            success: function(response){
                
                if($.isArray(response)){
                    var counter = 0;
                    $.each(response,function(key,value){
                       var newOption = $(document.createElement('option')).val(counter).text(value).appendTo($('#sortieColumns')); 
					   counter++;   
                    });
  
                }

            },
            error: function(msg,detail,thrown){
            	               
                if (thrown) {
                    $('.message').addClass("global_error_msg").text(thrown);
                }else{
                    if(detail){ msg += " " + detail;}
                    $('.message').addClass("global_error_msg").text(msg);
                }
            },
			complete: function(data){
				removeExistingMappingOptions();
			}
        });

    return readSortieOptions;
    
}


function getInputMappings(){
    var fieldMappings = [];
    var mappings = {};
    var item= {};
    var rows = $('table#tblMappings tbody tr'); 
	
	//Map the column information
    $.each(rows, function(key, value){
       var importColumn = $(value).find(".importColumn");
	   var autoFillColumn = $(value).find(".autoFill");
       var sortieColumn = $(value).find(".sortieColumn");
       var constantColumn = $(value).find(".constantColumn");
	   var foreignPositionColumn = $(value).find(".importColumnPosition");
	   var rampodPositionColumn = $(value).find(".sortieColumnPosition");

       var mapRow = {};
	   
       mapRow['rampod_field_name'] = $(sortieColumn).val();
       mapRow['foreign_field_name'] = $(importColumn).val();
       mapRow['constant_field_value'] = $(constantColumn).val();
       mapRow['rampod_field_position'] = $(rampodPositionColumn).val();  
       mapRow['foreign_field_position'] = $(foreignPositionColumn).val();  
       
	   
	   
	   var autoFill = "";
	   if($(autoFillColumn).is(":checked")){
            autoFill= $(autoFillColumn).val();  
	   }
       mapRow['auto_fill'] = autoFill;  
	   
     fieldMappings.push(mapRow);
    
    });

	mappings = {
		'field_mapping': fieldMappings,
		'user': $('#sortieUser').val(),
		'program': $('#sortieProgram').val(),
		'unit': $('#sortieUnit').val(),
		'file_type': $('#sortieImportType').val(),
		'data_table': $('.importListing li.selected').text(),
		'item': $('#sortieCurrentItem').val()
	}

    return mappings;
}

function saveMapping(){
	var inputMappings = JSON.stringify(getInputMappings());

	var url = "../controller/sortieController.cfc";     
    var d = {};
    //clearMsg();
	
	d.method = "saveMappings";
    d.returnFormat = "json";
	d.mappings = inputMappings;
	
    //d.formRequest.mappings = inputMappings;
    
	var saveInputMappings = $.ajax({
            url: url,
            type: 'POST',
            data: d,
            dataType: 'json',
            success: function(response){
                if(response.success){
				    $('.message').addClass("global_success_msg").text("Sortie Mappings Saved succesfully!");	
					
				}else{
				    $('.message').addClass("global_error_msg").text(response.message);	
					
				}
            },
            error: function(msg,detail,thrown){
 
                if (thrown) {
                    $('.message').addClass("global_error_msg").text(thrown);
                }else{
                    if(detail){ msg += " " + detail;}
                    $('.message').addClass("global_error_msg").text(msg);
                }
            }
        });
	
	
	return saveInputMappings;
}

function importSortie(){
    var inputMappings = JSON.stringify(getInputMappings());
	$('#importResults').hide();
	var url = "../controller/sortieController.cfc";     
    var d = {};
    clearMsg();
    $('.message').addClass("global_loading_msg").text('Importing Sorties...Please Wait');
    d.method = "importData";
    d.returnFormat = "json";
    d.mappings = inputMappings;
	d.filepath = $('#filePath').val();
	d.action = $('#sortieImportType').val();
	d.item = $('#sortieCurrentItem').val();
	
	var sortieImport = $.ajax({
            url: url,
            type: 'POST',
            data: d,
			cache:false,
            dataType: 'json',
            success: function(response){
				clearMsg();
                if(response.success){
                    $('.message').addClass("global_success_msg").text("Sortie Import finished!");    
                    
                }else{
                    $('.message').addClass("global_error_msg").text(response.message);  
                    
                }

				if(isDefined(response.importResult)){
					
					if(isDefined(response.importResult.processed)){
						
						$('#sortieImportProcessed').text(response.importResult.processed);
					}
					
					if(isDefined(response.importResult.constraints)){
                        $('#sortieImportConstraints').text(response.importResult.constraints);
                    }
					
					if(isDefined(response.importResult.total)){
                        $('#sortieImportTotal').text(response.importResult.total);
                    }
					
					$('#importResults').show();
					
				}
				
				if(isDefined(response.importFailures)){
					for(var i=0; i<response.importFailures.length; i++){
						
						var tableMappingHeader = $('#tblFailureResults tbody');
						var rowCount = $('#tblFailureResults tbody tr').length + 1;
						var newRow = $(document.createElement('tr')).appendTo(tableMappingHeader);
						
						var newCell = $(document.createElement('td')).appendTo(newRow);	
						var newInputColumn = $(document.createElement('input')).addClass("sortieColumn").attr({'type':'text','name':'missionId' + rowCount,'id':'missionId' + rowCount,'readOnly':'readOnly'}).val(response.importFailures[i].missionId).appendTo(newCell);	
	
						var newCell = $(document.createElement('td')).appendTo(newRow);
						var newInputColumn = $(document.createElement('input')).addClass("sortieColumn").attr({'type':'text','name':'serno' + rowCount,'id':'serno' + rowCount,'readOnly':'readOnly'}).val(response.importFailures[i].serno).appendTo(newCell);	

						var newCell = $(document.createElement('td')).appendTo(newRow);
						var newInputColumn = $(document.createElement('input')).addClass("sortieColumn").attr({'type':'text','name':'sortieDate' + rowCount,'id':'sortieDate' + rowCount,'readOnly':'readOnly'}).val(response.importFailures[i].sortieDate).appendTo(newCell);
	
						var newCell = $(document.createElement('td')).appendTo(newRow);
						var newInputColumn = $(document.createElement('input')).addClass("sortieColumn").attr({'type':'text','name':'remarks' + rowCount,'id':'remarks' + rowCount,'readOnly':'readOnly'}).val(response.importFailures[i].remarks).appendTo(newCell);
	
					}	
					$('div#failureResults').show();			
				}
				
            },
            error: function(msg,detail,thrown){
            	
				clearMsg();
                if (thrown) {
                    $('.message').addClass("global_error_msg").text(thrown);
                }else{
                    if(detail){ msg += " " + detail;}
                    $('.message').addClass("global_error_msg").text(msg);
                }
            },
        });
	return sortieImport;
}
