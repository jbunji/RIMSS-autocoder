<cfimport taglib="../layout" prefix="RIMSS"/>

<!--- cfscript add - Kevin added 7 nov --->
<cfscript>
	import cfc.dao.DBUtils;
	import cfc.utils.QueryIterator;
	
	import cfc.facade.SessionFacade;
	import cfc.utils.utilities;
	
	import criis.controller.maintenanceController;
	
</cfscript>

<!--- cfscript add - end  --->

<cfsetting showdebugoutput="false" >
<RIMSS:layout section="maintenance" subSection="#application.sessionManager.getSubSection()#">
	
	<script src="<cfoutput>#application.rootpath#</cfoutput>/criis/layout/js/maintenance.js"></script>
	
	<RIMSS:subLayout/>
	<cfparam name="selectedBackLogSubmenu" default="partOrdered"/>
	
	<!--- ONLY RIMSS MGR AND DEPOT USER CAN EDIT --->
	<cfset canEdit = false />
	<cfset isDepot = false />
	<cfif application.sessionManager.getUserModel().isMemberOfGroup("PCS_SU") or application.sessionManager.getMaintLevelSetting() EQ "DEPOT">
		<cfset canEdit = true />
	</cfif>
	<cfif application.sessionManager.getMaintLevelSetting() EQ "DEPOT">
		<cfset isDepot = true />
	</cfif>
	<cfset dbUtils = application.objectFactory.create("DbUtils") />
	
	<style type="text/css">
		.pqdr{
			font-weight:bold;
			font-size:11px;
			color: red;
			padding-left: 10px;
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
		   
	   .theadth {
    		border:1px solid black;
    		padding:2px;
			color:white;
			white-space:nowrap;
	
		}	  
	   
	   .hand {
		cursor:pointer;
		}
		
		.globalTable thead tr td{
			border: 1px solid black;
		}
		
/*		.mainContent{
			
			max-height: 90vh;
		}*/
		
		
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
	 	
	 	$(".validate").click(function(e){
	 		var id = $(this).closest("tr").attr("id");
	 		var ack = $("#ack_"+id);
	 		var msg = $(".message");
	 		
	 		if(ack.data("date") == ""){
			    e.preventDefault();
	 			msg.addClass("global_notice_msg").html("Acknowledgment is required.");	 
	 		}
	 	});
	 	
	 	 $(".clck").click(function(){		
					var orderIdval = $(this).parent().parent().attr('id');
					var remAssetIdval = $('#remAssetId_'+$(this).parent().parent().attr("id")).val();
					//alert(remAssetId);
					var today = new Date();
					var time = today.getHours()+':'+today.getMinutes();
					var day = ("0" + today.getDate()).slice(-2);
					var month = new Date(today).format("mmm");
					var year = today.getFullYear();
					
					if (day.length == 1) {
						day = '0' + day;
					}
					var now = time + ' <br/> ' + day + '-' + month + '-' + year;
					
					var s = getRootPath().toUpperCase();
					var program = $("#prog").val();
					var url = s + "/"+program+"/controller/maintenanceController.cfc";

					$.post(
              			url,
              			{
               				method:"partOrderedAcknowledged",
			   				orderId: orderIdval,
			   				remAssetId: remAssetIdval
              			}, function(){
									alert('The acknowledgement for the part order has been accepted');
			  	 					$('#ack_'+orderIdval).addClass('menubuttons right');
									$('#div_'+orderIdval).html(''+now);
									
	 								$(".message").addClass("global_info_msg").html("Reloading page...");	
									location.reload();
									
									
							});
				});	 
				
				$(".shipRecv").click(function (e){		
					
					// Validate
	 				var id = $(this).closest("tr").attr("id");
	 				var tcn = $("#tcn_"+id);
	 				var msg = $(".message");
	 				if(tcn.val() == ""){
			 			msg.addClass("global_notice_msg").html("Tracking No is required.");	
			 			e.preventDefault();
			 			return false;
			 		}
	 		
	 		
	 		
					function addZero(i) {
					    if (i < 10) {
					        i = "0" + i;
					    }
					    return i;
					}						
					
					var orderIdval = $(this).parent().parent().attr('id');
					
					var today = new Date();
					var minutes = addZero(today.getMinutes());				
					var time = today.getHours()+':'+minutes;
					var day = ("0" + today.getDate()).slice(-2);
					var month = new Date(today).format("mmm");
					var year = today.getFullYear();
					
					if (day.length == 1) {
						day = '0' + day;
					}
					var now = time + ' <br/> ' + day + '-' + month + '-' + year;
					
					var s = getRootPath().toUpperCase();
					var program = $("#prog").val();
					var url = s + "/"+program+"/controller/maintenanceController.cfc";

					$.post(
              			url,
              			{
               				method:"shipRecvAcknowledged",
			   				orderId: orderIdval
              			}, function(){
									alert('The acknowledgement for the shipment received has been accepted');
			  	 					$('#shipRecv_'+orderIdval).addClass('menubuttons right');
									$('#shipRecvDiv_'+orderIdval).html(''+now);
							});
				}	 );
				
				 
		 
	 })
	  
			
   </script>
   <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/jquery.timePicker.min.js"></script>	
<!---jQuery below is responsible for Export to Excel function along with hidden table at bottom of page --->   
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
	
	var reportTimeStamp = "Report Prepared on: " +  days[d.getUTCDay()] + ", " +  months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " +  d.getUTCFullYear() + ", " + addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes()) + ":" + addZero(d.getUTCSeconds()) + " ZULU";

	//Setting date string for excel filename
	var excelDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);	
	
	var exportTable = $('#partOrderedTableExport').DataTable( {
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
		                
		                filename: 'CUI_PARTS_ORDERED_' + excelDate,
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
				      	}
		        	},	        
	            {
	                extend: 'excelHtml5',
	                className: 'excelBtn',
	                title: "CONTROLLED UNCLASSIFIED INFORMATION",
	                messageTop: reportTimeStamp,
	                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
		            filename: 'CUI_Parts_Ordered_' + excelDate,
	                text: 'Export to Excel'
	            }		            
	            
	        ]
	} ); 	
		    
	//De-tatching buttons from table and appending them to a div, so that buttons can be moved on page   	
	exportTable.buttons().container().appendTo('#exportButtons');
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
	            		         <input type="text" style="width:250px" name="searchCriteria" id="searchCriteria" <cfif Structkeyexists(form,"searchCriteria")>value="#encodeForHTML(trim(form.searchCriteria))#"</cfif>/>
                                 <input type="submit" name="searchPartOrdered" id="searchPartOrdered" class="search" value="" onclick="setAction('search.partOrdered',this);setMethod('forward',this);"/>
							 </div>	
	            		</td>
	            		<!--- JJP 06/22/17 Set session variable for current tab to redirect --->
	            		<cfset session.currentTab = "PO">
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
		                            <!---<li id="pdfLink"><a href="index.cfm?action=export.partOrdered&exportType=pdf">Export to PDF </a></li>--->
		                            <li id="exportButtons"></li>
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
			   
			   <table class="globalTable sticky-headers" id="partOrderedTable">
			   		<thead>
				   		<tr bgcolor="#CCCCCC">
				   			<td align="center" colspan="7"><b>REQUESTS</b></td>
				   			<td align="center" colspan="2" style="border-left-width:3px;"><b>ACKNOWLEDGE</b></td>
				   			<td align="center" colspan="5" style="border-left-width:3px;"><b>FILL ACTIONS</b></td>
				   			<td align="center" colspan="2" style="border-left-width:3px;"><b>PART DELIVERED</b></td>
				   		</tr>
			         	<tr>
							<td class="theadth" bgcolor="#5A5A5A" width="7%">BASE</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">PART NOUN REQUESTED</td>
							<td class="theadth" bgcolor="#5A5A5A" width="8%">PART NUMBER</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">SERNO</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">TRACKING No</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%">SHIP DATE</td>
							<td class="theadth" bgcolor="#5A5A5A" width="3%" style="border-left-width:3px;">&nbsp;</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%" >DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A" width="5%" style="border-left-width:3px;">PART NOUN ISSUED</td>
							<td class="theadth" bgcolor="#5A5A5A" width="5%">PART NUMBER</td>
							<td class="theadth" bgcolor="#5A5A5A">SERNO</td>
							<td class="theadth" bgcolor="#5A5A5A">DATE/TIME</td>
							<td class="theadth" bgcolor="#5A5A5A">TRACKING No</td>
							<td class="theadth" bgcolor="#5A5A5A" width="3%" style="border-left-width:3px;">&nbsp;</td>
							<td class="theadth" bgcolor="#5A5A5A" width="6%" >DATE/TIME</td>
			         	</tr>
					</thead>
				   <tbody > 	   	
			       <cfoutput>
				   <cfloop condition="#rc.qSearch.next()#"> 
				        <tr class="<cfif rc.qSearch.getCursor() mod 2> odd <cfelse> even </cfif>" id="#encodeForHTML(trim(rc.qSearch.getOrderId()))#">
                            <td><p title="Base: #encodeForHTML(trim(rc.qSearch.getBase()))# Unit: #encodeForHTML(trim(rc.qSearch.getUnit()))#">#encodeForHTML(trim(rc.qSearch.getBase()))#</p></td>
							<td>#encodeForHTML(trim(rc.qSearch.getRemNoun()))#</td>
                            <td>#encodeForHTML(trim(rc.qSearch.getRemPartNo()))#</td>
							<td>
								<a href="index.cfm?action=edit.maintenance.detail&eventRepair=#rc.qSearch.getRepairId()#">#encodeForHTML(trim(rc.qSearch.getRemSerNo()))#</a>
								<cfif rc.qSearch.getIsPqdr() EQ "Y"><span class="pqdr">(PQDR)</span></cfif>
							</td>
							<td style="text-align:center">	
									#encodeForHTML(TimeFormat(trim(rc.qSearch.getInsDate()),"HH:mm"))#<br />
									#encodeForHTML(DateFormat(trim(rc.qSearch.getInsDate()),"dd-mmm-yyyy"))#
							</td>
							<td>
								<cfif encodeForHTML(trim(rc.qSearch.getREQ_Tcn())) NEQ ''>
									<cfswitch expression="#rc.qSearch.getREQ_Shipper()#">
										<cfcase value="FEDEX">
											<cfset trackingLink = dbUtils.getTrackingLinks('FEDEX')>
											<a href="#variables.trackingLink.Description##trim(rc.qSearch.getREQ_Tcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getREQ_Tcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getREQ_Shipper()))#)</span>
										</cfcase>
										<cfcase value="UPS">
											<cfset trackingLink = dbUtils.getTrackingLinks('UPS')>
											<a href="#variables.trackingLink.Description##trim(rc.qSearch.getREQ_Tcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getREQ_Tcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getREQ_Shipper()))#)</span>
										</cfcase>
										<cfcase value="DHL">
											<cfset trackingLink = dbUtils.getTrackingLinks('DHL')>
											<a href="#variables.trackingLink.Description##trim(rc.qSearch.getREQ_Tcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getREQ_Tcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getREQ_Shipper()))#)</span>
										</cfcase>
										<cfcase value="GOV">
											#encodeForHTML(trim(rc.qSearch.getREQ_Tcn()))#	
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getREQ_Shipper()))#)</span>
										</cfcase>
										<cfdefaultcase>
											&nbsp;
										</cfdefaultcase>
								 	</cfswitch>
								<cfelse>
									<!--- JJP 08/23/17 If no SerNo issued can't add TCN' --->
									<cfif canEdit AND encodeForHTML(trim(rc.qSearch.getRemSerNo())) NEQ '' AND encodeForHTML(rc.qSearch.getAcknowledgeDate()) EQ ''>
										<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/shippingDialog.cfm?action=R" class="shippingDialog"  id="req_ship" title="REQ Shipping">
											<input type="text" class="hand" style="border: none; background-color: transparent;" name="reqtcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="reqtcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getREQ_Tcn()))#">
										</a>
									<cfelse>
										<input type="text" class="hand" style="border: none; background-color: transparent;" name="reqtcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="reqtcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getREQ_Tcn()))#" readonly=readonly>
									</cfif>
								</cfif>
							</td>	
							<td style="text-align:center">	
									#encodeForHTML(DateFormat(trim(rc.qSearch.getREQ_SHIP_DATE()),"dd-mmm-yyyy"))#
							</td>													
							<td style="border-left-width:3px;">
								<input type="button" name="ack_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="ACK" id="ack_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" data-date="#encodeForHTML(rc.qSearch.getAcknowledgeDate())#" <cfif rc.qSearch.getAcknowledgeDate() NEQ ''>disabled class="menubuttons right clck"<cfelse>class="menubuttons left clck"</cfif> <cfif !canEdit>disabled</cfif> />
							</td>
							<td style="text-align:center">
								<div id="div_#encodeForHTML(trim(rc.qSearch.getOrderId()))#">
									#encodeForHTML(TimeFormat(trim(rc.qSearch.getAcknowledgeDate()),"HH:mm"))# <br />
									#encodeForHTML(DateFormat(trim(rc.qSearch.getAcknowledgeDate()),"dd-mmm-yyyy"))#
								</div>
							</td>							
							<td style="border-left-width:3px;">
								<cfif canEdit AND encodeForHTML(rc.qSearch.getAcknowledgeDate()) NEQ "">
									<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupPartOrderSRANounsDialog.cfm" class="luPartOrderSRA" id="lookup_part_order_sra_noun" title="Noun">
										<input type="text" class="hand" style="border: none; background-color: transparent;" name="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getRepNoun()))#">
									</a>
								<cfelse>
									<input type="text" class="hand validate" style="border: none; background-color: transparent;" name="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="insPartOrderSraNoun_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getRepNoun()))#" readonly=readonly>
								</cfif>
							</td>
							<td>
								<input class="form_field font10" id="insSraPartno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" type="text" style="border: none; background-color: transparent;" name="insSraPartno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#rc.qSearch.getRepPartNo()#" readonly="readonly" />
							</td>
                            <td class="install">
                            	<cfif canEdit>
                            	<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRAAssetByPartOrderNounDialog.cfm" class="luSernoPartOrder" id="lookup_sra_part_order_asset_ref" title="Serial Number">
                            		<input type="text" class="sraSernoChg hand" style="border: none; background-color: transparent;" name="insSraSerno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="insSraSerno_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getRepSerNo()))#">
								</a>
								<cfelse>
									<input type="text" class="sraSernoChg hand" style="border: none; background-color: transparent;" value="#encodeForHTML(trim(rc.qSearch.getRepSerNo()))#" readonly=readonly>
								</cfif>
							</td>
							<td style="text-align:center">
								#encodeForHTML(TimeFormat(trim(rc.qSearch.getFillDate()),"HH:mm"))# <br />
								<input name="fillDate_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="fillDate_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" type="text" value="#encodeForHTML(DateFormat(trim(rc.qSearch.getFillDate()),"dd-mmm-yyyy"))#" style="border: none; background-color: transparent;width:85px" readonly="readonly">
							</td>
							<td>
								<cfif encodeForHTML(trim(rc.qSearch.getTcn())) NEQ ''>
									<cfswitch expression="#rc.qSearch.getShipper()#">
										<cfcase value="FEDEX">
											<cfset trackingLink = dbUtils.getTrackingLinks('FEDEX')>
											<a href="#variables.trackingLink.Description##trim(rc.qSearch.getTcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getTcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="UPS">
											<cfset trackingLink = dbUtils.getTrackingLinks('UPS')>
											<a href="#variables.trackingLink.Description##trim(rc.qSearch.getTcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getTcn()))#</a>
											<span style="font-size:8px;padding-left:5px;">(#encodeForHTML(trim(rc.qSearch.getShipper()))#)</span>
										</cfcase>
										<cfcase value="DHL">
											<cfset trackingLink = dbUtils.getTrackingLinks('DHL')>
											<a href="#variables.trackingLink.Description##trim(rc.qSearch.getTcn())#" target="_blank">#encodeForHTML(trim(rc.qSearch.getTcn()))#</a>
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
									<!--- JJP 08/23/17 If no SerNo issued can't add TCN' --->
									<cfif canEdit AND encodeForHTML(trim(rc.qSearch.getRepSerNo())) NEQ ''>
										<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/shippingDialog.cfm?action=F" class="shippingDialog"  id="ship" title="Shipping">
											<input type="text" class="hand" style="border: none; background-color: transparent;" name="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getTcn()))#">
										</a>
									<cfelse>
										<input type="text" class="hand" style="border: none; background-color: transparent;" name="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="tcn_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getTcn()))#" readonly=readonly>
									</cfif>
								</cfif>
							</td>
							<td style="border-left-width:3px;">
								<input type="button" name="shipRecv_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="ACK" id="shipRecv_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" <cfif (application.sessionManager.getUserModel().isMemberOfGroup("PCS_SU") EQ 'NO') and (isDepot EQ true)>disabled</cfif> data-date="#encodeForHTML(rc.qSearch.getReplSruRecvDate())#" <cfif rc.qSearch.getReplSruRecvDate() NEQ ''>disabled class="menubuttons right shipRecv"<cfelse>class="menubuttons left shipRecv"</cfif>  />
							</td>
							<td style="text-align:center">
								<div id="shipRecvDiv_#encodeForHTML(trim(rc.qSearch.getOrderId()))#">
									#encodeForHTML(TimeFormat(trim(rc.qSearch.getReplSruRecvDate()),"HH:mm"))# <br />
									#encodeForHTML(DateFormat(trim(rc.qSearch.getReplSruRecvDate()),"dd-mmm-yyyy"))#
								</div>
							</td>
							<input type="hidden" name="remAssetId_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" id="remAssetId_#encodeForHTML(trim(rc.qSearch.getOrderId()))#" value="#encodeForHTML(trim(rc.qSearch.getREM_Asset()))#">
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
<!---EXPORT TO EXCEL SECTION --->
		
<!---Section below is hidden on page --->
<div style="display:none">
	<!---Table below is what is exported to excel --->
	 <table id="partOrderedTableExport">
	      <thead>
	         	<tr>
					<th width="4%">BASE</th>
					<th width="4%">PART NOUN REQUESTED</th>
					<th width="9%">PART NUMBER</th>
					<th width="9%">SERNO</th>
					<th width="6%">DATE/TIME</th>
					<th width="6%">TRACKING NO</th>
					<th width="6%">SHIP DATE</th>
					<th width="6%">DATE/TIME</th>
					<th width="5%">PART NOUN ISSUED</th>
					<th width="5%">PART NUMBER</th>
					<th width="5%">SERNO</th>
					<th width="5%">DATE/TIME</th>
					<th width="5%">TRACKING No</th>
					<th width="5%">DELIVERED DATE/TIME</th>
	         	</tr>	
	         </thead> 
		   <tbody> 	   
		   <cfoutput query="rc.search"> 
		        <tr>
                    <td>#encodeForHTML(rc.search.base)#&nbsp;#encodeForHTML(rc.search.unit)#</td>
                    <td>#encodeForHTML(rc.search.rem_noun)#</td>
                    <td>#encodeForHTML(rc.search.rem_partno)#</td>
                    <td>#encodeForHTML(rc.search.rem_serno)#</td>
                    <td>#encodeForHTML(TimeFormat(trim(rc.search.ins_date),"HH:mm"))#<br />
						#encodeForHTML(DateFormat(trim(rc.search.ins_date),"dd-mmm-yyyy"))#</td>
                    <td>#encodeForHTML(rc.Search.req_tcn)#
                    	<cfif len(trim(rc.search.req_shipper))>(#encodeForHTML(rc.search.req_shipper)#)</cfif>
                    </td>
                    <td>#encodeForHTML(rc.search.req_ship_date)#</td>
                    <td>#encodeForHTML(TimeFormat(trim(rc.search.acknowledge_date),"HH:mm"))# <br />
						#encodeForHTML(DateFormat(trim(rc.search.acknowledge_date),"dd-mmm-yyyy"))#</td>
                    <td>#encodeForHTML(rc.search.rep_noun)#</td>
                    <td>#encodeForHTML(rc.search.rep_partno)#</td>
                    <td>#encodeForHTML(rc.search.rep_serno)#</td>
                    <td>#encodeForHTML(TimeFormat(trim(rc.search.fill_date),"HH:mm"))# <br />
						#encodeForHTML(DateFormat(trim(rc.search.fill_date),"dd-mmm-yyyy"))#</td>
                    <td>#encodeForHTML(rc.search.tcn)#
                    	<cfif len(trim(rc.search.shipper))>(#encodeForHTML(rc.search.shipper)#)</cfif>
                    </td>
                    <td>#encodeForHTML(TimeFormat(trim(rc.search.REPL_SRU_RECV_DATE),"HH:mm"))# <br />
						#encodeForHTML(DateFormat(trim(rc.search.REPL_SRU_RECV_DATE),"dd-mmm-yyyy"))#</td>
                </tr>   
		   </cfoutput>
   		</tbody>
   </table>
</div>	
</RIMSS:layout>
