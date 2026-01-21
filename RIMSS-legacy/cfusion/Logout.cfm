<cfsilent>
<cfset userModel = "" />
<cfif (IsDefined("APPLICATION")) >
    <cfif StructKeyExists(APPLICATION,"sessionManager") >
        <cfset userModel = application.sessionManager.getUserModel() />
    </cfif>
</cfif>

<cfimport taglib="default/layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
</cfsilent>
<RIMSS:layout section="home">
    
	<cfif !IsDefined("userModel")>
	    <h2>You have logged out successfully.</h2>
	<cfelse>
	    <cfset application.sessionManager.setLogoutEventFlag(true) />
	    <h2>User <cfoutput>#application.sessionManager.getUserName()#</cfoutput> logged out successfully.</h2>
	</cfif>
	
	<a href="javascript:window.open('', '_self', '');window.close();">Close</a> this browser window to completely end this session.
    <!---<cftry><cfset getPageContext().getRequest().getSession().invalidate()><cfcatch></cfcatch></cftry>--->
    

	<!---<cfset osName = createobject("java", "java.lang.System").getProperty("os.name") />
	<cfif osName.toLowerCase().indexOf("windows") eq -1>
	    <cfset returnUrl = getPageContext().getRequest().getContextPath() />
	    <cfset getPageContext().getResponse().setHeader("Osso-Return-Url", "#returnUrl#") />
	    <cfset getPageContext().getResponse().sendError("470", "Oracle SSO") />
	</cfif>--->
    
    <cfsilent>
	    <cftry>
		    <cfset utils = new cfc.utils.utilities()/>
		    <!---<cfset utils.expireSession()/>--->
		    <!--- Expire Session and logout (logout method does both) --->
		    <cfset utils.logout()/>
			<cfset applicationStop()>
	    <cfcatch></cfcatch>
	    </cftry>
	</cfsilent>
</RIMSS:layout>