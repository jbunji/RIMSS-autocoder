component  output="true" extends="appRoot.Application"
{

	
	if(isDefined("URL")){
		addToRequest('url',Duplicate(URL));
		//StructAppend(request.context.urlStruct,Duplicate(request.currentUrlStruct),true);

	}
	if(isDefined("FORM")){
		
		addToRequest('form',Duplicate(FORM));
	}
	rc = request.context;
}