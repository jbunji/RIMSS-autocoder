<cfsilent>
	<cfparam name="errorMsg" default="Unknown Error Occurred"/>
	<cfparam name="errorDetail" default=""/>
	<cfparam name="errorStackTrace" default=""/>
	<cfparam name="msgClass" default=""/>
	
	<cftry>
		<cfif isDefined("rc.sessionHasExpired")>
			<cfheader name="SessionTimeout" value="1">
		</cfif>
		<cfif isDefined("request.context.error")>
			
			<cfif(isDefined("request.context.ajaxErrorClass") and len(trim(request.context.ajaxErrorClass)))>
			     <cfset msgClass=request.context.ajaxErrorClass/>
			</cfif>
			
			<cfset utils = new cfc.utils.utilities()/>
			
            <cfset cause = utils.getCause(request.context.error)/>
			
			<cfif isDefined("cause.message")>
                <cfset errorMsg = cause.message/>
            </cfif>
            
            <cfif isDefined("cause.detail")>
                <cfset errorDetail = cause.detail/>
            </cfif>
            
            <cfif isDefined("cause.stacktrace")>
                <cfset errorStackTrace = cause.stacktrace/>
            </cfif>

            <cfset utils.recordError(cause)/>
			
		</cfif>
	<cfcatch>
		<cfif isDefined("cfcatch.message")>
            <cfset errorMsg = cfcatch.message/>
        </cfif>
        
        <cfif isDefined("cfcatch.detail")>
            <cfset errorDetail = cfcatch.detail/>
        </cfif>
        
        <cfif isDefined("cfcatch.stacktrace")>
            <cfset errorStackTrace = cfcatch.stacktrace/>
        </cfif>
	</cfcatch>	
	</cftry>
	 
</cfsilent>

<cfoutput>
<div class="ajaxError">	
	<div class="errorInfo">
		<div class="errorMsg #msgClass#">#errorMsg#</div>
		<div class="errorDetail" style="display:none">#errorDetail#</div>
		<div class="errorStackTrace" style="display:none">#errorStackTrace#</div>
	</div>
</div>
</cfoutput>