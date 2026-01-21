<cfimport taglib="../default/layout" prefix="RIMSS"/>
<RIMSS:layout section="denied" subsection="#APPLICATION.sessionManager.getSubsection()#">
	<cfif isDefined("rc.error")>

        <cfset utils = new cfc.utils.utilities()/>

        <cfset cause = utils.getCause(rc.error)/>

        <cfif isDefined("cause.message")>
            <cfset msg = cause.message/>
        </cfif>
        <cfset utils.recordError(cause)/>

        <cfset StructDelete(rc,"error")>
        <cfif len(trim(msg))>
	       <cfoutput><div class="message global_notice_msg">#msg#</div></cfoutput>
	    </cfif>
    </cfif>
    <cfdump var="#request#"/>
</RIMSS:layout>