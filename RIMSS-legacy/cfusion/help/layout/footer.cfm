            </div>
			<div class="push"></div>
		</div>
		<cfoutput>
		<div class="clearfix footer">
			
			<div id="skin_footer" class="noprint">
				<div class="notifications">
					<a href="#application.rootPath#/#LCASE(TRIM(application.sessionManager.getProgramSetting()))#/notifications/">Add / Edit Notifications</a>
					|
					<a class="viewNotifications" href="#application.rootPath#/dialogs/lookupNotificationsDialog.cfm"> Notifications</a>
				</div>
				<div class="footerLeft"><cfif IsDefined("application.ApplicationVersion")>#application.ApplicationVersion#</cfif></div>
				<div class="footerCenter"><a href="mailto:helpdesk@rampod.net?Subject=RIMSS:%20Helpdesk%20Support">Need to Update Permissions / Questions?</a></div>
				<div class="footerRight">&copy; #DateFormat(Now(),'yyyy')#</div>
			</div>
			
			<!---<table>
				<tr id="layout_footer" class="layout_footer">
	                <td>
	                    <div id="skin_footer" class="noprint">
	                        <div class="appversion"><cfif IsDefined("application.ApplicationVersion")>#application.ApplicationVersion#</cfif></div>
	                        <div class="rampodlogo">&copy; #Now()#</div>
	                        
	                    </div>
	                </td>
	            </tr>
			</table>--->
		</div>
		</cfoutput>
    </body>
</html>
<script>
	
    try {
		$(function() {
	
	        setupNotificationsLookupDialog();
	         
	    });
	} catch (e) {
		
	}


</script>  