
<cfimport taglib="../layout" prefix="RIMMS"/>
<cfsetting showdebugoutput="true" >

<cfset exportDate = DateFormat(now(), 'YYYYMMDD')>

    <cfset PROCEDURES = createObject("component", "procedures")>
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

<cfsavecontent variable="content" >
	<!--- WO4767 - HD-726 - JJP - Added header to force saving as .pdf --->
	<cfheader name="Content-Disposition" value="attachment;filename=CUI_P5_FAILURE_REPORT_#EncodeForHTML(exportDate)#.pdf">

	<cfoutput>	
	<div align="center" style="font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
		*****CONTROLLED UNCLASSIFIED INFORMATION*****
	</div>	
	<br/>
    <div class="headerContent">
        <div class="headerTitle">P5 Failure Report Form</div>
    </div>	<br/>
    <div >
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
                    		</div>							
						</td>
                    	<td class="column">
                    		<div class="formField">                               
                                <input class="form_field font10" id="reportDate" type="text" name="reportDate" value="#session.p5.reportDate#"/>                                    
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
								<input class="form_field font10" id="failOrig" type="text" name="failOrig" value="#session.p5.failorig#" /> 
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
								<input class="form_field font10" id="branch" type="text" name="branch" value="#session.p5.branch#" /> 
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
								<input class="form_field font10" id="unit" type="text" name="unit" value="#session.p5.unit#" /> 
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
								<input class="form_field font10" id="sentLoc" type="text" name="sentLoc" value="#session.p5.sentLoc#" /> 
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
								<input class="form_field font10" id="address1" type="text" name="address1" value="#session.p5.address1#" /> 
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
								<input class="form_field font10" id="address2" type="text" name="address2" value="#session.p5.address2#" /> 
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
								<input class="form_field font10" id="city" type="text" name="city" value="#session.p5.city#" /> 
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
								<input class="form_field font10" id="state" type="text" name="state" value="#session.p5.state#" /> 
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
								<input class="form_field font10" id="zip" type="text" name="zip" value="#session.p5.zip#" /> 
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
								<input class="form_field font10" id="createdBy" type="text" name="createdBy" value="#session.p5.createdby#" /> 
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
								<input class="form_field font10" id="createdByEmail" type="text" name="createdByEmail" value="#session.p5.createdbyemail#" /> 
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
								<input class="form_field font10" id="PODcontactName" type="text" name="PODcontactName" value="#session.p5.podcontactname#" /> 
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
								<input class="form_field font10" id="PODcontactPhone" type="text" name="PODcontactPhone" value="#session.p5.podcontactphone#" /> 
                            </div>
						</td>											    	
				    </tr>
                </tbody>
            </table> <br/>
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
								<input class="form_field font10" id="jobNo" type="text" name="jobNo" value="#session.p5.jobno#" /> 
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
								<input class="form_field font10 calendar_field1" id="failDate" type="text" name="failDate" value="#session.p5.failDate#" /> 
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
								<input class="form_field font10" id="DRSItemNo" type="text" name="DRSItemNo" value="#session.p5.drsitemno#" /> 
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
								<input class="form_field font10" id="serNo" type="text" name="serNo" value="#session.p5.serno#" /> 
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
								<input class="form_field font10" id="desc" type="text" name="desc" value="#session.p5.desc#" /> 
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
								<input class="form_field font10" id="parentType" type="text" name="parentType" value="#session.p5.parentType#" /> 
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
								<input class="form_field font10" id="parentSerNo" type="text" name="parentSerNo" value="#session.p5.parentSerNo#" /> 
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
								<input class="form_field font10" id="aircraftType" type="text" name="aircraftType" value="#session.p5.aircraftType#" />
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
								<input class="form_field font10" id="variant" type="text" name="variant" value="#session.p5.variant#" />
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
								<input class="form_field font10" id="block" type="text" name="block" value="#session.p5.block#" />								
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
								<input class="form_field font10" id="mountLoc" type="text" name="mountLoc" value="#session.p5.mountLoc#" />
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
								<input class="form_field font10" id="railType" type="text" name="railType" value="#session.p5.railType#" />
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
								<input class="form_field font10" id="whenOccured" type="text" name="whenOccured" value="#session.p5.whenOccured#" />								
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
								<input class="form_field font10" id="gps" type="text" name="gps" value="#session.p5.gps#" />	
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
								<input class="form_field font10" id="keyStatus" type="text" name="keyStatus" value="#session.p5.keyStatus#" />
                            </div>
						</td>																																		    	
				    </tr>	
					<tr>
                        <td class="column" align="right">
                            <div class="formField">
                                <label class="font10" >Key Type</label>                                
                            </div>
						</td>	
                        <td class="column">
                            <div class="formField">                              
								<input class="form_field font10" id="keyType" type="text" name="keyType" value="#session.p5.keyType#" />
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
								<input class="form_field font10" id="etm" type="text" name="etm" value="#session.p5.etm#" />
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
								<input class="form_field font10" id="track" type="text" name="track" value="#session.p5.track#" />
                            </div>
						</td>																																		    	
				    </tr>				    			    				    			    			    				    			    				    
				</tbody>
		   </table> <br/>
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
								 <!---<textarea name="detail" rows="6" cols="50">#Replace(session.p5.detail, chr(13) & chr(10), "<br />")#</textarea>---> 
								 <p>
								 	#session.p5.detail#
								 </p>     
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
								<input class="form_field font10" id="chars" type="text" name="chars" value="#session.p5.chars#" />
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
							ADIU_1&nbsp;&nbsp;<input type="checkbox" name="adiu_1" <cfif session.p5.adiu_1>checked</cfif>><br/>
							ADIU_2&nbsp;&nbsp;<input type="checkbox" name="adiu_2" <cfif session.p5.adiu_2>checked</cfif>><br/>
							ADIU_3&nbsp;&nbsp;<input type="checkbox" name="adiu_3" <cfif session.p5.adiu_3>checked</cfif>><br/>
							ADIU_4&nbsp;&nbsp;<input type="checkbox" name="adiu_4" <cfif session.p5.adiu_4>checked</cfif>><br/>
							ADIU_5&nbsp;&nbsp;<input type="checkbox" name="adiu_5" <cfif session.p5.adiu_5>checked</cfif>><br/>
							ADIU_6&nbsp;&nbsp;<input type="checkbox" name="adiu_6" <cfif session.p5.adiu_6>checked</cfif>><br/>
							ADIU_7&nbsp;&nbsp;<input type="checkbox" name="adiu_7" <cfif session.p5.adiu_7>checked</cfif>>
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
								 <!---<textarea name="indications" rows="6" cols="50">#session.p5.indications#</textarea> --->  
								 <p>
								 	#session.p5.indications#	
								 </p>   
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
								<input class="form_field font10" id="frequency" type="text" name="frequency" value="#session.p5.frequency#" />
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
								<input class="form_field font10" id="lru" type="text" name="lru" value="#session.p5.lru#" />
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
								<input class="form_field font10" id="kgSerNo" type="text" value="#session.p5.kgserno#" name="kgSerNo" />
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
								<input class="form_field font10" id="oob" type="text" name="oob" value="#session.p5.oob#" />
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
								<input class="form_field font10" id="pqdr" type="text" name="pqdr" value="#session.p5.pqdr#" />
                            </div>
						</td>																																		    	
				    </tr>				    			    					    					    				    				    			    				    			    			    				    				    			    	                	
                </tbody>
            </table> <br/>    
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
            </cfoutput>
            <br/>
            <div align="center" style="font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
				*****CONTROLLED UNCLASSIFIED INFORMATION*****
			</div>				
</cfsavecontent>
	
<cfset StructDelete(Session,"p5")>

<cfdocument format="pdf" encryption="NONE">
	<!---<cfdocumentsection>--->
		<html> 
		    <head>      
		        <style>
		        	<cfoutput>	
		        		<cfinclude template="../../criis/layout/css/default.css" />
		            	<cfinclude template="../../criis//layout/css/content.css" />
		            </cfoutput>
		        </style>
		    </head>
		    <body>		
				<cfoutput>#paragraphFormat(content)#</cfoutput>
			</body>
		</html>
	<!---</cfdocumentsection>--->
</cfdocument>