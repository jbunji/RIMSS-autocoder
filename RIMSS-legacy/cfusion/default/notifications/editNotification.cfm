<cfsilent>
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
<cfset dbUtils = application.objectFactory.create("DbUtils") />
<cfset utils = new cfc.utils.utilities() />
<cfset qPrograms = dbUtils.getAllPrograms()/>

</cfsilent>
<RIMSS:layout section="notifications" subsection="#APPLICATION.sessionManager.getSubsection()#">
    <RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	
	<script>

            $(document).ready(function(){
                
                $('#btnReset').on("click",function(){
                    $(this).closest("form").setActionMethod("edit.notification","forward");
                });
                
                $('#btnUpdate').on("click",function(){
                    $(this).closest("form").setActionMethod("update.notification","doAction");
                });
                
                $('#btnDelete').on("click",function(){
                    if (removeConfirmation()) {
                        $(this).closest("form").setActionMethod("delete.notification", "doAction");
                    }else{
                        return false;
                    }
                });
                
                

            });


    </script>
	
	<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
	
	<div class="headerContent" >
        <div class="headerTitle">Edit Notification</div>
    </div>
	
	<div class="font12 mainContent">
        <form id="editNotification" name="editNotification" method="post" action="index.cfm">
            <cfoutput><input type="hidden" class="noreset" readonly="readonly" id="msgId" name="msgId" <cfif StructKeyExists(form,'msgId')>value="#encodeForHTML(trim(form.msgId))#"</cfif> /></cfoutput>
            <table class="three_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                            <td class="column">
                                <div class="columnContent">
                                    
                                    <div class="formField">
                                        <label class="font10" id="program_id_label">Program:</label> 
                                        <cfoutput>
                                            <select name="programs" id="programs" >
                                                <option value="0"> - All Programs - </option>
                                                <cfif isDefined("qPrograms") and isQuery(qPrograms)>
                                                    <cfloop query="qPrograms">
                                                        <option <cfif Structkeyexists(form,"programs") and UCASE(TRIM(form.programs)) eq UCASE(TRIM(CODE_ID))>selected="selected"</cfif>  value="#HTMLEditForamt(CODE_ID)#">#HTMLEditForamt(UCASE(TRIM(CODE_VALUE)))#</option>
                                                    </cfloop>
                                                </cfif>
                                                
                                            </select>
                                        </cfoutput>
                                    </div>
                                </div>
                            </td>
                            <td class="column" style="text-align:center">
                                <div class="columnContent">
                                    
                                    <div class="formField">
                                        <label class="font10 required" id="start_date_label">Start Date:</label>
                                        <cfoutput> 
                                        <input class="form_field calendar_field font10 touppercase" readOnly="readOnly" id="startDate" type="text" name="startDate" <cfif StructKeyExists(form,'startDate')>value="#encodeForHTML(trim(form.startDate))#"</cfif> readonly="readonly" />
                                        </cfoutput>
                                        <span style="padding:25px">
                                        <label class="font10" id="stop_date_label">Stop Date:</label>
                                        <cfoutput> 
                                        <input class="form_field calendar_field font10 touppercase" readOnly="readOnly" id="stopDate" type="text" name="stopDate" <cfif StructKeyExists(form,'stopDate')>value="#encodeForHTML(trim(form.stopDate))#"</cfif> readonly="readonly" />
                                        </cfoutput>
                                        </span>
                                        
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                
									<div class="formField">

	                                    <label class="font10" id="priority_label">Priority:</label> 
                                        <cfoutput>
                                            <select name="priority" id="priority">
                                                <option value="0"></option>
                                                
                                                    <cfloop from="1" to="3" index="p">
                                                        <option <cfif Structkeyexists(form,"priority") and TRIM(form.priority) eq trim(p)>selected="selected"</cfif>  value="#p#">#TRIM(p)#</option>
                                                    </cfloop>
                                            </select>
                                        </cfoutput>

	                                </div>
                                    
									
									
                                </div>
                            </td>
                    </tr>

					<tr>
                        <td colspan="3">
						    <div class="columnContent">
	                            <div class="formField">
	                                <label class="font10" id="notification_label" style="vertical-align: top;">Notification:</label>
	                                <cfoutput>
										
	                                   <textarea class="text_area_field font10 touppercase" id="notification" name="notification" rows="4" ><cfif StructKeyExists(form, 'notification')><cfoutput>#encodeForHTML(trim(form.notification))#</cfoutput></cfif></textarea>
	                                </cfoutput>
	                            </div>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td colspan="3">
                            <div class="button_container">
                                 <input type="submit" name="btnUpdate" id="btnUpdate" value="UPDATE" onclick="setAction('update.notification',this);setMethod('doAction',this);" >
                                 <input type="submit" name="btnDelete" id="btnDelete" class="deleteNotification admin" value="DELETE" >
                                 <input type="submit" name="btnReset" id="btnReset" value="RESET" class="reset" onclick="setAction('edit.notification',this);setMethod('forward',this);"> 
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="column" style="text-align:center" colspan="3">
                            <cfoutput>
                                <a id="newSortieSearch" href="index.cfm?action=get.notifications&method=forward">New Search</a>  
                            </cfoutput>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
	
</RIMSS:layout>
<cfdump var="#rc#"/>