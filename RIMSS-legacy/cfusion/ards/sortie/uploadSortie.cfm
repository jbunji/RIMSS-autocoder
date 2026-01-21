<cfimport taglib="../layout" prefix="RIMSS"/>
<RIMSS:layout section="sorties">
	<RIMSS:subLayout/>
	<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
	<table class="tblImport" width="30%"  cellpadding="5" cellspacing="5">
	<tr>
		<th>Sortie Import</th>
	</tr> 
	<tr>
		<td class="columns" >
		<cfoutput>	
		  <form name="fileUpload" action="index.cfm"  method="POST" enctype="multipart/form-data"> 
		        <input type="hidden" readonly="readonly" name="method" value="doAction"/>
				<input type="hidden" readonly="readonly" name="action" value="upload.sortie"/>
				
				<div style="text-align:center">
		        	<label> File type:
		           
		           </label>
				   <input type="radio"  name="importType"  value="access" <cfif isDefined("form.importType") and form.importType eq "access">checked="checked"</cfif>/> Access
                   <input type="radio"  name="importType" value="excel" <cfif isDefined("form.importType") and form.importType eq "excel">checked="checked"</cfif>/> Excel
				</div>
				<div style="padding:5px;text-align:center" >

					    File to upload: <input type="file"  name="fileData" id="fileData" style="width:350px;"/>
					
				
		         
		        </div>
				<div class="button_container clearfix">
                  <input type="submit" value="Upload" name="btnSubmit"/> 
                  </div>
		    </form>
		</cfoutput>	
		</td>
	</tr> 
	</table>
</RIMSS:layout>

