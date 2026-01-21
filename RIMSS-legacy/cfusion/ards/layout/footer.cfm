            </div>
			<div class="push"></div>
		</div>
		<cfoutput>
		<div class="clearfix footer">
			
			<div id="skin_footer" class="noprint">
				<div class="notifications">
					<a href="#application.rootPath#/#LCASE(TRIM(application.sessionManager.getProgramSetting()))#/notifications/" class="admin">Add / Edit Notifications</a>
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
<cfsilent>
<cfscript>
	import cfc.facade.SessionFacade;
	sessionFacade = new SessionFacade();
</cfscript>	

<cfset dbUtils = application.objectFactory.create("DBUtils") />
<cfset utils = new cfc.utils.utilities()/>
<cfset code = application.objectFactory.create("CodeService") />
<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset programIdLookup = application.sessionManager.getProgramIdSetting() />
<cfset sysLookup = dbUtils.getSysIdByProgram(programLookup)/>


<cfset sysVal = code.getCode(val(sysLookup)).getCodeValue()/>

<cfset currentDate = Now()/>


<cfset sysLookup = listPrepend(sysLookup,0)/>
</cfsilent>


<input type="hidden" id="prog" name="prog" value="<cfoutput>#ATTRIBUTES.program#</cfoutput>">

<cfif !#sessionFacade.getAckMsgFlag()# and application.sessionManager.getUserSettingsFlag()>
	<cfset getNotificationsList = dbUtils.getMessagesBySysIdAndDate(sysLookup,currentDate)/>
	<cfif getNotificationsList.recordcount gt 0 > 
			<script>
				var str = <cfoutput>'#application.rootPath#/dialogs/lookupAckNotificationsDialog.cfm'</cfoutput>;
				var program = <cfoutput>'#ATTRIBUTES.program#'</cfoutput>;
	
		        setupAckNotificationsDialog(program) 
				showAckNotificationsDialog(str);
			</script>
	</cfif>
</cfif>


<script>
	
    try {
		$(function() {
	
	        setupNotificationsLookupDialog();
	        setupAckNotificationsDialog() 
	    });
	} catch (e) {
		
	}


</script>  

<style>
	.noTitle .ui-dialog-titlebar{
		 background-color: red !important;
		  background-image: none;
		  color: #fff;
		  text-align:center;
	}
	
	.noTitle .ui-dialog-titlebar-close{
		display: none;
	}
	
	.noTitle .ui-dialog-buttonpane .ui-dialog-buttonset {
	    float: right;
	    padding-right: 250px;
	}
	
	.noTitle .ui-dialog-buttonpane button{
		background:yellow !important;
		height:20px;
		font-weight: bold;
		font-size:10px;
		text-align:center;
		padding-bottom:23px;
		border-style:solid;
		border-color:black;
		width: 150px;
	}
	

</style>