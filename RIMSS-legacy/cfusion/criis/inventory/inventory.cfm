<cfimport taglib="../layout" prefix="RIMSS"/>
<!---<script src="#application.rootpath#/skins/common/assets/wc_tabs.css"></script>--->

<cfscript>
    import cfc.dao.DBUtils;
    import cfc.utils.QueryIterator;
    
    import cfc.facade.SessionFacade;
    import cfc.utils.utilities;
        
</cfscript>

<cfset dbUtils = application.objectFactory.create("DBUtils") />
<cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
<cfset qSystems = dbUtils.getSystemByProgram(application.sessionManager.getProgramIdSetting(),application.sessionManager.getLocIdSetting())/>
<!---<cfset qAssets = dbUtils.getAssetsByProgram(application.sessionManager.getProgramIdSetting(),application.sessionManager.getLocIdSetting())/>--->



<cfsetting showdebugoutput="false" >
<RIMSS:layout section="inventory" subSection="#application.sessionManager.getSubSection()#">
    <RIMSS:subLayout/>
	
	<style>
				
		table.assetTable{
		  border-collapse:collapse;
		  border:1px solid black;
		  width:100%;
		
		}
		
		table.assetTable thead tr{
		    background-color:#027FD1;
		    color:white;
		}
		
		table.assetTable thead th{
		    border:1px solid black;
		    padding:2px;
		    color:white;
		    white-space:nowrap;
		    
		}
		
		table.assetTable thead th.sorting, 
		table.assetTable thead th.sorting_asc, 
		table.assetTable thead th.sorting_desc{
		    cursor:pointer;
		    
		}
		
		table.assetTable tbody tr{
		    color:black;
		}
		
		table.assetTable tbody tr.even{
		    background-color:#e6e6e6;
		}
		
		table.assetTable tbody tr.odd{
		    background-color:white;
		}
		
		table.assetTable tbody td{
		    border:1px solid black;
		    padding:2px;
		    
		
		}
		
		table.assetTable tbody th{
		    color:white;
		    
		
		}
		
		table.assetTable tbody tr.hilight{
		    background-color:#5C85D6 !important;
		    color:white !important;
		    cursor:pointer;
		}
		
		table.assetTable tbody tr td.editIcon {
	    background-image: url("../layout/images/icons/edit.png");
	    background-position: center center;
	    background-repeat: no-repeat;
	    height: 20px;
	    width: 20px;
	}

	
		
	</style>
	
	
	<style type="text/css">
		
		div.backlogMenu{
		    height:35px;
		    background-color:#000;
		    color:white;
		    margin:0px;	
			
		}
		
		div.backlogMenu .menuItems {
			width:100%;
			border-collapse:collapse;
			line-height:2.3em;
		}
		
		div.backlogMenu .menuItems td{
			text-align:center;
			white-space:nowrap;
			
		}
		
		div.backlogMenu .menuItems td.searchItem{
            width:20%;
			min-width:20%;
        }

		div.backlogMenu .backlog a#backlogLink,
		div.backlogMenu .pmi a#pmiLink,
		div.backlogMenu .tcto a#tctoLink
		{
           /* background-color:#7bbaf9;
            color:black;*/
        }
		
		.highlight{
			background-color:#7bbaf9 !important;
            color:black;
		}

		div.backlogMenu .backlogSubItems {			
			white-space:nowrap;
			margin:1px;
		}
		
		div.backlogMenu .backlogSubItems ul {
			margin:0px auto;
			padding:0px;
			list-style:none;
			color:white;
			width:750px;
			white-space:nowrap;
	
		}
		
		div.backlogMenu .backlogSubItems li {
			float:left;
			width:150px;
			background-color:#027fd1;
			line-height:2.3em;
			border-right:1px solid #4e9eef;
			border-left:1px solid #154f89;
			white-space:nowrap;

		}
		
		div.backlogMenu .backlogSubItems li a {
			color:white;
			text-decoration:none;
			display:block;

		}
		div.backlogMenu .backlogSubItems li a:hover {
            color:black;
			
           background-color:#7bbaf9;
		   
        }
        
		.export {
			width:350px;
			min-width:350px; 
		}
		
		.exportOptions {
			clear:both;
		}
		
		.exportOptions .noLabel {
           width:50px;
		   height:32px;
		   display:block;
        }
		
        .exportOptions ul {
            margin:0px auto;
            padding:0px;
            list-style:none;
            color:white;
            width:auto;
			font-size:10px;

        }

        .exportOptions li {
            float:left;
			height:32px;
			width:112px;


        }
        
        .exportOptions li a {
            color:white;
            text-decoration:none;
			display:block;
			height:32px;
			padding-left:2px;
			line-height:32px;
			font-weight:bold;
        }
		
		.exportOptions li a:hover {
		  color:#7bbaf9;	
		}
		
		
		.exportOptions #pdfLink a {
			padding-left:5px;
		}
		
		.exportOptions #printLink {
			background-image: url("../../common/images/icons/print.png");
			background-position:center;
			background-repeat:no-repeat;
			
		}
		
		.exportOptions #pdfLink {
            background-image: url("../../common/images/icons/pdf.png");
            background-position:right;
			background-repeat:no-repeat;
			text-align:left;
			padding-left:5px;
            
        }
		
		.exportOptions #excelLink {
            background-image: url("../../common/images/icons/excel.png");
            background-position:right;
			background-repeat:no-repeat;
			text-align:left;

            
        }	
		
		

       .link a{
		   text-decoration:none;
           }	
           
         .ui-tooltip {
		    max-width: 3500px;
		    float:right;
		  }
		
	</style>
	
	<!---<cfparam name="url.system" default="#qSystems.system#" >--->
<cfparam name="session.system" default="POD" >
<cfparam name="url.system" default="#session.system#" >
	
	<cfif not isDefined("rc.qAssets")>	
		<script>
			<cflocation url="index.cfm?action=search.inventory&system=#encodeForHTML(url.system)#">
		</script>
	</cfif>
	
	<script type="text/javascript">

		
		$(function() {
			
			$(document).tooltip({
				items:"[data-legend]",
				content:function(){
					return "<div style='font-size:12px; '>"+
    	"<div style='font-weight:bold; margin: auto 0'>Legend</div>"+
    	"<cfoutput>"+
    		"<div>Today: #lsdateformat(now(),'MM/DD/YYYY')#</div>"+
    		"<div style='background:red'>Due on or before #DateDiff('d',now(),dateadd('d', now(), 7))+1# days (#LSDATEFORMAT(dateadd('d', now(), 7), 'MM/DD/YYYY')#) </div>"+
    		"<div style='background:yellow'>Due between #DateDiff('d',now(),dateadd('d', now(), 8))+1# days (#LSDATEFORMAT(dateadd('d', now(), 8), 'MM/DD/YYYY')#) and"+
    		" #DateDiff('d',now(),dateadd('d', now(), 30))+1# days (#LSDATEFORMAT(dateadd('d', now(), 30), 'MM/DD/YYYY')#)  </div>"+
    		"<div style='background:green'>Due on or after #DateDiff('d',now(),dateadd('d', now(), 31))+1# days (#LSDATEFORMAT(dateadd('d', now(), 31), 'MM/DD/YYYY')#) </div></br>"+
    	"</cfoutput>"+
    "</div>";
				}
			});
			<cfif isDefined("rc.system")>
				<cfoutput>
				$(".#rc.system#Link").toggleClass("highlight");
				</cfoutput>
			</cfif>
			setupHighlight(); 
			/*
			var dt = $('#inventoryTable').dataTable({ 
				
			"bFilter": true,
			"sDom":'t'
				
			});
			*/
			
			$('#dtSearch').on('keyup',function(e){
				dt.fnFilter($(this).val());
			});
			

        });  
	
    </script>
<!---jQuery below is responsible for Export to Excel function along with hidden table at bottom of page --->   
<script>
	
	<cfoutput>
		var inv_system = "#EncodeForHTML(rc.system)#";
	</cfoutput>
	
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
	
	var reportTimeStamp = "Report Prepared on: " +  days[d.getUTCDay()] + ", " +  months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " +  d.getUTCFullYear() + ", " + addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes()) + ":" + addZero(d.getUTCSeconds()) + " ZULU";

	//Setting date string for excel filename
	var excelDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);	
	
	var exportTable = $('#inventoryTableExport').DataTable( {
	        dom: 'Brtp',
	        "paging": false,
	        //Options below control the size and scrolling options of tables
        	"bAutoWidth": false,
			"sScrollX": false,
			"sScrollY": false,
			"bScrollCollapse": false,
	        "bSort" : false,
	        "aaSorting": [],
	        buttons: [
	        	{
	        		extend: 'pdfHtml5',
	        		className: 'pdfBtn',
	        		messageTop: document.getElementById("skin_sub_title").innerText + ' - Inventory - ' + reportTimeStamp,
	        		
	        		//PLACEHOLDER text is overwritten below
	        		title: 'PLACEHOLDER',
	                messageBottom: 'PLACEHOLDER',
	                
	                filename: 'CUI_Inventory_' + excelDate,
	                orientation: 'landscape',
	                text: 'Export to PDF',
	                customize: function(doc) {
						
						//Overwriting PLACEHOLDER text above with CUI in order to add asterisks. Styling CUI text
		   				doc.content[0].alignment = 'center';
		   				doc.content[0].text = '*****CONTROLLED UNCLASSIFIED INFORMATION*****';
		   				doc.content[0].bold = 'true';
		   				doc.content[0].fontSize = '14';
		   				
		   				//Styling report title
		   				doc.content[1].alignment = 'center';
		   				doc.content[1].fontSize = '15';
		   				
		   				//Overwriting PLACEHOLDER text above with CUI in order to add asterisks. Styling CUI text.
		   				doc.content[3].alignment = 'center';
		   				doc.content[3].text = '*****CONTROLLED UNCLASSIFIED INFORMATION*****';
		   				doc.content[3].bold = 'true';
		   				doc.content[3].fontSize = '14';
		   				
		   				//Setting font size for table. Setting size too large can cause table to cut off on PDF export
		   				doc.styles.tableHeader.fontSize = 10;
                        doc.styles.tableBodyEven.fontSize = 10;
                        doc.styles.tableBodyOdd.fontSize = 10;

                        for (var i = 0; i < exportTable.column(4).data().length; i++) {
	                        
	                        //Getting PMI column position
	                        var pmiCol = exportTable.columns().count() - 2;
	                        
	                        //Getting "Next PMI Due" value from table
							var pmi_date = exportTable.column(pmiCol).data()[i];
							
							if (pmi_date.length > 0) {
								//Converting Next PMI Due date to Date object
								//Need to use "Date.parse()" for IE
	 							var pmi_date = new Date(Date.parse(pmi_date));
								
								//Getting today's date
								var date=new Date();
								var months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
								var today_date = date.getDate()+"-"+months[date.getMonth()]+"-"+date.getFullYear();
								
								//Converting today's date to a Date object
								//Need to use "Date.parse()" for IE
								var today_date = new Date(Date.parse(today_date));
								
	  	 						//Getting difference in days between Next PMI Due date and today's date
	  	 						var ONE_DAY = (1000 * 60 * 60 * 24);
	     						var differenceMs =  Math.abs(pmi_date - today_date);
	    						var diff = Math.round(differenceMs / ONE_DAY);
	
								/*If difference in days is less than or equal 7 days OR todays date is greater than PMI date, 
								then Next PMI Due will be highlighted red*/
		        		   		if (diff <= 7 || today_date > pmi_date){
		        		   			doc.content[2].table.body[i+1][pmiCol].fillColor = 'red';
		        		   		}
		        		   		/*If difference in days is greater than 7 days
		        		   		and less than or equal to 30 days, then Next PMI Due will be highlighted yellow*/
		        		   		else if (diff <= 30 && diff > 7){
		        		   			doc.content[2].table.body[i+1][pmiCol].fillColor = 'yellow';
		        		   		}
		        		   		//If difference in days is greater than or equal to 31 days, then Next PMI Due will be highlighted green
		        		   		else if (diff >= 31){
		        		   			doc.content[2].table.body[i+1][pmiCol].fillColor = 'green';
		        		   		}
						    }
						    
				      	}
	            	}
	        	},
	            {
	                extend: 'excelHtml5',
	                className: 'excelBtn',
	                title: "CONTROLLED UNCLASSIFIED INFORMATION",
	                messageTop: reportTimeStamp,
	                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
		            filename: 'CUI_Inventory_' + excelDate,
	                text: 'Export to Excel',
      				customize: function( xlsx ) {
	    				var sheet = xlsx.xl.worksheets['sheet1.xml'];
	    				
	            		var excel_row = "";
	            		
	            		if (inv_system == 'POD' || inv_system == 'IM') {
	            			excel_row = "L";
	            		} else {
	            			excel_row = "H";
	            		}
	            		
	    				//Loops through table on what would be column "G" in excel spreadsheet
	    				$('row c[r^="'+ excel_row + '"]', sheet).each( function (index ) {
						    
						    if (index > 0) {
								
								//Getting "Next PMI Due" value from table
								var pmi_date = $(this).text();
								
								//Converting Next PMI Due date to Date object
								//Need to use "Date.parse()" for IE
	 							var pmi_date = new Date(Date.parse(pmi_date));
								
								//Getting today's date
								var date=new Date();
								var months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
								var today_date = date.getDate()+"-"+months[date.getMonth()]+"-"+date.getFullYear();
								
								//Converting today's date to a Date object
								//Need to use "Date.parse()" for IE
								var today_date = new Date(Date.parse(today_date));
								
	  	 						//Getting difference in days between Next PMI Due date and today's date
	  	 						var ONE_DAY = (1000 * 60 * 60 * 24);
	     						var differenceMs =  Math.abs(pmi_date - today_date);
	    						var diff = Math.round(differenceMs / ONE_DAY);

								/*If difference in days is less than or equal 7 days OR todays date is greater than PMI date, 
								then Next PMI Due will be highlighted red*/
		        		   		if (diff <= 7 || today_date > pmi_date){
		        		   			$(this).attr( 's', '35' );
		        		   		}
		        		   		/*If difference in days is greater than 7 days
		        		   		and less than or equal to 30 days, then Next PMI Due will be highlighted yellow*/
		        		   		else if (diff <= 30 && diff > 7){
		        		   			$(this).attr( 's', '45' );
		        		   		}
		        		   		//If difference in days is greater than or equal to 31 days, then Next PMI Due will be highlighted green
		        		   		else if (diff >= 31){
		        		   			$(this).attr( 's', '40' );
		        		   		}  
	            		    }
	            		})
	            	}
	            }		            
	            
	        ]
	} ); 	
		    
	//De-tatching buttons from table and appending them to a div, so that buttons can be moved on page   	
	exportTable.buttons().container().appendTo('#exportButtons');
});
		
</script>		
	<div class="backlogMenu">
		<cfoutput>
                
	        <form name="maintenance_menu_form" method="post" action="#application.rootPath#/#lcase(trim(application.sessionManager.getProgramSetting()))#/inventory/index.cfm">
	            <table class="menuItems">
	            	<tr>
	            		<td class="searchItem">
	            		    <div >
	            		    	 
								 <input type="hidden" id="system" name="system" value="#rc.system#">
	            		         <input type="text" style="width:250px" name="searchCriteria" id="searchCriteria" <cfif Structkeyexists(form,"searchCriteria")>value="#encodeForHTML(trim(form.searchCriteria))#"</cfif>/>
                                 <input type="submit" name="searchBacklog" id="searchBacklog" class="search" value="" onclick="setAction('search.inventory',this);setMethod('forward',this);"/>
							 </div>
	            		</td>
						<td style="text-align:center">
							<div class="backlogSubItems">
								 <ul class="backlog">
								 	<cfloop query="qSystems">
								 		<li><a id="#encodeForHTML(system)#Link" class="#encodeForHTML(system)#Link" href="inventory.cfm?system=#encodeForURL(SYSTEM)#">#encodeForHTML(SYSTEM)#</a></li>
									 </cfloop>
								 </ul>
							 </div> 
						</td>
						<td class="export">
							<div class="exportOptions">
								<ul >
		                            <li class="noLabel" id="printLink"><a href="#application.rootPath#/#lcase(trim(application.sessionManager.getProgramSetting()))#/inventory/index.cfm?action=export.inventory&exportType=print&system=#rc.system#" target="_blank"></a></li>
		                            <!---<li id="pdfLink"><a href="#application.rootPath#/#lcase(trim(application.sessionManager.getProgramSetting()))#/inventory/index.cfm?action=export.inventory&exportType=pdf&system=#rc.system#">Export to PDF </a></li>--->
		                            <li id="exportButtons"></li>
		                        </ul>
							</div>
						</td>
	            	</tr>
	            </table>
	            	
	        </form> 

        </cfoutput>
	</div>
    
	<cfoutput>
	   <div class="message #msgStatus#">#encodeForHTML(trim(msg))#</div>
	</cfoutput>
	
     <div class="headerContent">
    	<div class="headerTitle">Inventory</div>
    </div>
	
    <span style="font-size:16px;font-weight:bold;float:right;margin-right: 200px;text-decoration: underline;" data-legend="">
    	+Legend
    </span>
 	<cfquery dbtype="query" name="QoQNoun">
		select noun
		from rc.qAssets
		group by noun
	</cfquery>

		<input type="hidden" id="system" value="#rc.system#">
			<div class="mainContent">
               <table class="globalTable font10 sticky-headers" id="inventoryTable">
                     <thead>                
					   <tr>
                            <th colspan="13" class="filter font9" style="background: black">
                                <cfif rc.qAssets.recordcount gt 1> <div style="float:left; l">Asset Count: <cfoutput>#rc.qAssets.recordcount#</cfoutput></div></cfif>                                  
                            </th>
                        </tr>
                        <tr>
                            <th class="noSort">&nbsp;</th>
							<th>Serno</th>
							<cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
								<th>Cumulative Hrs</th>
								<th>Bench Hrs</th>
								<th>Operational Hrs</th>
							</cfif>
                            <th>Status</th>
                            <th>Current Loc</th>
                            <th>Assign Loc</th>
							<cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
								<th>CPOT</th>
							</cfif>
                            
                            <th>Is In Transit</th>
							<th>Tracking Number</th>
							<th>Next PMI Due</th>
							<th>Remarks</th>
                        </tr>
                     </thead>
                   <tbody> 
                   	
                   	
                   	 	
                   	<!--- This is for debuging --->
                   		<!---
                   	<cfdump var="#SESSION.USER.SETTINGS.UNIT#" label="USER">
                   	<cfdump var="#SESSION.USER.SETTINGS.LOCID#" label="USER">
                   
                   	<cfdump var="#server#" label="Server Scope">
                   	<cfdump var="#SESSION#" >
 					<cfdump var="#QoQNoun#" >
 					<cfdump var="#APPLICATION#" > 					
 					<cfdump var="#rc#" >
                   	<cfdump var="#rc.qAssets#" abort>
                   	  --->   
                   <cfoutput query="QoQNoun" >
				   	   <cfquery dbtype="query" name="QoQAssets">
							select *
							from rc.qAssets
							where noun = '#QoQNoun.noun#'
						</cfquery>																					
						<tr>
				   			<td bgcolor="##027FD1" style="text-align:center;font-weight:bold;color:white" colspan="13">#encodeForHTML(QoQNoun.noun)#</td>	
						</tr> 
						
						
				   	   
				   	   <cfloop query="QoQAssets">
				   	   	
				   	 
				   	  
                        <tr class="<cfif currentRow mod 2> odd <cfelse> even </cfif>">
                            <td class="edit editIcon"><a href="index.cfm?action=edit.inventory&assetId=#encodeForURL(ENCRYPTED_ASSET_ID)#&system=#encodeForURL(rc.system)#"></a></td>
                            <td style="width:50px">#encodeForHTML(trim(SERNO))#</td>
							<cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
								<td style="width:50px">#encodeForHTML(delta)#</td>
								<td style="width:50px">#encodeForHTML(bench)#</td>
								<td style="width:50px">#encodeForHTML(flight)#</td>		
							</cfif>					
                            <td style="width:50px">#encodeForHTML(trim(STATUS))#</td>
                            <td style="width:200px"><p title="Site: #encodeForHTML(trim(CURR))# Unit: #encodeForHTML(trim(unit_c))#">#encodeForHTML(trim(CURR))#</p></td>
                            <td style="width:200px"><p title="Site: #encodeForHTML(trim(ASSIGN))# Unit: #encodeForHTML(trim(unit_a))#">#encodeForHTML(trim(ASSIGN))#</p></td>
							<cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
								<td style="width:50px">#encodeForHTML(trim(ETM))#</td>
							</cfif>
                            <td style="width:50px">#encodeForHTML(trim(IN_TRANSIT))#</td>       
							<td  style="width:100px">
								<cfswitch expression="#shipper#">
									<cfcase value="FEDEX">
										<a href="http://www.fedex.com/Tracking?action=track&tracknumbers=#encodeForURL(TCN)#" target="_blank">#encodeForHTML(trim(TCN))#</a>
										<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfcase value="UPS">
										<a href="http://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=#encodeForURL(TCN)#" target="_blank">#encodeForHTML(trim(TCN))#</a>
										<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfcase value="DHL">
										<a href="http://webtrack.dhlglobalmail.com/?mobile=&trackingnumber=#encodeForURL(TCN)#" target="_blank">#encodeForHTML(trim(TCN))#</a>
										<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfcase value="GOV">
										#encodeForHTML(trim(TCN))#	
										<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(SHIPPER))#)</span>
									</cfcase>
									<cfdefaultcase>
										&nbsp;
									</cfdefaultcase>
								</cfswitch> 
							</td> 
							<!--- JJP 06/30/17 Added color coding for Next PMI Due (Issue 271) --->
							<cfif NEXT_DUE_DATE NEQ "">
								<cfif DateDiff('d',now(),NEXT_DUE_DATE)+1 GT 30>
									<td style="background-color:green; width: 50px">#LSDateFormat(NEXT_DUE_DATE,'DD-MMM-YYYY')#</td>
								<cfelseif (DateDiff('d',now(),NEXT_DUE_DATE)+1 LTE 30) AND (DateDiff('d',now(),NEXT_DUE_DATE)+1 GT 7)>
									<td style="background-color:yellow;width: 50px">#LSDateFormat(NEXT_DUE_DATE,'DD-MMM-YYYY')#</td>
								<cfelse>
									<td style="background-color:red;width: 50px">#LSDateFormat(NEXT_DUE_DATE,'DD-MMM-YYYY')#</td>
								</cfif>
							<cfelse>
								<td>&nbsp;</td>
							</cfif>
							<td><div class="excerpt">#encodeForHTML(trim(REMARKS))#</div></td>            
                        </tr>   
						</cfloop>
                   </cfoutput>
                   </tbody>
               </table>			   
		  </div>
<!---EXPORT TO EXCEL SECTION --->
		
<!---Section below is hidden on page --->
<div style="display:none">
	<!---Table below is what is exported to excel --->
	 <table id="inventoryTableExport">
	      <thead>
	         	<tr>
					<th width="4%">Serno</th>
					<th width="4%">Noun</th>
					<cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
						<th width="6%">Cumulative Hrs</th>
						<th width="9%">Bench Hrs</th>
						<th width="18%">Operational Hrs</th>
					</cfif>
					<th width="6%" >Status</th>
					<th width="6%">Current Loc</th>
					<th width="5%">Assign Loc</th>
					<cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
						<th width="5%">ETM</th>
					</cfif>
                    <th width="5%">Is In Transit</th>
					<th width="5%">Tracking Number</th>
					<th width="5%">Next PMI Due</th>
					<th>Remarks</th>
	         	</tr>	
	         </thead> 
		   <tbody> 	   
		   <cfoutput query="rc.qAssets"> 
		        <tr>
                    <td>#EncodeForHTML(trim(SERNO))#</td>
                    <td>#EncodeForHTML(trim(NOUN))#</td>
                    <cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
						<td>#EncodeForHTML(trim(delta))#</td>
	                    <td>#EncodeForHTML(trim(bench))#</td>
	                    <td>#EncodeForHTML(trim(flight))#</td>
                    </cfif>
					<td>#EncodeForHTML(trim(status))#</td>
					<td>#encodeForHTML(trim(CURR))#</td>
					<td>#encodeForHTML(trim(ASSIGN))#</td>
					<cfif (rc.system EQ "POD" OR rc.system EQ "IM")>
						<td>#encodeForHTML(trim(ETM))#</td>
					</cfif>
					<td>#encodeForHTML(trim(IN_TRANSIT))#</td>
					<td>#encodeForHTML(trim(TCN))#	
						<cfif len(trim(SHIPPER))>(#encodeForHTML(trim(SHIPPER))#)</cfif>
					</td>
					<td>#LSDateFormat(NEXT_DUE_DATE,'DD-MMM-YYYY')#</td>
                    <td>#EncodeForHTML(trim(REMARKS))#</td>
                </tr>   
		   </cfoutput>
   		</tbody>
   </table>
</div>		  
</RIMSS:layout>	