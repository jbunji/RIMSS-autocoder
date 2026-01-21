

function  setupDeleteSortie(){
	
	$('.deleteSortie').click(function(e){
		var c = confirm("Are you sure you want to delete this Sortie?");
		if (c) {
			deleteSortie($(this));
		}
	});
	
	
}


function deleteSortie(sortie){
	var s = getRootPath();
    var url = "../controller/sortieController.cfc";
	var d = {};

    d.method = "deleteSortie";
	d.sortieId = $(sortie).attr('id');
    d.returnFormat = "json";
	
	var deleteSortieById = $.ajax({
            url: url,
            type: 'POST',
            data: d,
            dataType: 'json',
            success: function(response){
                if (response.success) {
				    $(sortie).parents("tr").remove();
                        if($('#sortieTable tbody tr').length <= 0){
                          $('#sortieTable').remove();
                          $(document.createElement('div')).addClass('global_notice_msg').text("No Records Found").appendTo($('.mainContent'));  
                        }else{
							$('#sortieTable').stripe();
						}
				}
                        
            }
        });

}
