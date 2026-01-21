<cfcomponent>
	<cffunction name="getConfig">
	  <cfargument name="ASSETID" type="numeric" required="yes">
	  
	  <cfstoredproc procedure="GLOBALEYE.CONFIG_PKG.GET_ASSET_CONFIG" dataSource = "#application.datasource#">  
	    <cfprocparam dbvarname="@P_ASSET_ID" cfsqltype="CF_SQL_INTEGER" value="#ASSETID#">

	
	     <cfprocresult name="RESULT" resultset="1"> 
	
	  </cfstoredproc>
	
	
	   <cfreturn RESULT> 
	  
	</cffunction>
	
	<!--- Redmine #1957 06-12-22 Function to get the available config slots by partno_id --->
	<cffunction name="getAvailable">
	  <cfargument name="NHAASSETID" type="numeric" required="yes">	
	  <cfargument name="partno_id" type="numeric" required="yes">
	  
	  <cfstoredproc procedure="GLOBALEYE.CONFIG_PKG.GET_ASSET_CONFIG" dataSource = "#application.datasource#">  
	    <cfprocparam dbvarname="@P_ASSET_ID" cfsqltype="CF_SQL_INTEGER" value="#NHAASSETID#">

	
	     <cfprocresult name="RESULT" resultset="1"> 
	
	  </cfstoredproc>

	  <cfif RESULT.recordcount>
	  
		<cfquery name = "QoQqpa" dbtype="query">
		
			select * from RESULT
			where partno_c = <CFQUERYPARAM VALUE="#arguments.partno_id#" CFSQLType="CF_SQL_NUMERIC">
		
		</CFQUERY>
		
		<cfreturn QoQqpa.available> 	  
	 <cfelse>
	   <cfreturn 1>
	  </cfif> 
	  
	</cffunction>	
</cfcomponent>