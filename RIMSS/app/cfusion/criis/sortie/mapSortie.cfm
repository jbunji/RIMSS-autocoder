<cfimport taglib="../layout" prefix="RIMSS"/>
<RIMSS:layout section="sorties">
    <RIMSS:subLayout/>
    <script src = "../layout/js/import.js"></script>
	<cfsilent>
        <cfif Structkeyexists(form,"upload")>
        <cfset form.filePath = (Structkeyexists(form,"upload")) ? form.upload.getTemporaryFile():""/>
        <cfset form.header = (Structkeyexists(form,"upload")) ? form.upload.getHeader():""/>
        <cfset form.type = (Structkeyexists(form,"upload")) ? form.upload.getType():""/>
        <cfset form.importArray = (Structkeyexists(form,"upload")) ? form.upload.getItems():[]/>
        <cfset form.importColumns = (Structkeyexists(form,"upload")) ? form.upload.getColumns():[]/>
        <!---<cfset form.importSummary = (Structkeyexists(form,"upload")) ? form.upload.getSummary():""/>--->
        <cfif arraylen(form.importArray)>
          <cfparam name="form.sortieCurrentItem" default="#form.importArray[1]#"/>
        </cfif>
        <cfparam name="form.sortieUser" default="#ucase(trim(application.sessionManager.getUserName()))#"/>
        <cfparam name="form.sortieUnit" default="#ucase(trim(application.sessionManager.getUnitSetting()))#"/>
        <cfparam name="form.sortieProgram" default="#ucase(trim(application.sessionManager.getProgramSetting()))#"/>
        
        </cfif>
    </cfsilent>
    
    <!---<cfoutput>
        <script>
            setInstanceProgram('#lcase(trim(application.sessionManager.getProgramSetting()))#');
            setInstanceUnit('#application.sessionManager.getUnitSetting()#');
        </script>
    </cfoutput>--->

        <cfoutput>
       <div class="message #msgStatus#">#msg#</div>
	   
	   <div class="headerContent" >
	        <div class="headerTitle">Map Sortie</div>
	    </div>
	   
        <form name="mappingsForm" id="mappingsForm">
            <input type="hidden" name="filePath" readonly="readonly" id="filePath" <cfif Structkeyexists(form,"filePath")>value = "#encodeForHTML(trim(form.filePath))#"</cfif>>
            <input type="hidden" name="sortieUser" readonly="readonly" id="sortieUser" <cfif Structkeyexists(form,"sortieUser")>value = "#encodeForHTML(UCASE(TRIM(form.sortieUser)))#"</cfif>>
            <input type="hidden" name="sortieUnit" readonly="readonly" id="sortieUnit" <cfif Structkeyexists(form,"sortieUnit")>value = "#encodeForHTML(UCASE(TRIM(form.sortieUnit)))#"</cfif>>
            <input type="hidden" name="sortieProgram" readonly="readonly" id="sortieProgram" <cfif Structkeyexists(form,"sortieProgram")>value = "#encodeForHTML(UCASE(TRIM(form.sortieProgram)))#"</cfif>>
            <input type="hidden" name="sortieCurrentItem" readonly="readonly" id="sortieCurrentItem" <cfif Structkeyexists(form,"sortieCurrentItem")>value = "#encodeForHTML(TRIM(form.sortieCurrentItem))#"</cfif>>
            <input type="hidden" name="type" readonly="readonly" id="sortieImportType" <cfif Structkeyexists(form,"type")>value = "#encodeForHTML(trim(form.type))#"</cfif>>
            <table  class="tblImport">
                <tr>
                    <th  class="columnItems"><cfif Structkeyexists(form,"header")><cfoutput>#header#</cfoutput></cfif></th>
                    <th class="columnMappings">&nbsp;</th>
                </tr>
                <tr>
                   <td valign="top" class="columns" >
                       <div class="columnListing">
                           
                           <ul class="importListing">
    
                               <cfif Structkeyexists(form,"importArray") and isArray(form.importArray)>             
                                   <cfloop from="1" to="#ArrayLen(form.importArray)#" index="s">
                                       <li class="<cfif s eq 1>selected rightArrow </cfif> <cfif isDefined('form.type')>#encodeForHTML(lcase(trim(form.type)))#</cfif>" id="#s#">#encodeForHTML(trim(form.importArray[s]))#</li>
                                   </cfloop>
                               </cfif>
    
                           </ul>
                       </div>  
                   </td>    
                   <td valign="top">
                      <table class="tblColumns">
                          <tr>
                            <th><cfif isDefined('form.type')>#encodeForHTML(trim(form.type))#</cfif> Columns</th>
                            <th>&nbsp;</th>
                            <th>Sortie Columns</th>
                          </tr>
                          <tr>
                              <td valign="top">
                                 <select  class="mapColumns" name="importColumns" id="importColumns" size="15" >
                                   
                                       
                                       <cfif Structkeyexists(form,"importColumns") and isArray(form.importColumns)>
                                           <cfloop from="1" to="#ArrayLen(form.importColumns)#" index="c">
                                               <cfif len(trim(form.importColumns[c]))>
                                                    <option value="#c#">#encodeForHTML(trim(form.importColumns[c]))#</option>
                                               </cfif>
                                           </cfloop>
                                       
                                       </cfif>
                                   
                                 </select>
                              </td>
                              
                              <td>      
                                <input type="button" class="mapColumns" id="btnMapColumns" value="<=>"/>
                              </td> 
                              <td valign="top">  
                                  <select  class="mapColumns" name="sortieColumns" id="sortieColumns" size="15" >
                                       <cfif isDefined("form.rampodColumns") and isArray(form.rampodColumns)>
                                           <cfloop from="1" to="#ArrayLen(form.rampodColumns)#" index="s">
                                               <cfif len(trim(form.rampodColumns[s]))>
                                                    <option value="#s#">#encodeForHTML(trim(form.rampodColumns[s]))#</option>
                                               </cfif>    
                                           </cfloop>
                                       </cfif>
                                 </select>  
                              </td> 
                         </tr>        
                     </table>   
                   </td>
                    
                </tr>
                <tr>
                   <td valign="top" class="columns" colspan="2" >
                   	    <div id="mappingButtons" class="button_container" style="margin:5px;" >
		                     <input type="button" name="loadMapping" id="loadMapping" value="Load Mapping"> 
		                     <input type="button" name="saveMapping" id="saveMapping" class="mappingData" disabled="disabled" value="Save Mapping"> 
		                     <input type="button" name="import" id="saveSortieImport" class="mappingData" disabled="disabled" value="Import to Dest."> 
		                </div>
				   </td>
			    </tr>
            </table>
            
            <div id="mappingsInfo" style="margin-top:5px;">
                <div class="listMappings">
                    <table class="tblMappings" id="tblMappings">
                        <thead>
                        <tr>
                            <th>Auto Fill<br/><input type="checkbox" name="selectAll" id="selectAll"></th>
                            <th><cfif isDefined("form.type")>#encodeForHTML(trim(form.type))#</cfif> Columns</th>
                            <th>Sortie Columns</th>
                            <th>Constant Value</th>
                            <th>&nbsp</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                        
                    </table>
                    
                </div>
                <div class="resetMappings button_container">
                  <input type="button" name="removeAllMappings" id="removeAllMappings" value="Reset Mappings"/>
                  <input type="hidden" readonly="readonly" id="idx" value="0">
                </div>
				
				<cfoutput>
				<div id="importResults" style="display:none;padding:5px;">
					<table class="tblImport" width="175px;">
						<tr>
							<th colspan="2" class="columnItems">Sortie Import Results</th>
							
						</tr>
						<tr>
							<td class="columns" style="text-align:right">Processed:</td>
							<td id="sortieImportProcessed" class="columns" style="font-weight:bold;color:green;text-align:left"></td>
						</tr>
						<tr>
                            <td class="columns" style="text-align:right">Constraints:</td>
                            <td class="columns" id="sortieImportConstraints" style="font-weight:bold;color:red;text-align:left" ></td>
                        </tr>
						<tr>
                            <td class="columns" style="text-align:right">Total:</td>
                            <td class="columns" id="sortieImportTotal" style="font-weight:bold;color:blue;text-align:left"></td>
                        </tr>
					</table>					
					
				</div>
				
				<div id="failureResults" style="display:none;margin-top:5px;">
					<table class="tblMappings" id="tblFailureResults">
						<thead>
							<tr>
								<th colspan="4" class="columnItems" style="font-weight:bold;">Failure Results</th>
							</tr>
							<tr>
								<th>Mission ID</th>
								<th>Serno</th>
								<th>Mission Date</th>
								<th>Error Type</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
				</cfoutput>
            </div>
            
        </form>
        </cfoutput>
        
</RIMSS:layout>
