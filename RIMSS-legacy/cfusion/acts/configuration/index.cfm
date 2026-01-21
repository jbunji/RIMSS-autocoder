<cfif StructKeyExists(REQUEST.context,'action')>
	<cfinclude template="../controller/mainController.cfm"/>
<cfelse>
	<cfset redirect(application.sessionManager.getValue("configuration"),true)/>
	<!--- Redirect to configurationDepot.cfm for ACTS is done in onRequest() --->
</cfif>

