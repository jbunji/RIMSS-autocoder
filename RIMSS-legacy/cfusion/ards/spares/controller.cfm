
<cfset SESSION.SPARESPROCS = "/RIMSS/ARDS/SPARES/">
<cfsetting showdebugoutput="true" >
<CFSCRIPT>	

if(url.action == 'updateSpares'){
	PROCEDURES = createObject("component", "procedures");
	

	for(x = 1; x LTE listLen(form.assetID); x = x + 1)
	{
		PROCEDURES.UPDATE_SPARES(getPageContext().getRequest().getParameterValues('assetID')[x],getPageContext().getRequest().getParameterValues('spareStatus')[x],getPageContext().getRequest().getParameterValues('spareLocation')[x],getPageContext().getRequest().getParameterValues('remarks')[x]);
		PROCEDURES.DELETE_SOFTWARE(getPageContext().getRequest().getParameterValues('assetID')[x]);
	}		
	
	if(Structkeyexists(form,"swCheck")){
	for(x = 1; x LTE listLen(form.swCheck); x = x + 1)
		{
			delLocation = (find("$",getPageContext().getRequest().getParameterValues('swCheck')[x]) - 1);
			strLength = len(getPageContext().getRequest().getParameterValues('swCheck')[x]);
			
			curAsset = left(getPageContext().getRequest().getParameterValues('swCheck')[x],delLocation);
			curSWID = mid(getPageContext().getRequest().getParameterValues('swCheck')[x],delLocation + 2,(strLength - delLocation));
			
			PROCEDURES.UPDATE_SOFTWARE(curAsset,curSWID,application.sessionManager.getUserName());
		}
	}	
	
 
	location="index.cfm?action=list.spares";
	
	location(location);		
}

</CFSCRIPT> 