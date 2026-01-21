<cfif StructKeyExists(REQUEST.context,'action')>
	<cfinclude template="../controller/mainController.cfm"/>
<cfelse>
	<cfset redirect("notifications.cfm",true)/>
</cfif>

