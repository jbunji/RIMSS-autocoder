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
			<cfif isDefined("rc.system")>
				<cfoutput>
				$(".#rc.system#Link").toggleClass("highlight");
				</cfoutput>
			</cfif>
			setupHighlight(); 
			
			var dt = $('#inventoryTable').dataTable({ 
				
			"bFilter": true,
			"sDom":'t'
				
			});
			
			
			$('#dtSearch').on('keyup',function(e){
				dt.fnFilter($(this).val());
			});
			

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
		                            <li id="pdfLink"><a href="#application.rootPath#/#lcase(trim(application.sessionManager.getProgramSetting()))#/inventory/index.cfm?action=export.inventory&exportType=pdf&system=#rc.system#">Export to PDF </a></li>
		                            <li id="excelLink"><a href="#application.rootPath#/#lcase(trim(application.sessionManager.getProgramSetting()))#/inventory/index.cfm?action=export.inventory&exportType=excel&system=#rc.system#">Export to Excel</a></li>
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

			<input type="hidden" id="system" value="#rc.system#">
			<div class="mainContent">
               <table class="globalTable font10" id="inventoryTable">
                     <thead>                
					   <tr>
                            <th colspan="12" class="filter font9" style="background: black">
                                <cfif rc.qAssets.recordcount gt 1> <div style="float:left; l">Asset Count: <cfoutput>#rc.qAssets.recordcount#</cfoutput></div></cfif>                                  
                            </th>
                        </tr>
                        <tr>
                            <th class="noSort">&nbsp;</th>
							<th>Serno</th>
							<cfif #rc.system# EQ "POD">
								<th>Cumulative Hrs</th>
								<th>Bench Hrs</th>
								<th>Operational Hrs</th>
							</cfif>
                            <th>Status</th>
                            <th>Current Loc</th>
                            <th>Assign Loc</th>
							<cfif #rc.system# EQ "POD">
								<th>ETM</th>
							</cfif>
                            
                            <th>Is In Transit</th>
							<th>Tracking Number</th>
							<th>Remarks</th>
                        </tr>
                     </thead>
                   <tbody>      
                   <cfoutput query="rc.qAssets">
							 
                        <tr class="<cfif currentRow mod 2> odd <cfelse> even </cfif>">
                            <td class="edit editIcon"><a href="index.cfm?action=edit.inventory&assetId=#encodeForURL(ENCRYPTED_ASSET_ID)#&system=#encodeForURL(rc.system)#"></a></td>
                            <td style="width:50px">#encodeForHTML(trim(SERNO))#</td>
							<cfif #rc.system# EQ "POD">
								<td style="width:50px">#encodeForHTML(delta)#</td>
								<td style="width:50px">#encodeForHTML(bench)#</td>
								<td style="width:50px">#encodeForHTML(flight)#</td>	
							</cfif>					
                            <td style="width:50px">#encodeForHTML(trim(STATUS))#</td>
                            <td style="width:200px">#encodeForHTML(trim(CURR))#</td>
                            <td style="width:200px">#encodeForHTML(trim(ASSIGN))#</td>
							<cfif #rc.system# EQ "POD">
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
							<td>#encodeForHTML(trim(REMARKS))#</td>            
                        </tr>   
                   </cfoutput>
                   </tbody>
               </table>			   
		  </div>
</RIMSS:layout>	