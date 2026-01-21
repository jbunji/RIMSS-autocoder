
<cfimport taglib="layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
<RIMSS:layout section="configuration">
<cfsilent>
<cfset cDate = DateFormat(Now(),'MMDDYYYY')>
<cfset cTime = TimeFormat(Now(),'HHmmss')>
<cfset fDate = DateFormat(Now(),'DD-MMM-YYYY')>
<cfset fTime = TimeFormat(Now(),'HH:mm')>
<cfset dateTime = cDate & cTime>
<cfset fdateTime = fDate & " " &  fTime>

<script>
	
		$(function(){
			$("#t").click(function(){
				var param = "01-APR-2014";
				var t = new Date(Date.parse(param));
				t.setDate(t.getDate()+12);
				alert(t.getDate + " " + t.get);
				
				
			});
		})
	
</script>
<!---
	<input type="button" id="t" name="t" value="click" />--->
<cfsavecontent variable="head">
<style type="text/css">
	
	body
	{
		margin:0 auto;
		padding:0;
		font-family:Verdana, Arial, Helvetica, sans-serif;
		font-size:12px;
	}
	
	table
	{
		width:99.5%;
		margin:0 auto;
	}
	
	.txtField
	{
		width:300px;
		border:1px solid #666;
		font-size:12px;
	}
	
	.txtArea
	{
		width:99%;
		text-align:left;
		height:200px;
		border:none;
		border:1px solid #666;
		text-transform:uppercase;
	}
</style>
<!---
<script>
	$(function(){
	    /* Add Required Fields * to all the labels that have class of "required" */
	    addRequiredtoLabels();
	    /* Add background color to input fields (text, textarea, radio, and checkboxes) when input gains focus */
	    addFocusHighlight();
	    /* Set readonly and disabled fields tabIndex to -1 */
	    setTabIndex();
	    /*Adds uppercasing of input text fields and text areas that do not have the class of "noUpper" */
	    addUpperCase();
	    /*Adds numeric restriction of input text fields and text areas that have the class of "numeric" */
	    addNumeric();
		addTextAreaMaxLength();
		});

</script>--->

</cfsavecontent>
<cfhtmlhead text="#head#">

<cfif structKeyExists(request.context,"send")>


<cfmail type="html" to="RIMSSSUPPORT@RAMPOD.NET" cc="#form.email#"  from="RIMSS REQUEST TICKET <noreply@rampod.net>" subject="RIMSS Help Desk Ticket - #form.subject#" >
Help Desk Ticket<br />
Date: #form.date#<br />
Submitted By: #trim(UCase(form.submittedBy))#<br />
Comm Phone: #trim(UCase(form.commPhone))#<br />
Organization: #trim(UCase(form.organization))#<br /><br />

Software Problem / Change Request Description:<br />
#trim(UCase(form.description))#<br /><br />

</cfmail> 
</cfif>
</cfsilent>
	<cfoutput>
	   <div class="message #msgStatus#">#msg#</div>
	</cfoutput>
	
	<div class="headerContent">
    	<div class="headerTitle">Contact</div>
    </div>
	
<div class="mainContent" >
	<form name="contactForm" id="contactForm" action="index.cfm?action=email.help&method=doAction" method="post">	
	
	
<!---<cfif not StructKeyExists(form,"btnSend")>--->
		 <div class="mainContainer">
		    <table class="two_column_table" cellspacing="0" cellpadding="0">
		      <tr>
		      	
				<td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="partno_id_label"><span class="font10 required_field">*</span>DATE:</label>
                            <cfoutput>
                            <input class="form_field required_form_field font10" id="date" type="text" name="date" value="#fDate#" readonly="readonly" />
							</cfoutput>
						</div>
					</div>
                </td>
		      </tr>
		      <tr>
		        <td class="column" >
					<div class="columnContent">
                        <div class="formField">
		        			<label class="form_field font10" for="submittedBy"><span class="font10 required_field">*</span>SUBMITTED BY:</label>
							<cfoutput>
							<input type="text" name="submittedBy" id="submittedBy" class="form_field required_form_field font10" <cfif structKeyExists(session,"user")>value="#session.user.userModel.getUserName()#"</cfif> />
							</cfoutput>
						</div>
					</div>
				</td>
		        <td class="column">
					<div class="columnContent">
                        <div class="formField">
				           		<label for="commPhone"><span class="font10 required_field">*</span>COMM PHONE #:</label>
				 		  		<cfoutput>
								<input type="text" name="commPhone" id="commPhone" class="txtField noUpper" <cfif StructKeyExists(form,"commPhone")>value=#encodeForHTML(form.commPhone)#</cfif> >
								</cfoutput> 
						</div>
					</div>
		        </td>
		      </tr>
		      <tr>
		        <td class="column">
					<div class="columnContent">
                        <div class="formField">
		        			<label for="email"><span class="font10 required_field">*</span>EMAIL:</label>
				            	<cfoutput><input type="text" name="email" id="email" class="txtField noUpper"  <cfif StructKeyExists(form,"email")>value=#encodeForHTML(form.email)#</cfif>></cfoutput>
						</div>
					</div>				
				</td>
		        <td class="column">
					<div class="columnContent">
                        <div class="formField">
		        			<label for="organization"><span class="font10 required_field">*</span>ORGANIZATION:</label>
							<cfoutput><input type="text" name="organization" id="organization" class="txtField noUpper"  <cfif StructKeyExists(form,"organization")>value=#encodeForHTML(form.organization)#</cfif>></cfoutput>
						</div>
					</div>				
				</td>
		      </tr>
		      <tr>
		        <td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
		        			<label for="subject"><span class="font10 required_field">*</span>SUBJECT:</label>
							<cfoutput><input type="text" name="subject" id="subject"  <cfif StructKeyExists(form,"subject")>value='#encodeForHTML(form.subject)#'</cfif>></cfoutput>
						</div>
					</div>				
				</td>
		      </tr>
		      <tr>
		        <td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
		        			<label for="description"><span class="font10 required_field">*</span>SOFTWARE PROBLEM / CHANGE REQUEST DESCRIPTION:</label>
							<cfoutput><textarea name="description" id="description" class="text_area_field font10 touppercase" rows="4" ><cfif StructKeyExists(form,"description")>#encodeForHTML(form.description)#</cfif></textarea> </cfoutput>
						</div>
					</div>				
				</td>
		      </tr>
		     
		      
		      <tr>
			      <td class="column" colspan="2">
					<div class="columnContent">
						<div class="formField button_container">
							<input type="submit" name="btnSend" value="Send Request" />
						</div>
					</div>
			      </td>
		      </tr>
		    </table>
		</div>
<!---<cfelse>
	<cfoutput>
    	<table  class="two_column_table" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="2">
					<div class="columnContent">
                        <div class="formField" style="text-align:center;">
							<p>THANK YOU FOR SUBMITTING YOUR HELP DESK REQUEST TICKET.</p>
						</div>
					</div>
                </td>
            </tr>
        </table>
    </cfoutput>
</cfif>--->

	
	</form>
</div>
</RIMSS:layout>