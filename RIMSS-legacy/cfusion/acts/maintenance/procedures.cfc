<cfcomponent>
	<cffunction name="getP5report">
	  <cfargument name="repairID" type="numeric" required="yes" > 

		<cfquery name = "getP5reportInfo" dataSource = "#application.datasource#">
		
			select globaleye.repair.event_ID,globaleye.repair.old_job, globaleye.repair.repair_seq, globaleye.loc_set.display_name,
			globaleye.event.start_job, globaleye.part_list.partno, globaleye.asset.serno, globaleye.part_list.noun, globaleye.repair.narrative,
			globaleye.meter_hist.meter_in
			from globaleye.repair INNER JOIN globaleye.event ON
			globaleye.repair.event_id = globaleye.event.event_id INNER JOIN globaleye.loc_set ON
			globaleye.event.loc_id = globaleye.loc_set.loc_id INNER JOIN globaleye.asset
			ON globaleye.repair.asset_id = globaleye.asset.asset_id INNER JOIN globaleye.part_list ON
			globaleye.asset.partno_id = globaleye.part_list.partno_id INNER JOIN globaleye.meter_hist ON
			globaleye.event.event_id = globaleye.meter_hist.EVENT_ID
			where globaleye.repair.repair_id = #repairID#
		
		</CFQUERY>
		
		<cfreturn getP5reportInfo>			
	
	</cffunction>
	
	<cffunction name="getParentInfo">
	  <cfargument name="parentSerNo" type="string" required="yes" > 

		<cfquery name = "getParentInfo" dataSource = "#application.datasource#">
		
			select serno,asset_type from globaleye.asset
			where serno = '#parentSerNo#'
		
		</CFQUERY>
		
		<cfreturn getParentInfo>			
	
	</cffunction>	
	
	<cffunction name="getPOCinfo"> 

		<cfquery name = "getPOCinfo" dataSource = "#application.datasource#">
		
			select * from globaleye.code
			where CODE_TYPE = 'P5POC'
		
		</CFQUERY>
		
		<cfreturn getPOCInfo>			
	
	</cffunction>	
	
</cfcomponent>