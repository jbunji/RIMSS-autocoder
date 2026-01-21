<cfcomponent displayname="Ad Hoc" hint="Ad Hoc Report Component" output="false">
	<cfset variables.instance.dsn = "">
	<cfset variables.instance.sysid = 0>
	<cfset variables.instance.locid = 0>
	<!---<cfset variables.logger = createObject("component","cfc.com.logger").init(ListLast(getMetadata(this).name,'.'))>--->
	
	<cffunction name="init" hint="Constructor" output="false">
		<cfargument name="dsn" required="true" type="string">
		<cfargument name="sysid" required="false" type="numeric" default="#variables.instance.sysid#">
		<cfargument name="locid" required="false" type="numeric" default="#variables.instance.locid#">
		<cfset variables.instance.dsn=arguments.dsn>
		<cfset variables.instance.sysid=trim(arguments.sysid)>
		<cfset variables.instance.locid=trim(arguments.locid)>
		
		<cfreturn this/>
	</cffunction>
	
	<cffunction name="runSQL" hint="Executes SQL statement" output="false">
		<cfargument name="sql" required="true" type="string" hint="SQL statement">
		<cfargument name="datasource" required="false" default="#variables.instance.dsn#" type="string" hint="Datasource">
		<cfset var local = StructNew()/>
		<cftry>
		<cfsetting requesttimeout="300"/>	
		<cfset local.tickBegin = GetTickCount()>
		
		<cfset ARGUMENTS.sql = replaceNoCase(ARGUMENTS.sql,"--{LOC_ID}--",variables.instance.locid,'ALL')>
		<cfset ARGUMENTS.sql = replaceNoCase(ARGUMENTS.sql,"--{SYS_ID}--",variables.instance.sysid,'ALL')>
		<!---<cfset ARGUMENTS.sql = rereplaceNoCase(ARGUMENTS.sql,'<[^>]+>'," ","ALL")>--->
		<cfset ARGUMENTS.sql = rereplaceNoCase(ARGUMENTS.sql,"&nbsp;"," ","ALL")>
		<cfset ARGUMENTS.sql = rereplaceNoCase(ARGUMENTS.sql,"FROM"," FROM","ALL")>
		<cfset ARGUMENTS.sql = rereplaceNoCase(ARGUMENTS.sql,"WHERE"," WHERE","ALL")>
		<cfset ARGUMENTS.sql = rereplaceNoCase(ARGUMENTS.sql,"AND"," AND","ALL")>
		<cfset ARGUMENTS.sql = rereplaceNoCase(ARGUMENTS.sql,"ORDER"," ORDER","ALL")>
		<!---<cfset variables.logger.writeLog("Running SQL: #ARGUMENTS.sql#")>--->
		<!--- <cfset ARGUMENTS.sql = Replace(arguments.sql, "=\d{1,}", "'", "ALL")>  --->   
			<cfquery name="local.qSQL" datasource="#ARGUMENTS.datasource#">
				#preservesinglequotes(ARGUMENTS.sql)#
			</cfquery>
			<cfset local.tickEnd = GetTickCount()>
			<cfset local.requestTime = local.tickEnd-local.tickBegin>
			<!---<cfset variables.logger.writeLog("Running SQL Result: #local.qSql.recordcount# (#local.requestTime# ms)")>--->
			<cfreturn local.qSQL/>
		<cfcatch>
			<cfreturn cfcatch.message & " " & cfcatch.detail/>
		</cfcatch>
		</cftry>
	</cffunction>
	
	<cffunction name="getLocationsBySystem" hint="Gets List of Locations based on System" output="false" access="remote">
		<cfargument name="sysid" required="no" default="">
		<cfargument name="dsn" required="no" default="#variables.instance.dsn#">
		<cfset var local = StructNew()>
		<cfif not isNumeric(arguments.sysid)>
			<cfset arguments.sysid = 0>
		</cfif>
		<cfquery name="local.getLocs" datasource="#arguments.dsn#">
			SELECT DISTINCT(c2.code_value) curr_site
			FROM code c,
			  code c2,
			  code c3,
			  code_by_loc cbl,
			  location l
			WHERE c.code_id  = cbl.group_cd
			AND c2.code_id   = l.site_cd
			AND cbl.loc_id   = l.loc_id
			AND c.code_value = 'SYS_BY_LOC'
			AND cbl.code_id  = c3.code_id
			AND c3.code_id   = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.sysid)#"/>
			ORDER BY c2.code_value ASC
		
		</cfquery>
		<cfreturn local.getLocs>
	</cffunction>
	
</cfcomponent>