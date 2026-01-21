
<cfimport taglib="default/layout" prefix="RIMSS"/>
<RIMSS:layout section="home" ignorePrivs="true">
	<!---<cfparam name="msg" default=""/>
	<cfparam name="msgStatus" default=""/>--->
	<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>	
		<!--- This page will redirect to the appropriate program if a user has been defined --->
		<cfset program = mapProgram(APPLICATION.sessionManager.getProgramSetting())>
		<cfif len(trim(program)) and (application.sessionManager.userHasPermission("ACCESS_PROGRAM_ID_#UCASE(TRIM(program))#") or 
			application.sessionManager.userHasPermission("ACCESS_PROGRAM_ID_ALL"))>
		  <cfset page = lcase(trim(program)) & "/index.cfm">
		 
		  <cfif fileExists(ExpandPath("#page#"))>
		      <cfset utils = new cfc.utils.utilities()/>
			  <cfset redirect(url = page, persist = true)/>
		     <!--- <cflocation url="#page#" addToken = "false"/>--->
		  <cfelseif fileExists(ExpandPath("default/index.cfm"))>
		  	  <cfset page = APPLICATION.rootPath & "/default/index.cfm">
			  <cfset utils = new cfc.utils.utilities()/>
              <cfset redirect(url = page, persist = true)/> 	
		  <cfelse>
		  	  <cfoutput><div class="global_notice_msg">Cannot access maintenance section for program : #trim(program)#</div></cfoutput>
		  </cfif>
		<cfelse>
		  <cfif not isDefined("msg") or isDefined("msg") and not len(trim(msg))>
              <cfoutput><div class="global_notice_msg">Cannot access maintenance section for program priv : #trim(program)#</div></cfoutput> 
		</cfif> 
		</cfif>
		
</RIMSS:layout>
