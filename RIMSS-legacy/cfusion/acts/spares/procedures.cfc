

<cfcomponent>

<cffunction name="UPDATE_SPARES">
  <cfargument name="ASSETID" type="numeric" required="yes">
  <cfargument name="STATUSID" type="numeric" required="yes">
  <cfargument name="SPARELOCATION" type="numeric" required="yes">
  <cfargument name="REMARKS" type="STRING" required="yes">
	  
  
  <cfstoredproc procedure="GLOBALEYE.SPARES.UPDATE_SPARES" dataSource = "#application.datasource#">  
    <cfprocparam dbvarname="@P_ASSETID" cfsqltype="CF_SQL_INTEGER" value="#ASSETID#">
	<cfprocparam dbvarname="@P_STATUSID" cfsqltype="CF_SQL_INTEGER" value="#STATUSID#">
	<cfprocparam dbvarname="@P_LOCATION" cfsqltype="CF_SQL_INTEGER" value="#SPARELOCATION#">
	<cfprocparam dbvarname="@P_REMARKS" cfsqltype="CF_SQL_VARCHAR" value="#REMARKS#">

    <!--- <cfprocresult name="RESULT" resultset="1"> --->

  </cfstoredproc>


  <!--- <cfreturn RESULT> --->
  
</cffunction>

<cffunction name="UPDATE_SOFTWARE">
  <cfargument name="ASSETID" type="numeric" required="yes">
  <cfargument name="SWID" type="numeric" required="yes">
  <cfargument name="INS_BY" type="string" required="yes">
  
  <cfstoredproc procedure="GLOBALEYE.SPARES.UPDATE_SOFTWARE" dataSource = "#application.datasource#">  
    <cfprocparam dbvarname="@P_ASSETID" cfsqltype="CF_SQL_INTEGER" value="#ASSETID#">
	<cfprocparam dbvarname="@P_SWID" cfsqltype="CF_SQL_INTEGER" value="#SWID#">
	<cfprocparam dbvarname="@P_INS_BY" cfsqltype="CF_SQL_VARCHAR" value="#INS_BY#">

    <!--- <cfprocresult name="RESULT" resultset="1"> --->

  </cfstoredproc>


  <!--- <cfreturn RESULT> --->
  
</cffunction>

<cffunction name="DELETE_SOFTWARE">
  <cfargument name="ASSETID" type="numeric" required="yes">	  
  
  <cfstoredproc procedure="GLOBALEYE.SPARES.DELETE_SOFTWARE" dataSource = "#application.datasource#">  
    <cfprocparam dbvarname="@P_ASSETID" cfsqltype="CF_SQL_INTEGER" value="#ASSETID#">

    <!--- <cfprocresult name="RESULT" resultset="1"> --->

  </cfstoredproc>


  <!--- <cfreturn RESULT> --->
  
</cffunction>
</cfcomponent>