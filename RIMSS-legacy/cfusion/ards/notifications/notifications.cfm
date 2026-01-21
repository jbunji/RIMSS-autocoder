<cfsilent>
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfset dbUtils = application.objectFactory.create("DbUtils") />
<cfset utils = new cfc.utils.utilities() />
<cfset qPrograms = dbUtils.getAllPrograms()/>
</cfsilent>
<RIMSS:layout section="notifications" subsection="#APPLICATION.sessionManager.getSubsection()#">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<script>
        try {
            $(document).ready(function(){
                //setupEditHighlight();
                setupHighlight();
                
                $('#btnSearch').on("click",function(){
                    $(this).closest("form").setActionMethod("search.notifications","forward");
                });
				
				$('#btnReset').on("click",function(){
                    $(this).closest("form").setActionMethod("list.notifications","forward");
                });

                $('.deleteIcon').on("click",function(event){

                    if (removeConfirmation()) {
							$(this).closest("form").setActionMethod("delete.notification.link","forward");
                    }else{
                        event.preventDefault();
                        return false;
                        
                    }

                });
                
                
                $('#dtSearch').on('keyup',function(e){
                    dt.fnFilter($(this).val());
                   });
                
                //Add Data Table
                var dt = $('#notificationsTable').dataTable({ 
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
        <div class="headerTitle">List Notifications</div>
    </div>
	
	<div class="font12 mainContent">
        <form id="searchNotifications" name="searchNotifications" method="post" action="index.cfm">
            <table class="three_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                            <td class="column">
                                <div class="columnContent" style="text-align:center">
                                    <div class="formField">
                                        <label class="font10" id="asset_id_label">Program:</label> 
                                        <cfoutput>
                                            <select name="programs" id="programs" >
                                                <option value="0"> - All Programs - </option>
                                                <cfif isDefined("qPrograms") and isQuery(qPrograms)>
                                                    <cfloop query="qPrograms">
                                                        <option <cfif Structkeyexists(form,"programs") and UCASE(TRIM(form.programs)) eq UCASE(TRIM(CODE_ID))>selected="selected"</cfif>  value="#encodeForHTML(CODE_ID)#">#encodeForHTML(UCASE(TRIM(CODE_VALUE)))#</option>
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
							<td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="startdate_label">Start Date:</label> 
                                        <cfoutput>
                                            <input class="calendar_field" type="text" readonly="readonly" name="startDate" id="startDate" <cfif Structkeyexists(form,"startDate")>value="#encodeForHTML(UCASE(TRIM(form.startDate)))#"</cfif>>
                                        </cfoutput>
                                        
                                    </div>
                                </div>
                            </td>
							<td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="stopdate_label">Stop Date:</label> 
                                        <cfoutput>
                                            <input class="calendar_field" type="text" readonly="readonly" name="stopDate" id="stopDate" <cfif Structkeyexists(form,"stopDate")>value="#encodeForHTML(UCASE(TRIM(form.stopDate)))#"</cfif>>
                                        </cfoutput>
                                        
                                    </div>
                                </div>
                            </td>
                            
                    </tr>
                    <tr>
                            <td class="column" colspan="3">
                                <div class="columnContent">
                                    <div class="formField button_container">
                                        <input type="submit" value="SEARCH" name="btnSearch" id="btnSearch" />
										<input type="submit" value="RESET" name="btnReset" id="btnReset" />
                                    </div>
                                </div>
                            </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
	
	<cfif isDefined("rc.qNotifications")>
        <div class="mainContent">  
            <cfif rc.qNotifications.count()>
			   <form id="searchNotificationsResults" name="searchNotificationsResults" method="post" action="index.cfm"> 	
	               <table class="globalTable" id="notificationsTable">
	                     <thead>
	                        <tr>
	                            <th colspan="13" class="filter">
	                                <cfoutput><cfif rc.qNotifications.count() gt 1> <div style="float:left">Notifications Count: #rc.qNotifications.count()#</div></cfif></cfoutput>
	                              <div>Filter Results: <input type="text" id="dtSearch"/></div>     
	                            </th>
	                        </tr>
	                        <tr>
	                            <th>Program</th>
								<th>Message</th>
	                            <th>Start Date</th>
	                            <th>Stop Date</th>
	                            <th>Priority</th>
	                            <th class="noSort">&nbsp;</th>
								<th class="noSort admin">&nbsp;</th>
	                        </tr>
	                        
	                     </thead>
	                   <tbody>          
	                   <cfoutput>
	                   <cfloop condition="#rc.qNotifications.next()#">
	                       <cfset startDate = isDate(rc.qNotifications.getStartDate()) ? UCASE(TRIM(DateFormat(rc.qNotifications.getStartDate(),"dd-mmm-yyyy"))) : ""/> 
						   <cfset stopDate = isDate(rc.qNotifications.getStopDate()) ? UCASE(TRIM(DateFormat(rc.qNotifications.getStopDate(),"dd-mmm-yyyy"))) : ""/> 
	                        <tr class="<cfif rc.qNotifications.getCursor() mod 2> odd <cfelse> even </cfif>">
	                            
	                            <td>#encodeForHTML(trim(rc.qNotifications.getProgram()))#</td>
								<td>#encodeForHTML(trim(rc.qNotifications.getMsgText()))#</td>
	                            <td>#encodeForHTML(trim(startDate))#</td>
	                            <td>#encodeForHTML(trim(stopDate))#</td>
	                            <td>#encodeForHTML(trim(rc.qNotifications.getPriority()))#</td>
								<td class="edit editIcon"><a href="index.cfm?action=edit.notification&msg=#utils.encryptId(rc.qNotifications.getMsgId())#"></a></td>
	                            <td class="delete deleteIcon admin"><a class="deleteNotification" href="index.cfm?action=delete.notification.link&msg=#utils.encryptId(rc.qNotifications.getMsgId())#"></a></td>
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