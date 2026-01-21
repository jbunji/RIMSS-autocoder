<!DOCTYPE html>
<cfsilent>

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<cfset dbUtils = application.objectFactory.create("DBUtils") />
<cfset utils = new cfc.utils.utilities()/>
<cfset code = application.objectFactory.create("CodeService") />

<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset programIdLookup = application.sessionManager.getProgramIdSetting() />
<cfset sysLookup = dbUtils.getSysIdByProgram(programLookup)/>

<cfset sysVal = code.getCode(val(sysLookup)).getCodeValue()/>

<cfset currentDate = Now()/>
<cfif Structkeyexists(rc,"currentDate") and isDate(rc.currentDate)>
    <cfset currentDate = rc.currentDate/>
</cfif>

<cfset sysLookup = listPrepend(sysLookup,0)/>
</cfsilent>


<cfset getNotificationsList = dbUtils.getMessagesBySysIdAndDate(sysLookup,currentDate)/>





<div id="notificationsLookup" style="width: 100%;">


    <table class="lookupDialog font10" id="notificationsList" cellpadding="0" cellspacing="0" >
        <thead>
        <cfif getNotificationsList.recordcount gt 0> 
        <tr>
            <th colspan="5" class="filter">
              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
            </th>
        </tr>
        </cfif> 
        <tr class="header">
                <th>Program</th>
                <th>Message</th>
                <th>Start Date</th>
                <th>Stop Date</th>
                <th>Priority</th>
        </tr></thead>
        <tbody><!---
    ---><cfif getNotificationsList.recordcount gt 0>
            <cfoutput>
            <cfloop query="getNotificationsList"><!---
            --->
            <cfsilent>
				<cfset start = IsDate(START_DATE) ? UCASE(TRIM(DATEFORMAT(START_DATE,"dd-mmm-yyyy"))) : ""/>
                <cfset stop = IsDate(STOP_DATE) ? UCASE(TRIM(DATEFORMAT(STOP_DATE,"dd-mmm-yyyy"))) : ""/>
			</cfsilent>
            <tr class="notification <cfif (currentrow mod 2) eq 0>even<cfelse>odd</cfif>">
                <td class="program"><span>#encodeForHTML(trim(Program))#</span></td>
                <td class="notificationMessage" ><span>#encodeForHTML(trim(msg_text))#</span></td>
				<td class="startDate date" ><span>#encodeForHTML(trim(start))#</span></td>
				<td class="stopDate date" ><span>#encodeForHTML(trim(stop))#</span></td>
				<td class="priority" ><span>#encodeForHTML(trim(priority))#</span></td>
            </tr><!---
        ---></cfloop>
			</cfoutput>
        <cfelse>
            <tr class="asset">
                <td colspan="5">
                    No Notifications found for System: <cfoutput>#sysVal#</cfoutput>
                </td>
            </tr>
        </cfif>
        </tbody>
    </table>
</div><!---
---><cfif getNotificationsList.recordcount gt 0>
    <script type="text/javascript">
        
        $(document).ready(function() {
            
            
            $("#notificationsList").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                }
            });

            var dt = $('.lookupDialog:visible').dataTable({ 
                      "bFilter": true,
                      "sDom":"t"
               });
            $('.lookupDialog:visible').find('#dtSearch').on('keyup',function(e){
                
                    dt.fnFilter($(this).val());
            });
			
			modifyDTColumns();

        });
        
        
        
    </script><!---
---></cfif>