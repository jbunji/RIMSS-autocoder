<cfcomponent name="Directory_Mgr">
	
    <cffunction name="createDir" access="remote" returntype="void" hint="This is the create Directory method">
    	<cfargument name="usr" type="any" />
        
        <cftry>
            <cfset path = ExpandPath("#application.rootpath#")&"/"&#usr#>
			
            <!--- If the directory does not exist, create it --->
            <cfif not DirectoryExists("#path#")>
                <cfdirectory action="create" directory="#path#">
            </cfif>
        <cfcatch>
                <cflog file="error" text="#cfcatch.TagContext[1].template# at line #cfcatch.TagContext[1].line# - #cfcatch.Detail#">
        </cfcatch>
        </cftry>
    </cffunction>
 
    <cffunction name="deleteDir" access="remote" returntype="void">
    	<cfargument name="usr" type="any" />
        <cftry>
			<cfif usr NEQ "">
                <cfset path = ExpandPath("#application.rootpath#")&"/"&#usr#>
                <cfif DirectoryExists("#path#")> 
                    <!---<cfdirectory action="list" name="qDir" directory="#path#">
                    <!--- Purge directory files --->
                    <cfloop query="qDir">
                        <cffile action="delete" file="#path#/#qDir.name#" />
                    </cfloop>
                    <!--- Delete directory --->
                    <cffile action="delete" file=#path#>--->
                    <cfdirectory action="delete" directory="#path#" recurse="true">
                </cfif>
            </cfif>
        <cfcatch>
                <cflog file="error" text="#cfcatch.TagContext[1].template# at line #cfcatch.TagContext[1].line# - #cfcatch.Detail#">
        </cfcatch>
        </cftry>
    </cffunction>
</cfcomponent>