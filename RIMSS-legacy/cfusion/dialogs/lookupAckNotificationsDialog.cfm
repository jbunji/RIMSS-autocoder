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


   
        <cfif getNotificationsList.recordcount gt 0 > 
       		<cfoutput query="getNotificationsList">
			   	#encodeForHTML(currentrow)# - #encodeForHTML(msg_text)#
				<br/>
			</cfoutput>
		</cfif>
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