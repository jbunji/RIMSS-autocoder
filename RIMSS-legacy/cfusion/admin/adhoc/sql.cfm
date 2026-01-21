<cfsilent>
	<cfsetting showDebugOutput="true"/>
	<cfparam name="testq" default=""/>
	<cfparam name="msg" default=""/>
	<cfparam name="msg_status" default="resultMessage"/>
	<cfsetting requesttimeout="300"/>
	<cfset dbUtils = application.objectFactory.create("DBUtils")>
	
	
	
	<cfif StructKeyExists(FORM,'datasource') and Structkeyexists(form,"sql")>
		
		<cfset dbUtils = application.objectFactory.create("DBUtils") />
		<cfset programLookup = application.sessionManager.getProgramSetting() />
		<cfset curlocId = 0>
		<cfset curSysId = 0>
		<cfset curLocId = application.sessionManager.getLocIdSetting()>
		<cfset curSysId = dbUtils.getSysIdByProgram(programLookup)/>


		<!---<cflog file="AdHoc" text="#application.sessionManager.getUserModel().getUserName()# - curlocId: #curLocId#" />
		<cflog file="AdHoc" text="#application.sessionManager.getUserModel().getUserName()# - curSysId: #curSysId#" />--->
			<!---<cflog file="AdHoc" text="#application.sessionManager.getUserModel().getUserName()# - sqlText: #form.sql#" />--->
		<cfset form.sql = replaceNoCase(form.sql,"--{LOC_ID}--",curLocId,'ALL')>
		<cfset form.sql = replaceNoCase(form.sql,"--{SYS_ID}--",curSysId,'ALL')>
		<cfset form.sql = replaceNoCase(form.sql,"AND"," AND ",'ALL')>
		<cfset form.sql = replaceNoCase(form.sql,"WHERE"," WHERE ",'ALL')>
		<cfset form.sql = replaceNoCase(form.sql,"ORDER"," ORDER",'ALL')>
		<cfset form.sql = rereplaceNoCase(form.sql,"<\s*br[^>]*>"," ","ALL")>
		<cfset form.sql = rereplaceNoCase(form.sql,"&nbsp;"," ","ALL")>
		<cfset form.sql = rereplaceNoCase(form.sql,"FROM"," FROM","ALL")>
		<cftry>

			<cfset sqlText = trim(FORM.sql)/>
			<cfset ds = trim(FORM.datasource)/>
			<!---<cfquery name="testq" datasource="#ds#">
				#PreserveSingleQuotes(sqlText)#
			</cfquery>
			--->
			
			
<!---			<cflog file="AdHoc" text="#application.sessionManager.getUserModel().getUserName()# - sqlText: #sqlText#" />
--->		
			<cfset testq = runSql(sqlText,ds)/>
		
		
			<!--- put the query in a table --->
			<!---<cfset dbUtils = application.objectFactory.create("DBUtils")>--->
			<!---<cfset testq = DBUtils.runSql(sqlText,ds)>--->
			<cfset colnames = testq.getColumnNames()/>
			
			<cfif testq.recordcount eq 0>
				<cfset msg="No Records Found">
				<cfset msg_status="global_notice_msg">
			</cfif>

			<cfcatch>	 
				<!---<cfset msg=cfcatch.message & " " & cfcatch.detail>--->
				<cfset msg=cfcatch.message & " " & cfcatch.detail>
				<cfset msg_status="global_error_msg">
				<cfrethrow/>
			</cfcatch>
		</cftry>
		
	<cfelse>
		<cfset msg="Something went very wrong!">
		<cfset msg_status="global_error_msg">
	</cfif>
	
	<cffunction name="runSql" output="no">
		<cfargument name="sqlText">
		<cfargument name="datasource">
		<cfset var qryResult = ""/>
		<cfset qryResult=dbUtils.runSql(arguments.sqlText,arguments.datasource)>
		<cfreturn qryResult>
	</cffunction>
		
</cfsilent>

<script>
	
	$(function() { 
	
	//Creating report timestamp for exports	
	var d = new Date();

	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	function addZero(i) {
	    if (i < 10) {
	        i = "0" + i;
	    }
	    return i;
	}
	
	var reportTimeStamp = days[d.getUTCDay()] + ", " +  months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " +  d.getUTCFullYear() + ", " + addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes()) + ":" + addZero(d.getUTCSeconds()) + " ZULU";
	
	//Setting date string for excel filename
	var excelDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
	
	var exportTable = $('#sql_results_table').DataTable( {
	        dom: 'Brtp',
	        "paging": false,
	        //Options below control the size and scrolling options of tables
        	"bAutoWidth": false,
			"sScrollX": false,
			"sScrollY": false,
			"bScrollCollapse": false,
	        "bSort" : true,
	        "aaSorting": [],
	        buttons: [
	        	{
	                extend: 'print',
	                className: 'adhocPrint',
	                messageTop: 'CONTROLLED UNCLASSIFIED INFORMATION',
	                title: 'ADHOC Report Results - ' + reportTimeStamp,
	                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
	                filename: 'CUI_ADHOC_Report_' + excelDate,
	                text: 'Print',
	                customize: function(doc) {
	                	//console.log($(doc.document.body).find('div'));
	                	$(doc.document.body).find('h1').css('font-size','12pt');
	                	$(doc.document.body).find('h1').css('text-align','center');
	                	
	                	$(doc.document.body).find('div').css('font-size','12pt');
	                	$(doc.document.body).find('div').css('text-align','center');
	                	$(doc.document.body).find('div').css('padding-top','10px');
	                	$(doc.document.body).find('div').css('padding-bottom','10px');
	                	
	                	$(doc.document.body).find('div')[0].innerText = "*****CONTROLLED UNCLASSIFIED INFORMATION*****";
	                	$(doc.document.body).find('div')[1].innerText = "*****CONTROLLED UNCLASSIFIED INFORMATION*****";
	                }
	            },
	            {
	                extend: 'excelHtml5',
	                className: 'adhocExcel',
	                title: 'CONTROLLED UNCLASSIFIED INFORMATION',
	                messageTop: 'ADHOC Report Results - ' + reportTimeStamp,
	                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
	                filename: 'CUI_ADHOC_Report_' + excelDate,
	                text: 'Excel'
	            }		            
	            
	        ]
	} ); 	
	
	//console.log(exportTable);
		    
	//De-tatching buttons from table and appending them to a div, so that buttons can be moved on page   	
	exportTable.buttons().container().appendTo('#exportButtons');
});
		
</script>
	<cftry>

	
	<cfoutput><div class="#msg_status#">#msg#</div></cfoutput>
	<cfif isquery(testq) and testq.recordCount>

		<div class="exportOptions clearfix" style="display:none;background-color:##AAA;">
		<cfoutput>
			<cfmodule  template="export.cfm" exportTypes="PRINT,EXCEL" query="#testq#" title="ADHOC RESULTS" exportTitle = "ADHOC RESULTS" id="sql_results"/>
		</cfoutput>
		</div>
		<cfoutput>
		<div id="sql_results">
		<table border="1" id="sql_results_table" class="result_table" width="100%" >
			<thead>
			<tr>
			<cfloop from="1" to="#ArrayLen(colnames)#" index="c">
				<th>#colnames[c]#</th>
			</cfloop>
			</tr>
			</thead>
			<tbody>
			<cfloop query="testq">
			<tr>
				<cfloop from="1" to="#ArrayLen(colnames)#" index="c">
				<td style="empty-cells:show;">#trim(testq[colnames[c]][currentrow])#&nbsp;</td>
				</cfloop>
			</tr>
			</cfloop>
			</tbody>
		</table>
		</div>
		</cfoutput>
		<script>$('.exportOptions').show();</script>
	</cfif>
	<cfcatch>
		<cfoutput><div class="global_error_msg">#cfcatch.message#</div></cfoutput>
		<cfrethrow/>
	</cfcatch>
	</cftry>
