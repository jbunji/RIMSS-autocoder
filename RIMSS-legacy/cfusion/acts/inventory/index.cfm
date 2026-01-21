<cfif StructKeyExists(REQUEST.context,'action')>
    <cfinclude template="../controller/mainController.cfm"/>
<cfelse>
    <cfset redirect("inventory.cfm",true)/>
</cfif>

