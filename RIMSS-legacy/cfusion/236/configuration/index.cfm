<cfif StructKeyExists(REQUEST.context,'action')>
	<cfinclude template="../controller/mainController.cfm"/>
<cfelse>
	<cfset redirect("configuration.cfm",true)/>
</cfif>


