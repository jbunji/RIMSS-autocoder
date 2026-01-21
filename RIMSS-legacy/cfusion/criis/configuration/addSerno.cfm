<cfsilent>
	<cfparam name="FORM.partnoid" default="0">
	<cfparam name="FORM.srapartnoid" default="0">
	<cfparam name="FORM.sranoun" default="">
	<cfset dbUtils = application.objectFactory.create("DbUtils") />
	<!---<cfset partList = dbUtils.getPartsById(HTMLEditFormat(trim(FORM.partnoid)))>	--->
	<cfset partList = dbUtils.getPartsByParentPartno(FORM.partnoid,FORM.sranoun)>
</cfsilent>

<style>
	.sraMessage
	{
	    border:2px solid #990000;
	    background-color:#CA0000;
	    color:#fff;
	    background-image:url(../images/icons/error.png);
	}
	.field{text-align:right}
</style>

<div id="sraMessage"></div>
<form id="addSRAForm">
	<cfif partList.recordCount>
		
		<table>
			<tr>
				<td class="field">PART NOUN:</td>
				<td><cfoutput>#encodeForHTML(trim(FORM.sranoun))#</cfoutput></td>
			</tr>
			<tr>
				<td class="field">PARTNO ID:</td>
				<td>
					<select name="partnoid" id="partnoid">
						<cfoutput query="partList">
							<option value="#encodeForHTML(trim(partlist.partno_c))#">#encodeForHTML(trim(partList.child_partno))#</option>
						</cfoutput>
					</select>
				</td>
			</tr>
			<tr>
				<td class="field">SERNO:</td>
				<td><input type="text" name="serno" id="serno"/></td>
			</tr>
		</table>		
	<cfelse>
		<div>No Data Found</div>
	</cfif>
</form>