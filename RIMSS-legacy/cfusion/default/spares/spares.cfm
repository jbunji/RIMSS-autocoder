<cfsilent>
	<cfimport taglib="../layout" prefix="RIMSS"/>
	<cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
	<cfset dbUtils = application.objectFactory.create("DBUtils") />
    <cfset spareNouns = dropDownUtilities.getNouns(program = APPLICATION.sessionmanager.getProgramSetting()) />
	
	
	<!---<cfset sparePartNouns = dropDownUtilities.getPartsByNounPart(programId = APPLICATION.sessionmanager.getProgramIdSetting(),partno = "SDAD-38-A10") />
    ---><cfsetting showdebugoutput="false" >
	
	
</cfsilent>


<RIMSS:layout section="spares">
    <RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<style>
		.disable{
			opacity:0.5;
			color:gray;
		}
	</style>
	<script>
        try {
            $(document).ready(function(){
                //setupEditHighlight();
                setupHighlight();
				
				
                $('#btnSearch').on("click",function(){
                    $(this).closest("form").setActionMethod("list.spares","forward");
                });
				
				$('#spareNouns').on("change keyup",function(){
                    $(this).closest("form").setActionMethod("list.spares","forward");
					$(this).closest("form").submit();
                });
				
				$('#btnAdd').on("click",function(){
                    $(this).closest("form").setActionMethod("add.spare","forward");
                });
				
				$('.deleteIcon').on("click",function(event){
                    if (removeConfirmation()) {
                        $(this).closest("form").setActionMethod("delete.spare", "forward");
                    }else{
						event.preventDefault();
						return false;
						
					}
                });
				
				
                $('#dtSearch').on('keyup',function(e){
                    dt.fnFilter($(this).val());
                   });
                
                //Add Data Table
                var dt = $('#sparesTable').dataTable({ 
                      "bFilter": true,
                      "sDom":"t"
               });

               modifyDTColumns();
			   
            });
            
			
        }catch(err){}

    </script>
	
	
	<cfoutput>
       <div class="message #msgStatus#">#msg#</div>
    </cfoutput>
    <div class="headerContent">
        <div class="headerTitle">List Spares</div>
    </div>
    
	<div class="font12 mainContent">
        <form id="searchSpares" name="searchSpares" method="post" action="index.cfm?action=list.spares">
            <table class="two_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                            <td class="column">
                                <div class="columnContent" style="text-align:center">
                                    <div class="formField">
                                        <label class="font10" id="asset_id_label">Noun:</label> 
                                        <cfoutput>
                                            <select name="spareNouns" id="spareNouns" >
                                            	<option value=""></option>
												<cfif isDefined("spareNouns") and isQuery(spareNouns)>
													<cfloop query="spareNouns">
														<option <cfif Structkeyexists(form,"spareNouns") and UCASE(TRIM(form.spareNouns)) eq UCASE(TRIM(NOUN))>selected="selected"</cfif>  value="#encodeForHTML(noun)#">#encodeForHTML(noun)#</option>
													</cfloop>
												</cfif>
												
                                            </select>
                                        </cfoutput>
                                        <!---<span class="button_container">
                                        <input type="submit" value="SEARCH" name="btnSearch" id="btnSearch" />
                                        </span>--->
									</div>
                                </div>
                            </td>
                            
                    </tr>
                    <tr>
                            <td class="column" colspan="2">
                                <div class="columnContent">
                                    <div class="formField button_container">
                                        <input type="submit" value="ADD" name="btnAdd" id="btnAdd" />
                                    </div>
                                </div>
                            </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
	<cfif isDefined("rc.qSpares")>			
			
		<div class="mainContent">  
			<cfif rc.qSpares.count()>
			<form id="searchSparesResults" name="searchSparesResults" method="post" action="index.cfm">
			   <table class="globalTable" id="sparesTable">
			         <thead>
			         	<tr>
							<th colspan="13" class="filter">
								<cfoutput><cfif rc.qSpares.count() gt 1> <div style="float:left">Spares Count: #rc.qSpares.count()#</div></cfif></cfoutput>
                              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
                            </th>
                        </tr>
			         	<tr>
			         		<th class="noSort">&nbsp;</th>
							<th>Spare Noun</th>
							<th>Spare Part Number</th>
							<th>Spare Serial Number</th>
							<th>Status</th>
							<th>Warranty Exp</th>
							<th>Location</th>
							<th>Depot</th>
							<th>Software Number/Title</th>
							<th>Remarks</th>
							<th class="noSort">&nbsp;</th>
							<th class="noSort admin">&nbsp;</th>
			         	</tr>
						
			         </thead>
				   <tbody> 	     	
			       <cfoutput>
				   <cfloop condition="#rc.qSpares.next()#">
				   	   
				   	   <cfset swQry = #dbUtils.getSoftwareByAssetId(val(rc.qSpares.getAssetId()))# />
				   	   
				   	   <cfset warrantyDate = isDate(rc.qSpares.getMfgDate()) ? UCASE(TRIM(DateFormat(rc.qSpares.getMfgDate(),"dd-mmm-yyyy"))) : ""/>    
				        <tr class="<cfif rc.qSpares.getCursor() mod 2> odd <cfelse> even </cfif> <cfif rc.qSpares.getIsOrdered() EQ 'Y'>disable</cfif>">
                            <td class="edit editIcon"><cfif rc.qSpares.getIsOrdered() EQ 'N'><a href="index.cfm?action=edit.spare&spareAsset=#rc.qSpares.getEncryptedAssetId()#"></a></cfif></td>
                            <td>#encodeForHTML(trim(rc.qSpares.getNoun()))#</td>
                            <td>#encodeForHTML(trim(rc.qSpares.getPartNo()))#</td>
                            <td>#encodeForHTML(trim(rc.qSpares.getSerNo()))#</td>
                            <td>#encodeForHTML(trim(rc.qSpares.getStatus()))#</td>
							<td>#encodeForHTML(trim(warrantyDate))#</td>
                            <td>#encodeForHTML(trim(rc.qSpares.getCurrentLoc()))#</td>
							<td>#encodeForHTML(trim(rc.qSpares.getDepotLoc()))#</td>
							<td>
								<cfif swQry.recordcount GT 0>
									<ul>
										<cfloop query="swQry">
											<li>#encodeForHTML(sw_number)# / #encodeForHTML(sw_title)#</li>																	
										</cfloop>
									</ul>
								</cfif>		
							</td>
							<td>	
								#encodeForHTML(trim(rc.qSpares.getRemarks()))#		
							</td>
							<td class="add addIcon"><cfif rc.qSpares.getIsOrdered() EQ 'N'><a href="index.cfm?action=add.like.spare&spareAsset=#rc.qSpares.getEncryptedAssetId()#"></a></cfif></td>
							<td class="delete deleteIcon admin"><cfif rc.qSpares.getIsOrdered() EQ 'N'><a href="index.cfm?action=delete.spare&spareAsset=#rc.qSpares.getEncryptedAssetId()#"></a></cfif></td>
                        </tr>	   
				   </cfloop>
				   </cfoutput>
				   </tbody>
		   	   </table>
			   </form>
			<cfelse>
                <div class="global_notice_msg">No Data Found</div>   
			</cfif>
		</div>	

	</cfif>
</RIMSS:layout>