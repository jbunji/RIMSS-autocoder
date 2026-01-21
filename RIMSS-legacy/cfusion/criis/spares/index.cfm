<cfif StructKeyExists(REQUEST.context,'action')>
	<cfinclude template="../controller/mainController.cfm"/>
<cfelse>
	<cfset redirect("spares.cfm",true)/>
</cfif>

