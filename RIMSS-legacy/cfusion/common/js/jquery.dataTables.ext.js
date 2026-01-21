    //Dependent on date.js
	try {
        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "date-pre": function(a){
                //var d = $.datepicker.parseDate('dd-M-yy', a);
                var d = Date.parse(a);
                return d;
            },
            
            "date-asc": function(a, b){
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },
            
            "date-desc": function(a, b){
                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            }
        });
    }catch(err){
        
    }
	
$(function() {
	//extend datatable defaults to have 
	$.extend($.fn.dataTable.defaults,{
		"bPaginate": false,
		"bLengthChange": true,
		"bFilter": false,
		"bSort": true,
		"bInfo": false,
		"bAutoWidth": false,
		"bProcessing": false,
		"bSortClasses": true,
		"bStateSave": false,
		"bServerSide": false,
		"aaSorting": [ ]
	});
});
