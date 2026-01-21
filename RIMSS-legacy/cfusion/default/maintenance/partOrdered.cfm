<cfimport taglib="../layout" prefix="RIMSS"/>

<!--- cfscript add - Kevin added 7 nov --->
<cfscript>
	import cfc.dao.DBUtils;
	import cfc.utils.QueryIterator;
	
	import cfc.facade.SessionFacade;
	import cfc.utils.utilities;
	
	import default.controller.maintenanceController;
	
</cfscript>

<!--- cfscript add - end  --->

<cfsetting showdebugoutput="false" >
<RIMSS:layout section="maintenance" subSection="#application.sessionManager.getSubSection()#">
	
	<script src="<cfoutput>#application.rootpath#</cfoutput>/default/layout/js/maintenance.js"></script>
	
	<RIMSS:subLayout/>
	<cfparam name="selectedBackLogSubmenu" default="partOrdered"/>
	
	<!--- ONLY RIMSS MGR AND DEPOT USER CAN EDIT --->
	<cfset canEdit = false />
	<cfif application.sessionManager.getUserModel().isMemberOfGroup("PCS_SU") or application.sessionManager.getMaintLevelSetting() EQ "DEPOT">
		<cfset canEdit = true />
	</cfif>

	
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
		   
	   .theadth {
    		border:1px solid black;
    		padding:2px;
			color:white;
			white-space:nowrap;
	
		}	  
	   
	   .hand {
		cursor:pointer;
		}
		
	</style>
<!--- cfsilent add - Kevin Added on 06 November 2013 --->		
<cfif not isDefined("rc.qSearch")>
	
	<script>		
		<cflocation url="index.cfm?action=search.partOrdered">
	</script>	

</cfif>
<!--- cfsilent add - end --->

<!--- script add - Kevin Added on 05 November 2013 --->	
	<script>
		
				

            $(document).ready(function(){
                //setupEditHighlight();
                setupHighlight();

               modifyDTColumns();	  
			   
            });          
	
	    
	 
	 $(function(){
	 	 $(".clck").click(function(){		
					var orderIdval = $(this).parent().parent().attr('id');
					
					var today = new Date();
					var day = ("0" + today.getDate()).slice(-2);
					var month = new Date(today).format("mmm");
					var year = today.getFullYear();
					
					if (day.length == 1) {
						day = '0' + day;
					}
					var now = day + '-' + month + '-' + year;
					
					var s = getRootPath().toUpperCase();
					var program = $("#prog").val();
					var url = s + "/"+program+"/controller/maintenanceController.cfc";

					$.post(
              			url,
              			{
               				method:"partOrderedAcknowledged",
			   				orderId: orderIdval
              			}, function(){
									alert('The acknowledgement for the part order has been accepted');
			  	 					$('#ack_'+orderIdval).addClass('menubuttons right');
									$('#div_'+orderIdval).html(''+now);
							});
				});	 
		 
	 })
	  
			
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
                                 <input type="submit" name="searchPartOrdered" id="searchPartOrdered" class="search" value="" onclick="setAction('search.partOrdered',this);setMethod('forward',this);"/>
							 </div>	
	            		</td>
						<td class="selectionItems">
							<div class="backlogSubItems">
								 <ul class="#selectedBacklogSubmenu#">
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
		                            <li class="noLabel" id="printLink"><a href="index.cfm?action=export.partOrdered&exportType=print" target="_blank"></a></li>
		                            <li id="pdfLink"><a href="index.cfm?action=export.partOrdered&exportType=pdf">Export to PDF </a></li>
		                            <li id="excelLink"><a href="index.cfm?action=export.partOrdered&exportType=excel">Export to Excel</a></li>
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
    <div class="headerContent">
    	<div class="headerTitle">Parts Ordered</div>
    </div>
	
	<cfif isDefined("rc.qSearch")>
		<div class="mainContent">  
			<cfif rc.qSearch.count()>
			<form id="searchPartsOrderedResults" name="searchPartOrderedResults" method="post" action="index.cfm">
			   
			   <table class="globalTable" id="partOrderedTable">
			   		<tr bgcolor="#CCCCCC">
			   			<td align="center" colspan="5"><b>REQUESTS</b></td>
			   			<td align="center" colspan="2" style="border-left-width:3px;"><b>ACKNOWLEDGE</b></td>
			   			<td align="center" colspan="5" style="border-left-width:3px;"><b>FILL ACTIONS</b></td>
			   		</tr>
			         	<tr>
							<td class="theadth" bgcolor="#5A5A5A" width="7%">BASE</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">PART NOUN REQUESTED</td>
							<td class="theadth" bgcolor="#5A5A5A" width="8%">PART NUMBER</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">SERNO</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A" width="3%" style="border-left-width:3px;">&nbsp;</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%" >DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A" width="5%" style="border-left-width:3px;">PART NOUN ISSUED</td>
							<td class="theadth" bgcolor="#5A5A5A" width="5%">PART NUMBER</td>
							<td class="theadth" bgcolor="#5A5A5A">SERNO</td>
							<td class="theadth" bgcolor="#5A5A5A">DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A">TRACKING No</td>
			         	</tr>
				   <tbody> 	     	
			       <cfoutput>
				   <cfloop condition="#rc.qSearch.next()#"> 
				        <tr class="<cfif rc.qSearch.getCursor() mod 2> odd <cfelse> even </cfif>" id="#encodeForHTML(trim(rc.qSearch.getOrderId()))#">
                            <td title="#encodeForHTML(trim(rc.qSearch.getUnit()))#">#encodeForHTML(trim(rc.qSearch.getBase()))#</td>
							<td>#encodeForHTML(trim(rc.qSearch.getRemNoun()))#</td>
                            <td>#encodeForHTML(trim(rc.qSearch.getRemPartNo()))#</td>
							<td>
								<a href="index.cfm?action=edit.maintenance.detail&eventRepair=#rc.qSearch.getRepairId()#">#encodeForHTML(trim(rc.qSearch.getRemSerNo()))#</a>
							</td>
							<td style="text-align:center">	
									#TimeFormat(encodeForHTML(trim(rc.qSearch.getInsDate())),"HH:mm")#<br />
									#DateFormat(encodeForHTML(trim(rc.qSearch.getInsDate())),"dd-mmm-yyyy")#
							</td>
							<td style="border-left-width:3px;">
								<input type="button" name="ack_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="ACK" id="ack_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" <cfif rc.qSearch.getAcknowledgeDate() NEQ ''>disabled class="menubuttons right clck"<cfelse>class="menubuttons left clck"</cfif> <cfif !canEdit>disabled</cfif> />
							</td>
							<td style="text-align:center">
								<div id="div_#encodeForHTML(trim(rc.qSearch.getOrderId()))#">
									#TimeFormat(encodeForHTML(trim(rc.qSearch.getAcknowledgeDate())),"HH:mm")# <br />
									#DateFormat(encodeForHTML(trim(rc.qSearch.getAcknowledgeDate())),"dd-mmm-yyyy")#
								</div>
							</td>
							<td style="border-left-width:3px;">
								<cfif canEdit>
									<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupPartOrderSRANounsDialog.cfm" class="luPartOrderSRA" id="lookup_part_order_sra_noun" title="Noun">
										<input type="text" style="border: none; background-color: transparent;" name="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getRepNoun()))#">
									</a>
								<cfelse>
									<input type="text" style="border: none; background-color: transparent;" name="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getRepNoun()))#" readonly=readonly>
								</cfif>
							</td>
							<td>
								<input class="form_field font10" id="insSraPartno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" type="text" style="border: none; background-color: transparent;" name="insSraPartno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#rc.qSearch.getRepPartNo()#" readonly="readonly" />
							</td>
                            <td class="install">
                            	<cfif canEdit>
                            	<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRAAssetByPartOrderNounDialog.cfm" class="luSernoPartOrder" id="lookup_sra_part_order_asset_ref" title="SERNO">
                            		<input type="text" class="sraSernoChg" style="border: none; background-color: transparent;" name="insSraSerno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="insSraSerno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getRepSerNo()))#">
								</a>
								<cfelse>
									<input type="text" class="sraSernoChg" style="border: none; background-color: transparent;" value="#encodeForHTML(trim(rc.qSearch.getRepSerNo()))#" readonly=readonly>
								</cfif>
							</td>
							<td style="text-align:center">
								#TimeFormat(encodeForHTML(trim(rc.qSearch.getFillDate())),"HH:mm")# <br />
								<input name="fillDate_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="fillDate_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" type="text" value="#DateFormat(encodeForHTML(trim(rc.qSearch.getFillDate())),"dd-mmm-yyyy")#" style="border: none; background-color: transparent;width:85px" readonly="readonly">
							</td>
							<td>
								<cfif encodeForHTML(trim(rc.qSearch.getTcn())) NEQ ''>
									<cfswitch expression="#rc.qSearch.getShipper()#">
										<cfcase value="FEDEX">
											<a href="http://www.fedex.com/Tracking?action=track&tracknumbers=#trim(rc.qSearch.getTcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getTcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="UPS">
											<a href="http://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=#trim(rc.qSearch.getTcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getTcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="DHL">
											<a href="http://webtrack.dhlglobalmail.com/?mobile=&trackingnumber=#trim(rc.qSearch.getTcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getTcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="GOV">
											#encodeForHTML(trim(rc.qSearch.getTcn()))#	
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfdefaultcase>
											&nbsp;
										</cfdefaultcase>
								 	</cfswitch>
								<cfelse>
									<cfif canEdit>
										<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/shippingDialog.cfm" class="shippingDialog"  id="ship" title="Shipping">
											<input type="text" style="border: none; background-color: transparent;" name="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getTcn()))#">
										</a>
									<cfelse>
										<input type="text" style="border: none; background-color: transparent;" name="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getTcn()))#" readonly=readonly>
									</cfif>
								</cfif>
							</td>
							<input type="hidden" name="insSraAssetId_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="insSraAssetId_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getRepAsset()))#">
							<input type="hidden" name="partno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="partno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getPodPartNo()))#">
							</tr>
						<cfset prevConfig = #encodeForHTML(trim(rc.qSearch.getConfig()))#>	   
				   </cfloop>
				   </cfoutput>
				   </tbody>
		   	   </table>
			   </form>
			<cfelse>
                <div class="global_notice_msg">No Data Found</div>   
			</cfif>
		</div>	
	</cfif>
	<!--- End of added code to test --->
</RIMSS:layout>
