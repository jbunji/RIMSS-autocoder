<cfimport taglib="../layout" prefix="RIMMS"/>
<cfsetting showdebugoutput="false" >

<cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
<cfset status = dropDownUtilities.getProgramStatus(application.sessionManager.getProgramSetting()) />
<RIMMS:layout layout="acts">
	<RIMMS:subLayout subSection="#application.sessionManager.getSubSection()#"/>
    
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/acts/layout/js/maintenance.js"></script>
	<script type="text/javascript" >
			$(document).ready(function(){
    		    		
    		
			    		//var jobcompdt = document.getElementById('maintCompDate').value;
			    		var jobcompdt = document.getElementById('maintCompDate').value;
					 	if(jobcompdt.length > 0){
					 		document.getElementById("clearDate_png").style.visibility = "visible";
					 	}
					 	else{
					 		document.getElementById("clearDate_png").style.visibility = "hidden";
					 	}    		    		
    		
    		  			
			});			
				
		$(function() {
		    $('.reset').click(function(event) {
		        event.preventDefault();
		        resetForm($(this).closest('form'));
				$('#meterchg').val('N');
		    });
			$('#serno').change(function(){
				alert("Serno click event.");
			});
			
			$('#btnInsert').click(function(e){
				$(this).setAction('insert.event');
				$(this).setMethod('doAction');
				
				//alert(parseInt($("#origEtmStart").val()));
				
				if((parseInt($("#etmStart").val()) < parseInt($("#origEtmStart").val())) || parseInt($("#etmStart").val()) > (parseInt($("#origEtmStart").val()) + 100)){
					var str = "You are attempting to decrease ETM reading or the entered value increases the ETM by greater than 100 hours. Do you want to proceed?";
					if(confirm(str)==true){
						return true;
					}else{
						return false;
					}
				}
			});			
		});

		 $(function(){
			$(".clearDate").click(function(event){
					 document.getElementById('maintCompDate').value='';
			    	 document.getElementById('maintCompTime').value=''; 
			    	 document.getElementById("clearDate_png").style.visibility = "hidden";
			    	 document.getElementById('maintCompDate').readOnly = false;
					return true;
			});
		 }); 

		 function maintCompDateOnChange(){
		 	
		 	setTimeout(function(){ //alert("Hello")
			    		//var jobcompdt = document.getElementById('maintCompDate').value;
			    		var jobcompdt = document.getElementById('maintCompDate').value;
					 	if(jobcompdt.length > 0){
					 		document.getElementById("clearDate_png").style.visibility = "visible";
					 		document.getElementById('maintCompDate').readOnly = true;
					 	}
					 	else{
					 		document.getElementById("clearDate_png").style.visibility = "hidden";
					 	}    		    		
    		}, 2000);
		 	
		 	//document.getElementById('maintCompDate').readOnly = true;
		 }
		 
		 function maintCompDateOnKey(){
		 		var jobcompdt = document.getElementById('maintCompDate').value;
					 	if(jobcompdt.length > 0 && document.getElementById('maintCompDate').disabled == false){
					 		document.getElementById("clearDate_png").style.visibility = "visible";
					 		document.getElementById('maintCompDate').readOnly = true;
					 	}
					 	else{
					 		document.getElementById("clearDate_png").style.visibility = "hidden";
					 		document.getElementById('maintCompDate').readOnly = false;
					 	} 
					 	
				return;   		    				 	
		 }
		
	</script>




    <cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
    <div class="headerContent">
    	<div class="headerTitle">Create Maintenance</div>
    </div>

    <div class="font12 mainContent">
        <form id="createMaintenance" name="createMaintenance" method="post" action="index.cfm">
        	<div class="formContent">
        		<table class="three_column_table" cellpadding="0px" cellspacing="0px">
        			<tbody>
                        <tr><td class="section_header" colspan="3">&nbsp;</td></tr>
						<tr>
							<td class="column">
								<div class="columnContent">
									<div class="formField">
										<label class="font10" id="job_id_label"><span class="font10 required_field">*</span>JOB ID:</label>
			                        	<input class="form_field required_form_field font10 noreset" id="job_id_field" type="text" name="jobId" value="<cfif StructKeyExists(form, 'jobId')><cfoutput>#encodeForHTML(trim(form.jobId))#</cfoutput></cfif>" readonly="readonly" />
									</div>
									<div class="formField">
				                        <label class="font10" id="asset_id_label"><span class="font10 required_field">*</span>SERNO:</label> 
				                        <input type="hidden" id="assetId" name="assetId" value="<cfif StructKeyExists(form, 'assetId')><cfoutput>#encodeForHTML(trim(form.assetId))#</cfoutput></cfif>" />
                                        <input type="hidden" id="ctAssetId" name="ctAssetId" value="<cfif StructKeyExists(form, 'ctAssetId')><cfoutput>#encodeForHTML(trim(form.ctAssetId))#</cfoutput></cfif>" />
										<input type="hidden" id="systype" name="systype" value="<cfif StructKeyExists(form, 'systype')><cfoutput>#encodeForHTML(trim(form.systype))#</cfoutput></cfif>" />
				                        <input class="form_field required_form_field font10" id="serno" type="text" name="serno" value="<cfif StructKeyExists(form, 'serno')><cfoutput>#encodeForHTML(trim(form.serno))#</cfoutput></cfif>" readonly="readonly" />
				                        <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupAssetDialog.cfm?sender=CM" class="lookup" id="lookup_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
									</div>
									<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE'>
	                                    <div class="formField etmClass">
	                                        <label class="font10" id="etm_start_label"><span class="font10 required_field">*</span>ETM START:</label> 
	                                        <input class="form_field font10" id="etmStart" type="text" name="etmStart" value="<cfif StructKeyExists(form, 'etmStart')><cfoutput>#encodeForHTML(trim(form.etmStart))#</cfoutput></cfif>" style="width: 50px;max-width: 50px;" />
	                                        <input type="hidden" id="origEtmStart" name="origEtmStart" value="<cfif StructKeyExists(form, 'etmStart')><cfoutput>#encodeForHTML(trim(form.etmStart))#</cfoutput></cfif>" />
										</div>
									</cfif>
									<!--- 06/27/17 JJP Default time to Now() --->
									<cfif StructKeyExists(form, 'maintStartDate')>
										<cfset variables.maintStart = encodeForHTML(trim(form.maintStartDate))>
									<cfelse>
										<cfset variables.maintStart = Dateformat(NOW(),"DD-MMM-YYYY")>
									</cfif>
									<cfif StructKeyExists(form, 'maintStartTime')>
										<cfset variables.maintStartTime = encodeForHTML(trim(form.maintStartTime))>
									<cfelse>
										<cfset variables.maintStartTime = Timeformat(NOW(),"HH:nn")>
									</cfif>								
									<div class="formField">
			                            <label class="font10" id="maint_start_label"><span class="font10 required_field">*</span>MAINT START:</label>
			                            <input class="form_field font10 calendar_field" id="maintStartDate" type="text" name="maintStartDate" value="<cfoutput>#variables.maintStart#</cfoutput>" readonly="readonly" />
			                            <input class="form_field font10 time_field" id="maintStartTime" type="text" name="maintStartTime" value="<cfoutput>#variables.maintStartTime#</cfoutput>" />
                                    </div>
								</div>
							</td>
							<td class="column">
								<div class="columnContent">
                                     <div class="formField">&nbsp;</div>
									<div class="formField">
                                        <label class="font10" id="partno_id_label"><span class="font10 required_field">&nbsp;</span>P/N:</label>
                                        <input class="form_field required_form_field font10" id="partno" type="text" name="partno" value="<cfif StructKeyExists(form, 'partno')><cfoutput>#encodeForHTML(trim(form.partno))#</cfoutput></cfif>" readonly="readonly" />
                                    </div>
									<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE'>
										<div class="formField etmClass">
				                            <label class="font10" id="meter_chg_label"><span class="font10 required_field">&nbsp;</span>REPLACED METER:</label>
				                            <select class="select_field font10" id="meterchg" name="meterchg">
				                                <option value="Y" <cfif StructKeyExists(form, 'meterchg') and form.meterchg eq 'Y'>selected="selected"</cfif> >YES</option>
				                                <option value="N" <cfif !StructKeyExists(form, 'meterchg') or (StructKeyExists(form, 'meterchg') and form.meterchg neq 'Y')>selected="selected"</cfif> >NO</option>
				                            </select>
	                                    </div>
									</cfif>
                                    <div class="formField">&nbsp;</div>
								</div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                	<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE'>
	                                    <div class="formField">
											<label class="font10" id="sortie_id_label"><span class="font10"></span>SORTIE ID:</label>
											<input type="hidden" id="sortieId" name="sortieId" value="<cfif StructKeyExists(form, 'sortieId')><cfoutput>#encodeForHTML(trim(form.sortieId))#</cfoutput></cfif>" />
				                        	<input class="form_field font10" id="mission" type="text" name="mission" value="<cfif StructKeyExists(form, 'mission')><cfoutput>#encodeForHTML(trim(form.mission))#</cfoutput></cfif>" readonly="readonly" />
											<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSortieDialog.cfm" class="lookup_ref" id="sortie" title="SORTIE"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
										</div>
									<cfelse>
											<div class="formField">&nbsp;</div>
									</cfif>
									<div class="formField">
                                        <label class="font10" id="status_label"><span class="font10 required_field">*</span>STATUS:</label>
                                        <select class="select_field font10" id="status_select" name="status_select">
                                            <option value=""></option>
                                            <cfloop array="#status#" index="idx">
                                                <option value="<cfoutput>#idx[1]#</cfoutput>" <cfif StructKeyExists(form,'status_select')><cfif form.status_select eq idx[1] >selected=selected</cfif></cfif>><cfoutput>#idx[2]#</cfoutput></option>
                                            </cfloop>
                                        </select>
                                    </div>
									<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE'>
	                                    <div class="formField etmClass">
	                                        <label class="font10" id="etm_comp_label"><span class="font10 required_field">&nbsp;</span>ETM COMP:</label> 
	                                        <input class="form_field font10" id="etmComp" type="text" name="etmComp" value="<cfif StructKeyExists(form, 'etmComp')><cfoutput>#encodeForHTML(trim(form.etmComp))#</cfoutput></cfif>" style="width: 50px;max-width: 50px;" />
	                                    </div>
									</cfif>
                                    <div class="formField">
			                            <label class="font10" id="maint_stop_label">MAINT COMP:</label>
			                            <input class="form_field font10 calendar_field" id="maintCompDate" onkeypress="maintCompDateOnKey();" onkeyup="maintCompDateOnKey();" onfocus="maintCompDateOnChange();"  type="text" name="maintCompDate" value="<cfif StructKeyExists(form, 'maintCompDate')><cfoutput>#encodeForHTML(trim(form.maintCompDate))#</cfoutput></cfif>"   />
			                            <input class="form_field font10 time_field" id="maintCompTime" type="text" name="maintCompTime" value="<cfif StructKeyExists(form, 'maintCompTime')><cfoutput>#encodeForHTML(trim(form.maintCompTime))#</cfoutput></cfif>" readonly="readonly" />
			                            <img src="../../common/images/date_delete.png" id="clearDate_png" name="clearDate_png" title="Clear Date and Time" alt="Clear Date and Time" class="clearDate" style="visibility:hidden;"  />			                            
                                    </div>
                                </div>
                            </td>
						</tr>
                        <tr>
                            <td colspan="3">
                                <div class="formField">
		                            <label class="font10" id="discrepancy_label" style="vertical-align: top;">DISCREPANCY:</label><br/>
		                            <textarea class="text_area_field font10 touppercase" id="discrepancy" name="discrepancy" rows="4" ><cfif StructKeyExists(form, 'discrepancy')><cfoutput>#encodeForHTML(trim(form.discrepancy))#</cfoutput></cfif></textarea>
                                </div>
                            </td>
                        </tr>
						<tr>
							<td colspan="3">
				                <div class="button_container">
				                    <input type="submit" class="input_buttons font10" id="btnInsert" name="btnInsert" value="INSERT" onclick="setAction('insert.event',this);setMethod('doAction',this);" />
				                    <input type="reset" class="input_buttons font10 reset" id="btnReset" name="btnReset" value="RESET" />
				                </div>
							</td>
						</tr>
        			</tbody>
        		</table>
        	</div>
        </form>
	</div>
</RIMMS:layout>
