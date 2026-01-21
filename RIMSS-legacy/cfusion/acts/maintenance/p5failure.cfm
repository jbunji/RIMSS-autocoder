<cfimport taglib="../layout" prefix="RIMMS"/>
<cfsetting showdebugoutput="true" >
<!---<cfset program = lcase(trim(application.sessionManager.getProgramSetting())) />--->

<RIMMS:layout layout="criis">
    <RIMMS:subLayout subSection="#application.sessionManager.getSubSection()#"/>

    <link href="<cfoutput>#application.rootpath#</cfoutput>/common/css/timePicker.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/criis/layout/js/maintenance.js"></script>
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/jquery.timePicker.min.js"></script>
    <script type="text/javascript">
    	$(function(){
			$('.calendar_field1').datepicker({
       				   dateFormat: "dd-M-yy",
				       changeMonth: true,
				       changeYear: true,
				       onSelect: function(dateText, inst) {
				           var tmpDate = $(this).val();
				           $(this).val(tmpDate.toUpperCase());
				       },
				onClose: function(dateText, inst){
					var nextPmi = $.trim($("#nextPmi").val());
				    if ((nextPmi.toUpperCase().indexOf("DAY") != -1)) {
						var str = $("#nextPmi").val();
						var arry = str.split("");
						res="";
						varnum = "n";
						for (var i = 0; i < arry.length; i++) {
							if (!isNaN(parseInt(arry[i], 10))) {
								res += arry[i];
								varnum = "y";
							}
							else {
								if (varnum == "y") {
									break;
								}
							}
						}
						var days = new Date(Date.parse(dateText));
						var additional = parseInt(res);
						days.setDate(days.getDate()+additional);
					
						var day = ("0" + days.getDate()).slice(-2);
						var month = new Date(days).format("mmm");
						var year = days.getFullYear();
					
						if (day.length == 1) {
							day = '0' + day;
						}
						var npmi = day + '-' + month.toUpperCase() + '-' + year;
						$("#nextPmiDate").val(npmi);
					}
				}	
			 });
		}) 
    </script>   
	<style>
		.deleteIcon {
    		background-image: url('../../common/images/icons/delete.png');
    		background-position:center;
    		background-repeat:no-repeat;
			cursor:pointer;
    		width:20px;
    		height:20px;
		}
		
		.menubuttons.middle1 {
    		cursor: pointer !important;
    		border: 1px solid #fff;
    		background-color: #027FD1;
    		color: #fff;
		}
	</style>

    <cfoutput>
    <cfset PROCEDURES = createObject("component", "procedures")>
   	<cfset p5Report = PROCEDURES.getP5report(#session.p5.repairID#)>
   	<cfset parentInfo = PROCEDURES.getParentInfo(#session.p5.parentSerNo#)>
   	<cfset POCInfo = PROCEDURES.getPOCInfo()>
   	
   	<!--- WO4778 Making the POC Info dynamic. See CODE table with CODE_TYPE 'P5POC' --->
   	<cfset POCNAME1 = "">
   	<cfset POCNAME2 = "">
   	<cfset POCNUMBER1 = "">
   	<cfset POCNUMBER2 = "">
   	
   	<cfif POCInfo.recordcount GT 0>
   		<cfset POCNAME1 = listGetAt(POCINFO.CODE_VALUE,1)>
   		<cfset POCNUMBER1 = listGetAt(POCINFO.DESCRIPTION,1)>
   		<cfif (listlen(POCINFO.CODE_VALUE) GT 1)>
   			<cfset POCNAME2 = listGetAt(POCINFO.CODE_VALUE,2)>
   			<cfset POCNUMBER2 = listGetAt(POCINFO.DESCRIPTION,2)>
   		</cfif>
   	</cfif>
   	
   	<cfset StructDelete(Session,"p5")>
   	
    
    <div class="message #msgStatus#">#msg#</div>   
    <div class="headerContent">
        <div class="headerTitle">P5 Failure Report Form</div>
    </div>
    <div class="font12 mainContent">
        <form name="p5FailureForm" method="post" action="controller.cfm?action=exportP5" target="_blank" enctype="multipart/form-data">
        	<input type="submit" value="Export to PDF">
            <table class="two_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                    	<td class="section_header">
                    		(Section 1): Location & Shipping Information 
						</td>
					</tr>
                </tbody>
            </table>
            <table cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                    	<td class="column" align="right">
                    		<div class="formField">
                                <label class="form_field font10">Failure Report Date</label>                                 
                                <!---<input class="form_field font10" id="reportDate" type="text" name="reportDate" /> --->                                   
                    		</div>							
						</td>
                    	<td class="column">
                    		<div class="formField">
                                <!---<label class="font10" id="date_label">Failure Report Date</label> --->                                
                                <input class="form_field font10 calendar_field1" id="reportDate" type="text" name="reportDate" value="#DateFormat(NOW(),"dd-mmm-yyyy")#"/>                                    
                    		</div>							
						</td>						
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10">Where Did the Asset Originally Fail?</label>                               
                            </div>
						</td>	
                        <td class="column">
                           <!--- <div class="formField">                          
								<select id="failOrig" name="failOrig">
									<option value=""></option>
									<option value="eglin">Eglin AFB</option>
									<option value="hill">Hill AFB</option>
								</select>
							<div class="formField">  --->                            
								<input class="form_field font10" id="failOrig" type="text" name="failOrig" value="#P5report.display_name#" /> 
                            </div>								
                            </div>
						</td>										    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10">Asset Owners Branch</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="branch" type="text" name="branch" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            &nbsp;
						</td>	
                        <td class="column">
                            &nbsp;
						</td>											    	
				    </tr>				    
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font14">Ship to Address</label>                               
                            </div>
						</td>					    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Unit or Service Organization</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="unit" type="text" name="unit" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Parts "Sent to" Location</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="sentLoc" type="text" name="sentLoc" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Address Line 1</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="address1" type="text" name="address1" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Address Line 2</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="address2" type="text" name="address2" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >City</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="city" type="text" name="city" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >State</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="state" type="text" name="state" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Zip</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="zip" type="text" name="zip" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            &nbsp;
						</td>	
                        <td class="column">
                            &nbsp;
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Report Created by Name</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="createdBy" type="text" name="createdBy" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Report Created by Email</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="createdByEmail" type="text" name="createdByEmail" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            &nbsp;
						</td>	
                        <td class="column">
                            &nbsp;
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >POD Shop Key Contact Name</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="PODcontactName" type="text" name="PODcontactName" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >POD Shop Key Contact Phone</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="PODcontactPhone" type="text" name="PODcontactPhone" /> 
                            </div>
						</td>											    	
				    </tr>
                </tbody>
            </table> 
            <table class="two_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                    	<td class="section_header">
                    		(Section 2): System Information
						</td>
					</tr>
                </tbody>
            </table> 
            <table cellpadding="0px" cellspacing="0px">
                <tbody>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Government Job Number</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="jobNo" type="text" name="jobNo" value="#p5Report.old_job# #p5Report.repair_seq#" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Failure Occured On Date</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10 calendar_field1" id="failDate" type="text" name="failDate" value="#DateFormat(p5report.start_job,"dd-mmm-yyyy")#" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >DRS Failed Item Number</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="DRSItemNo" type="text" name="DRSItemNo" value="#p5report.partno#" /> 
                            </div>
						</td>											    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Failed Item Serial Number</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="serNo" type="text" name="serNo" value="#p5report.serno#" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Failed Item Description</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="desc" type="text" name="desc" value="#p5report.noun#" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Parent Item Type</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="parentType" type="text" name="parentType" value="#parentInfo.asset_type#" /> 
                            </div>
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Parent Item Serial Number</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="parentSerNo" type="text" name="parentSerNo" value="#parentInfo.serno#" /> 
                            </div>
						</td>											    	
				    </tr>					    	
				    <tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Aircraft Type</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="aircraftType" name="aircraftType">
									<option value=""></option>
									<option value="f_16">F-16</option>
									<option value="f_15">F-15</option>
								</select>--->
								<input class="form_field font10" id="aircraftType" type="text" name="aircraftType" />								
                            </div>
						</td>
					</tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Aircraft Variant</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="variant" name="variant">
									<option value=""></option>
									<option value="C">C</option>
									<option value="D">D</option>
								</select>--->
								<input class="form_field font10" id="variant" type="text" name="variant" />
                            </div>
						</td>
					</tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Aircraft Block</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="block" name="block">
									<option value=""></option>
									<option value="50">50</option>
								</select>--->
								<input class="form_field font10" id="block" type="text" name="block" />
                            </div>
						</td>
					</tr>
					<tr>	
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >POD Mounting Location</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="mountLoc" name="mountLoc">
									<option value=""></option>
									<option value="STA_9">STA-9</option>
								</select>--->
								<input class="form_field font10" id="mountLoc" type="text" name="mountLoc" />
                            </div>
						</td>
					</tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Rail Type</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="railType" name="railType">
									<option value=""></option>
									<option value="LAU_129">LAU_129</option>
								</select>--->
								<input class="form_field font10" id="railType" type="text" name="railType" />
                            </div>
						</td>																																		    	
				    </tr>	
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >When Incident Occured</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="whenOccured" name="whenOccured">
									<option value=""></option>
									<option value="sortie">During Sortie</option>
								</select>--->
								<input class="form_field font10" id="whenOccured" type="text" name="whenOccured" />
                            </div>
						</td>
					</tr>
					<tr>	
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >GPS Type</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="gps" name="gps">
									<option value=""></option>
									<option value="DIGS">DIGS</option>
								</select>--->
								<input class="form_field font10" id="gps" type="text" name="gps" />
                            </div>
						</td>
					</tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Key Status</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="keyStatus" name="keyStatus">
									<option value=""></option>
									<option value="keyed">Keyed</option>
								</select>--->
								<input class="form_field font10" id="keyStatus" type="text" name="keyStatus" />
                            </div>
						</td>																																		    	
				    </tr>	
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10">Key Type</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="keyType" name="keyType">
									<option value=""></option>
									<option value="m">Monthly</option>
								</select>--->
								<input class="form_field font10" id="keyType" type="text" name="keyType" />
                            </div>
						</td>																																		    	
				    </tr>	
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >ETM Reading (Hours)</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="etm" type="text" name="etm" value="#p5report.meter_in#" />
                            </div>
						</td>																																		    	
				    </tr>	
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Failed Item Effects to the Sortie</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="track" name="track">
									<option value=""></option>
									<option value="i">Itermittent Track During Sortie</option>
								</select>--->
								<input class="form_field font10" id="track" type="text" name="track" />
                            </div>
						</td>																																		    	
				    </tr>				    			    				    			    			    				    			    				    
				</tbody>
		   </table> 
            <table class="two_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                    	<td class="section_header">
                    		(Section 3): Detailed Description of the Incident or Failure
						</td>
					</tr>
                </tbody>
            </table> 
            <table cellpadding="0px" cellspacing="0px">
                <tbody>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Detailed Incident Report</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								 <textarea name="detail" rows="6" cols="50">#p5report.narrative#</textarea>      
			                </div>
						</td>																																		    	
				    </tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Incident Characteristics</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="chars" name="chars">
									<option value=""></option>
									<option value="bo">Failure is Detectable Both on Bench and Operation</option>
								</select>--->
								<input class="form_field font10" id="chars" type="text" name="chars" />
                            </div>
						</td>																																		    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            &nbsp;
						</td>	
                        <td class="column">
                            &nbsp;
						</td>											    	
				    </tr>				    
				    <tr>
                        <td class="column" colspan="2" align="left">
                            <div class="formField">
                                <label class="font14">If applicable > Select the CDU Screen(s) Where The Issues or Failures Were Displayed</label>                               
                            </div>
						</td>					    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
							ADIU_1&nbsp;&nbsp;<input type="checkbox" name="adiu_1"><br/>
							ADIU_2&nbsp;&nbsp;<input type="checkbox" name="adiu_2"><br/>
							ADIU_3&nbsp;&nbsp;<input type="checkbox" name="adiu_3"><br/>
							ADIU_4&nbsp;&nbsp;<input type="checkbox" name="adiu_4"><br/>
							ADIU_5&nbsp;&nbsp;<input type="checkbox" name="adiu_5"><br/>
							ADIU_6&nbsp;&nbsp;<input type="checkbox" name="adiu_6"><br/>
							ADIU_7&nbsp;&nbsp;<input type="checkbox" name="adiu_7">
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" colspan="2" align="left">
                            <div class="formField">
                                <label class="font14">Please List the Specific Indications on the CDU Screen, and / or End Cap Lamp</label>                               
                            </div>
						</td>					    	
				    </tr>				    
					<tr>
                        <td class="column">
                            &nbsp;
						</td>							
                        <td class="column">
                            <div class="formField">                              
								 <textarea name="indications" rows="6" cols="50"></textarea>      
			                </div>
						</td>																																		    	
				    </tr>	
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Issue Occurrence Frequency</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<!---<select id="frequency" name="frequency">
									<option value=""></option>
									<option value="i">Failure or Issue is Intermittent</option>
								</select>--->
								<input class="form_field font10" id="frequency" type="text" name="frequency" />
                            </div>
						</td>																																		    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            &nbsp;
						</td>	
                        <td class="column">
                            &nbsp;
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" colspan="2" align="left">
                            <div class="formField">
                                <label class="font14">Failure Follows Suspect Verification</label>                               
                            </div>
						</td>					    	
				    </tr>
				    <tr>
                        <td class="column" align="right">
                            &nbsp;
						</td>	
                        <td class="column">
                            &nbsp;
						</td>											    	
				    </tr>				    				    
				    <tr>
                        <td class="column" colspan="2" align="left">
                            <div class="formField">
                                <label class="font14">
									*Conduct test if: The test does not present a risk to personal safety<br/>
									and is not an obvious risk to the LRU or Test Equipment.<br/>
									>>> Install the suspect LRU into known good system to verify that the failure follows the LRU.
								</label>                               
                            </div>
						</td>					    	
				    </tr>	
				    <tr>
                        <td class="column" align="right">
                            &nbsp;
						</td>	
                        <td class="column">
                            &nbsp;
						</td>											    	
				    </tr>
				    <tr>
                        <td class="column" colspan="2" align="left">
                            <div class="formField">
                                <label class="font14">If the Failure or Issue does not follow the LRU then the item may not be bad.</label>                               
                            </div>
						</td>					    	
				    </tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Verification of Failure Following LRU</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<select id="lru" name="lru">
									<option value=""></option>
									<option value="Yes - Verified">Yes - Verified</option>
									<option value="No - Not Verified">No - Not Verified</option>
								</select>
                            </div>
						</td>																																		    	
				    </tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Enter Serial Number of 'Known Good' System</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="kgSerNo" type="text" name="kgSerNo" />
                            </div>
						</td>																																		    	
				    </tr>
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Was the Item an Out Of Box Failure?</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
									<select id="oob" name="oob">
									<option value=""></option>
									<option value="No-Item was not an Out Of Box Failure">No-Item was not an Out Of Box Failure</option>
									<option value="Yes-Item Does Not Meet Functional Requirements">Yes-Item Does Not Meet Functional Requirements</option>
									<option value="Yes-Item has Missing or Damaged Hardware">Yes-Item has Missing or Damaged Hardware</option>
									<option value="Yes-Item Was Damaged During Freight">Yes-Item Was Damaged During Freight</option>
								</select>
                            </div>
						</td>																																		    	
				    </tr>	
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Is this Issue or Failure a PQDR?</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
									<select id="pqdr" name="pqdr">
									<option value=""></option>
									<option value="No-Item is a Standard Field Failure Return">No-Item is a Standard Field Failure Return</option>
									<option value="Yes-Item is a PQDR">Yes-Item is a PQDR</option>
								</select>
                            </div>
						</td>																																		    	
				    </tr>				    			    					    					    				    				    			    				    			    			    				    				    			    	                	
                </tbody>
            </table>     
            <table class="two_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                    	<td class="section_header">
                    		(Section 4) DRS Shipment Requirements
						</td>
					</tr>
                </tbody>
            </table> 
            <table cellpadding="0px" cellspacing="0px">
                <tbody>
                	<tr>
                		<td class="column">
                			<ol>
                				<li>Complete the RMA / Failure Report Form</li><br/>
                				<li>Provide hardcopies inside the shipping package:
                					<ol type="a">
                						<li>The RMA / Replenishment Part Request Form</li>
                						<li>DD1149 for every item (Information on the form must be complete and match the Item numbers)</li>
                					</ol>
                				</li><br/>
                				<li>
                					DRS Ship To Address:<br/>
                					&nbsp;&nbsp;DRS Technologies, Inc.<br/>
									&nbsp;&nbsp;Attn: Depot & Warranty Program Managers<br/>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; #encodeForHTML(POCNAME1)#&nbsp;#encodeForHTML(POCNUMBER1)#<br/>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; #encodeForHTML(POCNAME2)#&nbsp;#encodeForHTML(POCNUMBER2)#<br/>
									&nbsp;&nbsp;640 Lovejoy Rd<br/>
									&nbsp;&nbsp;Ft Walton Beach, FL 32548
                				</li><br/>
                				<li>If the Return is a PQDR
                					<ol type="a">
                						<li>The package needs appropriate labeling on the exterior for DCMA attention</li>
                						<li>PQDR&apos;s must be shipped individually. They cannot be mixed with other returns in the same package</li>
                						<li>Attach one copy of DD1575 to the exterior of the package and insure that it states "To Be Opened In The Presence of a Government Representative"</li>
                					</ol>
                				</li>
                			</ol>	
                		</td>
                	</tr>
                </tbody>
            </table>                              		                                             			
        </form>
    </div>
	</cfoutput>
</RIMMS:layout>
