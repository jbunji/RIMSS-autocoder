<cfimport taglib="../layout" prefix="RIMMS"/>
<cfsetting showdebugoutput="false" >
<cfset program = lcase(trim(application.sessionManager.getProgramSetting())) />

<RIMMS:layout layout="default">
    <RIMMS:subLayout subSection="#application.sessionManager.getSubSection()#"/>
	
<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>

<div class="headerContent">
    	<div class="headerTitle">Create Bit Pc</div>
    </div>

    <div class="font12 mainContent">
<form id="addBitPcForm" action="index.cfm" >
	<input type="hidden" id="eventId" name="eventId" value="<cfif StructKeyExists(form, 'eventId')><cfoutput>#encodeForHTML(trim(form.eventId))#</cfoutput></cfif>">
	<input type="hidden" id="repairId" name="repairId" value="<cfif StructKeyExists(form, 'eventId')><cfoutput>#encodeForHTML(trim(form.repairId))#</cfoutput></cfif>">			
	<input type="hidden" id="laborId" name="laborId" value="<cfif StructKeyExists(form, 'laborId')><cfoutput>#encodeForHTML(trim(form.laborId))#</cfoutput></cfif>">
	<input type="hidden" id="assetId" name="assetId" value="<cfif StructKeyExists(form, 'assetId')><cfoutput>#encodeForHTML(trim(form.assetId))#</cfoutput><cfelse>659325</cfif>" />
	<input type="hidden" name="eventRepair" id="eventRepair" value="<cfif StructKeyExists(form, 'eventRepair')><cfoutput>#encodeForHTML(trim(form.eventRepair))#</cfoutput></cfif>">
	<input type="hidden" name="laborBitId" id="laborBitId" value="<cfif StructKeyExists(form, 'laborBitPc')><cfoutput>#encodeForHTML(trim(form.laborBitPc.getLaborBitId()))#</cfoutput></cfif>">
	<table class="three_column_table" cellpadding="0" cellspacing="0" id="partWorked">
		<tbody>			
			<tr>
                <td class="column">
                    <div class="formField">
                        <label class="font10" id="bitPartno_label">PARTNO:</label> 
                        <input class="form_field font10" id="bitPartno" type="text" name="bitPartno" value="<cfif StructKeyExists(form, 'laborBitPc')><cfoutput>#encodeForHTML(trim(form.laborBitPc.getBitPartno()))#</cfoutput></cfif>" />
                    </div>
                </td>
                <td class="column">
                    <div class="formField">
                        <label class="font10" id="bitName_label">&nbsp;NAME:</label> 
                        <input class="form_field font10" id="bitName" type="text" name="bitName" value="<cfif StructKeyExists(form, 'laborBitPc')><cfoutput>#encodeForHTML(trim(form.laborBitPc.getBitName()))#</cfoutput></cfif>" />
                    </div>
                </td>
                <td class="column">
                    <div class="formField">
                        <label class="font10" id="bitQty_label">QTY:</label> 
                        <input class="form_field font10" id="bitQty" type="text" name="bitQty" value="<cfif StructKeyExists(form, 'laborBitPc')><cfoutput>#encodeForHTML(trim(form.laborBitPc.getBitQty()))#</cfoutput></cfif>" />
                    </div>
                </td>
			</tr>
			<tr>
				<td class="column" colspan="3" style="text-align:center">
					<a href="index.cfm?action=edit.maintenance.detail&eventRepair=<cfif StructKeyExists(form, 'eventRepair')><cfoutput>#encodeForHTML(trim(form.eventRepair))#</cfoutput></cfif>">Return to Maintenance Detail</a>
				</td>
			</tr>
		</tbody>
	</table>
	 <table class="one_column_table" cellpadding="0" cellspacing="0">
	    <tbody>
	        <tr>
	            <td>
	                <div class="button_container">
	                	<input type="submit" class="input_buttons font10" id="btnInsert" name="btnInsert" value="SUBMIT" onclick="setAction('insert.bitPc',this);setMethod('doAction',this);" />
	                    <input type="reset" class="input_buttons font10 reset" id="btnReset" name="btnReset" value="RESET" />
	                </div>
	            </td>
	        </tr>
	    </tbody>
	</table>
	
</form>

</div>
</RIMMS:layout>