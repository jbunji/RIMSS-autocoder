<cfscript>
	req = getPageContext().getRequest();
	message = "Unknown";
	getMessage = req.getParameter(JavaCast("String","message"));
	if(isDefined("getMessage")){
	   message=getMessage;
	}
	writeOutput(message);	
</cfscript>