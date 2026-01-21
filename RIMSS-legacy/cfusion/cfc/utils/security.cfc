<!---
#######################################################################################################
Security CFC (security.cfc)
Author(s): 	Matthew Abbott(Matthew.Abbott@robins.af.mil)
			Andrew Abbott (Andrew.Abbott@robins.af.mil)

Notes
------------
- This is the component to handle basic security of RAMPOD applications

Updates
------------
2-JUN-2010 10:37 MWA fix to changeELC() method to make sure baseArray exists
19-OCT-2010 13:45 MWA added findPGMID() and getPGMID() and setPGMID()  
28-OCT-2010 13:45 MWA added isSupervisor() and fixed isAdmin()
1/27/2011 18:48:09 - matthew.abbott Worked on deployment pieces
1/28/2011 09:32:26 - matthew.abbott reworked code that determined correct system
					 matthew.abbott more system work
3/3/2011 16:16:47 - matthew.abbott added orderSites() orderSESites() private methods
3/22/2011 15:32:06 - matthew.abbott rewrote security.cfc to have all properties listed with defaults
3/23/2011 10:00:40 - matthew.abbott populated priv list array
3/25/2011 11:11:36 - matthew.abbott getCurrentSystem() made explicit
3/28/2011 11:15:05 - matthew.abbott added site data from agg_user to privs
5/4/2011 16:46:44 - matthew.abbott forced deployed location to be default location
5/25/2011 12:55:42 - matthew.abbott  fix for isAdmin() and isSupervisor()
5/26/2011 11:15:33 - matthew.abbott getWorkCentersByLocSys() changed to set IMDSCurrentUnit() if only one record returns
6/1/2011 17:05:38 - matthew.abbott getUserWorkCenters() updated setSystemByWorkcenterLocid() added
6/13/2011 09:15:58 - matthew.abbott turned off debugging by default
6/14/2011 16:54:38 - matthew.abbott getSystemsByLocation updated
6/16/2011 16:01:32 - matthew.abbott setSystemByWCLoc() added to attempt to set current system.
6/16/2011 16:14:57 - matthew.abbott set authorized to false if cant find a system, or user doesnt have right system
7/7/2011 09:52:37 - matthew.abbott bug fix.  call to getProperty() needs to be getUserProperty()
7/7/2011 15:07:08 - matthew.abbott added deployed wc/loc to get system to setSystemByWCLoc() 
7/7/2011 17:04:13 - matthew.abbott added call to findPGMID() in setSystemByWCLoc()
11/16/2011 12:05:28 - matthew.abbott cleaned up comments, var scoped some variables, 
					  changed where it wouldnt add priv unless relevant id is not blank and numeric
11/17/2011 11:19:51 - matthew.abbott set systemids property to Empty Array
12/6/2011 17:25:58 - matthew.abbott made use of new default_sys_id column
12/7/2011 13:15:34 - matthew.abbott added sesiteids property
2/2/2012 14:19:42 - matthew.abbott added useHomeLocation() check for deployed users
4/3/2012 17:19:25 - matthew.abbott changed uname argument in setCamsUser() from numeric to string
4/20/2012 13:23:04 - matthew.abbott called findPGMID() in the getUserInfo()
6/4/2012 13:43:47 - matthew.abbott updated getPermissions() to filter down to just GLOBAL_EYE as app_name
#######################################################################################################
--->
<cfcomponent output="false">
	<cfset VARIABLES.instance = structNew()>
	<cfset VARIABLES.instance.version = CreateDateTime(2012,06,04,13,43,47)>
	<cfset VARIABLES.other = ArrayNew(1)>
	<cfset VARIABLES.isLoggedIn = false>
	<cfset VARIABLES.log = false>
	
	<!--- structure with defaults for ALL explicit properties--->
	<cfset VARIABLES.instance.userInfo = structNew()>
	<cfset VARIABLES.instance.userInfo.active = 'N'>
	<cfset VARIABLES.instance.userInfo.authorized = false>
	<cfset VARIABLES.instance.userInfo.camsusername = "">
	<cfset VARIABLES.instance.userInfo.ctlocid = 0>
	<cfset VARIABLES.instance.userInfo.currentlocation = "">
	<cfset VARIABLES.instance.userInfo.currentlocation = "">
	<cfset VARIABLES.instance.userInfo.currentdeployedlocation = "">
	<cfset VARIABLES.instance.userInfo.currentdeployedlocationid = 0>
	<cfset VARIABLES.instance.userInfo.currentdeployedsitecd = 0>
	<cfset VARIABLES.instance.userInfo.currentlocation = "">
	<cfset VARIABLES.instance.userInfo.currentlocationid = 0>
	<cfset VARIABLES.instance.userInfo.currentsite = "">
	<cfset VARIABLES.instance.userInfo.currentsitecd = 0>
	<cfset VARIABLES.instance.userInfo.currentsquad = "">
	<cfset VARIABLES.instance.userInfo.currentsquadcd = "">
	<cfset VARIABLES.instance.userInfo.currentsystem = "">
	<cfset VARIABLES.instance.userInfo.currentsystemid = 0>
	<cfset VARIABLES.instance.userInfo.currentworkcenter = "">
	<cfset VARIABLES.instance.userInfo.currentworkcenterid = 0>
	<cfset VARIABLES.instance.userInfo.currentunit = "">
	<cfset VARIABLES.instance.userInfo.currentcd = 0>
	<cfset VARIABLES.instance.userInfo.elc = 0>
	<cfset VARIABLES.instance.userInfo.imdscurrentbase = "">
	<cfset VARIABLES.instance.userInfo.imdscurrentelc = 0>
	<cfset VARIABLES.instance.userInfo.imdscurrentunit = "">
	<cfset VARIABLES.instance.userInfo.imdshomebase = "">
	<cfset VARIABLES.instance.userInfo.imdshomeelc = 0>
	<cfset VARIABLES.instance.userInfo.imdshomeunit = "">
	<cfset VARIABLES.instance.userInfo.email = "">
	<cfset VARIABLES.instance.userInfo.errors = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.firstname = "">
	<cfset VARIABLES.instance.userInfo.globaleyeadmin = false>
	<cfset VARIABLES.instance.userInfo.geoloc = "">
	<cfset VARIABLES.instance.userInfo.homelocation = "">
	<cfset VARIABLES.instance.userInfo.homelocationid = 0>
	<cfset VARIABLES.instance.userInfo.homelocid = 0>
	<cfset VARIABLES.instance.userInfo.homesite = "">
	<cfset VARIABLES.instance.userInfo.homesitecd = 0>
	<cfset VARIABLES.instance.userInfo.homesquad = "">
	<cfset VARIABLES.instance.userInfo.homesquadcd = 0>
	<cfset VARIABLES.instance.userInfo.homesystem = "">
	<cfset VARIABLES.instance.userInfo.homesystemid = 0>
	<cfset VARIABLES.instance.userInfo.homeunit = "">
	<cfset VARIABLES.instance.userInfo.homeunitcd = 0>
	<cfset VARIABLES.instance.userInfo.homeworkcenter = "">
	<cfset VARIABLES.instance.userInfo.homeworkcenterid = 0>
	<cfset VARIABLES.instance.userInfo.imdsempno = "">
	<cfset VARIABLES.instance.userInfo.lastname = "">
	<cfset VARIABLES.instance.userInfo.locid = 0>
	<cfset VARIABLES.instance.userInfo.majcom = "">
	<cfset VARIABLES.instance.userInfo.majcomcd = 0>
	<cfset VARIABLES.instance.userInfo.middlename = "">
	<cfset VARIABLES.instance.userInfo.other = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.parsaccess = false>
	<cfset VARIABLES.instance.userInfo.pgmid = 0>
	<cfset VARIABLES.instance.userInfo.privlist = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.rank = "">
	<cfset VARIABLES.instance.userInfo.seaccess = false>
	<cfset VARIABLES.instance.userInfo.seadmin = false>
	<cfset VARIABLES.instance.userInfo.sebases = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.sesitecds = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.sesites = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.sesiteids = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.site = "">
	<cfset VARIABLES.instance.userInfo.sitecd = 0>
	<cfset VARIABLES.instance.userInfo.sitecds = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.siteids = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.sites = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.squad = "">
	<cfset VARIABLES.instance.userInfo.squadcd = 0>
	<cfset VARIABLES.instance.userInfo.supervisor = false>
	<cfset VARIABLES.instance.userInfo.systemids = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.systems = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.unit = "">
	<cfset VARIABLES.instance.userInfo.unitcd = 0>
	<cfset VARIABLES.instance.userInfo.userid = 0>
	<cfset VARIABLES.instance.userInfo.username = "">
	<cfset VARIABLES.instance.userInfo.workcenter = "">
	<cfset VARIABLES.instance.userInfo.workcenters = ArrayNew(1)>
	<cfset VARIABLES.instance.userInfo.workcenterid = 0>
	<cfset VARIABLES.instance.userInfo.workcenterids = ArrayNew(1)>
	
	
	
	<!---init--->
	<cffunction name="init" access="public" returntype="any" output="no">
	  <cfargument name="dsn" type="string" required="yes">
	  <cfargument name="username" type="string" required="no">
	  <cfset set('dsn',ARGUMENTS.dsn)>
	  <cfif StructKeyExists(ARGUMENTS,"username")>
	   <!--- <cfset getUserInfo(ARGUMENTS.username)/>--->
	    	<cfset login(ARGUMENTS.username)/>
	  </cfif>
	  <cfset logMe("Security Module Initialized #Now()#")>
	  <cfreturn this>
	</cffunction>
	
	<!---login--->
	<cffunction name="login" access="public" returntype="boolean" output="no">
		<cfargument name="username" required="yes" type="string"/>
	    <cfset user = getUserInfo(trim(ARGUMENTS.username))/>
		<cfif isAuthorized()>
			<cfset orderSites()/>
			<cfset orderSESites()/>
		</cfif>
		<!---<!---set system--->
		<cfset setSystemByWCLoc(getUserProperty('currentworkcenterid'),getUserProperty('currentlocationid'))/>--->
	    <cfreturn isAuthorized()/>
	</cffunction>
	
	<!---getUserInfo--->
	<cffunction name="getUserInfo" access="public" returntype="any" output="no">
		<cfargument name="username" required="true" type="string"/>
		<cfset var local = StructNew()/>
		
		<!--- reset errors --->
  		<cfset SetUserProperty('errors',ArrayNew(1))>
  
		<cfstoredproc datasource="#getDSN()#" procedure="GLOBALEYE.GET_USER_INFO">
			<cfprocparam cfsqltype="cf_sql_varchar" value="#Trim(UCase(ARGUMENTS.username))#" variable="p_user" type="in">
			<cfprocresult name="local.qTempVar">
		</cfstoredproc>
		
		<cfif local.qTempVar.recordCount>
    		<cfset setUserProperty('authorized',true)/>
			<!---loop through adding properties to the userInfo structure--->	
			<cfloop array="#local.qTempVar.getColumnList()#" index="c">
		    	<cfset structInsert(VARIABLES.instance.userInfo,ReReplaceNoCase(c,'_','','ALL'),local.qTempVar[c][1],true)>
		    	<!---<cfset logMe("#Ucase(ARGUMENTS.username)# - #ReReplaceNoCase(c,'_','','ALL')# - #local.qTempVar[c][1]#")>--->
		  	</cfloop>
			
		<cfelse>
			<cfset addError('User #Ucase(ARGUMENTS.username)# does not exist!')/>
    		<cfset addError('User #Ucase(ARGUMENTS.username)# not authorized')/>	
		</cfif>
		<!--- add Pars Access--->
    	<cfset StructInsert(VARIABLES.instance.userInfo,UCase('PARSACCESS'),hasParsAccess(UCase(ARGUMENTS.username)),true)/>
		
		<!---reset currentworkcenterid to 0--->
		<cfif StructKeyExists(VARIABLES.instance.userInfo,"currentworkcenterid") and not len(trim(variables.instance.userInfo.currentworkcenterid))>
			<cfset setUserProperty('currentworkcenterid',0)/>
		</cfif>
		
	
		<!---set currentsystemid to defaultsysid--->
		<cfif StructKeyExists(VARIABLES.instance.userInfo,"defaultsysid") and StructKeyExists(VARIABLES.instance.userInfo,"currentsystemid")>
	 		<cfset VARIABLES.instance.userInfo.CURRENTSYSTEMID = VARIABLES.instance.userInfo.DEFAULTSYSID/>
		</cfif>
		<!---set currentsystem to system--->
		<cfif StructKeyExists(VARIABLES.instance.userInfo,"system") and StructKeyExists(VARIABLES.instance.userInfo,"currentsystem")>
	 		<cfset VARIABLES.instance.userInfo.CURRENTSYSTEM = VARIABLES.instance.userInfo.SYSTEM/>
		</cfif>

		<!---call additional functions to populate additional data--->
		<cfset getPermissions(Trim(UCase(ARGUMENTS.username)))/>
		<cfset getAdditionalPermissions(Trim(UCase(ARGUMENTS.username)))/>
		<cfset getUserWorkCenters(Trim(UCase(ARGUMENTS.username)),getUserProperty('currentlocationid'))/>
		


		<!---check to see if defaultsysid is empty or 0--->
		<cfif StructKeyExists(VARIABLES.instance.userInfo,'DEFAULTSYSID') 
				and (not len(trim(VARIABLES.instance.userInfo.DEFAULTSYSID)) 
				or not VARIABLES.instance.userInfo.DEFAULTSYSID) >
			
			<!---attempt to find system if the default is blank--->
			<cfset local.qSystems = getSystemByWorkCenterLoc(getUserProperty('currentlocationid'),getUserProperty('currentworkcenterid'))/>
			<cfif local.qSystems.recordCount>
				<cfset local.syslist = ArrayToList(getUserProperty('SYSTEMIDS'))/>

				
				
				<cfset local.found = 0/>
				
				<cfloop query="local.qSystems">
	
					<!---check to see if the user has the system priv--->
					<cfif ListFindNoCase(ArrayToList(getUserProperty('SYSTEMIDS')),sys_id)>
						<cfset setUserProperty('CURRENTSYSTEMID',sys_id)/>
						<cfset setUserProperty('CURRENTSYSTEM',sys)/>
						<cfset setUserProperty('HOMESYSTEMID',sys_id)/>
						<cfset setUserProperty('HOMESYSTEM',sys)/>
						<cfset found = 1/>
						<cfbreak/>
					</cfif>
				</cfloop>
				
				<cfif not found>
					<cfif listLen(ValueList(local.qSystems.sys)) eq 1>
						<cfset addError('User #Ucase(ARGUMENTS.username)# needs to have the following system (#VALUELIST(local.qSystems.sys)#)')/>	
					<cfelse>
						<cfset addError('User #Ucase(ARGUMENTS.username)# needs to have one the following systems (#VALUELIST(local.qSystems.sys)#)')/>	
					</cfif>
					<cfset setUserProperty('authorized',false)/>
				</cfif>
				
			<cfelse>
				<cfset addError('Cannot Determine Default System for User #Ucase(ARGUMENTS.username)# ')/>	
				<cfset setUserProperty('authorized',false)/>
			</cfif>

		<cfelse>
			
			<!---attempt to setup default system--->
			<cfset local.qSystems = getSystemByWorkCenterLoc(getUserProperty('currentlocationid'),getUserProperty('currentworkcenterid'))/>
			<cfif local.qSystems.recordCount>
				<cfset local.syslist = ArrayToList(getUserProperty('SYSTEMIDS'))/>

				
				
				<cfset local.found = 0/>
				
				<cfloop query="local.qSystems">
	
					<!---check to see if the user has the system priv--->
					<cfif ListFindNoCase(ArrayToList(getUserProperty('SYSTEMIDS')),sys_id)>
						<cfset setUserProperty('CURRENTSYSTEMID',sys_id)/>
						<cfset setUserProperty('CURRENTSYSTEM',sys)/>
						<cfset setUserProperty('HOMESYSTEMID',sys_id)/>
						<cfset setUserProperty('HOMESYSTEM',sys)/>
						<cfset found = 1/>
						<cfbreak/>
					</cfif>
				</cfloop>
				
				<cfif not found>
					<cfif listLen(ValueList(local.qSystems.sys)) eq 1>
						<cfset addError('User #Ucase(ARGUMENTS.username)# needs to have the following system (#VALUELIST(local.qSystems.sys)#)')/>	
					<cfelse>
						<cfset addError('User #Ucase(ARGUMENTS.username)# needs to have one the following systems (#VALUELIST(local.qSystems.sys)#)')/>	
					</cfif>
					<cfset setUserProperty('authorized',false)/>
				</cfif>
				
			<cfelse>
				<cfset addError('Cannot Determine Default System for User #Ucase(ARGUMENTS.username)# ')/>	
				<cfset setUserProperty('authorized',false)/>
			</cfif>
			
			
			
			
			<cfset findPGMID(getUserProperty('CURRENTSYSTEMID'))/>
			
			
			<!---validate system/wc/location--->
			<cfset local.validate = ValidateData(getUserProperty('CURRENTSYSTEMID'),getUserProperty('CURRENTLOCATIONID'),getUserProperty('CURRENTWORKCENTERID'))/>
			<cfif not local.validate>
				<!---not valid--->
				<cfset addError('User #Ucase(ARGUMENTS.username)#- ValidateData() did not pass')/>
				<cfset setUserProperty('authorized',false)/>
			</cfif>
			
		</cfif>

		
	</cffunction>
	
	<!---use home location (used for deployed users)--->
	<cffunction name="useHomeLocation" output="false" returnType="boolean">
		<cfif isDeployed() and getUserProperty('currentlocationid') eq getUserProperty('currentdeployedlocationid')>
			<cfreturn true/>
		<cfelse>
			<cfreturn false/>
		</cfif>
	</cffunction>
	
	<!---Validate Data--->
	<cffunction name="ValidateData" output="false">
		<cfargument name="sysid" required="true" type="any"/>
		<cfargument name="locid" required="true" type="any"/>
		<cfargument name="wccd" required="true" type="any"/>
		
		<cfset var qValidate = ""/>
		
		
		<cfif not isNumeric(ARGUMENTS.sysid)>
			<cfset ARGUMENTS.sysid = 0/>
		</cfif>
		
		<cfif not isNumeric(ARGUMENTS.locid)>
			<cfset ARGUMENTS.locid = 0/>
		</cfif>
		
		<cfif not isNumeric(ARGUMENTS.wccd)>
			<cfset ARGUMENTS.wccd = 0/>
		</cfif>
		
		
		
		<cfquery name="qValidate" datasource="#getDSN()#">
			SELECT  cbc.to_code code_value,
	                cbc.code_b code_id,
	                cbc.code_a sys_id,
	                cbl.loc_id,
	                l.site || ' ' || l.unit site,
	                c.code_value sys
	        FROM    code_by_loc_view cbl,
	                code_by_code_view cbc,
	                code c,
	                location_view l
	        WHERE   cbl.group_name='WC_BY_LOC'
	        AND     cbc.group_name    ='WC_BY_SYS'
	        AND     cbl.loc_id        = cbc.loc_id
	        AND     cbl.code_id       = cbc.code_b
	        AND     cbl.loc_id       = <cfqueryparam cfsqltype="cf_sql_numeric" value="#ARGUMENTS.locid#"/>
	        AND     cbc.active_a      = 'Y'
	        AND     cbc.active_b      = 'Y'

	        AND     cbc.code_a = c.code_id
	        AND     cbl.code_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#ARGUMENTS.wccd#"/>
	        AND     cbl.loc_id = l.loc_id
          	AND     cbc.code_a = <cfqueryparam cfsqltype="cf_sql_numeric" value="#ARGUMENTS.sysid#"/>
	
	        UNION
	        
			
			Select cbc.to_code code_value, cbc.code_b code_id, cbc.code_a sys_id, cbc.loc_id, lv.site || ' ' || lv.unit site,cbc.from_code sys 
	        from	code_by_code_view cbc, globaleye.location_view lv
	        where	group_name = 'DEPLOYED_WC'
	        and 	cbc.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#ARGUMENTS.locid#"/>
	        and   cbc.loc_id = lv.loc_id
	        and		cbc.active_a = 'Y'
	        and		cbc.active_b = 'Y'
	        and   cbc.code_a = <cfqueryparam cfsqltype="cf_sql_numeric" value="#ARGUMENTS.sysid#"/>
	        and  cbc.code_b = <cfqueryparam cfsqltype="cf_sql_numeric" value="#ARGUMENTS.wccd#"/>
			order by 4,6
			
		</cfquery>
		
		<cfif not qValidate.recordCount>
			<cfreturn false/>
		<cfelse>
			<cfreturn true/>
		</cfif>
		
		
	</cffunction>
	
	<!--- is Authorized --->
	<cffunction name="isAuthorized" returntype="boolean" access="public" output="no">
		<cfreturn VARIABLES.instance.userInfo.authorized/>
	</cffunction>
	
	<!---getPermissions--->
	<cffunction name="getPermissions" returntype="query" access="public" output="no">
		<cfargument name="username" required="no" default="#getUserName()#">
		<cfset var local = StructNew()/>
		
		<cfset local.lse_sites = ArrayNew(1)/>
	    <cfset local.lse_sitecds = ArrayNew(1)/>
	    <cfset local.lse_bases = ArrayNew(1)/>
	    <cfset local.ais_sites = ArrayNew(1)/>
	    <cfset local.sites = ArrayNew(1)/>
	    <cfset local.siteids = ArrayNew(1)/>
	    <cfset local.sitecds = ArrayNew(1)/>
	    <cfset local.work_center_ids = ArrayNew(1)/>
	    <cfset local.work_centers = ArrayNew(1)/>
	    <cfset local.systems = ArrayNew(1)/>
	    <cfset local.system_ids = ArrayNew(1)/>
		
		<!---add defaults to user structure--->
		<cfif StructKeyExists(VARIABLES.instance.userInfo,"locid") and isNumeric(VARIABLES.instance.userInfo.locid)>
    		<cfset ArrayPrepend(local.siteids,VARIABLES.instance.userInfo.locid)/>
  		</cfif>

		<cfif StructKeyExists(VARIABLES.instance.userInfo,"currentsitecd") and isNumeric(VARIABLES.instance.userInfo.currentsitecd)>
		 	<cfset ArrayPrepend(local.sitecds,VARIABLES.instance.userInfo.currentsitecd)/>
		</cfif>

		<cfif StructKeyExists(VARIABLES.instance.userInfo,"currentsite")>
		 	<cfset ArrayPrepend(local.sites,VARIABLES.instance.userInfo.currentsite & " " &  VARIABLES.instance.userInfo.currentunit)/>
		</cfif>
		
		<cfif StructKeyExists(VARIABLES.instance.userInfo,"defaultsysid") and StructKeyExists(VARIABLES.instance.userInfo,"currentsystemid")>
		 	<cfset ArrayPrepend(local.system_ids,VARIABLES.instance.userInfo.defaultsysid)/>
		</cfif>
		
		<cfif StructKeyExists(VARIABLES.instance.userInfo,"system") and StructKeyExists(VARIABLES.instance.userInfo,"currentsystem")>
		 	<cfset ArrayPrepend(local.systems,VARIABLES.instance.userInfo.system)/>
		</cfif>
		
		<cfquery name="local.qPermissions" datasource="#getDSN()#">
			Select      u.user_name,
			            p.priv,
			            p.priv_id,
			            trim(p.app_name) app_name,
			            trim(p.sub_app) sub_app,
			            trim(p.relevant_id) relevant_id,
			            trim(p.relevant) relevant,
			            DECODE(relevant,'LOCATION', l.site || ' ' || l.unit, TRIM(c.code_value)) CODE_VALUE,
			            DECODE(relevant,'LOCATION',
			              (
			                SELECT 	site_cd
			                FROM	globaleye.location_view l
			                WHERE	loc_id = relevant_id
			              )
			            ,0) site_cd
			
			    from    aggregate.agg_user u,
			            aggregate.AGG_USER_PRIV p,
			            globaleye.code c,
			            location_view l
			    where   u.user_name = p.user_name
			    and     u.active = 'Y'
			    and		p.active = 'Y'
			    and     u.user_name = <cfqueryparam cfsqltype="cf_sql_varchar" value="#UCase(ARGUMENTS.username)#">
			    and		p.relevant_id = c.code_id(+)
			    and   	p.relevant_id = l.loc_id(+)
			    and		p.app_name = <cfqueryparam cfsqltype="cf_sql_varchar" value="GLOBAL_EYE">
			    --and 	p.relevant_id is not null
			order by 	p.sub_app,p.relevant
		</cfquery>
		
		<!--- priv array --->
        <cfset StructInsert(VARIABLES.instance.userInfo,UCase("PRIVLIST"),ListToArray(ValueList(local.qPermissions.priv)),true)/>
		
		<cfoutput query="local.qPermissions" group="user_name">
			<cfoutput group="app_name">
			    <cfoutput group="sub_app">
			        	<cfoutput>
			            <cfswitch expression="#relevant#">
			            	<!--- LOCATION privs--->
			                <cfcase value="LOCATION">

								<cfif len(trim(relevant_id)) and isNumeric(trim(relevant_id))>
				                    <cfif trim(sub_app) eq 'SE'>
				
										<cfif not listFindNoCase(ArrayToList(local.lse_sites),relevant_id)>
				                            <cfset ArrayAppend(local.lse_sites,relevant_id)>
				                            <cfset ArrayAppend(local.lse_sitecds,site_cd)>
				                            <cfset ArrayAppend(local.lse_bases,code_value)>
				                            <cfset logMe("#Ucase(ARGUMENTS.username)# - SE Location #relevant_id# #code_value# added. ")>
				                        </cfif>
				
				                    <cfelseif trim(sub_app) eq 'AIS'>
				
				                        <cfif not listFindNoCase(ArrayToList(local.ais_sites),relevant_id)>
				                            <cfset ArrayAppend(local.ais_sites,relevant_id)>
				
				                        	<cfset logMe("#Ucase(ARGUMENTS.username)# - AIS Location #relevant_id# #code_value# added. ")>
				                        </cfif>
				
				                    <cfelseif trim(priv) eq 'DEPLOYED'>
				                    	
				                        <cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTDEPLOYEDLOCATION'),code_value,true)/>
				                        <cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTDEPLOYEDLOCATIONID'),relevant_id,true)/>
				                        <cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTDEPLOYEDSITECD'),site_cd,true)/>
				                    	
										<!--- set current location to deployed info --->
										<cfset setCurrentLocationInfo(relevant_id)/>
										<cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTLOCATION'),code_value,true)/>
				                        <cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTLOCATIONID'),relevant_id,true)/>
				                        <cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTSITECD'),site_cd,true)/>    
									
				                        
				                        <cfif not listFindNoCase(ArrayToList(local.siteids),relevant_id)>
												<cfset ArrayAppend(local.sitecds,site_cd)/>
				                                <cfset ArrayAppend(local.siteids,relevant_id)>
				                                <cfset logMe("#Ucase(ARGUMENTS.username)# - GE Location #relevant_id# #code_value# added. ")/>
				                        </cfif>
				
				
				                        <cfif not listFindNoCase(ArrayToList(local.sites),code_value)>
												<cfset ArrayAppend(local.sites,code_value)/>
				                        </cfif>
				
				                    <cfelse>
				
				                    	<cfif not listFindNoCase(ArrayToList(local.siteids),relevant_id)>
												<cfset ArrayAppend(local.sitecds,site_cd)/>
				                                <cfset ArrayAppend(local.siteids,relevant_id)>
				                                <cfset logMe("#Ucase(ARGUMENTS.username)# - GE Location #relevant_id# #code_value# added. ")/>
				                        </cfif>
				
				
				                        <cfif not listFindNoCase(ArrayToList(local.sites),code_value)>
												<cfset ArrayAppend(local.sites,code_value)/>
				                        </cfif>
				
				                        <cfif not listFindNoCase(ArrayToList(local.siteids),relevant_id)>
				                                <cfset ArrayAppend(local.sitecds,site_cd)/>
				                                <cfset ArrayAppend(local.siteids,relevant_id)>
				                                <cfset logMe("#Ucase(ARGUMENTS.username)# - GE Location #relevant_id# #code_value# added. ")/>
				                        </cfif>
				
				                    </cfif>
								</cfif>
			               </cfcase>
			
			               <!--- WORK CENTER privs--->
			               <cfcase value="WORK_CENTER">
						   	   
						   	   
						   	   <cfif len(trim(relevant_id)) and isNumeric(trim(relevant_id))>
						   	   
				                    <cfif not listFindNoCase(ArrayToList(local.work_center_ids),relevant_id)>
				                        <cfset ArrayAppend(local.work_center_ids,relevant_id)>
										<cfset logMe("#Ucase(ARGUMENTS.username)# - Work Center ID #relevant_id# added. ")/>
				                    </cfif>
				                    <cfif not listFindNoCase(ArrayToList(local.work_centers),code_value)>
				                        <cfset ArrayAppend(local.work_centers,code_value)>
				                        <cfset logMe("#Ucase(ARGUMENTS.username)# - Work Center #code_value# added. ")/>
				
				                    </cfif>
			                    
								</cfif>
								
			                </cfcase>
			
			                <!---SYSTEM privs--->
			                <cfcase value="SYSTEM">
								
								<cfif len(trim(relevant_id)) and isNumeric(trim(relevant_id))>
								
				                    <cfif not listFindNoCase(ArrayToList(local.systems),code_value)>
				                        <cfset ArrayAppend(local.systems,code_value)>
				                        <cfset logMe("#Ucase(ARGUMENTS.username)# - System #code_value# added. ")/>
				
				                    </cfif>
				                    <cfif not listFindNoCase(ArrayToList(local.system_ids),relevant_id)>
				                        <cfset ArrayAppend(local.system_ids,relevant_id)>
				                        <cfset logMe("#Ucase(ARGUMENTS.username)# - System ID #relevant_id# added. ")/>
				
				                    </cfif>
			                    
								</cfif>
			                </cfcase>
							
							<!---SUPERVISOR privs--->
			                <cfcase value="SUPERVISOR">
			                	<cfset logMe("#Ucase(ARGUMENTS.username)# - Supervisor set to  true ")/>
			                    <cfset setUserProperty('SUPERVISOR',true)/>
			                </cfcase>

			            </cfswitch>
			
			        </cfoutput>
			    </cfoutput>
			</cfoutput>
		</cfoutput>
		

		<cfif not ArrayLen(local.systems)>
			<cfset VARIABLES.instance.userInfo.currentSystem = ''/>
	        <cfset VARIABLES.instance.userInfo.homeSystem = ''/>
	        <cfset addError('User #Ucase(ARGUMENTS.username)# does not have a System')/>
	        <cfset StructInsert(VARIABLES.instance.userInfo,UCase('authorized'),false,true)/>
    	</cfif>
		
		<!--- add arrays to main user object--->
	    <cfset StructInsert(VARIABLES.instance.userInfo,UCase("systems"),local.systems,true)/>
	    <cfset structInsert(VARIABLES.instance.userInfo,UCase('systemids'),local.system_ids,true)>
	    <cfset StructInsert(VARIABLES.instance.userInfo,UCase("sesites"),local.lse_sites,true)/>
		<cfset StructInsert(VARIABLES.instance.userInfo,UCase("sesiteids"),local.lse_sites,true)/>
		<cfset set('se',local.lse_sites)/>
	    <cfset StructInsert(VARIABLES.instance.userInfo,UCase("sesitecds"),local.lse_sitecds,true)/>
	    <cfset structInsert(VARIABLES.instance.userInfo,UCase('workcenterids'), local.work_center_ids,true)>
		<cfset structInsert(VARIABLES.instance.userInfo,UCase('workcenters'), local.work_centers,true)>
	    <cfset structInsert(VARIABLES.instance.userInfo,UCase('sites'), local.sites,true)>
	    <cfset structInsert(VARIABLES.instance.userInfo,UCase('siteids'), local.siteids,true)>
	    <cfset structInsert(VARIABLES.instance.userInfo,UCase('sitecds'), local.sitecds,true)>
	    <cfset structInsert(VARIABLES.instance.userInfo,UCase('sebases'),local.lse_bases,true)>
	    <cfset structInsert(VARIABLES.instance.userInfo,UCase('aissites'),local.ais_sites,true)>
		
		<!--- hasSEAccess? --->
    	<cfset StructInsert(VARIABLES.instance.userInfo,UCase('SEACCESS'),hasSEAccess(),true)/>

		
		<cfreturn local.qPermissions/>
	</cffunction>
	
	<cffunction name="getAdditionalPermissions" hint="gets permissions that do not have a relevant id" output="no">
		<cfargument name="username" required="yes" type="string"/>
	    <cfset var qAdditionalPermissions = ""/>
	    <cfset var other = ArrayNew(1)/>
	    <cfset var subapp = ""/>
	
	    <cfquery name="qAdditionalPermissions" datasource="#getDSN()#">
	    	SELECT p.user_name,
	               p.priv,
	               NVL(p.relevant,p.priv) relevant,
	               p.sub_app,
	               p.app_name,
	               p.relevant_id
	        FROM   AGGREGATE.agg_user_priv p
	        WHERE  p.user_name = <cfqueryparam cfsqltype="cf_sql_varchar" value="#Trim(UCase(ARGUMENTS.username))#">
	        AND    p.relevant_id is null
	        AND    p.active = 'Y'
	    </cfquery>
	
		<cfoutput query="qAdditionalPermissions" group="relevant">
	    	<cfif UCASE(ReReplaceNoCase(relevant,'_','','ALL')) eq 'ADMIN'>
	        	<cfoutput>
	            	<cfset subapp = UCASE(ReReplaceNoCase(sub_app,'_','','ALL'))>
	                <cfset structInsert(VARIABLES.instance.userInfo,UCase(subapp & 'ADMIN'),true,true)>
	            </cfoutput>
	        <cfelse>
				<cfif not ListFindNoCase(ArrayToList(other),ReReplaceNoCase(relevant,'_','','ALL'))>
	                <cfset ArrayAppend(other,LCase(ReReplaceNoCase(relevant,'_','','ALL')))/>
	            </cfif>
	        </cfif>
	    </cfoutput>
	
	    <cfset SetUserProperty('other',other)/>
		
	</cffunction>
	
	<!---setup workcenters--->
	<cffunction name="getUserWorkCenters" access="public" output="no">
		<cfargument name="username" required="yes" type="string"/>
		<cfargument name="locid" type="string" required="no" default="0"/>
		<cfargument name="sysid" type="string" required="no" default="#GetUserProperty('currentsystemid')#"/>
	    <cfset var qWorkCenters = ""/>
		<cfset var out_select_record = ""/>
	    <cfset var siteids = VARIABLES.instance.userInfo.siteids/>
		<cfset var sitecds = VARIABLES.instance.userInfo.sitecds/>
		<cfset var sites = VARIABLES.instance.userInfo.sites/>
	    <cfset var locids = ArrayNew(1)/>
	    <cfset var found = 0/>
	
	
	
	
	
	    <!--- force it to be 0 if empty arguments--->
	    <cfif not Len(trim(ARGUMENTS.locid))>
	    	<cfset ARGUMENTS.locid = 0/>
	    </cfif>
	
	
	    <cfquery name="qWorkCenters" datasource="#getDSN()#" result="wc">
	    	SELECT  cbc.to_code code_value,
	                cbc.code_b code_id,
	                cbc.code_a sys_id,
	                cbl.loc_id,
	                l.site || ' ' || l.unit site,
	                c.code_value sys
	        FROM    code_by_loc_view cbl,
	                code_by_code_view cbc,
	                code c,
	                location_view l
	        WHERE   cbl.group_name='WC_BY_LOC'
	        AND     cbc.group_name    ='WC_BY_SYS'
	        AND     cbl.loc_id        = cbc.loc_id
	        AND     cbl.code_id       = cbc.code_b
	        AND     cbl.loc_id       IN (<cfqueryparam cfsqltype="cf_sql_varchar" list="yes" value="#ARGUMENTS.locid#">)
	        AND     cbc.active_a      = 'Y'
	        AND     cbc.active_b      = 'Y'
			AND		cbc.code_a in (<cfqueryparam cfsqltype="cf_sql_numeric" list="yes" value="#ARGUMENTS.sysid#">)
	        AND     cbc.code_a = c.code_id
	        AND cbl.loc_id = l.loc_id
	        AND cbc.to_code not in (<cfqueryparam cfsqltype="cf_sql_varchar" list="yes" value="#ArrayToList(getUserProperty('workcenters'))#">)
			AND	cbc.code_b > 0
			<cfif not isDeployed()>
			AND	cbc.to_code not in('ADEPL')
			
			</cfif>
			
			<cfif isDeployed()>
	        UNION
	        
			
			Select cbc.to_code code_value, cbc.code_b code_id, cbc.code_a sys_id, cbc.loc_id, lv.site || ' ' || lv.unit site,cbc.from_code sys 
	        from	code_by_code_view cbc, globaleye.location_view lv
	        where	group_name = 'DEPLOYED_WC'
	        and 	cbc.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.locid)#"/>
	        and   cbc.loc_id = lv.loc_id
	        and		cbc.active_a = 'Y'
	        and		cbc.active_b = 'Y'
	        and  cbc.code_a = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.sysid)#"/>
			AND cbc.to_code not in (<cfqueryparam cfsqltype="cf_sql_varchar" list="yes" value="#ArrayToList(getUserProperty('workcenters'))#">)
			AND	cbc.code_b > 0

			</cfif>
			
			
			
	        order by 4, 6
	    </cfquery>
	
		<cfloop query="qWorkCenters">
		<cfif loc_id eq ARGUMENTS.locid and isDeployed() and sys_id eq getUserProperty('currentsystemid')>
			<cfif isNumeric(qWorkCenters.code_id) and qWorkCenters.code_id gt 0 and ListFindNoCase(ArrayToList(getUserProperty('workcenterids')),qWorkCenters.code_id) >
			 	<cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTWORKCENTER'),qWorkCenters.code_value,true)/>
				<cfset StructInsert(VARIABLES.instance.userInfo,UCase('WORKCENTER'),qWorkCenters.code_value,true)/>
	         	<cfset StructInsert(VARIABLES.instance.userInfo,UCase('CURRENTWORKCENTERID'),qWorkCenters.code_id,true)/>
				<cfset StructInsert(VARIABLES.instance.userInfo,UCase('WORKCENTERID'),qWorkCenters.code_id,true)/>
			</cfif>
			<cfbreak/>
	    </cfif>
	    
	    </cfloop>


	     <cfstoredproc datasource="GLOBALEYE" procedure="GLOBALEYE.GET_WKCTR_LIST">
			<cfprocparam cfsqltype="cf_sql_varchar" value="#trim(Ucase(getUserName()))#" variable="p_user" type="in">
			<cfprocresult name="out_select_record">
		 </cfstoredproc>
	
		 
	
	
	     <!---quick way to remove locations a user doesnt have the system for--->
	     <!--- get locid string--->
		 <cfoutput query="out_select_record" group="loc_id">
	     	<cfset ArrayAppend(locids,loc_id)>
	     </cfoutput>


	   	<cfloop from="#ArrayLen(VARIABLES.instance.userInfo.siteids)#" to="1" step="-1"  index="r">
	     	<cfif not ListFindNoCase(ArrayToList(locids),VARIABLES.instance.userInfo.siteids[r])>
				<cfset ArrayDeleteAt(VARIABLES.instance.userInfo.siteids,r)/>
	            <cfset ArrayDeleteAt(VARIABLES.instance.userInfo.sites,r)/>
	            <cfset ArrayDeleteAt(VARIABLES.instance.userInfo.sitecds,r)/>
	        </cfif>
	  	</cfloop>

		<!---remove ADEPL, and NONE workcenters--->
		<cfif not isDeployed()>
			<cfquery name="out_select_record" dbtype="query" >
				
				SELECT * from out_select_record
				WHERE WKCTR != 'ADEPL'
				AND	WKCTR_ID > 0
				
			
			</cfquery>
		</cfif>


	     <cfloop query="out_select_record">
		 	 
	     	<cfif not ListFindNoCase(ArrayToList(VARIABLES.instance.userInfo.workcenterids),WKCTR_ID)>
	        	<cfif LOC_ID eq VARIABLES.instance.userInfo.CURRENTLOCATIONID>
	
	            	<cfset ArrayPrepend(VARIABLES.instance.userInfo.workcenterids,WKCTR_ID)/>
	            <cfelse>
	        		<cfset ArrayAppend(VARIABLES.instance.userInfo.workcenterids,WKCTR_ID)/>
	            </cfif>
	        </cfif>
	        <cfif not ListFindNoCase(ArrayToList(VARIABLES.instance.userInfo.workcenters),WKCTR)>
				
	        	<cfif LOC_ID eq VARIABLES.instance.userInfo.CURRENTLOCATIONID>
	
	        		<cfset ArrayPrepend(VARIABLES.instance.userInfo.workcenters,WKCTR)/>
	            <cfelse>
	            	<cfset ArrayAppend(VARIABLES.instance.userInfo.workcenters,WKCTR)/>
	            </cfif>
	        </cfif>
	        
	     </cfloop>
	
		<cfif (not len(trim(VARIABLES.instance.userInfo.CURRENTWORKCENTERID)) 
			or not variables.instance.userInfo.CURRENTWORKCENTERID) and ArrayLen(VARIABLES.instance.userInfo.workcenterids)>
	    	<cfset VARIABLES.instance.userInfo.CURRENTWORKCENTERID = VARIABLES.instance.userInfo.workcenterids[1]>
	    	<cfset VARIABLES.instance.userInfo.WORKCENTERID = VARIABLES.instance.userInfo.workcenterids[1]>
	    </cfif>
	
	    <cfif not len(trim(VARIABLES.instance.userInfo.CURRENTWORKCENTER)) and ArrayLen(VARIABLES.instance.userInfo.workcenters)>
	    	<cfset VARIABLES.instance.userInfo.CURRENTWORKCENTER = VARIABLES.instance.userInfo.workcenters[1]>
	    	<cfset VARIABLES.instance.userInfo.WORKCENTER = VARIABLES.instance.userInfo.workcenters[1]>
	    </cfif>
		
	    <cfif len(trim(VARIABLES.instance.userInfo.CURRENTWORKCENTER))>
			<cfset structInsert(VARIABLES.instance.userInfo,UCase('IMDSHomeUnit'),Left(VARIABLES.instance.userInfo.CURRENTWORKCENTER,1),true)>
	        <cfset structInsert(VARIABLES.instance.userInfo,UCase('IMDSCurrentUnit'),Left(VARIABLES.instance.userInfo.CURRENTWORKCENTER,1),true)>
		</cfif>
		
		<cfif ArrayLen(getUserProperty('workcenterids'))>
			<cfset setUserProperty('workcenterid',VARIABLES.instance.userInfo.workcenterids[1])/>
		</cfif>
	    
		<cfif ArrayLen(getUserProperty('workcenters'))>
			<cfset setUserProperty('workcenter',VARIABLES.instance.userInfo.workcenters[1])/>
		</cfif>
		
			
	    <cfreturn out_select_record>
	</cffunction>
	

	<cffunction name="getSystemByWorkCenterLoc" returntype="query" output="no" access="private">
		<cfargument name="locid" required="yes" type="any"/>
		<cfargument name="wcid" required="yes" type="any"/>
		<cfset var local = structNew()/>
	
		
		<cfif not isNumeric(ARGUMENTS.locid)>
			<cfset ARGUMENTS.locid = 0/>
		</cfif>
		
		<cfif not isNumeric(ARGUMENTS.wcid)>
			<cfset ARGUMENTS.wcid = 0/>
		</cfif>
		
		
		<cfquery name="local.qSystemByWorkCenterLoc" datasource="#get('dsn')#">
		
			
			
			SELECT  cbc.to_code code_value,
	                cbc.code_b code_id,
	                cbc.code_a sys_id,
	                cbl.loc_id,
	                l.site || ' ' || l.unit site,
	                c.code_value sys
	        FROM    code_by_loc_view cbl,
	                code_by_code_view cbc,
	                code c,
	                location_view l
	        WHERE   cbl.group_name='WC_BY_LOC'
	        AND     cbc.group_name    ='WC_BY_SYS'
	        AND     cbl.loc_id        = cbc.loc_id
	        AND     cbl.code_id       = cbc.code_b
	        AND     cbl.loc_id       = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.locid)#"/>
	        AND     cbc.active_a      = 'Y'
	        AND     cbc.active_b      = 'Y'

	        AND     cbc.code_a = c.code_id
	        AND     cbl.code_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.wcid)#"/>
	        AND cbl.loc_id = l.loc_id
			AND	cbc.code_b > 0
			
			<cfif not isDeployed()>
			AND	cbc.to_code not in('ADEPL')
			</cfif>
			
			<cfif isDeployed()>
	        UNION
	        
			
			Select cbc.to_code code_value, cbc.code_b code_id, cbc.code_a sys_id, cbc.loc_id, lv.site || ' ' || lv.unit site,cbc.from_code sys 
	        from	code_by_code_view cbc, globaleye.location_view lv
	        where	group_name = 'DEPLOYED_WC'
	        and 	cbc.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.locid)#"/>
	        and   cbc.loc_id = lv.loc_id
	        and		cbc.active_a = 'Y'
	        and		cbc.active_b = 'Y'
	        and  cbc.code_b = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.wcid)#"/>
			AND	cbc.code_b > 0
			order by 4,6
			</cfif>
		</cfquery>
		<cfreturn local.qSystemByWorkCenterLoc/>
	</cffunction>
	
	
	<!--- get Locations of users--->
	<cffunction name="getLocations" returntype="query" output="no">
	    <cfset var qLocations="">
	    <cfset var locids=0>
	    <cftry>
	            <cfif ArrayLen(getUserProperty('siteids'))>
	                <cfset locids=ArrayToList(getUserProperty('siteids'))>
	            <cfelse>
	                <cfset locids=0>
	            </cfif>
	    <cfcatch>
	        <cfset locids=0>
	    </cfcatch>
	    </cftry>
	    <cfquery name="qLocations" datasource="#get('dsn')#">
	        Select 	loc_id,
	                majcom,
	                majcom_cd,
	                site,
	                site_cd,
	                unit,
	                unit_cd,
	                squad,
	                squad_cd,
	                geoloc,
	                site || ' ' || unit base
	        from	globaleye.location_view
	        where	loc_id IN (0,<cfqueryparam cfsqltype="cf_sql_numeric" value="#locids#" list="yes">)
	    </cfquery>
	    <cfreturn qLocations>
	</cffunction>
	
	
	<!---getELCListing--->
	<cffunction name="getELCListing" returntype="any" output="no">
		<cfset var list = "">
	    <cfset var elcSearch = "">
	    <cfset var qELCListing = "">
	    <cfset var elcArray = ArrayNew(1)>
	    <cfset ArrayAppend(elcArray,0)>
		<cfif structKeyExists(session,'ws')>
	    	<cfset list = session.ws.changeELC('?')>
		
	        <cfset elcSearch = XMLSearch(list,"//*[name()='ELCNumber']")>
	        <cfif ArrayLen(elcSearch)>
			<cfloop array="#elcSearch#" index="e">
	        	<cfset ArrayAppend(elcArray,e.xmlText)>
	        </cfloop>
	        </cfif>
	
			<cfset logMe(ArrayToList(elcArray))/>
	
	        <cfquery name="qELCListing" datasource="#get('dsn')#" result="">
	        	
	            SELECT 		cbl.loc_id,
	   						c2.code_value elc,
			       			c2.code_type,
	   						l.site base,
	   						l.unit
				FROM 		code_by_loc cbl,
	            			code c,
	                    	code c2,
	                    	location_view l
				WHERE 		c.code_type = 'GROUP'
				AND  		c.code_value = 'ELC_LOCS'
				AND 		cbl.group_cd = c.code_id
				AND 		cbl.loc_id = l.loc_id
				AND 		cbl.code_id = c2.code_id
	            AND			c2.code_value in (<cfqueryparam cfsqltype="cf_sql_varchar" list="yes" value="#ArrayToList(elcArray)#">)
	            AND			cbl.loc_id in
	            			(
	                        	Select l.loc_id
	                            from   location_view l, code_by_loc_view cbl, code_by_loc_view sys
	                            where cbl.group_name = 'WC_BY_LOC'
	                            and sys.group_name = 'SYS_BY_LOC'
	                            and cbl.loc_id = l.loc_id
	                            and cbl.loc_id = sys.loc_id
	                            and cbl.active_code = 'Y'
	                            and cbl.active_loc = 'Y'
	                            and sys.active_code = 'Y'
	                            and	sys.active_loc = 'Y'
	                            group by l.loc_id
	                        )
				ORDER BY	l.site
	        </cfquery>
	    </cfif>
	    <cfreturn qELCListing>
	</cffunction>
	
	
	<!---changeELC--->
	<cffunction name="changeELC" returntype="any"  output="no">
		<cfargument name="elc" required="yes" type="any">
		
		<cfset var change = ''>
	    <cfset var elcArray = ArrayNew(1)>
	    <cfset var baseArray = ArrayNew(1)>
	    <cfset var unitArray = ArrayNew(1)>
		<cfset var isError = ''/>

	    <!--- base name --->
	    <cfset var base = ""/>
		
	    <!--- this function relies on the sesison.ws IMDS session--->
	    <cfif structKeyExists(session,'ws')>
	    	<cfset change = session.ws.changeELC(trim(arguments.elc))>
	        <cfset logMe("change return - " & toString(change))>
	        <cfif isXML(change)>
	        	<cfset isError = XMLSearch(change,"//*[name()='ApplicationErrorText']")>
				<cfset elcArray = XMLSearch(change,"//*[name()='EnterpriseLocationCode']")>
	            <cfset baseArray = XMLSearch(change,"//*[name()='Base']")>
	            <cfset unitArray = XMLSearch(change,"//*[name()='Unit']")>
	            
	            <cfif ArrayLen(elcArray)>
					<cfset setUserProperty('ELC',elcArray[1].xmlText)>
	                <cfset setUserProperty('IMDSCURRENTELC',elcArray[1].xmlText)>
	            </cfif>
	            <cfif ArrayLen(baseArray)>
	            	<cfset setUserProperty('IMDSCURRENTBASE',baseArray[1].xmlText)>
	                <cfset base = baseArray[1].xmlText/>
	            </cfif>
	            <cfif ArrayLen(unitArray)>
	            	<cfset setUserProperty('IMDSCURRENTUNIT',unitArray[1].xmlText)>
	            </cfif>
	            <cfif ArrayLen(isError)>
	            	<cfset variables.msg = isError[1].xmlText>
	            	<cfreturn false>
	            <cfelse>
	            	<cfset variables.msg = "Change ELC Successful to #arguments.elc# #base#">
	
	            	<cfreturn true>
	            </cfif>
	        <cfelse>
	        	<cfset variables.msg = "Not Valid XML">
	        	<cfreturn false>
	        </cfif>
	    <cfelse>
	    	<cfset variables.msg = 'No Logon Found'>
	    	<cfreturn false>
	    </cfif>
	    <cfreturn change>
	</cffunction>
	
	<!--- get message (currently using with changeELC)--->
	<cffunction name="getMessage" returntype="string" output="no">
	    <cfreturn variables.msg>
	</cffunction>
	
	<!--- set message (currently using with changeELC)--->
	<cffunction name="setMessage" returntype="void" output="no">
		<cfargument name="msg" type="string" required="yes"/>
	    <cfset variables.msg = trim(ARGUMENTS.msg)>
	</cffunction>
	
	<!--- getSystemsByLocation (currently using with changeELC)--->
	<cffunction name="getSystemsByLocation" output="no" access="public">
	    <cfargument name="locids" type="string" default="0">
	    <cfargument name="useprivs" type="boolean" default="0"/>
	    <cfset var qGetSystemsByLocation = ""/>
		<cfset var qTempQuery2 = ""/>
	    <cfset var locIDList = ArrayNew(1)>
	    <cfset var sysIDList = getUserProperty('systemids')/>
	    <cfset ArrayAppend(locIDList,0)>
	    <cfset ArrayAppend(sysIDList,0)/>
	    <cfloop list="#arguments.locids#" index="L">
	        <cfset ArrayAppend(locIDList,L)>
	    </cfloop>
		
		
		
	    <cfquery name="qGetSystemsByLocation" datasource="#get('dsn')#">
	        Select  cbl.code_id,
	                cd.code_value,
	                cbl.loc_id,
	                b.code_value || ' ' || u.code_value
	        from    globaleye.code_by_loc cbl,
	                globaleye.code cd,
	                globaleye.code b,
	                globaleye.code u,
	                globaleye.location l,
	                globaleye.code cg
	        where   cbl.code_id = cd.code_id
	        and     l.site_cd = b.code_id
	        and     l.unit_cd = u.code_id
	        and     l.loc_id = cbl.loc_id
	        and     cbl.group_cd = cg.code_id
	        and     cg.code_value = 'SYS_BY_LOC'
	        and     cbl.loc_id in (<cfqueryparam cfsqltype="cf_sql_varchar" value="#ArrayToList(locIDList)#" list="yes">)
	        <cfif StructKeyExists(ARGUMENTS,'useprivs') and ARGUMENTS.useprivs>
	        and cbl.code_id in (
	        	Select p.relevant_id
	            from AGGREGATE.agg_user_priv p
	            where p.relevant = 'SYSTEM'
	            and	  p.active = 'Y'
	            and	  p.user_name = <cfqueryparam cfsqltype="cf_sql_varchar" value="#getUserName()#"/>
	        )
	        </cfif>
	   
	    </cfquery>
	    <cfif not qGetSystemsByLocation.recordCount>
	         <cfquery name="qTempQuery2" datasource="#get('dsn')#" CachedWithin="#CreateTimeSpan(0,1,0,0)#">
	            Select  cbl.code_id,
	                    cd.code_value
	            from    globaleye.code_by_loc cbl,
	                    globaleye.code cd,
	                    globaleye.code b,
	                    globaleye.code u,
	                    globaleye.location l,
	                    globaleye.code cg
	            where   cbl.code_id = cd.code_id
	            and     l.site_cd = b.code_id
	            and     l.unit_cd = u.code_id
	            and     l.loc_id = cbl.loc_id
	            and     cbl.group_cd = cg.code_id
	            and     cg.code_value = 'SYS_BY_LOC'
	            <cfif StructKeyExists(ARGUMENTS,'useprivs') and ARGUMENTS.useprivs>
	            and cbl.code_id in (
					<cfqueryparam cfsqltype="cf_sql_varchar" list="true"  value="#ArrayToList(sysIDList)#"/>
	          
	            )
	            </cfif>
	            group by cbl.code_id, cd.code_value
	            order by 2
	        
	        </cfquery>
	        <cfreturn qTempQuery2>
	    <cfelse>
	        <cfreturn qGetSystemsByLocation>
	    </cfif>
	
	</cffunction>
	
	
	<!---Set System by workcenter and loc--->
	<cffunction name="setSystemByWorkcenterLocid" output="false" returntype="void">
		<cfargument name="wcid" required="yes" type="any">
		<cfargument name="locid" required="yes" type="any">
		
		<cfset var local = StructNew()>

		
		<cfset local.qSysByWorkcenter = getSystemByWorkCenterLoc(arguments.locid,arguments.wcid)/>
		<cfif local.qSysByWorkCenter.recordCount>
		<cfloop query="local.qSysByWorkcenter">
			<cfif ListFindNoCase(ArrayToList(getUserProperty('systemids')),sys_id)>
				<cfset VARIABLES.instance.userInfo.currentsystem = sys/>
                <cfset VARIABLES.instance.userInfo.currentsystemid = sys_id/>
                <cfset VARIABLES.instance.userInfo.homesystem = sys/>
                <cfset VARIABLES.instance.userInfo.homesystemid = sys_id/>
				<cfbreak/>
			</cfif>
		</cfloop>
		</cfif>
		
	</cffunction>
	
	<!--- setSystemAndWorkcenter (currently using with changeELC)--->
	<cffunction name="setSystemAndWorkcenter" returntype="void" output="no">
		<cfargument name="sysid" type="numeric" required="yes"/>
	    <cfargument name="wcid" type="numeric" required="yes"/>
	    <cfset var qSystemAndWorkCenter = ""/>
	    <cfquery name="qSystemAndWorkCenter" datasource="#getDSN()#">
	    	Select  #ARGUMENTS.sysid# sysid,
	        GET_GECODE_VALUE(#ARGUMENTS.sysid#) sys,
	        #ARGUMENTS.wcid# wcid,
	        GET_GECODE_VALUE(#ARGUMENTS.wcid#) wc
			from dual
	    </cfquery>
	    <!--- set current systems--->
	        <cfif qSystemAndWorkCenter.recordCount eq 1>
	
	
					<cfif not listFindNoCase(ArrayToList(getUserProperty('SYSTEMIDS')),qSystemAndWorkCenter.sysid)>
	                    <cfset ArrayPrepend(getUserProperty('SYSTEMIDS'),qSystemAndWorkCenter.sysid)>
	                </cfif>
	                <cfif not listFindNoCase(ArrayToList(getUserProperty('SYSTEMS')),qSystemAndWorkCenter.sys)>
	                    <cfset ArrayPrepend(getUserProperty('SYSTEMS'),qSystemAndWorkCenter.sys)>
	                </cfif>
	
	
	                 <cfset setUserProperty('CURRENTSYSTEMID',qSystemAndWorkCenter.sysid)>
	                 <cfset setUserProperty('CURRENTSYSTEM',qSystemAndWorkCenter.sys)>
	                 
	
	
					<cfset logMe("SYSTEM CHANGED to - " & getUserProperty('CURRENTSYSTEM'))>
					<!--- set PGMID--->
					<cfset findPGMID(qSystemAndWorkCenter.sysid)/>
	
	
	                <cfif not listFindNoCase(ArrayToList(getUserProperty('WORKCENTERIDS')),qSystemAndWorkCenter.wcid)>
	                    <cfset ArrayPrepend(getUserProperty('WORKCENTERIDS'),qSystemAndWorkCenter.wcid)>
	                </cfif>
	                <cfif not listFindNoCase(ArrayToList(getUserProperty('WORKCENTERS')),qSystemAndWorkCenter.wc)>
	                    <cfset ArrayPrepend(getUserProperty('WORKCENTERS'),qSystemAndWorkCenter.wc)>
	                </cfif>
	
	                <cfset setUserProperty('CURRENTWORKCENTERID',qSystemAndWorkCenter.wcid)>
	                <cfset setUserProperty('CURRENTWORKCENTER',qSystemAndWorkCenter.wc)>
					
					<cfif len(qSystemAndWorkCenter.wc)>
	                	<cfset setUserProperty('IMDSCURRENTUNIT',left(qSystemAndWorkCenter.wc,1))>
					</cfif>
					
					<cfset logMe("WORK CENTER CHANGED to - " & getUserProperty('CURRENTWORKCENTER'))>
	                <cfset logMe("IMDS CURRENT UNIT CHANGED to - " & getUserProperty('IMDSCURRENTUNIT'))>
				
	
	        </cfif>
	</cffunction>
	

	<!--- get Work Centers--->
	<cffunction name="getWorkCenters" access="private" output="no">
		<cfargument name="locid" default="0" type="string" required="no">
	    <cfargument name="sysid" default="0" type="string" required="no">
	    
	    <cfset var qGetWorkCenters = "">
	    
	    <cfquery name="qGetWorkCenters" datasource="#getDSN()#" result="wc">
	    	SELECT  cbc.to_code code_value,
	                cbc.code_b code_id,
	                cbc.code_a sys_id,
	                cbl.loc_id,
	                l.site || ' ' || l.unit site,
	                c.code_value sys
	        FROM    code_by_loc_view cbl,
	                code_by_code_view cbc,
	                code c,
	                location_view l
	        WHERE   cbl.group_name='WC_BY_LOC'
	        AND     cbc.group_name    ='WC_BY_SYS'
	        AND     cbl.loc_id        = cbc.loc_id
	        AND     cbl.code_id       = cbc.code_b
	        AND     cbl.loc_id       IN (<cfqueryparam cfsqltype="cf_sql_varchar" list="yes" value="#ARGUMENTS.locid#">)
	        AND     cbc.active_a      = 'Y'
	        AND     cbc.active_b      = 'Y'
	        AND     cbc.code_a       IN (<cfqueryparam cfsqltype="cf_sql_varchar" list="yes" value="#ARGUMENTS.sysid#">)
	        AND     cbc.code_a = c.code_id
	        AND cbl.loc_id = l.loc_id
			<cfif not isDeployed()>
			AND	 	cbc.to_code != 'ADEPL'
			</cfif>
			
			<cfif isDeployed()>
	        UNION
	        
			
			Select cbc.to_code code_value, cbc.code_b code_id, cbc.code_a sys_id, cbc.loc_id, lv.site || ' ' || lv.unit site,cbc.from_code sys 
	        from	code_by_code_view cbc, globaleye.location_view lv
	        where	group_name = 'DEPLOYED_WC'
	        --and		cbl.loc_id = cbc.loc_id
	        --and 	cbl.code_id = cbc.code_b
	        and 	cbc.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.locid)#"/>
	        and   cbc.loc_id = lv.loc_id
	        and		cbc.active_a = 'Y'
	        and		cbc.active_b = 'Y'
	        and cbc.code_a = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.sysid)#"/>
	
	        </cfif>
			
			
	        order by 4,6
	    </cfquery>
	    
	</cffunction>
	
	<!--- getWorkCentersByLocSys (currently using with changeELC)--->
	<cffunction name="getWorkCentersByLocSys" returntype="any" output="no" access="public">
	    <cfargument name="locid" required="yes" type="numeric">
	    <cfargument name="sysid" required="yes" type="numeric">
	    <cfset var qWorkCentersByLocSys = "">
	
	    <cfquery name="qWorkCentersByLocSys" datasource="#get('dsn')#" CachedWithin="#CreateTimeSpan(0,1,0,0)#">
	        Select 	    cbc.to_code code_value, cbc.code_b code_id
	        from	code_by_loc_view cbl, code_by_code_view cbc
	        where	cbl.group_name='WC_BY_LOC'
	        and   cbc.group_name='WC_BY_SYS'
	        and		cbl.loc_id = cbc.loc_id
	        and   cbl.code_id = cbc.code_b
	        and cbl.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.locid)#"/>
	        and cbc.active_a = 'Y'
	        and cbc.active_b = 'Y'
	        and cbc.code_a = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.sysid)#"/>
			and cbc.code_b > 0
	        <cfif not isDeployed()>
			and cbc.to_code != 'ADEPL'
			</cfif>
	        <cfif isDeployed()>
	        UNION
	        
			
			 Select cbc.to_code || '(d)' code_value, cbc.code_b code_id
	        from	code_by_code_view cbc
	        where	group_name = 'DEPLOYED_WC'
	        --and		cbl.loc_id = cbc.loc_id
	        --and 	cbl.code_id = cbc.code_b
	        and 	cbc.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.locid)#"/>
	        and		cbc.active_a = 'Y'
	        and		cbc.active_b = 'Y'
	        and 	cbc.code_b > 0
	        and cbc.code_a = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(arguments.sysid)#"/>
	        </cfif>
	    </cfquery>
	
		<cfif qWorkCentersByLocSys.recordCount eq 1>
			<!---go ahead and set IMDSCurrentUnit if only one record returns--->
			<cfset setUserProperty('IMDSCURRENTUNIT',Left(UCase(qWorkCentersByLocSys.code_value),1))/>
		</cfif>
		
	    <cfreturn qWorkCentersByLocSys>
	</cffunction>
	
	<!---getSystemByWCLoc--->
	<cffunction name="setSystemByWCLoc" returnType="void" output="no">
		<cfargument name="wcid" required="yes" typoe="any" />
		<cfargument name="locid" required="yes" typoe="any" />
		
		<cfset var local = StructNew()/>
		
		<cfif not isNumeric(ARGUMENTS.wcid)>
			<cfset ARGUMENTS.wcid = 0/>
		</cfif>
		
		<cfif not isNumeric(ARGUMENTS.locid)>
			<cfset ARGUMENTS.locid = 0/>
		</cfif>
		
		<cfquery name="local.qSystemsByWCLoc" datasource="#getDSN()#">
			
			Select 	  
	          cbcv.cbc_id,
	          cblv.code_value,
	          cblv.code_id,
	          cbcv.code_b wc_cd,
	          cbcv.loc_id,
	          cbcv.from_code sys,
			  cbcv.code_a sys_id
		   from	globaleye.code_by_loc_view cblv, globaleye.code_by_code_view cbcv
		   where	cblv.group_name='WC_BY_LOC'
	       and   	cbcv.group_name='WC_BY_SYS'
		   and		cblv.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#arguments.locid#"/>
	       and   	cblv.code_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#arguments.wcid#"/>
	       and 		cblv.code_id = cbcv.code_b
		   and 		cbcv.loc_id = cblv.loc_id
		   <cfif not isDeployed()>
			and cbcv.to_code != 'ADEPL'
			</cfif>
		   
	       group by  cbcv.cbc_id,cblv.code_value,cblv.code_id,cbcv.code_b, cbcv.loc_id,cbcv.from_code,cbcv.code_a
	       
	       
	       <cfif isDeployed()>
		   	   
		   <!--- 
		   		add deployed wc/loc/system query based on DEPLOYED_WC group
		   	--->
		   	
		   	
	       UNION
       
	       Select 	  
		          	cbcv.cbc_id, 
		          	cblv.site || ' ' || cblv.unit code_value,
		          	cbcv.code_a code_id,
		          	cbcv.code_b wc_cd,
		          	cbcv.loc_id,
		          	cbcv.from_code sys,
				  	cbcv.code_a sys_id
			from	globaleye.location_view cblv, globaleye.code_by_code_view cbcv
			where	cbcv.group_name='DEPLOYED_WC'
			and		cbcv.loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#arguments.locid#"/>
	      	and   	cbcv.code_b = <cfqueryparam cfsqltype="cf_sql_numeric" value="#arguments.wcid#"/>
			and 		cbcv.loc_id = cblv.loc_id
		      
	       group by cbcv.cbc_id, 
	            	cblv.site || ' ' || cblv.unit,
		          	cbcv.code_a,
		          	cbcv.code_b,
		          	cbcv.loc_id,
		          	cbcv.from_code,
	            	cbcv.code_a
	       
	       
			</cfif>
		
           order by 2
		</cfquery>
		
		<!---<cfif local.qSystemsByWCLoc.recordCount eq 1>
			<cfloop query="local.qSystemsByWCLoc">
			<cfif ArrayLen(getUserProperty('systems')) and ListFindNoCase(ArrayToList(getUserProperty('systems')),local.qSystemsByWCLoc.sys)>
				<cfset setUserProperty('currentsystem',local.qSystemsByWCLoc.sys)/>
				<cfset setUserProperty('currentsystemid',local.qSystemsByWCLoc.sys_id)/>
				<!--- set PGMID--->
				<cfset findPGMID(local.qSystemsByWCLoc.sys_id)/>
				<cfset setUserProperty('authorized',true)/>
				<cfbreak/>
			</cfif>
			</cfloop>
		<cfelse>
			<cfif not isDeployed()>
				<cfset setUserProperty('currentsystem','')/>
				<cfset setUserProperty('currentsystemid',0)/>
				<cfset setUserProperty('authorized',false)/>
				<cfset addError("Cannot find System for user")/>
			</cfif>
		</cfif>--->
		
	</cffunction>
	
	<!--- getSystemsByLoc (currently using with changeELC)--->
	<cffunction name="getSystemsByLoc" returntype="any" output="no">
	    <cfargument name="locid" required="yes" type="numeric">
	    <cfset var qSystemsByLoc = "">
	    <cfquery name="qSystemsByLoc" datasource="#get('dsn')#" CachedWithin="#CreateTimeSpan(0,1,0,0)#">
	        Select 	code_value,
	                code_id
	        from	code_by_loc_view
	        where	group_name='SYS_BY_LOC'
	        and		loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#arguments.locid#"/>
	    </cfquery>
	    <cfreturn qSystemsByLoc>
	</cffunction>
	
	<cffunction name="setCurrentLocationInfo" access="public" output="no" returntype="void">
		<cfargument name="locid" required="yes" type="numeric"/>
	    <cfset var qCurrentLocationInfo = ""/>
	    <cfset var a = ""/>
	    <cfset var columns = ArrayNew(1)/>
	    <cfset var sites = VARIABLES.instance.userInfo['sites']/>
	    <cfset var siteids = VARIABLES.instance.userInfo['siteids']/>
	    <cfset var sitecds =  VARIABLES.instance.userInfo['sitecds']/>
	
	    <cfquery name="qCurrentLocationInfo" datasource="#getDSN()#">
	        Select  site currentsite,
	        		site,
	                unit,
	                site_cd sitecd,
	                unit_cd unitcd,
	                squad,
	                squad_cd squadcd,
	                site_cd currentsitecd,
	                unit currentunit,
	                unit_cd currentunitcd,
	                squad currentsquad,
	                squad_cd currentsquadcd,
	                loc_id currentlocationid,
	                site || ' ' || unit currentlocation,
	                majcom,
	                majcom_cd majcomcd,
	                loc_id locid,
	                ct_loc_id ctlocid
	        from    globaleye.location_view
	        where loc_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(ARGUMENTS.locid)#">
	    </cfquery>
	    <!--- populate location information --->
	    <cfif qCurrentLocationInfo.recordCount>
	    	<cfset columns = qCurrentLocationInfo.getColumnList()/>
	    	<cfloop from="1" to="#ArrayLen(columns)#" index="a">
	        	<cfset setUserProperty(columns[a],qCurrentLocationInfo[columns[a]][1])/>
	        </cfloop>
	
	        <cfloop query="qCurrentLocationInfo">
	
	
	             <cfif not listFindNoCase(ArrayToList(sites),qCurrentLocationInfo.currentlocation)>
	                <cfset ArrayPrepend(sites,qCurrentLocationInfo.currentlocation)>
	             </cfif>
	
	
	             <cfif not listFindNoCase(ArrayToList(siteids),qCurrentLocationInfo.currentlocationid)>
	                <cfset ArrayPrepend(siteids,qCurrentLocationInfo.currentlocationid)>
	             </cfif>
	
	             <cfif not listFindNoCase(ArrayToList(sitecds),qCurrentLocationInfo.currentsitecd)>
	                <cfset ArrayPrepend(sitecds,qCurrentLocationInfo.currentsitecd)>
	             </cfif>
	
	             <cfset setUserProperty("sites",sites)/>
	             <cfset setUserProperty("siteids",siteids)/>
	             <cfset setUserProperty("sitecds",sitecds)/>
	
	         </cfloop>
	
			<!---<cfset orderSites()/>--->
	
	    </cfif>
	</cffunction>
	
	<!--- findPGMID (will change later)--->
	<cffunction name="findPGMID" access="private" output="no">
		<cfargument name="sysid" required="true" type="numeric" hint="System ID"/>
		<cfset local = StructNew()/>
		<cfquery name="local.qPGMID" datasource="#get('dsn')#">
			SELECT c3.code_id, c3.code_value
			FROM   GLOBALEYE.code_by_code cbc,
			       GLOBALEYE.code c,
			       GLOBALEYE.code c2,
			       GLOBALEYE.code c3
			WHERE  cbc.group_cd = c2.code_id
			AND    cbc.code_b = c.code_id
			AND    cbc.code_a = c3.code_id
			AND    c2.code_value = 'PGM_ID_BY_SYS'
			AND    c.active = 'Y'
			AND    c.code_id = <cfqueryparam cfsqltype="cf_sql_numeric" value="#arguments.sysid#"/>
		</cfquery>
		
		<cfif local.qPGMID.recordCount>
			<cfset setPGMID(local.qPGMID.code_id)/>
			<cfreturn local.qPGMID.code_id/>
		<cfelse>
			<cfset setPGMID(0)/>
			<cfreturn 0/>
		</cfif>
	</cffunction>
	
	<!--- get BypassPages --->
	<cffunction name="getBypassPages" returntype="Query" output="false">
		<cfset var qBypassPages = "">
		<cfquery name="qBypassPages" datasource="#get('dsn')#">
			SELECT		code_id,
						get_gecode_value(code_id) as CF_Page
			FROM 		code_group
			WHERE 		group_cd = (select code_id from code where code_type = 'GROUP' and code_value = 'ALLOW_BYPASS_IMDS')
		</cfquery>
		<cfreturn qBypassPages>
	</cffunction>
	
	<!--- get BypassPageList --->
	<cffunction name="getBypassPageList" returntype="string" output="false">
		<cfset var qBypassPageList = getByPassPages()>
		<cfreturn ValueList(qBypassPageList.CF_PAGE)>
	</cffunction>
	
	<!--- is Deployed --->
	<cffunction name="isDeployed" returntype="boolean" access="public" output="no">
		<cfif StructKeyExists(VARIABLES.instance.userInfo,'CurrentDeployedLocationID') and VARIABLES.instance.userInfo.CurrentDeployedLocationID>
	    	<cfreturn true/>
	    <cfelse>
	    	<cfreturn false/>
		</cfif>
	</cffunction>
	
	<!--- is Supervisor --->
	<cffunction name="isSupervisor" returntype="boolean" access="public" output="no">
		
		<cfif not isBoolean(VARIABLES.instance.userInfo.SUPERVISOR)>
			<cfreturn false/>
		<cfelse>
			<cfreturn VARIABLES.instance.userInfo.SUPERVISOR/>
		</cfif>
		
	
	</cffunction>
	
	<!--- has errors? --->
	<cffunction name="hasErrors" returntype="boolean" access="public" output="no">
		<cfif StructKeyExists(VARIABLES.instance.userInfo,"errors") and isArray(VARIABLES.instance.userInfo.errors)>
	    	<cfif ArrayLen(VARIABLES.instance.userInfo.errors)>
	        	<cfreturn true>
	        <cfelse>
	        	<cfreturn false>
	        </cfif>
	    <cfelse>
	    	<cfreturn false>
	    </cfif>
	</cffunction>
	
	
	<!--- hasParsAccess--->
	<cffunction name="hasParsAccess" access="public" returntype="boolean" output="no">
	    <cfargument name="user" required="yes" type="string">
	
	    <cfset var qHasParsAccess = "">
	        <cftry>
	                <cfquery name="qHasParsAccess" datasource="#get('dsn')#">
	                    SELECT HAS_PARS_ACCESS(<cfqueryparam cfsqltype="cf_sql_varchar" value="#UCase(arguments.user)#">) pars
	                    FROM DUAL
	                </cfquery>
	                <cfif qHasParsAccess.pars>
	                    <cfreturn true>
	                <cfelse>
	                    <cfreturn false>
	                </cfif>
	        <cfcatch>
	            <cfreturn false>
	        </cfcatch>
	
	    </cftry>
	</cffunction>
	
	
	<!--- hasSEAccess--->
	<cffunction name="hasSEAccess" access="public" returntype="boolean" output="no">
	    <cfset var userInfo = getInfo()>
	
	        <cftry>
	
	                <cfif StructKeyExists(userInfo,"sesites") and isArray(userInfo.sesites) AND ArrayLen(userInfo.sesites)>
	                	<cfreturn true/>
	                <cfelse>
	                	<cfreturn false/>
	                </cfif>
	
	        <cfcatch>
	            <cfreturn false>
	        </cfcatch>
	
	    </cftry>
	</cffunction>
	
	
	<!--- isAdmin (checks to see if a user has the admin priv based on sub_app) --->
	<cffunction name="isAdmin" returntype="boolean" output="no">
		<cfargument name="app" required="no" default="globaleye">
	    <cfset var userInfo = getInfo()>
	    <cfif structKeyExists(userInfo,UCase(arguments.app & "admin"))>
	    	<cfreturn VARIABLES.instance.userInfo[ARGUMENTS.app & "ADMIN"]/>
	    <cfelse>
	    	<cfreturn false/>
	    </cfif>
	</cffunction>
	
	
	<!--- setHomeSystemID--->
	<cffunction name="setHomeSystemID" access="public" returntype="void" hint="Sets Users Current System" output="no">
		<cfargument name="sys" type="numeric" required="yes">
	    <cfset var qHomeSystemID="">
	    <cftry>
			<cfset setUserProperty(UCase('homesystemid'),UCase(trim(arguments.sys)))>
	        <cfquery name="qHomeSystemID" datasource="#get('dsn')#">
	        	Select code_id,code_value from code
	            where code_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#trim(UCase(sys))#">
	            and code_type = 'SYSTEM'
	        </cfquery>
	        <cfif qHomeSystemID.recordCount>
	        	<cfset setUserProperty(UCase('homesystem'),UCase(trim(qHomeSystemID.code_value)))>
	        <cfelse>
	        	<cfset setUserProperty(UCase('homesystem'),'UNKN')>
	        </cfif>
	        <cfcatch>
	        	<cfset setUserProperty(UCase('homesystem'),'UNKN')>
	        </cfcatch>
	    </cftry>
	</cffunction>
	
	<!--- setHomeSystem--->
	<cffunction name="setHomeSystem" access="public" returntype="void" hint="Sets Users Current System" output="no">
		<cfargument name="sys" type="string" required="yes">
	    <cfset var qHomeSystem="">
	    <cftry>
			<cfset setUserProperty(UCase('homesystem'),UCase(trim(arguments.sys)))>
	        <cfquery name="qHomeSystem" datasource="#get('dsn')#">
	        	Select code_id from code
	            where code_value = <cfqueryparam cfsqltype="cf_sql_varchar" value="#trim(UCase(sys))#">
	            and code_type = 'SYSTEM'
	        </cfquery>
	        <cfif qHomeSystem.recordCount>
	        	<cfset setUserProperty(UCase('homesystemid'),UCase(trim(qHomeSystem.code_id)))>
	        <cfelse>
	        	<cfset setUserProperty(UCase('homesystemid'),0)>
	        </cfif>
	        <cfcatch>
	        	<cfset setUserProperty(UCase('homesystemid'),0)>
	        </cfcatch>
	    </cftry>
	</cffunction>
	
	<!--- setCurrentSystemID --->
	<cffunction name="setCurrentSystemID" access="public" returntype="void" hint="Sets Users Current System" output="no">
		<cfargument name="sysid" type="string" required="yes">
	    <cfset var code = createObject("component","cfc.com.codesDAO").init(get('dsn'))>
	    <cfset var sysVal = code.getCodeValue(trim(arguments.sysid))>
	    
	    <cftry>
			<cfset setUserProperty(UCase('currentsystemid'),UCase(trim(arguments.sysid)))>
				<cfif len(trim(sysVal))>
	                <cfset setUserProperty('CurrentSystem',sysVal)>
	                <!--- set PGMID--->
					<cfset findPGMID(arguments.sysid)/>
	            </cfif>
	        <cfcatch>
	        </cfcatch>
	    </cftry>
	</cffunction>
	
	
	
	<!--- getCurrentWorkCenterID --->
	<cffunction name="getCurrentWorkCenterID" access="public" returntype="string" hint="Gets Users Current Work Center ID" output="no">
		<cftry>
	     	<cfif isNumeric(getUserProperty('currentworkcenterid'))>
	     		<cfreturn getUserProperty('currentworkcenterid')>
	        <cfelse>
	        	<cfreturn 0>
			</cfif>
		<cfcatch>
	    	<cfreturn 0>
	    </cfcatch>
	    </cftry>
	</cffunction>
	
	<!--- setCurrentWorkCenterID --->
	<cffunction name="setCurrentWorkCenterID" access="public" returntype="void" hint="Sets Users Current System" output="no">
		<cfargument name="wcid" type="string" required="yes">
	    <cfset var code = createObject("component","cfc.com.codesDAO").init(get('dsn'))>
	    <cfset var wcVal = code.getCodeValue(trim(arguments.wcid))>
	    
	    <cftry>
			<cfset setUserProperty(UCase('currentworkcenterid'),UCase(trim(arguments.wcid)))>
				<cfif len(trim(wcVal))>
	                <cfset setUserProperty('CurrentWorkCenter',wcVal)>
	            <!--- <cfset setCurrentWorkCenterID(wcCode)> --->
	            </cfif>
	        <cfcatch>
	        </cfcatch>
	    </cftry>
	</cffunction>
	
	
	
	
	<!--- get work center --->
	<cffunction name="getWorkCenterName" access="public" returntype="query" hint="Gets Users Current Work Center Names" output="no">
		<cfset var u = ArrayNew(1)>
	    <cfset var wc = ArrayNew(1)>
	    <cfset var qWorkCenters = "">
	
	    <cftry>
			<cfif structKeyExists(variables.instance,"userInfo")>
	            <cfset u = get('userInfo')>
	            <cfset wc = u.workcenters>
	        </cfif>
	        <cfcatch>
	        </cfcatch>
	    </cftry>
	
	    <cfquery name="qWorkCenters" datasource="#get('dsn')#">
	        SELECT 	code_id,
	        		code_value
	        from 	globaleye.code
	        where 	code_type = 'WORK_CENTER'
	        <cfif ArrayLen(wc)>
	        and		code_value in (<cfqueryparam cfsqltype="cf_sql_varchar" list="yes" value="#ArrayToList(wc)#">)
	        <cfelse>
	        and 	code_value = '0'
	        </cfif>
	
	    </cfquery>
	
	    <cfreturn qWorkCenters>
	</cffunction>
	
	
	
	<!--- getCurrentWorkcenter--->
	<cffunction name="getCurrentWorkCenter" access="public" hint="Gets Users Current Work Center" output="no">
	    <cfreturn getUserProperty('currentworkcenter')>
	</cffunction>
	
	<!--- setCurrentWorkcenter--->
	<cffunction name="setCurrentWorkCenter" access="public"  hint="Sets Users Current Work Center Name" output="no">
		<cfargument name="wc" type="string" required="yes">
		<cfset var local = StructNew()/>
	    <cfset setUserProperty(UCase('currentworkcenter'),UCase(trim(arguments.wc)))>
	    <cfset local.code = createObject("component","cfc.com.codesDAO").init(get('dsn'))>
	    <cfset local.wcCode = local.code.getCodeID('WORK_CENTER',UCase(trim(arguments.wc)))>
	    <cfif len(trim(local.wcCode))>
	    	<cfset setUserProperty('CurrentWorkCenterID',local.wcCode)>
		</cfif>
	</cffunction>
	
	<!---getCurrentSystem--->
	<cffunction name="getCurrentSystem" access="public" returntype="String"  hint="Gets Users Current System" output="no">
		<cfreturn getUserProperty('currentsystem')/>
	</cffunction>
	
	<!--- getDsn --->
	<cffunction name="getDsn" returntype="string" hint="Gets Datasource" output="no">
		<cfreturn get('dsn')>
	</cffunction>
	
	<!--- setDsn --->
	<cffunction name="setDsn" returntype="string" hint="Sets Datasource" output="no">
		<cfargument name="dsn" type="string">
		<cfreturn set('dsn',UCase(ARGUMENTS.dsn))>
	</cffunction>
	
	<!--- getUserName --->
	<cffunction name="getUserName" access="public" returntype="string" hint="Sets Username" output="no">
	  <cfreturn VARIABLES.instance.userInfo.username/>
	</cffunction>
	
	<!--- setUserName --->
	<cffunction name="setUserName" access="public" returntype="void" hint="Sets Username" output="no">
	  <cfargument name="username" type="string">
	  <cfset StructInsert(VARIABLES.instance.userInfo,UCase('username'),trim(ARGUMENTS.username),true)/>
	</cffunction>
	
	
	<!--- setHomeLoc --->
	<cffunction name="setHomeLoc" returntype="void" hint="Sets Users Current Home Location" output="no">
		<cfargument name="hlocid" type="numeric" required="yes">
		<cfset setUserProperty('homelocid', arguments.hlocid)>
	</cffunction>
	
	
	<!--- setCamsUser --->
	<cffunction name="setCamsUser" returntype="void" hint="Sets CAMS Username" output="no">
		<cfargument name="uname" type="string" required="yes">
		<cfset setUserProperty('camsusername', arguments.uname)>
	</cffunction>
	
	<!--- getCamsUser --->
	<cffunction name="getCamsUser" access="public" hint="Gets CAMS Username" output="no">
	    <cfreturn getUserProperty('camsusername')>
	</cffunction>
	
	<!---getPGMID--->
	<cffunction name="getPGMID" returntype="numeric" hint="Gets Current PGMID" outpyt="no">
		<cfif StructKeyExists(VARIABLES.instance,'userInfo') and StructKeyExists(VARIABLES.instance.userInfo,'PGMID')>
			<cfreturn VARIABLES.instance.userInfo.PGMID/>
		<cfelse>
			<cfreturn 0/>
		</cfif>
	</cffunction>
	
	<!---setPGMID --->
	<cffunction name="setPGMID" returntype="void" hint="Sets Users PGMID" output="no">
		<cfargument name="pgmid" type="numeric" required="yes">
		<cfset setUserProperty('pgmid', arguments.pgmid)>
	</cffunction>
	
	
	<!--- getHomeLoc --->
	<cffunction name="getHomeLoc" returntype="numeric" hint="Gets Users Current Home Location" output="no">
		<cftry>
	    		<cfreturn getUserProperty('homelocid')>
	    	<cfcatch>
	        	<cfreturn 56>
	        </cfcatch>
	    </cftry>
	</cffunction>
	
	<!---getSESiteList--->
	<cffunction name="getSESiteList" output="no" access="public" returntype="array">
		<cfargument name="sysid" required="no" type="numeric" default="#getUserProperty('currentsystemid')#"/>
		<cfset var local = StructNew()/>
		
		<cfset local.sebases = ArrayNew(1)/>
		<cfset local.sesitecds = getUserProperty('sesitecds')/>
		<cfset local.sesites = ArrayNew(1)/>
		<cfset local.sesiteids = ArrayNew(1)/>
		<cfset ArrayPrepend(local.sesiteids,0)/>
		<cfif StructKeyExists(ARGUMENTS,"sysid") and isNumeric(ARGUMENTS.sysid) and ARGUMENTS.sysid gt 0>
			<cfquery name="local.qSeSites" datasource="#getDSN()#">
				
				SELECT  distinct cbl.site || ' ' || cbl.unit base,cbl.loc_id,cbl.site_cd,cbl.unit_cd, cbl.site, cbl.unit 
				from  code_by_code_view cbcv, code_by_loc_view cbl
				where cbcv.group_name ='WC_BY_SYS'
				and   cbl.group_name = 'WC_BY_LOC'
				and cbcv.code_a = <cfqueryparam cfsqltype="cf_sql_numeric" value="#trim(ARGUMENTS.sysid)#"/>
				and cbl.loc_id in (<cfqueryparam cfsqltype="cf_sql_numeric" list="true" value="#ArrayToList(local.sesiteids)#"/>)
				and cbl.code_id = cbcv.code_b
				and cbcv.loc_id = cbl.loc_id

			</cfquery>
			
			<cfif local.qSeSites.recordCount>
				<cfloop query="local.qSeSites">
				<cfif not ListFindNoCase(ArrayToList(local.sebases),base)>
					<cfset ArrayAppend(local.sebases,base)/>
					<cfset ArrayAppend(local.sesitecds,site_cd)/>
					<cfset ArrayAppend(local.sesites,loc_id)/>
				</cfif>
				</cfloop>
				
				
				
				<cfset setUserProperty('sebases',local.sebases)/>
				<cfset setUserProperty('sesitecds', local.sesitecds)/>
				<cfset setUserProperty('sesites',local.sesites)/>
				
				<cfset orderSESites()/>
				
				<cfreturn local.sesites/>
			<cfelse>
				<cfreturn getUserProperty('sesites')/>
			</cfif>
			
		<cfelse>
			<cfreturn getUserProperty('sesites')/>
		</cfif>
	</cffunction>
	
	
	<!--- get Info --->
	<cffunction name="getInfo" access="public" returntype="struct" hint="Returns User Info Structure" output="no">
		<cfreturn VARIABLES.instance.userInfo/>
	</cffunction>
	
	<!--- getUserObj (deprecated) use getInfo --->
	<cffunction name="getUserObj" access="public" returntype="struct" hint="Returns User Info Structure" output="no">
		<cfreturn getInfo()/>
	</cffunction>
	
	
	<!--- add to Error array --->
	<cffunction name="addError" returntype="void" access="private" output="no">
		  <cfargument name="errortext" type="string" required="yes">
		  <cfset var local = StructNew()/>
		  <cfset local.errors = getUserProperty('errors')/>
		  <cfset logMe("ERROR: " & trim(ARGUMENTS.errortext))/>
		  <cfif not ListContainsNoCase(ArrayToList(local.errors),'ERROR: ' & trim(ARGUMENTS.errortext))>
		  	<cfset ArrayAppend(local.errors,"ERROR: " & trim(ARGUMENTS.errortext))/>
		  </cfif>
		  <cfset setUserProperty('errors',local.errors)/>
		</cffunction>
		
	<cffunction name="orderSites" access="private" hint="Orders Sites in Alpha order" output="no">
		<cfset var local = StructNew()/>
		<cfset local.sites = getUserProperty('sites')/>
		<cfset local.siteids = VARIABLES.instance.userInfo.SITEIDS/>
		<cfset local.sitecds = getUserProperty('sitecds')/>
	
		<cfset local.siteLength = ArrayLen(local.sites)/>
		<cfset local.siteStruct = StructNew()/>
			<!---make sure all arrays are equal--->
			<cfif ArrayLen(local.sites) eq Arraylen(local.siteids) and ArrayLen(local.sites) eq ArrayLen(local.sitecds)>
				
				<cfloop from="1" to="#ArrayLen(local.sites)#" index="local.s">
					<cfset local.sStruct = StructNew()/>
					<cfset StructInsert(local.sStruct,'base',local.sites[local.s],true)/>
					<cfset StructInsert(local.sStruct,'baseid',local.siteids[local.s],true)/>
					<cfset StructInsert(local.sStruct,'basecd',local.sitecds[local.s],true)/>
					<cfset StructInsert(local.siteStruct,ReplaceNoCase(local.sites[local.s],' ','','ALL'),local.sStruct,true)/>
				</cfloop>
				
				<cfset local.bases = ArrayNew(1)/>
				<cfset local.sids = ArrayNew(1)/>
				<cfset local.cds = ArrayNew(1)/>
				
				<cfset local.siteArray = ListToArray(StructKeyList(local.siteStruct))/>
				<cfset ArraySort(local.siteArray,'text')/>
		
				<cfloop from="1" to="#ArrayLen(local.siteArray)#" index="local.s1">
					<cfset ArrayAppend(local.bases,local.siteStruct[local.siteArray[local.s1]].base)/>
					<cfset ArrayAppend(local.sids,local.siteStruct[local.siteArray[local.s1]].baseid)/>
					<cfset ArrayAppend(local.cds,local.siteStruct[local.siteArray[local.s1]].basecd)/>
				</cfloop>
		
				
				<cfset setUserProperty('SITES',local.bases)/>
				<cfset setUserProperty('SITEIDS',local.sids)/>
				<cfset setUserProperty('SITECDS',local.cds)/>
				
			</cfif>
	</cffunction>
	
	
	<cffunction name="orderSESites" access="private" hint="Orders Sites in Alpha order" output="no">
		<cfset var local = StructNew()/>
		<cfset local.sites = getUserProperty('sebases')/>
		<cfset local.siteids = getUserProperty('sesites')/>
		<cfset local.sitecds = getUserProperty('sesitecds')/>
		
		<cfset local.siteStruct = StructNew()/>
		
		<!---make sure all arrays are equal--->
		<cfif ArrayLen(local.sites) eq Arraylen(local.siteids) and ArrayLen(local.sites) eq ArrayLen(local.sitecds)>
			
			<cfloop from="1" to="#ArrayLen(local.sites)#" index="local.s">
				<cfset local.sArray = ArrayNew(1)/>
				<cfset local.sArray[1] = local.sites[local.s]/>
				<cfset local.sArray[2] = local.siteids[local.s]/>
				<cfset local.sArray[3] = local.sitecds[local.s]/>
				<cfset local.siteStruct[ReplaceNoCase(local.sites[local.s],' ','','ALL')] = local.sArray/>
			</cfloop>
			<cfset local.sListArray = ListToArray(StructKeyList(local.siteStruct))/>
			
			<cfset ArraySort(local.sListArray,'text')/>
		
			<cfset local.bases = ArrayNew(1)/>
			<cfset local.sids = ArrayNew(1)/>
			<cfset local.cds = ArrayNew(1)/>
			
			<cfloop from="1" to="#ArrayLen(local.sListArray)#" index="local.sl">
				<cfset ArrayAppend(local.bases,local.siteStruct[local.sListArray[local.sl]][1])/>
				<cfset ArrayAppend(local.sids,local.siteStruct[local.sListArray[local.sl]][2])/>
				<cfset ArrayAppend(local.cds,local.siteStruct[local.sListArray[local.sl]][3])/>
			</cfloop>
			
			<cfset setUserProperty('SEBASES',local.bases)/>
			<cfset setUserProperty('SESITES',local.sids)/>
			<cfset setUserProperty('SESITECDS',local.cds)/>
			
	
		</cfif>
		
	</cffunction>
	
	
	<!--- get Properties from the VARIABLES.instance.userInfo structure --->
	<cffunction name="getUserProperty" access="private" hint="Gets user properties/settings" output="no">
	  <cfargument name="prop" type="any" required="true">
	  <cfif not structKeyExists(VARIABLES.instance.userInfo,ARGUMENTS.prop)>
	    <cfthrow message="User Property #ARGUMENTS.prop# does not exist">
	    <cfelse>
	    <cfreturn VARIABLES.instance.userInfo[ARGUMENTS.prop]>
	  </cfif>
	</cffunction>
	
	<!--- sets Properties from the VARIABLES.instance.userInfo structure --->
	<cffunction name="setUserProperty" access="private" returntype="void" hint="Sets user properties/settings" output="no">
	  <cfargument name="prop" type="any" required="true">
	  <cfargument name="propval" type="any" required="true">
	  <cfif structKeyExists(VARIABLES.instance,'userInfo')>
	    <cfset VARIABLES.instance.userInfo[UCase(ARGUMENTS.prop)] = ARGUMENTS.propval>
	  </cfif>
	</cffunction>
	
	<!--- gets Properties from the VARIABLES.properties structure--->
	<cffunction name="get" access="private" returntype="any" hint="Gets properties/settings (not User Properties)" output="no">
	  <cfargument name="prop" type="any" required="true">
	  <cfif not structKeyExists(VARIABLES.instance,ARGUMENTS.prop)>
	    <cfthrow message="Property #ARGUMENTS.prop# does not exist">
	    <cfelse>
	    <cfreturn VARIABLES.instance[UCase(ARGUMENTS.prop)]>
	  </cfif>
	</cffunction>
	
	<!--- sets Properties from the VARIABLES.properties structure --->
	<cffunction name="set" access="private" returntype="void" hint="Sets properties/settings (not User Properties)" output="no">
	  <cfargument name="prop" type="any" required="true">
	  <cfargument name="propval" type="any" required="true">
	  <cfset VARIABLES.instance[UCase(ARGUMENTS.prop)] = ARGUMENTS.propval>
	</cffunction>
	
	<!--- gets the variables instance--->
	<cffunction name="getVars" access="public" returntype="struct" hint="Returns Current Instance Variables" output="no">
	  <cfreturn VARIABLES.instance>
	</cffunction>
	
	<!---logger methods--->
	<cffunction name="LogMe" output="false" access="private" >
		<cfargument name="msg" type="string"/>
		<cftry>
		<cfif VARIABLES.log>
			<cflog file="SECURITY_MODULE2" application="true" text="#ARGUMENTS.msg#">
		</cfif>
		<cfcatch>
			<cflog file="SECURITY_MODULE2" application="true" text="#cfcatch.message# #cfcatch.detail#">
		</cfcatch>
		</cftry>
	</cffunction>
	
	
	
	<!---
	END HELPBER METHODS
	--->
	
	<!--- onMissingMethod to generate your get/set properties DO NOT REMOVE --->
	<cffunction name="onMissingMethod"  returntype="any" output="no" hint="Used to generate get/set methods for all user properties">
	  <cfargument name="missingMethodName">
	  <cfargument name="missingMethodArguments">
	  <cfset var prop = "">
	  <cfset var value = "">
	  <cfset var cfcname = ExpandPath('/#replace(getMetaData(this).name,".","/","ALL")#')>
	  <cfif findNoCase("get",ARGUMENTS.missingMethodName) is 1 >
	    <cfset prop = replaceNoCase(ARGUMENTS.missingMethodName,"get","")>
	    <cfif structKeyExists(VARIABLES.instance['userInfo'],prop)>
	      <cfreturn getUserProperty(prop)>
	      <cfelse>
	      <cfthrow type="Application" message="Method #ARGUMENTS.missingMethodName#() doesn't exist in component #getMetaData(this).name#.">
	    </cfif>
	  <cfelseif findNoCase("set",ARGUMENTS.missingMethodName) is 1>
	    <cfset prop = replaceNoCase(ARGUMENTS.missingMethodName,"set","")>
	    <cfif listLen(structKeyList(ARGUMENTS.missingMethodArguments))>
	      <cfset value = ARGUMENTS.missingMethodArguments[listFirst(structKeyList(ARGUMENTS.missingMethodArguments))]>
	      <cfreturn setUserProperty(prop,value)>
	      <cfelse>
	      <cfthrow type="Application" message="Method #ARGUMENTS.missingMethodName#() in component #getMetaData(this).name# requires at least one argument.">
	    </cfif>
	  <cfelseif findNoCase("has",ARGUMENTS.missingMethodName) is 1>
	  	 <cfset prop = replaceNoCase(ARGUMENTS.missingMethodName,"has","")>
	     <cfif trim(lcase(prop)) neq 'admin'>
			 <cfif structKeyExists(VARIABLES.instance['userInfo'],'other')>
	              <cfif isArray(VARIABLES.instance['userInfo'].other)>
	                <cfif ListFindNoCase(ArrayToList(VARIABLES.instance['userInfo'].other),UCase(prop))>
	                    <cfreturn true/>
	                <cfelse>
	                    <cfreturn false/>
	                </cfif>
	              </cfif>
	        </cfif>
	    <cfelse>
	    	<cfthrow type="Application" message="Method #ARGUMENTS.missingMethodName#() doesn't exist in component #getMetaData(this).name#.">
	    </cfif>
	  </cfif>
	</cffunction>
	
	
</cfcomponent>