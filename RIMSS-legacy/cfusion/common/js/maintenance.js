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

$(function() {
	//setup asset lookup dialog
	setupAssetLookupDialog();
	setupLookupDialog();
	setupPartNoDialog();
	setupLookupSRAAssetsDialog();
	setupSRANounLookupDialog();
	setupSRAAssetLookupDialog();

    //attach timePicker to maintStartTime & maintStopTime
    $('.time_field').timePicker();

});
