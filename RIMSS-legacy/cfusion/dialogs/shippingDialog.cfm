<!DOCTYPE html>
	<cfsilent>
	<script src="#application.rootpath#/common/js/jquery-1.8.2.js"></script>
    <script src="#application.rootpath#/common/js/jquery-ui-1.9.1.js"></script>
    <link href="<cfoutput>#application.rootpath#</cfoutput>/common/css/timePicker.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/acts/layout/js/maintenance.js"></script>
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/jquery.timePicker.min.js"></script>		

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<!---<cfparam name="form.nhapartno" default="0"/>
<cfparam name="form.lruExists" default="false"/>--->

<!---<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset unitLookup = application.sessionManager.getUnitSetting() />--->

<!---<cfset sysCatLookup = "AIRBORNE" />
<cfif IsDefined("form.systemcat")>
    <cfset sysCatLookup = ucase(form.systemcat) />
</cfif>

<cfset assetLookup = application.objectFactory.create("DbLookups") />
<cfset aNouns = assetLookup.lookupSraNouns(form.nhapartno) />--->

</cfsilent>

	<script type="text/javascript">
		$('.calendar_field1').datepicker({
       				   dateFormat: "dd-M-yy",
				       changeMonth: true,
				       changeYear: true,
				       onSelect: function(dateText) {
				           var tmpDate = $(this).val();
				           $(this).val(tmpDate.toUpperCase());
				       }
			 });
	</script>

<div id="nounsLookup" style="width: 100%;">
<!---<cfdump var="#form#" >
<cfabort>--->
<form name="trackingForm" id="trackingForm">
	<table class="lookupDialog font10" id="trackingFormId" cellpadding="0" cellspacing="0" >
		<tbody>
			<tr>
				<td> Shipper: </td>
				<td>
					<select class="form_field required_form_field font10" id="shipper" name="shipper">
						<option value="">Select...</option>
						<option value="FEDEX" >FedEx</option>
						<option value="UPS">UPS</option>
						<option value="DHL">DHL</option>
						<option value="GOV">Gov.</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>TCN: </td>
				<td><input class="font10" type="text" name="tcNumber" id="tcNumber" value=""></td>
			</tr>
			<tr>
				<td>Ship Date</td>
				<td>
					<input class="form_field font10 calendar_field1" type="text" id="shipDate" name="shipDate" value=""  readonly="readonly" />
				</td>                                    
			</tr>
	    </tbody>
	</table>
	<cfoutput>
		<input type="hidden" name="lookUpId" id="lookUpId" value="#encodeForHTML(form.id)#">
		<input type="hidden" name="assetId" id="assetId" value="#encodeForHTML(form.insSraAsset)#">
		<input type="hidden" name="remAssetId" id="remAssetId" value="#encodeForHTML(form.RemAsset)#">
		<input type="hidden" name="action" id="action" value="#left(url.action,1)#">
	</cfoutput>
</form>	
</div>