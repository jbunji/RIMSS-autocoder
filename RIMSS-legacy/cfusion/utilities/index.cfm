<cfif StructKeyExists(REQUEST.context,'action')>
	<cfset program = "utilities"/>	  
    <cfinclude template="#application.rootPath#/#program#/controller/mainController.cfm"/>
<cfelse>
    <cfset redirect(application.rootPath,true)/>
</cfif>

