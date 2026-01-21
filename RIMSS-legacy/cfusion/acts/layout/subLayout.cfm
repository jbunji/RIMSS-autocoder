<cfsilent>
    <cfparam name="attributes.menu" default=""/>
	<cfparam name="attributes.subSection" default=""/>
	<cfparam name="attributes.layout" default="acts"/>

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

    <cfset attributes.rootPath = sRootPath/>

 </cfsilent> 
 
    <cfswitch expression="#thisTag.executionMode#">
        <cfcase value="start">
		
            <cfset ancestorlist = getbasetaglist()>

		    <!--- Determine whether you are nested inside a custom tag. Skip the first
		        element of the ancestor list, i.e., the name of the custom tag I'm in. --->
		    <cfset incustomtag = ''>
		    <cfloop index="elem" 
		        list="#listrest(ancestorlist)#">
		        <cfif (left(elem, 3) eq 'cf_')>
		            <cfset incustomtag = elem>
		            <cfbreak>
		        </cfif>
		    </cfloop>
		
		    <cfif len(trim(incustomtag))>
		        <!--- Get the tag instance data. --->
		        <cfset tagdata = getbasetagdata(incustomtag)>
		        <cfset StructAppend(ATTRIBUTES,tagData.Attributes)>
		    </cfif>
			
			<cfif not len(trim(ATTRIBUTES.menu))>
		        <cfset ATTRIBUTES.menu = "Maintenance">    
		        <cfif Structkeyexists(ATTRIBUTES,"section") and len(trim(ATTRIBUTES.section))>
		           <cfset ATTRIBUTES.menu = ATTRIBUTES.section>
		        </cfif>
		    </cfif>
            <cfif len(trim(attributes.menu))>
                <cfif FileExists(getDirectoryFromPath(getCurrentTemplatePath()) & "/subLayouts/#Lcase(attributes.menu)#.cfm")>
                    <cfinclude template="subLayouts/#Lcase(attributes.menu)#.cfm">
                </cfif>
            <cfelse>
                <cfexit/>
            </cfif>
            
        </cfcase>

    </cfswitch>