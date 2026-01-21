<cfparam name="rc.assetid" default="0"/>
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
<cfsilent>
	<cfif isDefined('rc') and not structKeyExists(rc,'nhaassetid')>
		<cflocation url="configuration.cfm" addtoken="false" >
	</cfif>
</cfsilent>

<RIMSS:layout section="configuration">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<script src = "../layout/js/configuration.js"></script>
	
<script type="text/javascript">
        $(function() {
			setupSRANounLookupDialog();
			setupSRAAssetLookupDialog();
			setupAddSNDialog();
			
			$('#btnDelete').click(function(e){
				$(this).setAction('remove.sra');
				var c = confirm("Are you sure you want to remove this LRU?");
				if (c) {
					return true;
				}else{
					return false;
				}
				return false;
			});
			$('#btnInsert').click(function(e){
				$(this).setAction('create.configuration');
				//return false;
			});
			
			$('#btnReset').click(function(e){
				$(this).setAction('new.configuration');
				//return false;
			});		
        });     
    </script>
	
	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle" >Add Sub Assembly</div>
    </div>
	
	<div class="mainContent">
		<form id="editConfig" name="editConfig" method="post" action="<cfoutput>index.cfm</cfoutput>">
		<input type="hidden" id="LRU" name="LRU" value="true"/>
		<table class="three_column_table" cellpadding="0px" cellspacing="0px" style="">
			<tbody>
			<tr>
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="asset_id_label" for="serno"> SERNO:</label> 
	                        <cfoutput><cfif StructKeyExists(rc,'assetObj')>#rc.assetObj.getSerno()#</cfif>
							<input type="hidden" id="nhaassetId" name="nhaassetId" <cfif StructKeyExists(rc,'assetObj')>value="#htmlEditFormat(trim(rc.assetObj.getAssetID()))#"</cfif>/>
	                        <input class="form_field required_form_field font10" id="serno" type="hidden" name="serno" <cfif StructKeyExists(rc,'assetObj')>value="#htmlEditFormat(trim(rc.assetObj.getSerno()))#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>
				</td>
				<td class="column">
					<div class="columnContent">
					<div class="formField">
                        <label class="font10" id="partno_id_label" for="partno">P/N:</label>
                        <cfoutput>
						<input type="hidden" id="partnoId" name="partnoId" <cfif StructKeyExists(rc,'partListObj')>value="#htmlEditFormat(trim(rc.partListObj.getPartnoID()))#"</cfif>  />
						<cfif StructKeyExists(rc,'partListObj')>#rc.partListObj.getPartno()#</cfif>
                        <input class="form_field required_form_field font10" id="partno" type="hidden" name="partno" <cfif StructKeyExists(rc,'partListObj')>value="#htmlEditFormat(trim(rc.partListObj.getPartno()))#"</cfif> readonly="readonly" />
						</cfoutput>
					</div>
					</div>
					
				</td>
				<td class="column">
					
					<div class="columnContent">
						<div class="formField">
	                       SYS TYPE:
							<cfoutput>
							<cfif StructKeyExists(rc,'codeObj')>#rc.codeObj.getCodeValue()#</cfif>
							<input class="form_field required_form_field font10" id="systype" type="hidden" name="systype" <cfif StructKeyExists(rc,'codeObj')>value="#rc.codeObj.getCodeValue()#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>

				</td>
			</tr>
			
			
			<tr>
				<td class="column">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="sranoun"><span class="font10">&nbsp;</span>SUB NOUN:</label>
                            <cfoutput>
                            <input class="form_field font10" id="sranoun" type="text" name="sranoun" value="" readonly="readonly" />
							</cfoutput>
							<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRANounsDialog.cfm" class="lookup" id="lookup_sra_noun_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
						</div>
					</div>
                </td>	
				
				<td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_serno_label" for="sraserno"><span class="font10">&nbsp;</span>SUB SERNO:</label>
                            <cfoutput>
                            <input class="form_field font10" id="sraserno" type="text" name="sraserno" readonly="readonly" />
							<input type="hidden" id="assetid" tabindex="-1" name="assetid" value="">
							<input type="hidden" id="newpartnoId" name="newpartnoId" value="" />
							</cfoutput>
							<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRAAssetByNounDialog.cfm" class="lookup" id="lookup_sra_asset_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
							<span  class="addIcon"><cfoutput><a id="btnAddSerno" href="addSerno.cfm"><img src="#application.rootpath#/common/images/icons/add.png"/></a></cfoutput></span>
						</div>
					</div>
                </td>
				</tr>
				<tr>
				<td class="column">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="srapartno"><span class="font10">&nbsp;</span>SUB PARTNO:</label>
                            <cfoutput>
                            <input class="form_field font10 noBackground" id="srapartno" type="text" name="srapartno" readonly="readonly"/>
							<input class="form_field font10 noBackground" id="srapartnoid" type="hidden" name="srapartnoid" />
							</cfoutput>
						</div>
					</div>
                </td>
				
				<td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="sransn"><span class="font10">&nbsp;</span>SUB NSN:</label>
                            <cfoutput>
                            <input class="form_field font10 noBackground" id="sransn" type="text" name="sransn" readonly="readonly"/>
							</cfoutput>
						</div>
					</div>
                </td>	
					
			</tr>
			<tr  style="text-align:center">				
				<td class="column" style="text-align:center" colspan="3" ><cfoutput><a href="index.cfm?action=edit.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(rc.assetObj.getAssetID()))#">Return to System Config List</a></cfoutput></td>
			</tr>
			<tr align="center">
				<td colspan="3" class="button_container">
					<input type="submit" name="btnInsert" id="btnInsert" value="INSERT"> 
					<input type="submit" name="btnReset" id="btnReset" value="RESET"> 
				</td>
			</tr>
			</tbody>	
		</table>
	
	
		
</RIMSS:layout>