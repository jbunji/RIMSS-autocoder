<cfimport taglib="../layout" prefix="RIMSS"/>

<!--- cfscript add - Kevin added 7 nov --->
<cfscript>
	import cfc.dao.DBUtils;
	import cfc.utils.QueryIterator;
	
	import cfc.facade.SessionFacade;
	import cfc.utils.utilities;
	
	import default.controller.maintenanceController;
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
		$(function(){
				$(".admin").click(function(event){
					if (confirm("Are you sure you want to remove this record?")==true){
						return true;
					}else{
						event.preventDefault();
					}
				});
		  })	
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
	            		         <input type="text" style="width:250px" name="searchCriteria" id="searchCriteria" <cfif Structkeyexists(form,"searchCriteria")>value="#encodeForHTML(trim(form.searchCriteria))#"</cfif>/>
                                 <input type="submit" name="searchBacklog" id="searchBacklog" class="search" value="" onclick="setAction('search.tcto',this);setMethod('forward',this);"/>
							 </div>	
	            		</td>
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
		                            <li id="pdfLink"><a href="index.cfm?action=export.tcto&exportType=pdf">Export to PDF </a></li>
		                            <li id="excelLink"><a href="index.cfm?action=export.tcto&exportType=excel">Export to Excel</a></li>
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
			   <table class="globalTable" id="backlogTable">
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
							<th bgcolor="#5A5A5A" width="4%">Unit</th>
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
							<th bgcolor="#5A5A5A" width="5%">ETM In</th>
							<th bgcolor="#5A5A5A">Remarks</th>
							<th class="noSort admin" bgcolor="#5A5A5A">&nbsp;</th>
			         	</tr>
						
			         </thead>
				   <tbody> 	 
				   
			<cfif QoQSearch.recordcount GT 0>
				   <cfoutput query="QoQSearch"> 
				        <tr class="<cfif currentRow mod 2> odd <cfelse> even </cfif>">
                            <td class="edit editIcon"><a href="index.cfm?action=edit.maintenance&eventJob=#encodeForURL(ENCRYPTED_EVENTID)#"></a></td>
                            <td>#encodeForHTML(trim(UNIT))#</td>
							<td>#encodeForHTML(trim(POD_SERNO))#</td>
                            <td class="link">
                            	<!---<cfif #encodeForHTML(trim(rc.qSearch.getRepairSeq()))# NEQ 0><a href="index.cfm?action=edit.maintenance.detail&eventRepair=#rc.qSearch.getEncryptedRepairId()#"></cfif>#encodeForHTML(trim(rc.qSearch.getJobNo()))#<cfif #encodeForHTML(trim(rc.qSearch.getRepairSeq()))# NEQ 0></a></cfif>--->
									<table style="border:0px">
	                            		<tr>
	                            			<td width="97%" style="border:0px">
	                            				<cfif #encodeForHTML(trim(REPAIR_SEQ))# NEQ 0>
													<a href="index.cfm?action=edit.maintenance.detail&eventRepair=#encodeForURL(ENCRYPTED_REPAIRID)#">
				                            	</cfif>
				                            		#encodeForHTML(trim(JOBNO))#
				                            	<cfif #encodeForHTML(trim(REPAIR_SEQ))# NEQ 0></a></cfif>
				                            				
	                            			</td>
											<td width="3%" style="border:0px">
												<cfif dbUtils.hasAttachmentsByRepairId(REPAIRID)>
													<div class="attachIcon"></div>
												</cfif>
											</td>
	                            		</tr>
	                            	</table>
                            
                            </td>
                            <td>#encodeForHTML(trim(SRA_NOUN))#</td>
							<td>#encodeForHTML(trim(SRA_PARTNO))#</td>
							<td>#encodeForHTML(trim(SRA_SERNO))#</td>
							<td>#DateFormat(encodeForHTML(trim(INSDATE)),"dd-mmm-yyyy")#</td>
							<cfif Structkeyexists(form,"searchCriteria") and form.searchCriteria NEQ "">
								<td>#DateFormat(encodeForHTML(trim(stop_job)),"dd-mmm-yyyy")#</td>
							</cfif>
							<td>#encodeForHTML(trim(STATUS))#</td>
							<td>#encodeForHTML(trim(METER_IN))#</td>
                            <td>#encodeForHTML(trim(narrative))#</td>
							<td class="delete deleteIcon admin"><a href="index.cfm?action=delete.maintenance&eventJob=#encodeForURL(ENCRYPTED_EVENTID)#&page=tcto"></a></td>
                        </tr>
						<cfset prevConfig = #encodeForHTML(trim(CONFIG))#>	   
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
	<!--- End of added code to test --->
	
	
</RIMSS:layout>
