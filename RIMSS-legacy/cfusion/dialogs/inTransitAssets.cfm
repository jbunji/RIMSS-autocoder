<!DOCTYPE html>


<cfsilent>

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<cfparam name="url.dir" default="" >
<cfset programLookup = application.sessionManager.getProgramIdSetting() />
<cfset unitLookup = application.sessionManager.getLocIdSetting() />

<cfset sysCatLookup = "AIRBORNE" />
<cfif IsDefined("form.systemcat")>
    <cfset sysCatLookup = ucase(form.systemcat) />
</cfif>

<cfset inTransitLookup = application.objectFactory.create("DBUtils") />

<cftry>
	<cfif StructKeyExists(url, "dir") and url.dir EQ "inbound">
		<cfset assets = inTransitLookup.getInboundAssets(programLookup, unitLookup) />
	<cfelse>
		<cfset assets = inTransitLookup.getOutboundAssets(programLookup, unitLookup) />
	</cfif>
    
	<cfcatch>
		<cfset assets = []/>
	</cfcatch>
</cftry>

</cfsilent>

<!---<cfif ArrayLen(assets) gt 0>
    <div class="filterResult">Filter Results: <input type="text" id="dtSearch"/></div>      
</cfif>--->

<div id="assetsLookup" style="width: 100%;">


	<table class="lookupDialog font10" id="userAssets" cellpadding="0" cellspacing="0" >
	    <thead>
	   <cfif assets.recordcount gt 0>
		<tr class="header">
	        <th>SERNO</th>
			<th>PARTNO</th>
			<th>NOUN</th>
			<cfif StructKeyExists(url, "dir") and url.dir EQ "inbound">
				<th>FROM</</th>
			<cfelse>
				<th>TO</</th>
			</cfif>
	    </tr></thead>
		<tbody><!---
	--->
		    <cfloop query="assets">
		    <tr>
		        <td class="serno" id='<cfoutput>#encodeForHTML(assets.asset_id)#</cfoutput>'>
		        	<span><cfoutput>#encodeForHTML(assets.serno)#</cfoutput></span>
		        </td>
				<td><cfoutput>#encodeForHTML(assets.partno)#</cfoutput></td>
				<td><cfoutput>#encodeForHTML(assets.noun)#</cfoutput></td>
				<cfif StructKeyExists(url, "dir") and url.dir EQ "inbound">
					<td><cfoutput>#encodeForHTML(assets.FROM_SITE)#</cfoutput></td>
				<cfelse>
					<td><cfoutput>#encodeForHTML(assets.TO_SITE)#</cfoutput></td>
				</cfif>
		    </tr><!---
		---></cfloop>
	    <cfelse>
			<tr><td colspan="3"></td></tr>
	        <tr class="asset">
	            <td colspan="3">
	            	No assets found for Program: <cfoutput>#encodeForHTML(programLookup)#</cfoutput>, Unit: <cfoutput>#encodeForHTML(unitLookup)#</cfoutput>, and System Category: <cfoutput>#encodeForHTML(sysCatLookup)#</cfoutput>
	            </td>
			</tr>
	    </cfif>
	    </tbody>
	</table>
</div>


    <script type="text/javascript">
        
        
        $(document).ready(function() {
           
			
			var dt = $('.lookupDialog:visible').dataTable({ 
                      "bFilter": true,
                      "sDom":"t"
               });
			

        });
    </script>