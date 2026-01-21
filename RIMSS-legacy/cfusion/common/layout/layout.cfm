<cfsilent>
        
        
    
    
    <cfif Structkeyexists(APPLICATION,"name")>
       <cfparam name="attributes.applicationName" default="#APPLICATION.name#">
    <cfelse>   
       <cfparam name="attributes.applicationName" default="RIMSS">
    </cfif>

    <cfparam name="attributes.layout" default="acts">
	
	<cfparam name="attributes.section" default="Maintenance">

    <cfparam name="attributes.description" default=""/>
    <cfparam name="attributes.keywords" default=""/>
    
    <cfparam name="attributes.title" default="#ATTRIBUTES.applicationName#">
    <cfparam name="attributes.appTitle" default="#ATTRIBUTES.title#"/>
    
     <cfparam name="attributes.subHeader" default="Application Home">

    <!--- privs --->
    <cfparam name="attributes.privs" default=""/>
    
    <cfif isDefined('caller') and StructKeyExists(CALLER,'this')>
     <cfset StructAppend(variables,caller.this)/>
    </cfif>

    <!---
        Simple path finding
    --->
    <cfif structKeyExists(attributes, "rootpath")>
        <cfset sRootPath = attributes.rootpath />
    <cfelseif structKeyExists(Application, "root")>
        <cfset sRootPath = Application.root />
    <cfelse>
        <cfset objPattern = CreateObject( "java", "java.util.regex.Pattern" ).Compile( "^/{1}.[A-Za-z0-9_-]+" ) />
        <cfset objMatcher = objPattern.Matcher( cgi.script_name ) />
        <cfset objMatcher.find()/>
        <cfset sRootPath = objMatcher.group() />
    </cfif>
    
    <cfif structKeyExists(attributes, "apptitle")>
        <cfset stitle = attributes.apptitle />
    <cfelseif structKeyExists(Application, "apptitle")>
        <cfset stitle = Application.apptitle />
    <cfelse>
        <cfset stitle = '' />
    </cfif>
    
    <cfset attributes.stitle = stitle>
    <cfset attributes.rootPath = sRootPath/>
    
    <cfif not len(trim(attributes.layout))>
        <cfset ATTRIBUTES.layout = "default"/>
    </cfif>
    
    <cfif not len(trim(attributes.section))>
        <cfset ATTRIBUTES.section = "Maintenance"/>
    </cfif>
    
    <cfparam name="caller.msg" default=""/>
    <cfparam name="caller.msgStatus" default=""/>

    <cfif Structkeyexists(request,"success") and not StructisEmpty(request.success)>
        <cfset caller.msg = HtmlEditFormat(trim(REQUEST.success.message))/>
        <cfset caller.msgStatus = "global_success_msg"/>
    </cfif>
    
    <cfif isDefined("request.context.success") and not StructisEmpty(request.context.success)>
        <cfset caller.msg = HtmlEditFormat(trim(request.context.success.message))/>
        <cfset caller.msgStatus = "global_success_msg"/>
    </cfif>

    <cfif Structkeyexists(request,"error") and not StructisEmpty(request.error)>
        <cfset caller.msg = HtmlEditFormat(trim(REQUEST.error.message))/>
        <cfset caller.msgStatus = "global_error_msg"/>
    </cfif>
    
    <cfif isDefined("request.context.error") and not StructisEmpty(request.context.error)>
		
        <cfset caller.msg = HtmlEditFormat(trim(request.context.error.message))/>
        <cfset caller.msgStatus = "global_error_msg"/>
    </cfif>
    
    <cfif Structkeyexists(request,"info") and not StructisEmpty(request.info)>
        <cfset caller.msg = HtmlEditFormat(trim(REQUEST.info.message))/>
        <cfset caller.msgStatus = "global_info_msg"/>
    </cfif>
    
    <cfif isDefined("request.context.info") and not StructisEmpty(request.context.info)>
        <cfset caller.msg = HtmlEditFormat(trim(request.context.info.message))/>
        <cfset caller.msgStatus = "global_info_msg"/>
    </cfif>
    
    <cfif Structkeyexists(request,"notice") and not StructisEmpty(request.notice)>
        <cfset caller.msg = HtmlEditFormat(trim(REQUEST.notice.message))/>
        <cfset caller.msgStatus = "global_notice_msg"/>
    </cfif>
    
    <cfif isDefined("request.context.notice") and not StructisEmpty(request.context.notice)>
        <cfset caller.msg = HtmlEditFormat(trim(request.context.notice.message))/>
        <cfset caller.msgStatus = "global_notice_msg"/>
    </cfif>
    
 </cfsilent> 

    <cfswitch expression="#thisTag.executionMode#">
        <cfcase value="start">

            <cfif FileExists(getDirectoryFromPath(getCurrentTemplatePath()) & "/header.cfm")>
               <cfinclude template="header.cfm">
            </cfif>

        </cfcase>
        
        <cfcase value='end'>

            <cfif FileExists(getDirectoryFromPath(getCurrentTemplatePath()) & "/footer.cfm")>
                <cfinclude template="footer.cfm">
            </cfif>
            <!--- Clean up session request if it exists --->
            <cfif isDefined("SESSION.request")>
                <cfset StructDelete(SESSION,"request")/>
            </cfif>    
        </cfcase>
    </cfswitch>