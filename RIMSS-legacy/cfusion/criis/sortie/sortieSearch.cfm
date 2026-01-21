<cfsilent>
	<cfimport taglib="../layout" prefix="RIMSS" />
	<cfsetting showdebugoutput="false" >
	<cfset sortieSerials = []/>
	<cfset utils = new cfc.utils.utilities()/>
	
	<!---<cftry>--->
	   <cfset dropDownUtilities = application.objectFactory.create("DBLookups") />
	   <cfset sortieSerials = dropDownUtilities.lookupUserAssets(application.sessionManager.getProgramSetting(),application.sessionManager.getUnitSetting(),"AIRBORNE") />
	<!---<cfcatch>
	</cfcatch>
	</cftry>--->
</cfsilent>
<RIMSS:layout section="sorties">
    <RIMSS:subLayout/>
	<script src="../layout/js/sortie.js"></script>
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/maintenance.js"></script>
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/jquery.timePicker.min.js"></script>	
    <!--- Using similar jQuery code from editConfiguration.cfm in configurationDepot.cfm (ACTS) -- WO4719 RIMSS v2.10.0 --->
	<!--- jQuery below is responsible for Export to Excel function in the Sorite Search page --->   
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
	
	//The line below allows for sorting by "Sortie Date" to function correctly
	$.fn.dataTable.moment( 'DD-MMM-YYYY' );

	//Setting date string for excel filename
	var excelDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);	
	
	var sortieTable = $('#sortieTable').DataTable( {
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
		        		extend: 'pdfHtml5',
		        		className: 'pdfBtn',
		        		messageTop: document.getElementById("skin_sub_title").innerText + ' Sorties' + ' - ' + reportTimeStamp,
		        		
		        		//PLACEHOLDER text is overwritten below
		        		title: 'PLACEHOLDER',
		                messageBottom: 'PLACEHOLDER',
		                
		                filename: 'CUI_Sorties_' + excelDate,
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
		                messageTop: document.getElementById("skin_sub_title").innerText + ' Sorties' + ' - ' + reportTimeStamp,
		                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
			            filename: 'CUI_Sorties_' + excelDate,
		                text: 'Export to Excel',
		                exportOptions: {
				            columns: 'th:not(.noSort)'
				         }
		            }		            
		            
		        ]
		} ); 	
		    
	//Detatching buttons from table and appending them to a div, so that buttons can be moved on page   	
	sortieTable.buttons().container().appendTo('#exportButtons');
});
		
</script>
	<!--- Comment 2nd sortiTable variable and modifyDTColumns as new code above is being used --->
    <script>
        try {
            $(document).ready(function(){
                //setupEditHighlight();
                setupHighlight();
                setupDeleteSortie();

				$('#btnSearch').on("click",function(){
					$(this).closest("form").setActionMethod("search.sortie","doAction");
				});
				$('.reset').click(function(event) {
	                event.preventDefault();
	                resetForm($(this).closest('form'));
	            });

                $('#dtSearch').on('keyup',function(e){
				    dt.fnFilter($(this).val());
				   });
				
				//Add Data Table
//                var dt = $('#sortieTable').dataTable({ 
//			          "bFilter": true,
//					  "sDom":"t"
//			   });
                
			   
              // modifyDTColumns();

				$("#isNonPodded").click(function(){
					
					if(this.checked){
						$("#sortieSerno").attr("disabled", true);
					}else{
						$("#sortieSerno").attr("disabled", false);
					}
					
				});
				
				
				$('.calendar_field').datepicker({
				        dateFormat: "dd-M-yy",
				        changeMonth: true,
				        changeYear: true,
				        onSelect: function(dateText, inst) {
				            var tmpDate = $(this).val();
				            $(this).val(tmpDate.toUpperCase());
				        }
				    });
				
            });

        }catch(err){}
    </script>

	<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
	

	<div class="headerContent" >
        <div class="headerTitle">Sortie Search</div>
    </div>

	<div class="font12 mainContent">
        <form id="sortieSearch" name="sortieSearch" method="post" action="index.cfm">
            <table class="three_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                            <td class="column">
                                <div class="columnContent">
                                    
                                    <div class="formField">
                                        <label class="font10 required" id="asset_id_label">SN:</label> 
                                        <cfoutput>
                                        <select name="sortieSerno" id="sortieSerno">
                                        	<option value=""></option>
											<cfloop index="s" array="#sortieSerials#">
											     <option value="#trim(s.serno)#" <cfif StructKeyExists(rc,'sortieSerno') and ucase(trim(rc.sortieSerno)) eq ucase(trim(s.serno))>selected="selected"</cfif>>#trim(s.serno)#</option>     		
											</cfloop>
                                        </select>
										</cfoutput>
										
										
                                    <span style="padding-left: 20px;">
										<input type="checkbox" id="isNonPodded" name="isNonPodded" <cfif StructKeyExists(rc,'isNonPodded') and rc.isNonPodded EQ 'on'>checked=checked</cfif>>Non-Podded?</input>
										
										<!---<select name="isNonPodded" id="isNonPodded">
                                        	<option value="N">N</option>
											<option value="Y">Y</option>
                                        </select>--->
                                    </span>
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="partno_id_label">MISSION ID:</label>
                                        <cfoutput>
                                        <input class="form_field required_form_field font10" id="missionId" type="text" name="missionId" <cfif StructKeyExists(rc,'missionId')>value="#encodeForHTML(trim(rc.missionId))#"</cfif> />
                                        </cfoutput>
                                    </div>
                                </div>
                            </td>
							<td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="partno_id_label">SORTIE DATE:</label>
                                        <cfoutput>
                                        <input class="form_field required_form_field font10 calendar_field" type="text" name="sortieDate" <cfif StructKeyExists(rc,'sortieDate')>value="#encodeForHTML(trim(rc.sortieDate))#"</cfif> readonly="readonly" />
                                        </cfoutput>
                                    </div>
                                </div>
                            </td>
							</tr>
							<tr>
                            <td class="column" colspan="3">
                                <div class="columnContent">
                                    <div class="formField button_container">
                                        <input type="submit" value="SEARCH" name="btnSearch" id="btnSearch" />
										<input type="reset" value="RESET" class="reset" name="btnReset" id="btnReset" />
                                    </div>
                                </div>
                            </td>
							</tr>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
	<cfif not isNull(RC.sortieResults) and isQuery(RC.sortieResults)>
		
		<div class="mainContent">   
		    <cfif RC.sortieResults.recordcount>
		        <cfoutput>
		           <table class="globalTable sticky-headers" id="sortieTable">
		              <thead>
		                <tr>
						    <th colspan="14" class="filter">
						      <cfif RC.sortieResults.recordcount gt 1> <div style="float:left">Sortie Count: #RC.sortieResults.recordcount#</div></cfif>
							  <div>Filter Results: <input type="text" id="dtSearch"/></div>      
						    </th>
					    </tr>
		                <tr>
		                    <th>Mission Id</th>
							<th class="date">Sortie Date</th>
		                    <th>SerNo</th>
							<th>Curr Unit</th>
							<th>Assn Unit</th>
							<th>Range</th>
                            <th>AC</th>
							<th>Tail No</th>
							<th>Station</th>
		                    <th>Sortie Effect</th>
		                    <th>DEB</th>
		                    <th>LM</th>
		                    <th>Remarks</th>
							<th>Reason</th>
		                    <th class="noSort">&nbsp;</th>
		                    <th class="noSort ">&nbsp;</th>
		                </tr>
		              </thead>
		              <tbody>
		               <cfloop query="rc.sortieResults">
		                   <tr class="<cfif currentrow mod 2> odd <cfelse> even </cfif>">
		                       <td >#encodeForHTML(trim(MISSION_ID))#</td>
							   <td class="nowrap">#encodeForHTML(trim(UCASE(LSDateFormat(SORTIE_DATE,"dd-mmm-yyyy"))))#</td>
		                       <td >#encodeForHTML(trim(SERNO))#</td>
							   <td class="nowrap">#encodeForHTML(trim(CURRENT_UNIT_VALUE))#</td>
							   <td class="nowrap">#encodeForHTML(trim(ASSIGNED_UNIT_VALUE))#</td>
							   <td  class="nowrap" >#encodeForHTML(trim(RANGE_VALUE))#</td>
							   <td  class="nowrap" >#encodeForHTML(trim(AIRCRAFT_TYPE))#</td>
							   <td >#encodeForHTML(trim(AC_TAILNO))#</td>
							   <td >#encodeForHTML(trim(AC_STATION))#</td>
		                       <td class="nowrap">#encodeForHTML(trim(SORTIE_EFFECT_VALUE))#</td>
		                       <td class="nowrap">#encodeForHTML(trim(IS_DEBRIEF))#</td>
		                       <td class="nowrap">#encodeForHTML(trim(IS_LIVE_MONITOR))#</td>
		                       <td>#encodeForHTML(trim(REMARKS))#</td>
							   <td>#encodeForHTML(trim(REASON))#</td>
		                       <td class="edit editIcon"><a href="index.cfm?action=edit.sortie&sortie=#utils.encryptId(sortie_id)#"></a></td>
		                       <td class="deleteSortie deleteIcon " id="#utils.encryptId(sortie_id)#">&nbsp;</td>
		                   </tr>
		               </cfloop>
		              </tbody>
		           </table>
		        </cfoutput>
		    <cfelse>
		        <div class="global_notice_msg">No Data Found</div>
		    </cfif>
		</div>
	</cfif> 
</RIMSS:layout>