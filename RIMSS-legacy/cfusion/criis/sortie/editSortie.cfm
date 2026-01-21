<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
<RIMSS:layout section="sorties">
    <RIMSS:subLayout/>
    <cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
    
    <script type="text/javascript">
        $(function() {
            //setup asset lookup dialog
            setupAssetLookupDialog();
            setupLookupDialog();
            isNonPodded();
            $('.reset').click(function(event) {
                event.preventDefault();
                resetForm($(this).closest('form'));
            });
			
			$('.deleteSortie').click(function(event) {
				var c = confirm("Are you sure you want to delete this Sortie?");
				return c;
            });
            
			$("#isNonPodded").bind("change", function(){
            	var val = $(this).val();
            	if(val == 'Y'){
            		$("#serno").val("NON-PODDED")
            		$("#assetId").val("");
            		$("#lookup_ref").hide();
            	}else if (val == 'N'){
            		$("#serno").val("");
            		$("#lookup_ref").show();
            	}
            	
            });
            
            
        }); 
        
        function isNonPodded(){
        	var val = $("#isNonPodded").val();
            	if(val == 'Y'){
            		$("#serno").val("NON-PODDED")
            		$("#assetId").val("");
            		$("#lookup_ref").hide();
            	}
        }
   
    </script>

    <div class="headerContent" >
        <div class="headerTitle">Edit Sortie</div>
    </div>
   
    <div class="font12 mainContent">
        <form id="createSortie" name="createSortie" method="post" action="index.cfm">
        	<cfoutput><input type="hidden" class="noreset" readonly="readonly" id="sortieId" name="sortieId" <cfif StructKeyExists(form,'sortieId')>value="#encodeForHTML(trim(form.sortieId))#"</cfif> /></cfoutput>
            <table class="three_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                            <td class="column">
                                <div class="columnContent">
                                    
                                    <div class="formField">
                                        <label class="font10 required" id="asset_id_label">SN:</label> 
                                        <cfoutput>
                                        <input type="hidden" id="assetId" name="assetId" <cfif StructKeyExists(form,'assetId')>value="#encodeForHTML(trim(form.assetId))#"</cfif> />
                                        <input class="form_field required_form_field font10 touppercase" id="serno" type="text" name="serno" <cfif StructKeyExists(form,'serno')>value="#encodeForHTML(trim(form.serno))#"</cfif> readonly="readonly" />
                                        </cfoutput>
                                        <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupAssetDialog.cfm" class="lookup" id="lookup_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                    </div>
                                    <div class="formField">
                                        <label class="font10 required" id="current_unit_label">CURRENT UNIT:</label>
                                        <cfoutput>
                                        <input type="hidden" id="currentUnitCd" name="currentUnitCd" <cfif StructKeyExists(form,'currentUnitCd')>value="#encodeForHTML(trim(form.currentUnitCd))#"</cfif> />   
                                        <input class="form_field required_form_field font10 touppercase" id="currentUnit" type="text" name="currentUnit" <cfif StructKeyExists(form,'currentUnit')>value="#encodeForHTML(trim(form.currentUnit))#"</cfif> readonly="readonly" />
                                        </cfoutput>
                                        <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref codeOnly" id="unitCode" title="UNIT"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                        
                                    </div>
                                    <div class="formField">
                                        <label class="font10 required" id="range_label">RANGE:</label>
                                        <cfoutput>
                                        <input type="hidden" id="rangeCd" name="rangeCd" <cfif StructKeyExists(form,'rangeCd')>value="#encodeForHTML(trim(form.rangeCd))#"</cfif> />       
                                        <input class="form_field font10 touppercase" id="range" type="text" name="range" <cfif StructKeyExists(form,'range')>value="#encodeForHTML(trim(form.range))#"</cfif> readonly="readonly" />
                                        </cfoutput>
                                        <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref codeOnly" id="rangeCode" title="RANGE"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                    </div>
                                    <div class="formField">
                                        <label class="font10 required" id="isNonPodded_label">IS NON-PODDED:</label>
                                        <cfoutput>
                                        <select class="select_field font10" id="isNonPodded" name="isNonPodded">
			                                <option value="Y" <cfif StructKeyExists(form, 'isNonPodded') and form.isNonPodded eq 'Y'>selected="selected"</cfif> >YES</option>
			                                <option value="N" <cfif !StructKeyExists(form, 'isNonPodded') or (StructKeyExists(form, 'isNonPodded') and form.isNonPodded neq 'Y')>selected="selected"</cfif> >NO</option>
			                            </select>
				                        </cfoutput>
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                    
                                    <div class="formField">
                                        <label class="font10 required" id="mission_id_label">MISSION ID:</label>
                                        <cfoutput>
                                        <input class="form_field required_form_field font10 touppercase" id="missionId" type="text" name="missionId" maxlength="250" <cfif StructKeyExists(form,'missionId')>value="#encodeForHTML(trim(form.missionId))#"</cfif>/>
                                        </cfoutput>
                                    </div>
                                    
                                    <div class="formField">
                                        <label class="font10 required" id="sortie_date_label">SORTIE DATE:</label>
                                        <cfoutput>
                                        <input class="form_field required_form_field font10 calendar_field touppercase" id="sortieDate" type="text" name="sortieDate" readonly="readonly" <cfif StructKeyExists(form,'sortieDate')>value="#encodeForHTML(trim(form.sortieDate))#" </cfif>/>
                                        </cfoutput>
                                    </div>
                                    
                                    <div class="formField">
                                        <label class="font10 required" id="sortie_effect_label">SORTIE EFFECT:</label>
                                        <cfoutput>
                                        <input type="hidden" id="sortieEffectCd" name="sortieEffectCd" <cfif StructKeyExists(form,'sortieEffectCd')>value="#encodeForHTML(trim(form.sortieEffectCd))#"</cfif> />       
                                        <input class="form_field font10 touppercase" id="sortieEffect" type="text" name="sortieEffect" <cfif StructKeyExists(form,'sortieEffect')>value="#encodeForHTML(trim(form.sortieEffect))#"</cfif> readonly="readonly" />
                                        
                                        </cfoutput>
                                        <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref codeOnly" id="sortieEffectCode" title="SORTIE EFFECT"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                    </div>
                                    
                                    <div class="formField">
                                        <label class="font10" id="isDebrief_label">IS DEBRIEF:</label>
                                        <cfoutput>
                                        <select class="select_field font10" id="isDebrief" name="isDebrief">
			                                <option value="Y" <cfif StructKeyExists(form, 'isDebrief') and form.isDebrief eq 'Y'>selected="selected"</cfif> >YES</option>
			                                <option value="N" <cfif !StructKeyExists(form, 'isDebrief') or (StructKeyExists(form, 'isDebrief') and form.isDebrief neq 'Y')>selected="selected"</cfif> >NO</option>
			                            </select>
				                        </cfoutput>
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                
                                <div class="formField">
                                    <label class="font10" id="ac_type_label"><span class="font10 required_field">&nbsp;</span>AC TYPE:</label>
                                    <cfoutput>
                                    <input type="hidden" id="acTypeCd" name="acTypeCd" <cfif StructKeyExists(form,'acTypeCd')>value="#encodeForHTML(trim(form.acTypeCd))#"</cfif> />   
                                    <input class="form_field font10 touppercase" id="acType" type="text" name="acType" <cfif StructKeyExists(form,'acType')>value="#encodeForHTML(trim(form.acType))#"</cfif> readonly="readonly" />
                                    </cfoutput>
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref codeOnly" id="acTypeCode" title="AIRCRAFT TYPE"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>
                                
                                <div class="formField">
                                    <label class="font10 required" id="ac_tail_no_label"><span class="font10 required_field">&nbsp;</span>AC TAIL NO:</label>
                                    <cfoutput>
                                    <input class="form_field font10 touppercase" id="acTailNo" type="text" name="acTailNo" maxlength="50" <cfif StructKeyExists(form,'acTailNo')>value="#encodeForHTML(trim(form.acTailNo))#"</cfif> />
                                    </cfoutput>
                                </div>
                                
                                <div class="formField">
                                    <label class="font10" id="ac_station_label"><span class="font10 required_field">&nbsp;</span>AC STATION:</label>
                                    <cfoutput>
                                    <input class="form_field font10 touppercase" id="acStation" type="text" name="acStation" maxlength="10" <cfif StructKeyExists(form,'acStation')>value="#encodeForHTML(trim(form.acStation))#"</cfif> />
                                    </cfoutput>
                                </div>
                                
                                <div class="formField">
                                    <label class="font10" id="isLiveMonitor_label">IS LIVE MONITOR:</label>
                                    <cfoutput>
                                    <select class="select_field font10" id="isLiveMonitor" name="isLiveMonitor">
		                                <option value="Y" <cfif StructKeyExists(form, 'isLiveMonitor') and form.isLiveMonitor eq 'Y'>selected="selected"</cfif> >YES</option>
		                                <option value="N" <cfif !StructKeyExists(form, 'isLiveMonitor') or (StructKeyExists(form, 'isLiveMonitor') and form.isLiveMonitor neq 'Y')>selected="selected"</cfif> >NO</option>
		                            </select>
			                        </cfoutput>
                                </div>
                                
                            </td>
                    </tr>
					<tr>
						<td colspan="3">
							<div class="formField">
                                <label class="font10 required" id="current_unit_label">ASSIGNED UNIT:</label>
                                <cfoutput>
								<input type="hidden" id="assignedUnitCd" name="assignedUnitCd" <cfif StructKeyExists(form,'assignedUnitCd')>value="#encodeForHTML(trim(form.assignedUnitCd))#"</cfif> />	
                                <input class="form_field required_form_field font10 touppercase" id="assignedUnit" type="text" name="assignedUnit" <cfif StructKeyExists(form,'assignedUnit')>value="#encodeForHTML(trim(form.assignedUnit))#"</cfif> readonly="readonly" />
								</cfoutput>
								<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref codeOnly" id="assignedUnitCode" title="ASSIGNED UNIT"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
								
                            </div>
						</td>
					</tr>
                    <tr>
                        <td colspan="3">
                            <div class="formField">
                                <label class="font10" id="remarks_label" style="vertical-align: top;">REASON:</label>
                                <cfoutput>
                                    <input class="form_field font10 touppercase" id="reason" type="text" name="reason" maxlength="250" size="150" <cfif StructKeyExists(form,'reason')>value="#encodeForHTML(trim(form.reason))#"</cfif> />
                                </cfoutput>
                            </div>

                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div class="formField">
                                <label class="font10" id="remarks_label" style="vertical-align: top;">REMARKS:</label><br/>
                                <textarea class="text_area_field font10 touppercase" id="remarks" name="remarks" rows="4" ><cfif StructKeyExists(form, 'remarks')><cfoutput>#encodeForHTML(trim(form.remarks))#</cfoutput></cfif></textarea>
                            </div>

                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div class="button_container">
                                 <input type="submit" name="btnUpdate" value="UPDATE" onclick="setAction('update.sortie',this);setMethod('doAction',this);" >
								 <input type="submit" name="btnDelete" class="deleteSortie " value="DELETE" onclick="setAction('delete.sortie',this);setMethod('doAction',this);" >
                                 <input type="reset" name="btnReset" value="RESET" class="reset"> 
								 <input type="submit" name="btnCreateLike" value="CREATE LIKE" onclick="setAction('createlike.sortie',this);setMethod('forward',this);" >
                            </div>
                        </td>
                    </tr>
					<tr>
                        <td class="column" style="text-align:center" colspan="3">
                            <cfoutput>
                                <a id="newSortieSearch" href="index.cfm?action=list.sorties&method=doAction">New Search</a>  
                            </cfoutput>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
</RIMSS:layout>
