
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >

<cfset dbUtils = application.objectFactory.create("DBUtils") />
<cfset utils = new cfc.utils.utilities()/>
<RIMSS:layout section="configuration">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<script src = "../layout/js/configuration.js"></script>
	<!-- DataTables -->
	<!--- Using similar jQuery code from editConfiguration.cfm in configurationDepot.cfm (ACTS) -- WO4717 RIMSS v2.9.0 --->
	<!--- jQuery below is responsible for Export to Excel function in the List Configuration page --->   
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
	
	
	var sraTable = $('#sraTable').DataTable( {
		        dom: 'Brtp',
		        "paging": false,
		        //Options below control the size and scrolling options of tables
		    	"bAutoWidth": false,
				"bScrollCollapse": false,
		        "bSort" : true,
		        "aaSorting": [],
		        "columnDefs": [{
		        	"targets": 'noSort',
		        	"orderable": false
		        }],
		        buttons: [
		            {
		                extend: 'excelHtml5',
		                className: 'excelBtn',
		                title: document.getElementById("skin_sub_title").innerText + ' - NHA SERNO: ' + document.getElementById("serno").value,
		                //messageTop: 'NOUN: ' + document.getElementById("sranoun").value + ' | PARTNO: ' + document.getElementById("srapartno").value + ' | SERNO: ' + document.getElementById("sraserno").value,
		                messageTop: reportTimeStamp,
		                filename: 'config_export',
		                text: 'Export to Excel',
		                exportOptions: {
				            columns: 'th:not(.noSort)'
				         },
		                //"CustomizeData" below allows for data to maintain formatting in export
			            customizeData: function(data) {
			          		//Looping over data in table body
					        for(var i = 0; i < data.body.length; i++) {
					          for(var j = 0; j < data.body[i].length; j++) {
					            data.body[i][j] = '\u200C' + data.body[i][j].trim();
					          }
							}
						}
		            }		            
		            
		        ]
		} ); 	
		    
	//Detatching buttons from table and appending them to a div, so that buttons can be moved on page   	
	sraTable.buttons().container().appendTo('#exportButtons');
});
		
</script>
	<!--- Comment 2nd sraTable variable and modifyDTColumns as new code above is being used --->
    <script type="text/javascript">
        $(function() {
			setupRemoveSRA();
			//setup asset lookup dialog
			setupAssetLookupDialog();
			setupHighlight(); 
			//var dt = $('#sraTable').dataTable({});
			
			//Add .noSort and .date column defs
            //modifyDTColumns();
	
        });     
    </script>
	<cfoutput>
	   <div class="message #msgStatus#">#encodeForHTML(trim(msg))#</div>
	</cfoutput>

	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle">List Configuration</div>
    </div>

	<div class="font12 mainContent">
		<form id="createMaintenance" name="createMaintenance" method="post" action="index.cfm?action=list.configuration">
			<table class="two_column_table" cellpadding="0px" cellspacing="0px">
				<tbody>
					<tr>
							<td class="column">
								<div class="columnContent">
									
									<div class="formField">
				                        <label class="font10" id="asset_id_label">SERNO:</label> 
				                        <cfoutput>
										<input type="hidden" id="assetId" name="assetId" <cfif StructKeyExists(rc,'nhaassetId')>value="#encodeForHTML(trim(rc.nhaassetId))#"</cfif> />
				                        <input class="form_field required_form_field font10" id="serno" type="text" name="serno" <cfif StructKeyExists(rc,'serno')>value="#encodeForHTML(trim(rc.serno))#"</cfif> readonly="readonly" />
										</cfoutput>
										<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupAssetDialog.cfm" class="lookup" id="lookup_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
									</div>
								</div>
							</td>
							<td class="column">
								<div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="partno_id_label">P/N:</label>
                                        <cfoutput>
										<input type="hidden" id="partnoId" name="partnoId" value="" />
                                        <input class="form_field required_form_field font10" id="partno" type="text" name="partno" <cfif StructKeyExists(rc,'partno')>value="#encodeForHTML(trim(rc.partno))#"</cfif> readonly="readonly" />
										</cfoutput>
									</div>
								</div>
                            </td>
					</tr>
					<tr>
							<td class="column" colspan="2">
								<div class="columnContent">
									<div class="formField button_container">
										<input type="submit" value="ADD" name="createConfiguration" id="createConfiguration" onclick="setAction('new.configuration',this);setMethod('forward',this);"  />
										<input type="submit" value="SEARCH" name="btnSearch" id="btnSearch" />
									</div>
								</div>
							</td>
                    </tr>
				</tbody>
			</table>
		</form>
	</div>
	

<cfif not isNull(RC.qconfigs) and isQuery(RC.qconfigs)>

<div class="mainContent">	
	<cfif REQUEST.context.qconfigs.recordcount>
		<table class="globalTable" id="sraTable">
			<thead>
			<tr>
				<th>Noun</th>
				<th>NSN</th>
				<th>PARTNO</th>
				<th>SOFTWARE</th>
				<th>SERNO</th>
				<th class="noSort "></th>
			</tr>
			</thead>
			<tbody>
			<cfoutput query="RC.qconfigs">
				<cfset swQry = #dbUtils.getSoftwareByAssetId(val(asset_id))# />	
			<tr class="<cfif currentrow mod 2>odd<cfelse>even</cfif>">
				<td>#encodeForHTML(trim(NOUN))#</td>
				<td>#encodeForHTML(trim(NSN))#</td>
				<td>#encodeForHTML(trim(PARTNO))#</td>
				<td>
					<cfif swQry.recordcount GT 0>
						<ul>
							<cfloop query="swQry">
								<li>#encodeForHTML(sw_number)# / #encodeForHTML(sw_title)#</li>																	
							</cfloop>
						</ul>
					</cfif>		
				</td>				
				<td class="edit"><a href="index.cfm?action=edit.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(asset_id))#">#encodeForHTML(trim(SERNO))#</a></td>
				<td class="delete iconClass ">
					<a id="#encodeForHTML(trim(ASSET_ID))#" class="removeSRA" href="index.cfm?action=remove.sra&assetid=#URLEncodedFormat(rc.util.encryptId(ASSET_ID))#">
						<img src="../../common/images/icons/delete.png" border="0"/>
					
					</a>
				</td>
			</tr>
			</cfoutput>
			</tbody>
		</table>
	<cfelse>
		<div class="global_notice_msg">No Data Found</div>
	</cfif>
</div>
</cfif>	

</RIMSS:layout>