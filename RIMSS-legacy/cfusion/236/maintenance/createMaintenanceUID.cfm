<cfimport taglib="../layout" prefix="RIMSS"/>
<RIMSS:layout section="maintenance" showSubSection=false>
    <RIMSS:subLayout/>

<cfoutput>	
<div class="message #msgStatus#">#msg#</div>
</cfoutput>      
	   
<div class="headerContent" >
    <div class="headerTitle">UID Reader Input</div>
</div>
<div class="font12 mainContent">
	<form name="inputFromUID" id="inputFromUID" method="post" action="index.cfm" style="text-align:center">
		<table class="one_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                        <td colspan="1">
                            <div class="button_container">
                                 <input type="reset" name="btnReset" value="RESET" class="reset">
								 <textarea type="text" name="uids" id="uids" class="reader hidden" rows="25" cols="100"></textarea> <!---class="reader hidden"--->
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
	</form>	
</div>



<cfif not isNull(RC.qAssetLevels) and isQuery(RC.qAssetLevels)>
<!--- Output data in a topLevel/subLevel for SHOP users --->        
        <div class="mainContent">   
            <cfif RC.qAssetLevels.recordcount>
                
				   <form name="uiiAssetsForm" id="uiiAssetsForm" method="POST" action="index.cfm">	
	                       <table class="globalTable uiiAssetTable">
	                       	   <cfset counter = 1/>
	                      	   <cfoutput query="rc.qAssetLevels" group="nha_noun">
								 	 
		                           <tbody>
		                           <tr class="<cfif counter mod 2> odd <cfelse> even </cfif>">
		                               <td>
		                               	      <table class="globalTable topLevelTable">
		                               	      	<thead>
				                                    <tr>
				                                    	<th style="width:16px;">&nbsp;</td>
				                                        <th>Noun</th>
				                                        <th>Part No</th>
				                                        <th>Serial No</th>
				                                        <cfif ucase(trim(NHA_SYS_TYPE)) neq "PART">
				                                            <th>Assigned Loc</th>
				                                            <th>Current Loc</th>
				                                             
				                                        </cfif>
				                                        <th >Status</th> 
				                                        <th style="width:20px;" class="selectAll">Maint</th>
				                                    </tr>
				                                </thead>       
		                               	        <tbody>
		                               	          <tr>
			                               	          <td class="nowrap showSub" style="text-align:center;cursor:pointer;"></td>
													  <td class="nowrap">#encodeForHTML(NHA_NOUN)#</td>
				                                       <td class="nowrap">#encodeForHTML(NHA_PARTNO)#</td>
				                                       <td class="nowrap">#encodeForHTML(NHA_SERNO)#</td>
				                                       <cfif ucase(trim(NHA_SYS_TYPE)) neq "PART">
				                                           <td class="nowrap">#encodeForHTML(LOC_IDA)#</td>
				                                           <td class="nowrap">#encodeForHTML(LOC_IDC)#</td>
				                                       </cfif>
				                                       <td class="nowrap">#encodeForHTML(NHA_STATUS)#</td>
				                                       <td style="text-align:center;" ><input type="checkbox" name="uiiAsset"  class="topUiiAsset uiiAsset checkbox" id="uiiAsset_#encodeForHTML(nha_asset)#" value="#encodeForHTML(nha_asset)#" <cfif isDefined("form.uiiAsset") and listfindnocase(form.uiiAsset,nha_asset)>checked="checked"</cfif>></a></td>
		                               	           </tr> 
												   
												   <cfoutput group="nha_partno">
												   	   <cfset subCounter = 1>
													   	   <!--- Make sure the sub asset is not the same as the nha asset --->    
						                                   <tr class="sub">
						                                   	<td style="width:16px;">&nbsp;</td>
						                                        <td <cfif ucase(trim(NHA_SYS_TYPE)) neq "PART">colspan="7"<cfelse>colspan="5"</cfif>>
						                                            <table class="globalSubTable">
						                                               <thead>
						                                                <tr>
						                                                   
																			<th>SRA Noun</th>
						                                                    <th>SRA Part No</th>
						                                                    <th>SRA Serial No</th>
						                                                    <th>SRA Status</th>
						                                                    <th style="width:16px" class="selectTopAsset">Maint</th>
						                                                </tr>
						                                              </thead>
						                                              <tbody>
						                                                <cfoutput>
						                                                
				                                       					<cfif asset_id neq nha_asset>
						                                                 <tr class="<cfif subCounter mod 2> odd <cfelse> even </cfif>">
						                                                   
																		   <td class="nowrap">#encodeForHTML(NOUN)#</td>
						                                                   <td class="nowrap">#encodeForHTML(PARTNO)#</td>
						                                                   <td class="nowrap">#encodeForHTML(SERNO)#</td>
						                                                   <td class="nowrap">#encodeForHTML(STATUS)#</td>
						                                                   <td style="text-align:center;" ><input type="checkbox" name="uiiAsset"  class=" subUiiAsset uiiAsset checkbox" id="uiiAsset_#encodeForHTML(asset_id)#" value="#encodeForHTML(asset_id)#" <cfif isDefined("form.uiiAsset") and listfindnocase(form.uiiAsset,asset_id)>checked="checked"</cfif>></a></td>
						                                                 </tr>  
						                                                 <cfset subCounter++/>
					                                   					</cfif>
						                                               </cfoutput>
						                                              </tbody>  
						                                            </table>
						                                        </td>
						                                   </tr> 
														   
					                                   
				                                   </cfoutput> 
												</tbody>	

		                               	      </table>
										
										</td>
									   
		                           </tr>
								   
								   </tbody>
								   <cfset counter++/>
								   </cfoutput>
                                </table>    
	                   
					   <div class="columnContent">
                            <div class="formField button_container">
                            	<input type="hidden" id="assets" name="assets" value="" />
                                <input type="submit" value="CREATE" name="btnCreate" id="btnCreate" />
                                
                            </div>
                        </div>
				   </form>
                
            <cfelse>
                <div class="global_notice_msg">No Data Found</div>
            </cfif>
        </div>
		
<cfelseif not isNull(RC.qUIIAssets) and isQuery(RC.qUIIAssets)>	
<!--- Output data in a asset list for DEPOT users --->
        <div class="mainContent">   
            <cfif RC.qUIIAssets.recordcount>
			<form name="uiiAssetsForm" id="uiiAssetsForm" method="POST" action="index.cfm">	
			<table class="globalTable">
				<tbody>
					<tr>
						<td>
			                <cfoutput>
			                   <table class="globalTable" id="uiiAssetsTable">
			                      
								  <thead>
			                        <tr>
			                            <th>Noun</th>
			                            <th>Part No</th>
			                            <th>Serial  No</th>
										<th class="loc" >Assigned Loc</th>
										<th class="loc" >Current Loc</th>
										<th>Status</th>
			                            <th style="width:16px;cursor:pointer" class="selectAll">Maint</th>
			                            
			                        </tr>
			                      </thead>
			                      <tbody>
			                      <cfloop query="rc.qUIIAssets"> 
			                           <tr class="<cfif currentrow mod 2> odd <cfelse> even </cfif> #encodeForHTML(lcase(trim(SYS_TYPE)))#">
			                               <td class="nowrap">#encodeForHTML(NOUN)#</td>
										   <td class="nowrap">#encodeForHTML(PARTNO)#</td>
			                               <td class="nowrap">#encodeForHTML(SERNO)#</td>
										   <cfif ucase(trim(SYS_TYPE)) neq "PART">
											   <td class="nowrap">#encodeForHTML(LOC_IDA)#</td>
											   <td class="nowrap">#encodeForHTML(LOC_IDC)#</td>
										   </cfif>
										   <td class="nowrap">#encodeForHTML(STATUS)#</td>
										   <td style="text-align:center;" ><input type="checkbox" name="uiiAsset"  class="uiiAsset checkbox" id="uiiAsset_#encodeForHTML(asset_id)#" value="#encodeForHTML(asset_id)#" <cfif isDefined("form.uiiAsset") and listfindnocase(form.uiiAsset,asset_id)>checked="checked"</cfif>></a></td>
			                           </tr>
			                       </cfloop>
			                      </tbody>
			                   </table>
							   </tbody>
						   </td>
					   </tr>
				   </table>
                </cfoutput>
                <div class="columnContent">
                    <div class="formField button_container">
                    	<input type="hidden" id="assets" name="assets" value="" />
                        <input type="submit" value="CREATE" name="btnCreate" id="btnCreate" />
                        
                    </div>
                </div>
	  		</form>
            <cfelse>
                <div class="global_notice_msg">No Data Found</div>
            </cfif>
      </div>
</cfif>
<script>

        try {
            $(document).ready(function(){
                $('textarea.reader').focus();
                
                //Setup UID Reader to wait for reader data
                setupUIDReader();
                
                $('.reset').click(function(event) {
                    event.preventDefault();
                    resetForm($(this).closest('form'));
                    $('textarea.reader').focus();
                });
                
				//setupHighlight();
                
                $('.selectAll').on("click",function(){
                    
                    if($(this).hasClass("allSelected")){
                       $('.checkbox').removeAttr("checked");
                       $(this).removeClass("allSelected");  
                    }else{
                       $('.checkbox').attr("checked","checked");
                       $(this).addClass("allSelected"); 
                    }
                });
				
				$('.subUiiAsset').on("click",function(){
                    
                    if($(this).is(':checked')){
					    $(this).closest("table.topLevelTable").find("tbody tr td input.topUiiAsset").attr("checked","checked");
                    }else{
						var checkedSubUii = $(this).closest("tbody").find(".subUiiAsset:not(:checked)").length;
						var allSubUii = $(this).closest("tbody").find(".subUiiAsset").length;
						if(checkedSubUii==allSubUii){
						  $(this).parents("table").find(".topUiiAsset").removeAttr("checked");	
						}
						
					}

                });
				
				$('.topUiiAsset').on("click",function(){
					if ($(this).is(":checked")) {
						$(this).closest("tbody").find("tr.sub").find('table.globalSubTable tbody tr td input.subUiiAsset').attr("checked","checked");
					}else{
						$(this).closest("tbody").find("tr.sub").find('table.globalSubTable tbody tr td input.subUiiAsset').removeAttr("checked");
					}
				
				});
				
				$('#btnCreate').on("click", function(){				
					if($("input:checked").length==0){
						return false;
					}
								
					var assets = new Array();
					$("input:checked").each(function(){
						assets.push($(this).val());
					});
					$("#assets").val(assets);
					
					$(this).setActionMethod("insert.maintenance.uid","doAction");
				});
				
				$('.showSub').on("click",function(){
					if($(this).closest("tbody").find("tr.sub").length){
					    if($(this).closest("tbody").find("tr.sub").is(":visible")){
						   $(this).closest("tbody").find("tr.sub").hide();
						   $(this).removeClass("open").addClass("close");	
						}else{
							$(this).closest("tbody").find("tr.sub").show();
	                       $(this).removeClass("close").addClass("open");  
						}
					}	
				});
				
				$('table.globalSubTable').closest("tbody").find("tr td.showSub").addClass("open");
				
				$('tr.part').closest("table").find("thead th.loc").hide();
                
            });

        }catch(err){}
        
        
    </script>
</RIMSS:layout>

