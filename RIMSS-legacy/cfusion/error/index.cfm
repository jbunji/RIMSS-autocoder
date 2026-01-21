<cfimport taglib="../default/layout" prefix="RIMSS"/>
<cfset subection = len(trim(APPLICATION.sessionManager.getSubsection())) ? APPLICATION.sessionManager.getSubsection() : "error"/>
<RIMSS:layout section="error" subsection="#subection#" ignorePrivs="true">
	<cfset msg = ""/>
	<cfset errorStruct = ""/>
	<cfset msgClass = "global_error_msg"/>
	<cfif isDefined("rc.ajaxErrorClass") and len(trim(rc.ajaxErrorClass))>
		<cfset msgClass=trim(rc.ajaxErrorClass)>
	</cfif>
	<cfif isDefined("rc.error")>
        <cfset utils = new cfc.utils.utilities()/>

		<cfset cause = utils.getCause(rc.error)/>
		<cfif isDefined("cause.message")>
			<cfset msg = cause.message/>
		</cfif>
		<cfset utils.recordError(rc.error)/>

		<cfset StructDelete(rc,"error")>
	</cfif>
	<cfif len(trim(msg))>
	   <cfoutput><div class="message #msgClass#">#msg#</div></cfoutput>
	</cfif>
</RIMSS:layout>
