
<cfif StructKeyExists(REQUEST.context,'action')>
	<cfinclude template="../controller/mainController.cfm"/>
<cfelse>
	<cflocation url="backlog.cfm" addToken="no"/>
</cfif>



<!---<cfif !IsDefined("REQUEST.context.action") or !IsDefined("REQUEST.context.method")>
	<cflocation url="backlog.cfm" addToken="no"/>
<cfelse>
	<cfinclude template="../controller/mainController.cfm"/>
</cfif>--->

<cfimport taglib="../layout" prefix="RIMSS"/>
<RIMSS:layout section="maintenance">
    <RIMSS:subLayout/>  
</RIMSS:layout>