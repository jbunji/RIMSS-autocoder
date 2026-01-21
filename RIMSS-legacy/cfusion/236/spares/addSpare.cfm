<cfsilent>
    <cfimport taglib="../layout" prefix="RIMSS"/>
    <cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
    <cfset spareStatusList = dropDownUtilities.getProgramPartStatus(UCASE(TRIM(APPLICATION.sessionmanager.getProgramSetting()))) />
	<cfset spareLocList = dropDownUtilities.getSpareLocations(UCASE(TRIM(APPLICATION.sessionmanager.getProgramSetting()))) />
    <cfset spareDepotList = dropDownUtilities.getSpareDepotLocations(UCASE(TRIM(APPLICATION.sessionmanager.getProgramSetting()))) />
    <cfset spareNouns = dropDownUtilities.getNouns(APPLICATION.sessionmanager.getProgramSetting()) />
	<cfif structkeyexists(form,"spareNoun") and len(trim(form.spareNoun))>
	   <cfset sparePart = dropDownUtilities.getPartsByNounPart(noun=form.spareNoun)>
	   <cfif sparePart.recordcount eq 1 and not structkeyexists(form,"sparePartNo") >
	   	   <cfparam name="form.sparepartNo" default="#sparePart.partno_id#"/>
	   </cfif> 
	</cfif>
	<cfif structkeyexists(form,"sparePartNo") and len(trim(form.sparePartNo))>
       <cfset spareNSN = dropDownUtilities.getPartsByNounPart(noun=form.spareNoun,partnoId=trim(form.sparePartNo))>
       
       <cfif spareNSN.recordcount eq 1 and not structkeyexists(form,"spareNSN") >
           <cfparam name="form.spareNSN" default="#sparePart.NSN#"/>
       </cfif>  
    
    
    </cfif>
	
	
    <cfsetting showdebugoutput="false" >
</cfsilent>

<RIMSS:layout section="spares" privs="PCS_ACTTS_SPARES">
    <RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
    <script src="../layout/js/spares.js"></script>
	<script>
        try {
            $(document).ready(function(){
                //setupEditHighlight();
                setupHighlight();
                setupNounPartRelated();
				setupSoftwareDialog();
				setupSoftwareDelete();
				
                $('#btnReset').on("click",function(){
                    $(this).closest("form").setActionMethod("add.spare","forward");
					
                });
				
				$('#btnInsert').on("click",function(){
                    $(this).closest("form").setActionMethod("create.spare","forward");
                    
                });
				try {
                   var dt = $('#softwareContainer table.currentSoftware').dataTable({ 
                      "sDom":"t"
                    });  
                    
                    dt.fnDraw();
                    modifyDTColumns();
                } catch (e) {   
                }

            });
        }catch(err){}

    </script>

    <cfoutput>
       <div class="message #msgStatus#">#msg#</div>
    </cfoutput>
    
    <div class="headerContent">
        <div class="headerTitle">Add Spare</div>
    </div>
	
	<div class="font12 mainContent">
        <form id="searchSpares" name="searchSpares" method="post" action="index.cfm">
        	<cfoutput>
        	<input type="hidden" name="spareAsset" readonly="readonly" id="spareAsset" <cfif Structkeyexists(form,"spareAsset")>value="#encodeForHTML(trim(form.spareAsset))#"</cfif>/>
			<input type="hidden" name="spareSoftwareId" readonly="readonly" id="spareSoftwareId" <cfif Structkeyexists(form,"spareSoftwareId")>value="#encodeForHTML(trim(form.spareSoftwareId))#"</cfif>/>
			</cfoutput>
			
            <table class="three_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                            <td class="column" style="white-space:nowrap">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10 required" id="noun_label">NOUN:</label> 
                                        <cfoutput>
                                            <select name="spareNoun" id="spareNoun">
                                                <option value=""></option>
                                                <cfif isDefined("spareNouns") and isQuery(spareNouns)>
                                                    <cfloop query="spareNouns">
                                                        <option <cfif Structkeyexists(form,"spareNoun") and UCASE(TRIM(form.spareNoun)) eq UCASE(TRIM(NOUN))>selected="selected"</cfif>  value="#encodeForHTML(noun)#">#encodeForHTML(noun)#</option>
                                                    </cfloop>
                                                </cfif>
                                                
                                            </select>
										</cfoutput>
                                        
                                    </div>
                                </div>
                            </td>
							<td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10 required" id="partno_label">PN:</label> 
                                        <cfoutput>
                                            <select name="sparePartNo" id="sparePartNo">
                                                <option value=""></option>
                                                <cfif isDefined("sparePart") and isQuery(sparePart)>
                                                    <cfloop query="sparePart">
                                                        <option <cfif Structkeyexists(form,"sparePartNo") and UCASE(TRIM(form.sparePartNo)) eq UCASE(TRIM(PARTNO_ID))>selected="selected"</cfif>  value="#encodeForHTML(trim(partno_id))#">#encodeForHTML(partno)#</option>
                                                    </cfloop>
                                                </cfif>
                                                
                                            </select>
                                        </cfoutput>
                                        
                                    </div>
                                </div>
                            </td>
							<td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10 required" id="nsn_label">NSN:</label> 
                                        <cfoutput>
										<select name="spareNSN" id="spareNSN">
                                            <option value=""></option>
                                            <cfif isDefined("spareNSN") and isQuery(spareNSN)>
                                                <cfloop query="spareNSN">
                                                    <option <cfif Structkeyexists(form,"spareNSN") and UCASE(TRIM(form.spareNSN)) eq UCASE(TRIM(NSN))>selected="selected"</cfif>  value="#encodeForHTML(NSN)#">#encodeForHTML(NSN)#</option>
                                                </cfloop>
                                            </cfif>
                                            
                                        </select>
                                        </cfoutput>
                                    </div>
                                </div>
                            </td>
                            
                    </tr>
                    
					<tr>
                            <td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10 required" id="noun_label">SN:</label> 
                                        <cfoutput>
                                            <input type="text" name="spareSerNo" id="spareSerNo" <cfif Structkeyexists(form,"spareSerNo")>value="#encodeForHTML(UCASE(TRIM(form.spareSerNo)))#"</cfif>>
                                        </cfoutput>
                                        
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10 required" id="partno_label">STATUS:</label> 
                                        <cfoutput>
											<select name="spareStatus" id="spareStatus">
												<option value=""></option>
												<cfif isDefined("spareStatusList") and isArray(spareStatusList)>
												    <cfloop array="#spareStatusList#" index="curSpare">
														<cfif Arraylen(curSpare) gte 2>
														  <option value="#curSpare[1]#" <cfif structkeyexists(form,"spareStatus") and trim(form.spareStatus) eq trim(curSpare[1])>selected="selected"</cfif>>#curSpare[2]#</option>
														</cfif>
													</cfloop>
												</cfif>
											</select>
                                        </cfoutput>
                                        
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="nsn_label">WARRANTY EXP:</label> 
                                        <cfoutput>
                                            <input class="calendar_field" type="text" readonly="readonly" name="spareWarranty" id="spareWarranty" <cfif Structkeyexists(form,"spareWarranty")>value="#encodeForHTML(UCASE(TRIM(form.spareWarranty)))#"</cfif>>
                                        </cfoutput>
                                        
                                    </div>
                                </div>
                            </td>
                            
                    </tr>
					<tr>
                            <td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10 required" id="noun_label">LOCATION:</label> 
                                        <cfoutput>
                                            <select name="spareLocation" id="spareLocation">
                                                <option value=""></option>
                                                <cfif isDefined("spareLocList") and isArray(spareLocList)>
                                                    <cfloop array="#spareLocList#" index="curSpare">
                                                        <cfif Arraylen(curSpare) gte 2>
                                                          <option value="#curSpare[1]#" <cfif structkeyexists(form,"spareLocation") and trim(form.spareLocation) eq trim(curSpare[1])>selected="selected"</cfif>>#curSpare[2]#</option>
                                                        </cfif>
                                                    </cfloop>
                                                </cfif>
                                            </select>
                                        </cfoutput>
                                        
                                        
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="partno_label">DEPOT:</label> 
                                        <cfoutput>
                                            <select name="spareDepot" id="spareDepot">
                                                <option value=""></option>
                                                <cfif isDefined("spareDepotList") and isArray(spareDepotList)>
                                                    <cfloop array="#spareDepotList#" index="curSpare">
                                                        <cfif Arraylen(curSpare) gte 2>
                                                          <option value="#curSpare[1]#" <cfif structkeyexists(form,"spareDepot") and trim(form.spareDepot) eq trim(curSpare[1])>selected="selected"</cfif>>#curSpare[2]#</option>
                                                        </cfif>
                                                    </cfloop>
                                                </cfif>
                                            </select>
                                        </cfoutput>
                                        
                                        
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <!---<div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="nsn_label">SOFTWARE:</label> 
                                        <cfoutput>
                                            <input type="text" name="spareSoftware" id="spareSoftware" <cfif Structkeyexists(form,"spareSoftware")>value="#UCASE(TRIM(form.spareSoftware))#"</cfif>>
                                            <span style="display:inline-block;">
	                                        <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSoftwareDialog.cfm" class="lookup" id="sw_lookup_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
	                                        </span>
										
										</cfoutput>
                                        
                                    </div>
                                </div>--->
                            </td>
                            
                    </tr>
					
					
						
					<tr>
						<td colspan="3" class="column">
						  <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="nsn_label">REMARKS:</label> 
                                        <cfoutput>
											<textarea name="spareRemarks" class="text_area_field" rows="4" id="spareRemarks"><cfif Structkeyexists(form,"spareRemarks")>#encodeForHTML(TRIM(form.spareRemarks))#</cfif></textarea>
                                        </cfoutput>
                                        
                                    </div>
                                </div>	
						</td>
						
					</tr>
					
					<tr>
                        <td colspan="3" class="column">
                          <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="nsn_label">SOFTWARE:</label> 
                                        <cfoutput>
                                        <span style="display:inline-block;">
                                            <a href="#application.rootpath#/dialogs/lookupSoftwareDialog.cfm" class="lookup" id="sw_lookup_ref"><img id="lookup_img" src="#application.rootpath#/common/images/lookup.png" /></a>
                                        </span> 
                                        </cfoutput>
                                        
                                        <div id="softwareContainer" style="font-size:11px;width:450px;text-align:center;">
										      <cfif isDefined("rc.qSpareSoftware") and isQuery(rc.qSpareSoftware) and rc.qSpareSoftware.recordcount>
											     <table class="currentSoftware globalTable">
											     	<thead>
											     		<tr>
											     			<th>Number</th>
															<th>Title</th>
															<th class="noSort ">&nbsp;</th>
														</tr>
													</thead>
													<tbody>
														<cfloop  query="rc.qSpareSoftware" >
                                                            <cfoutput>
																<tr>
																	<td>#encodeForHTML(SW_NUMBER)#</td>
																	<td>#encodeForHTML(SW_TITLE)#</td>
																	<td class="deleteSoftware deleteIcon " id="#encodeForHTML(ENCRYPTED_SW_ID)#">&nbsp;</td>
																</tr>
															</cfoutput>
                                                        </cfloop>
													</tbody>
												</table>
											     
											  </cfif>
										
										
										</div>
                                    </div>
                                </div>  
                        </td>
                        
                    </tr>
					
					
					
					
					
                    <tr>
                            <td class="column" colspan="3">
                                <div class="columnContent">
                                	
                                    <div class="formField button_container">
                                    	<cfoutput>
                                        <div>
                                                <cfif Structkeyexists(form,"spareNoun") and len(trim(form.spareNoun))>
												    <a id="newSpareSearch" href="index.cfm?action=list.spares">New Search</a> 	
												<cfelse>	
													<a id="newSpareSearch" href="index.cfm?action=list.spares.page">New Search</a> 
												</cfif>
                                                  
                                             
                                        </div>
                                    </cfoutput>
                                        <input type="submit" value="INSERT" name="btnInsert" id="btnInsert" />
										<input type="submit" value="RESET" name="btnReset" id="btnReset" />
                                    </div>
                                </div>
                            </td>
                    </tr>
					
					
                </tbody>
            </table>
        </form>
    </div>
</RIMSS:layout>