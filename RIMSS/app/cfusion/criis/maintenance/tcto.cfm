<cfimport taglib="../layout" prefix="RIMSS"/>

<!--- cfscript add - Kevin added 7 nov --->
<cfscript>
	import cfc.dao.DBUtils;
	import cfc.utils.QueryIterator;
	
	import cfc.facade.SessionFacade;
	import cfc.utils.utilities;
	
	import criis.controller.maintenanceController;
	dbUtils = application.objectFactory.create("DBUtils");
</cfscript>

<!--- cfscript add - end  --->

<cfsetting showdebugoutput="false" >
<RIMSS:layout section="maintenance" subSection="#application.sessionManager.getSubSection()#">
	<RIMSS:subLayout/>
	<cfparam name="selectedBackLogSubmenu" default="tcto"/>
	<cfparam name="form.maintStatus" default="" >
	<cfparam name="session.maintStatus" default="#form.maintStatus#" >
	
	<cfparam name="session.searchCriteria" default="" >		
	<cfparam name="form.searchCriteria" default="#session.searchCriteria#" >		
	
	
	<style type="text/css">
		.headerMaintStatus{
			float:right;
			padding: 0px 100px 0px 0px;
		}
		
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
		div.backlogMenu .tcto a#tctoLink,
		div.backlogMenu .partOrdered a#partsOrderedLink
		{
            background-color:#7bbaf9;
            color:black;
        }

		div.backlogMenu .backlogSubItems {
			
		}
		
		div.backlogMenu .backlogSubItems ul {
			margin:0px auto;
			padding:0px;
			list-style:none;
			color:white;
			width:620px;
	
		}
		
		div.backlogMenu .backlogSubItems li {
			float:left;
			width:150px;
			background-color:#027fd1;
			line-height:2.3em;
			border-right:1px solid #4e9eef;
			border-left:1px solid #154f89;

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
		
	</style>
<!--- cfsilent add - Kevin Added on 06 November 2013 --->	
<cfif not isDefined("rc.qSearch")>
	
	<script>		
		<cflocation url="index.cfm?action=search.tcto">
	</script>	
    	
<!---	<cfsilent>           
	            <cfset maintenanceController = new maintenanceController()>
				<cfset qSearch = maintenanceController.searchBacklog()>
					   
	</cfsilent>--->
</cfif>
<!--- cfsilent add - end --->

<!--- script add - Kevin Added on 05 November 2013 --->	
	<script>
		try {
			
            $(document).ready(function(){
                //setupEditHighlight();
                setupHighlight();
				
				$(function(){
				      setAction('search.backlog', this);
			          setMethod('forward', this);
				      $(this).closest("form").submit();
			    });
				
				$('#searchCriteria').keydown(function(event){
				//13 = enter key is pressed
				      if (event.which == 13) {
					          setAction('search.backlog', this);
					          setMethod('forward', this);
				      }
			    }).keyup(function(event){
				      //13 = enter key is pressed
				      if (event.which == 13) {
					          event.preventDefault();
					          $('#searchCriteria').trigger('click');
					          return false;
				      }
			    });	
				
				$('#maintStatus').change(function(){
					setMaintStatus();
					$("#maintStatusForm").submit();
				});

               modifyDTColumns();
			  
			 /* $("#backlogTable").dataTable({
			  	"fnDrawCallback": addColSpan
			  });*/
			   
            });
            
            //Add .noSort and .date column defs
           // modifyDTColumns();
			
	    }catch(err){
			console.log("Error: " + err.toString());
	   }
	
		$(function(){
				$(".admin").click(function(event){
					if (confirm("Are you sure you want to remove this record?")==true){
						return true;
					}else{
						event.preventDefault();
					}
				});
		  })	
   </script>

<!---jQuery below is responsible to Export to Excel function along with hidden table at bottom of page --->   
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
	var excelDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
	
	
	var reportTimeStamp = "Report Prepared on: " +  days[d.getUTCDay()] + ", " +  months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " +  d.getUTCFullYear() + ", " + addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes()) + ":" + addZero(d.getUTCSeconds()) + " ZULU";
	
	var reportTable = $('#tctoTableExport').DataTable( {
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
		        		messageTop: document.getElementById("skin_sub_title").innerText + ' - TCTO',
		        		
		        		//PLACEHOLDER text is overwritten below
		        		title: 'PLACEHOLDER',
		                messageBottom: 'PLACEHOLDER',
		                
		                filename: 'CUI_TCTO_' + excelDate,
		                orientation: 'landscape',
		                text: 'Export to PDF',
		                exportOptions: {
				            columns: 'th:not(.noSort)',
				         },
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
	                        
	                        for (var i = 0; i < reportTable.column(4).data().length; i++) {
		                       //Looking for the location header row...
		       				   if (isNaN(reportTable.column(3).data()[i]) 
		       				       && reportTable.column(0).data()[i] == '&nbsp;') {
		            		   		for (var x = 0; x < 8; x++) {
		            		   			if (x == 0) {
		            		   				doc.content[2].table.body[i+1][0].fillColor = '#027FD1';
		            		   				doc.content[2].table.body[i+1][0].color = 'white';
		            		   				doc.content[2].table.body[i+1][0].colSpan = 10;
		            		   				doc.content[2].table.body[i+1][0].alignment = 'center';
		            		   				doc.content[2].table.body[i+1][0].text = reportTable.column(3).data()[i];
		            		   				doc.content[2].table.body[i+1][0].bold = 'true';
		            		   			}
		            		   			
		            		   		}
		            		   }
							        
					      	}   
				      	}
		        	},
	            {
	                extend: 'excelHtml5',
	                className: 'excelBtn',
	                title: "CONTROLLED UNCLASSIFIED INFORMATION",
	                //title: document.getElementById("skin_sub_title").innerText + ' - TCTO',
	                messageTop: document.getElementById("skin_sub_title").innerText + ' - TCTO',
	                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
	                filename: 'CUI_TCTO_export_' + excelDate,
	                text: 'Export to Excel',
	                //"CustomizeData" below allows for data to maintain formatting in export
		            customizeData: function(data) {
		          		//Looping over data in table body
				        for(var i = 0; i < data.body.length; i++) {
				          for(var j = 0; j < data.body[i].length; j++) {
				            data.body[i][j] = '\u200C' + data.body[i][j].trim();
				          }
						}
					},
	                customize: function( xlsx ) {
                				var sheet = xlsx.xl.worksheets['sheet1.xml'];
                				//console.log(sheet);
                        		
                				//Loops through table on what would be column "C" in excel spreadsheet
                				$('row c[r^="C"]', sheet).each( function (index) {
									
									var rowNum = index + 3;
									
                    		   		var cellValue = $(this).text().replace('\u200C','');
                    		   		
                    		   		//If there is no value in cell, then we are at a header row
		           				    if (index > 0) {
		           				    	if ($('c[r=A'+ rowNum +']', sheet).text().replace('\u200C','') == '' &&
		           				    		$('c[r=B'+ rowNum +']', sheet).text().replace('\u200C','') == ''){
			            		   				$('c[r=A'+ rowNum +']', sheet).attr( 's', '7' );
			            		   				$('c[r=B'+ rowNum +']', sheet).attr( 's', '7' );
			            		   				$('c[r=C'+ rowNum +']', sheet).attr( 's', '7' );
			            		   				$('c[r=D'+ rowNum +']', sheet).attr( 's', '7' );
			            		   				$('c[r=E'+ rowNum +']', sheet).attr( 's', '7' );
			            		   				$('c[r=F'+ rowNum +']', sheet).attr( 's', '7' );
			            		   				$('c[r=G'+ rowNum +']', sheet).attr( 's', '7' );
				            		   			$('c[r=H'+ rowNum +']', sheet).attr( 's', '7' );
				            		   			$('c[r=I'+ rowNum +']', sheet).attr( 's', '7' );
				            		   			$('c[r=J'+ rowNum +']', sheet).attr( 's', '7' );
				            		   			$('c[r=K'+ rowNum +']', sheet).attr( 's', '7' );
		            		   			}
		            		   		  else {
		            		   		  	 $('c[r=J'+ rowNum +']', sheet).attr( 's', '55' );
		            		   		  	 $('c[r=K'+ rowNum +']', sheet).attr( 's', '55' );
		            		   		  }
		                		   }
		                		   
		                		  
		                        		  
                        		})
                        	}
	            }		            
	            
	        ]
	} ); 	
		    
	//De-tatching buttons from table and appending them to a div, so that buttons can be moved on page   	
	reportTable.buttons().container().appendTo('#exportButtons');
});
		
</script>
<!--- script add - End  --->

    <cfset prevConfig = "">	
	
	<div class="backlogMenu">
		<cfoutput>
                
	        <form name="maintenance_menu_form" method="post" action="#application.rootPath#/#lcase(trim(application.sessionManager.getProgramSetting()))#/maintenance/index.cfm">
	            <table class="menuItems">
	            	<tr>
	            		<td class="searchItem">
	            		     <div >
	            		         <input type="text" style="width:250px" name="searchCriteria" id="searchCriteria" <cfif Structkeyexists(form,"searchCriteria")>value="#EncodeForHTML(trim(form.searchCriteria))#"</cfif>/>
                                 <input type="submit" name="searchBacklog" id="searchBacklog" class="search" value="" onclick="setAction('search.tcto',this);setMethod('forward',this);"/>
							 </div>	
	            		</td>
	            		<!--- JJP 06/22/17 Set session variable for current tab to redirect --->
	            		<cfset session.currentTab = "TCTO">
						<td class="selectionItems">
							<div class="backlogSubItems">
								 <ul class="#selectedBackLogSubmenu#">
								 <li><a id="backlogLink" href="backlog.cfm">WORKLOAD</a></li>
                                    <li><a id="pmiLink" href="pmi.cfm">PMI</a></li>
                                    <li><a id="tctoLink" href="tcto.cfm">TCTO</a></li>
                                    <li><a id="partsOrderedLink" href="partOrdered.cfm">PARTS ORDERED</a></li>
								 </ul>
							 </div> 
						</td>
						<td class="export">
							<div class="exportOptions">
								<ul >
		                            <li class="noLabel" id="printLink"><a href="index.cfm?action=export.tcto&exportType=print" target="_blank"></a></li>
		                            <!---<li id="pdfLink"><a href="index.cfm?action=export.tcto&exportType=pdf">Export to PDF </a></li>--->
		                            <li id="exportButtons"></li>
		                            <!---<li id="excelLink"><a href="index.cfm?action=export.tcto&exportType=excel">Export to Excel</a></li>--->
		                        </ul>
							</div>
						</td>
						
	            	</tr>
					
					
	            </table>
	            	
	        </form> 

        </cfoutput>
	</div>
	
	<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
    <!---<cfdump var="#REQUEST#"/>--->


<!--- Added Code to test - Kevin Added --->

<form id="maintStatusForm">
    <div class="headerContent">
    	<div class="headerTitle">TCTO</div>
    </div>
	
	<cfif isDefined("rc.qSearch")>
		
		<cfquery dbtype="query" name="QoQSearch">
			select *
			from rc.search 
			<cfif session.maintStatus EQ "O">
				where stop_job is null
			</cfif>
			<cfif session.maintStatus EQ "C">
				where stop_job is not null
			</cfif>
		</cfquery>	

		<div class="mainContent">  
			<form id="searchBacklogResults" name="searchBacklogResults" method="post" action="index.cfm">
			   <table class="globalTable sticky-headers" id="backlogTable">
			         <thead>
			         	<tr>
						    <th colspan="15" class="filter">
						      <cfif QoQSearch.recordcount gt 1> <div style="float:left">Record Count: <cfoutput>#QoQSearch.recordcount#</cfoutput></div></cfif>
							  	<span class="headerMaintStatus">
									<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
									Maintenance Status: 
									<select id="maintStatus" name="maintStatus">
										<option value="">All</option>
										<option value="O" <cfif session.maintStatus eq "O">selected</cfif>>Open</option>
										<option value="C" <cfif session.maintStatus eq "C">selected</cfif>>Closed</option>
									</select>
									</cfif>
								</span> 
						    </th>
					    </tr>
			         	<tr>
			         		<!---<th bgcolor="#027FD1">Config</th>--->
			         		<th class="noSort" bgcolor="#5A5A5A">&nbsp;</th>
							<th bgcolor="#5A5A5A" width="4%">Base</th>
							<th bgcolor="#5A5A5A" width="6%">Pod Serial No.</th>
							<th bgcolor="#5A5A5A" width="9%">Job No.</th>
							<th bgcolor="#5A5A5A" width="6%">SRA Noun</th>
							<th bgcolor="#5A5A5A" width="6%">SRA Part No.</th>
							<th bgcolor="#5A5A5A" width="5%">SRA Serial No.</th>
							<th bgcolor="#5A5A5A" width="6%" >Date In</th>
							<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
								<th bgcolor="#5A5A5A" width="6%">Date Out</th>
							</cfif>
							<th bgcolor="#5A5A5A" width="5%">Status</th>
							<th bgcolor="#5A5A5A" width="5%">CPOT In</th>
							<th bgcolor="#5A5A5A">Remarks</th>
							<th class="noSort " bgcolor="#5A5A5A">&nbsp;</th>
			         	</tr>
						
			         </thead>
				   <tbody> 	 
				   
			<cfif QoQSearch.recordcount GT 0>
			   <!--- 05/10/17 JJP Added group by config functionality 
			   <cfoutput query="QoQSearch" group="config"> 
			   	--->
			   	 <cfset prevConfig="">
			     <cfoutput query="QoQSearch" > 
			   	
			   	
			   		<cfif prevConfig NEQ #QoQSearch.config#>
			   		<tr>
			   			<td bgcolor="##027FD1" style="text-align:center;font-weight:bold;color:white" colspan="15">#EncodeForHTML(config)#</td>	
					</tr>
					</cfif>

					<!---
				   	<cfloop query="QoQSearch">				
				    --->
				    
				        <tr class="<cfif currentRow mod 2> odd <cfelse> even </cfif>">
                            <td class="edit editIcon"><a href="index.cfm?action=edit.maintenance&eventJob=#EncodeForURL(ENCRYPTED_EVENTID)#"></a></td>
                            <td><p title="Base: #EncodeForHTML(trim(site))# Unit: #EncodeForHTML(trim(unit))#">#EncodeForHTML(trim(site))#</p></td>
							<td>#EncodeForHTML(trim(POD_SERNO))#</td>
                            <td class="link">
                            	<!---<cfif #EncodeForHTML(trim(rc.qSearch.getRepairSeq()))# NEQ 0><a href="index.cfm?action=edit.maintenance.detail&eventRepair=#rc.qSearch.getEncryptedRepairId()#"></cfif>#EncodeForHTML(trim(rc.qSearch.getJobNo()))#<cfif #EncodeForHTML(trim(rc.qSearch.getRepairSeq()))# NEQ 0></a></cfif>--->
									<table style="border:0px">
	                            		<tr>
	                            			<td width="97%" style="border:0px">
	                            				<cfif #EncodeForHTML(trim(REPAIR_SEQ))# NEQ 0>
													<a href="index.cfm?action=edit.maintenance.detail&eventRepair=#EncodeForURL(ENCRYPTED_REPAIRID)#">
				                            	</cfif>
				                            		#EncodeForHTML(trim(JOBNO))#
				                            	<cfif #EncodeForHTML(trim(REPAIR_SEQ))# NEQ 0></a></cfif>
				                            				
	                            			</td>
											<td width="3%" style="border:0px">
												<cfif dbUtils.hasAttachmentsByRepairId(REPAIRID)>
													<div class="attachIcon"></div>
												</cfif>
											</td>
	                            		</tr>
	                            	</table>
                            
                            </td>
                            <td>#EncodeForHTML(trim(SRA_NOUN))#</td>
							<td>#EncodeForHTML(trim(SRA_PARTNO))#</td>
							<td>#EncodeForHTML(trim(SRA_SERNO))#</td>
							<td>#DateFormat(trim(INSDATE),"dd-mmm-yyyy")#</td>
							<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
								<td>#DateFormat(trim(stop_job),"dd-mmm-yyyy")#</td>
							</cfif>
							<td>#EncodeForHTML(trim(STATUS))#</td>
							<td>#EncodeForHTML(trim(METER_IN))#</td>
                            <td><div class="excerpt">#EncodeForHTML(trim(narrative))#</div></td>
							<td class="delete deleteIcon "><a href="index.cfm?action=delete.maintenance&eventJob=#EncodeForURL(ENCRYPTED_EVENTID)#&page=tcto"></a></td>
                        </tr>
                        <cfset prevConfig = #QoQSearch.config#>	  
                        <!---
						<cfset prevConfig = #EncodeForHTML(trim(CONFIG))#>	 
				   </cfloop>  
				   --->
			   </cfoutput>
			<cfelse>
				<tr>
					<td colspan="15">
						<div class="global_notice_msg">No Data Found</div>		
					</td>
				</tr>
                   
			</cfif>
				   </tbody>
		   	   </table>
			   </form>
		</div>	
	</cfif>
</form>	

<!---EXPORT TO EXCEL SECTION --->
		
<!---Section below is hidden on page --->
<div style="display:none">
	<cfset prevConfig = "">
	<!---Table below is what is exported to excel --->
	<table id="tctoTableExport">
	     <thead>
	     	<tr>
				<th width="4%">Base</th>
				<th width="6%">Pod Serial No.</th>
				<th width="9%">Job No.</th>
				<th width="6%">SRA Noun</th>
				<th width="6%">SRA Part No.</th>
				<th width="5%">SRA Serial No.</th>
				<th width="6%" >Date In</th>
				<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
					<th width="6%">Date Out</th>
				</cfif>
				<th width="5%">Status</th>
				<th width="5%">CPOT In</th>
				<th>Remarks</th>
	     	</tr>
	   </thead>
	   <tbody> 	 		
	   		<cfset prevConfig="">
	   		<cfoutput query="QoQSearch" > 
	   		<cfif prevConfig NEQ #QoQSearch.config#>
	   			<tr>
	   				<td style="display:none">&nbsp;</td>
	   				<td style="display:none">&nbsp;</td>
					<td style="display:none">&nbsp;</td>
					<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
						<td colspan="11">#EncodeForHTML(config)#</td>
					<cfelse>
						<td colspan="10">#EncodeForHTML(config)#</td>
					</cfif>
					<td style="display:none">&nbsp;</td>
					<td style="display:none">&nbsp;</td>
					<td style="display:none">&nbsp;</td>
					<td style="display:none">&nbsp;</td>
					<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
						<td style="display:none">&nbsp;</td>
					</cfif>
					<td style="display:none">&nbsp;</td>
					<td style="display:none">&nbsp;</td>	
	   			</tr>
	   		</cfif>
	        <tr>
	            <td>#EncodeForHTML(trim(site))#</td>
				<td>#EncodeForHTML(trim(POD_SERNO))#</td>
	            <td>#EncodeForHTML(trim(JOBNO))#</td>
	            <td>#EncodeForHTML(trim(SRA_NOUN))#</td>
				<td>#EncodeForHTML(trim(SRA_PARTNO))#</td>
				<td>#EncodeForHTML(trim(SRA_SERNO))#</td>
				<td>#DateFormat(trim(INSDATE),"dd-mmm-yyyy")#</td>
				<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
					<td>#DateFormat(trim(stop_job),"dd-mmm-yyyy")#</td>
				</cfif>
				<td>#EncodeForHTML(trim(STATUS))#</td>
				<td>#EncodeForHTML(trim(METER_IN))#</td>
	            <td>#EncodeForHTML(trim(narrative))#</td>
	        </tr>
			<cfset prevConfig = #QoQSearch.config#>	  
		</cfoutput>
	   </tbody>
	</table>
</div>
	
	
</RIMSS:layout>
