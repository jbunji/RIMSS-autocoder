<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsilent>
	<cfif isDefined('rc') and not structKeyExists(rc,'system')>
		<cflocation url="inventory.cfm" addtoken="false" >
	</cfif>
</cfsilent>

<cfsetting showdebugoutput="false" >
<RIMSS:layout section="inventory" subSection="#application.sessionManager.getSubSection()#">
    <RIMSS:subLayout/>
	
	<script>
		$(function(){
			
			$('#btnUpdate').click(function(e){
				$(this).setAction('update.inventory');
				$(this).setMethod('doAction');
				
				if((parseInt($("#etm").val()) < parseInt($("#currEtm").val())) || parseInt($("#etm").val()) > (parseInt($("#currEtm").val()) + 100)){
					var str = "You are attempting to decrease ETM reading or the entered value increases the ETM by greater than 100 hours. Do you want to proceed?";
					if(confirm(str)==true){
						return true;
					}else{
						return false;
					}
				}
			});
			
			$('#btnReset').click(function(e){
				$(this).setAction('edit.inventory');
				setMethod('forward',this);
			});
			
			$(".loc").change(function(){
							
				var site_a = $("#site_a").val();
				var site_c = $("#site_c").val();
			
				var currSite = $("#curr_select option:selected").data("site_cd");
				var assignSite = $("#assign_select option:selected").data("site_cd");
				
				if(currSite != site_c){
					$("#shipReg").show();
					$("#inTransit_select").val("Y");
					return true;
				}else{
					$("#shipReg").hide();		
					$("#inTransit_select").val("N");	
					//return true;		
				}
				/*
				if(assignSite != site_a){
					$("#shipReg").show();
					$("#inTransit_select").val("Y");
					return true;
				}else{
					$("#shipReg").hide();		
					$("#inTransit_select").val("N");	
					//return true;		
				}*/
				
				
				
			})
		})
	</script>
	
<cfscript>
    import cfc.dao.DBUtils;
    import cfc.utils.QueryIterator;
    
    import cfc.facade.SessionFacade;
    import cfc.utils.utilities;
        
</cfscript>

	<cfset dbUtils = application.objectFactory.create("DBUtils") />
	<cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
	<cfset aStatus = dropDownUtilities.getActsStatus() />
	<cfset qAllLocs = dropDownUtilities.getAllLocations() />


 	<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
	<div class="headerContent">
    	<div class="headerTitle">Edit Asset</div>
    </div>
	
	
	<div class="mainContent">
		<form id="editInventory" name="editInventory" method="post" action="<cfoutput>index.cfm</cfoutput>">
		<cfoutput>
		<input type="hidden" id="site_a" name="site_a" value="#encodeForHTML(trim(site_a_cd))#" />
		<input type="hidden" id="site_c" name="site_c" value="#encodeForHTML(trim(site_c_cd))#" />	
		<input type="hidden" id="system" name="system" value="#encodeForHTML(trim(rc.system))#" />
		<input type="hidden" id="ctAssetId" name="ctAssetId" <cfif StructKeyExists(form, 'ct_asset_id')>value="#encodeForHTML(trim(ct_asset_id))#"</cfif> />
		</cfoutput>	
		<table class="two_column_table" cellpadding="0px" cellspacing="0px" style="">
			<tbody>
			<tr>
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="asset_id_label" for="serno"> SERNO:</label> 
	                        <cfoutput><cfif StructKeyExists(form,'serno')>#serno#</cfif>
							<input type="hidden" id="assetId" name="assetId" <cfif StructKeyExists(form,'asset_id')>value="#encodeForHTML(trim(asset_Id))#"</cfif>/>
	                        <input class="form_field required_form_field font10" id="serno" type="hidden" name="serno" <cfif StructKeyExists(form,'serno')>value="#encodeForHTML(trim(serno))#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>
				</td>
				<td>
					<label class="font10" id="inTransit_label" for="inTransit_select">IN TRANSIT:</label>
					<cfif StructKeyExists(form, 'in_transit')>
						<select class="select_field font9" id="inTransit_select" name="inTransit_select" <cfif in_transit EQ "N">disabled=disabled</cfif>>
							<option value="Y"<cfif in_transit EQ "Y">selected=selected</cfif>>Y</option>
							<option value="N"<cfif in_transit EQ "N">selected=selected</cfif>>N</option>
						</select>
						<span id="shipReg" <cfif in_transit EQ "N">style="display:none"</cfif>>
							<cfoutput>
		                    <label class="font10" id="shipper_label" for="shipper"> SHIPPER:</label> 
							<!---<input type="text" class="form_field required_form_field font10" id="shipper" name="shipper" <cfif StructKeyExists(form,'shipper')>value="#encodeForHTML(trim(shipper))#"</cfif> />--->
								<select class="form_field required_form_field font10" id="shipper" name="shipper">
									<option value="">Select...</option>
									<option value="FEDEX" <cfif shipper EQ "FEDEX">selected=selected</cfif>>FedEx</option>
									<option value="UPS"<cfif shipper EQ "UPS">selected=selected</cfif>>UPS</option>
									<option value="DHL"<cfif shipper EQ "DHL">selected=selected</cfif>>DHL</option>
									<option value="GOV"<cfif shipper EQ "GOV">selected=selected</cfif>>Gov.</option>
								</select>
		                    <label class="font10" id="tcn_label" for="tcn"> TCN:</label> 
							<input type="text" class="form_field required_form_field font10" id="tcn" name="tcn" <cfif StructKeyExists(form,'tcn')>value="#encodeForHTML(trim(tcn))#"</cfif> />
							</cfoutput>
						</span>
					</cfif>
				</td>
			</tr>
			<tr>
				<td>
					<div class="columnContent">
						<div class="formField">
							<label class="font10" id="status_label" for="status_select">STATUS:</label>							
							<select class="select_field font9" id="status_select" name="status_select" <cfif in_transit EQ "Y">disabled=disabled</cfif>>  
								<cfoutput>                                
			                        <cfloop array="#aStatus#" index="idx">
			                            <option value="#idx[1]#" <cfif status_cd eq idx[1] >selected=selected</cfif>>#idx[2]#</option>
			                        </cfloop>
								</cfoutput>
		                    </select>
							<cfoutput>
							<input type="hidden" id="status_cd" name="status_cd" value="#encodeForHTML(trim(status_cd))#" />
							</cfoutput>
						</div>
					</div>
				</td>
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="etm_label" for="etm"> ETM:</label> 
							<cfif isDefined("rc.system") and rc.system EQ "POD">
	                        	<cfoutput>
									<input type="text" name="etm" id="etm" value="#encodeForHTML(trim(ETM))#" size="5" <cfif in_transit EQ "Y">disabled=disabled</cfif>>
									<input type="hidden" name="currEtm" id="currEtm" value="#encodeForHTML(trim(ETM))#">
									<input type="hidden" name="meterType" id="meterType" value="#encodeForHTML(trim(METER_TYPE))#"> 
									<input type="hidden" name="meterSeq" id="meterSeq" value="#encodeForHTML(trim(METER_SEQ))#">
									<cfif in_transit EQ "Y"><input type="hidden" name="etm" id="etm" value="#encodeForHTML(trim(ETM))#"></cfif> 
								</cfoutput>
	                        <cfelse>
								N/A
								<input type="hidden" name="etm" id="etm" value=""> 
								<input type="hidden" name="meterType" id="meterType" value=""> 
								<input type="hidden" name="meterSeq" id="meterSeq" value=""> 
							</cfif>
						</div>
					</div>
				</td>	
			</tr>
			<tr>
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="curr_id_label" for="curr_select">CURRENT LOC:</label>
	                        <cfoutput>
								<cfif StructKeyExists(form,"loc_idc")>
								<select class="form_field required_form_field font10 loc" id="curr_select" name="curr_select" <cfif in_transit EQ "Y">disabled=disabled</cfif>>
							    	<cfloop query="qAllLocs" >
									  <option value="#encodeForHTML(loc_id)#" data-site_cd="#encodeForHTML(site_cd)#" <cfif loc_idc eq loc_id >selected=selected</cfif>>#encodeForHTML(site)# - #encodeForHTML(unit)# - #encodeForHTML(squad)#</option>
									</cfloop>
							    </select>
								<input type="hidden" id="curr_id" name="curr_id" value="#encodeForHTML(trim(loc_idc))#">
								</cfif>
							</cfoutput>
						</div>
					</div>					
				</td>
				<td class="column">					
					<div class="columnContent">
						<div class="formField">
                        	<label class="font10" id="assign_id_label" for="assign_select">ASSIGNED LOC:</label>						
							<cfoutput>	
								<cfif StructKeyExists(form,"loc_ida")>						
								<select class="form_field required_form_field font10 loc" id="assign_select" name="assign_select" <cfif in_transit EQ "Y">disabled=disabled</cfif>>
			                        <cfloop query="qAllLocs" >
			                          <option value="#encodeForHTML(loc_id)#" data-site_cd="#encodeForHTML(site_cd)#"  <cfif loc_ida eq loc_id >selected=selected</cfif>>#encodeForHTML(site)# - #encodeForHTML(unit)# - #encodeForHTML(squad)#</option>
			                        </cfloop>
			                    </select>
								<input type="hidden" id="assign_id" name="assign_id" value="#encodeForHTML(trim(loc_ida))#">
								</cfif> 
							</cfoutput>
						</div>
					</div>
				</td>	
			</tr>
			<td colspan="2">
	            <div class="formField">
	                <label class="font10" id="remarks_label" style="vertical-align: top;">REMARKS:</label><br/>
	                <textarea class="text_area_field font10 touppercase" id="remarks" name="remarks" rows="4" ><cfif StructKeyExists(form, 'REMARKS')><cfoutput>#encodeForHTML(trim(REMARKS))#</cfoutput></cfif></textarea>
	            </div>
	        </td>
			<tr>
				<td class="column button_container" colspan="2" style="text-align:center">
					<input type="submit" name="btnUpdate" id="btnUpdate" value="UPDATE" onclick="setAction('update.event',this);setMethod('doAction',this);"> 
					<input type="submit" name="btnReset" id="btnReset" value="RESET">
				</td>
			</tr>
			<tr>
				<td class="column" colspan="2" style="text-align:center;"><cfoutput><a href="index.cfm?action=search.inventory&system=#rc.system#">Return to Asset List</a></cfoutput></td>
			</tr>
			</tbody>	
		</table>
		</form>
	</div>		

</RIMSS:layout>	