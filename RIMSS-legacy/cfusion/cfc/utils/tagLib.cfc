<cfcomponent output="false">
	
	<cfset variables.instance = {
	   'spreadSheetResult' = ""
	}>

    <cffunction name="cookie" access="public" returnType="void" output="false">
		<cfargument name="name" type="string" required="true">
		<cfargument name="value" type="string" required="false">
		<cfargument name="expires" type="any" required="false">
		<cfargument name="domain" type="string" required="false">
		<cfargument name="httpOnly" type="boolean" required="false">
		<cfargument name="path" type="string" required="false">
		<cfargument name="secure" type="boolean" required="false">
		<cfset var args = {}>
		<cfset var arg = "">
		<cfloop item="arg" collection="#arguments#">
		    <cfif not isNull(arguments[arg])>
		        <cfset args[arg] = arguments[arg]>
		    </cfif>
		</cfloop>
		
		<cfcookie attributecollection="#args#">
	</cffunction>
	
	<cffunction name="enableCFoutputOnly" access="public" returnType="any" output="false">
        <cfargument name="outputOnly" type="boolean" required="true">
		<cfset setting(enableCFoutputOnly = "#trim(ARGUMENTS.outputOnly)#")/>
        <!---<cfsetting enableCFoutputOnly = "#trim(ARGUMENTS.outputOnly)#"/>--->
		<cfreturn this>
    </cffunction>
	
	<cffunction name="requestTimeout" access="public" returnType="any" output="false">
        <cfargument name="timeout" type="numeric" required="true">
		<cfset setting(requestTimeout = "#trim(ARGUMENTS.timeout)#")/>
        <!---<cfsetting requestTimeout = "#trim(ARGUMENTS.timeout)#"/>--->
		<cfreturn this>
    </cffunction>
    
    <cffunction name="showDebugOutput" access="public" returnType="any" output="false">
        <cfargument name="showDebug" type="boolean" required="true">
		<cfset setting(showDebugOutput = "#trim(ARGUMENTS.showDebug)#")/>
        <!---<cfsetting showDebugOutput = "#trim(ARGUMENTS.showDebug)#"/>--->
		<cfreturn this>
    </cffunction>
    
	<cffunction name="spreadSheetRead" access="public" returnType="any" output="false">

        <cfset ARGUMENTS.action = "READ"/>

        <cfif isDefined("arguments.name")>
			<cfset arguments.name = "variables.instance.spreadSheetResult">
		<cfelseif isDefined("arguments.query")>
			<cfset arguments.query = "variables.instance.spreadSheetResult"> 
		</cfif>

        <cfset cfSpreadSheet(argumentCollection=arguments)>
        <cfreturn variables.instance.spreadSheetResult>
    </cffunction>
    
    <cffunction name="spreadSheetWrite" access="public" returnType="any" output="false">

        <cfset var result = "">
        
        <cfset ARGUMENTS.action = "WRITE"/>

        <cfif isDefined("arguments.name")>
            <cfset arguments.name = "result">
        <cfelseif isDefined("arguments.query")>
            <cfset arguments.query = "result"> 
        </cfif>

       <cfset cfSpreadSheet(argumentCollection=arguments)>
        <cfreturn variables.instance.spreadSheetResult>
    </cffunction>
    
    <cffunction name="spreadSheetUpdate" access="public" returnType="any" output="false">

        <cfset var result = "">
        
        <cfset ARGUMENTS.action = "UPDATE"/>

        <cfif isDefined("ARGUMENTS.name")>
            <cfset ARGUMENTS.name = "variables.instance.spreadSheetResult">
        <cfelseif isDefined("ARGUMENTS.query")>
            <cfset ARGUMENTS.query = "variables.instance.spreadSheetResult"> 
        </cfif>

        <cfset cfSpreadSheet(argumentCollection=arguments)>
        <cfreturn variables.instance.spreadSheetResult>
    </cffunction>
    
    <cffunction name="cfSpreadSheet" access="private" returnType="any" output="false">
		<cfspreadsheet attributecollection="#ARGUMENTS#"/>
	</cffunction>

    <cffunction name="contentReset" access="public" returnType="any" output="false">
        <!---<cfcontent reset = "yes"/>--->
		<cfset content(reset = "yes")/>
        <cfreturn this>
    </cffunction>
    
    <cffunction name="content" access="public" returnType="void" output="false">
		<cfcontent attributeCollection="#arguments#" />
	</cffunction>
    
    <cffunction name="setting" access="public" returntype="void" >      
		<cfsetting attributeCollection="#arguments#" /> 
	</cffunction>
    
    <cffunction name="HTTPHeader" output="false" returnType="void">
	    <cfargument name="name" type="string" default="">
	    <cfargument name="value" type="string" default="">
	    <cfargument name="statuscode" type="string" default="">
	    <cfargument name="statustext" type="string" default="">
	    <cfif Len(name) and Len(value)>
	        <cfheader name="#name#" value="#value#">
	    <cfelseif Len(statuscode) and Len(statustext)>
	        <cfheader statuscode="#statuscode#" statustext="#statustext#">
	    </cfif>
	</cffunction>
    
    <cffunction name="header" access="public" returntype="void" >      
		<cfheader attributeCollection="#arguments#" />
	</cffunction>
	
	<cffunction name="saveContent" access="public" returnType="any">
		<cfargument name="content" type="any" default="">
		<cfset var savedContent = "">
		<cfsavecontent variable="savedContent">#ARGUMENTS.content#</cfsavecontent>
		<cfreturn savedContent> 
	</cffunction>
    
    
</cfcomponent>