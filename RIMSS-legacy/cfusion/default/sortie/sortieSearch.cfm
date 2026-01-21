<cfsilent>
	<cfimport taglib="../layout" prefix="RIMSS" />
	<cfsetting showdebugoutput="false" >
	<cfset sortieSerials = []/>
	<cfset utils = new cfc.utils.utilities()/>
	<cftry>
	   <cfset dropDownUtilities = application.objectFactory.create("DBLookups") />
	   <cfset sortieSerials = dropDownUtilities.lookupUserAssets(application.sessionManager.getProgramSetting(),application.sessionManager.getUnitSetting(),"AIRBORNE") />
	<cfcatch>
	</cfcatch>
	</cftry>
</cfsilent>
<RIMSS:layout section="sorties">
    <RIMSS:subLayout/>
	<script src="../layout/js/sortie.js"></script>
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
                var dt = $('#sortieTable').dataTable({ 
			          "bFilter": true,
					  "sDom":"t"
			   });
                
			   
               modifyDTColumns();

				
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
                                        <input class="form_field required_form_field font10 calendar_field" id="sortieDate" type="text" name="sortieDate" <cfif StructKeyExists(rc,'sortieDate')>value="#encodeForHTML(trim(rc.sortieDate))#"</cfif> readonly="readonly" />
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
		           <table class="globalTable" id="sortieTable">
		              <thead>
		                <tr>
						    <th colspan="13" class="filter">
						      <cfif RC.sortieResults.recordcount gt 1> <div style="float:left">Sortie Count: #RC.sortieResults.recordcount#</div></cfif>
							  <div>Filter Results: <input type="text" id="dtSearch"/></div>      
						    </th>
					    </tr>
		                <tr>
		                    <th>Mission Id</th>
							<th class="date">Sortie Date</th>
		                    <th>SerNo</th>
							<th>Unit</th>
							<th>Range</th>
                            <th>AC</th>
							<th>Tail No</th>
							<th>Station</th>
		                    <th>Sortie Effect</th>
		                    <th>Remarks</th>
							<th>Reason</th>
		                    <th class="noSort">&nbsp;</th>
		                    <th class="noSort admin">&nbsp;</th>
		                </tr>
		              </thead>
		              <tbody>
		               <cfloop query="rc.sortieResults">
		                   <tr class="<cfif currentrow mod 2> odd <cfelse> even </cfif>">
		                       <td >#encodeForHTML(trim(MISSION_ID))#</td>
							   <td class="nowrap">#encodeForHTML(trim(UCASE(LSDateFormat(SORTIE_DATE,"dd-mmm-yyyy"))))#</td>
		                       <td >#encodeForHTML(trim(SERNO))#</td>
							   <td class="nowrap">#encodeForHTML(trim(CURRENT_UNIT_VALUE))#</td>
							   <td  class="nowrap" >#encodeForHTML(trim(RANGE_VALUE))#</td>
							   <td  class="nowrap" >#encodeForHTML(trim(AIRCRAFT_TYPE))#</td>
							   <td >#encodeForHTML(trim(AC_TAILNO))#</td>
							   <td >#encodeForHTML(trim(AC_STATION))#</td>
		                       <td class="nowrap">#encodeForHTML(trim(SORTIE_EFFECT_VALUE))#</td>
		                       <td>#encodeForHTML(trim(REMARKS))#</td>
							   <td>#encodeForHTML(trim(REASON))#</td>
		                       <td class="edit editIcon"><a href="index.cfm?action=edit.sortie&sortie=#utils.encryptId(sortie_id)#"></a></td>
		                       <td class="deleteSortie deleteIcon admin" id="#utils.encryptId(sortie_id)#">&nbsp;</td>
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