<cfoutput>
	<cfset request.subSection = "AIRBORNE"/>
	<cfparam name="showSubSection" default="false"/>
	<cfif IsDefined("ATTRIBUTES")>
		<cfif Structkeyexists(ATTRIBUTES,"layout") and len(trim(ATTRIBUTES.layout))>
		   <link href="#application.rootpath#/#Lcase(attributes.layout)#/layout/css/maintenance.css" rel="stylesheet" type="text/css" />
		</cfif>
		<cfsilent>
			<cfif Structkeyexists(ATTRIBUTES,"subSection") and len(trim(ATTRIBUTES.subSection))>
			      <cfset subSection = ATTRIBUTES.subSection>	
				    
			<cfelse>
				<cfset subSection = "AIRBORNE"/>
			</cfif>
			<cfset request.subSection = subSection>
			<cfset subMenuProgram = ""/>
			
			<cfif isDefined("ATTRIBUTES.program")>
				<cfset subMenuProgram = ATTRIBUTES.program/>
				
			</cfif>

			<cfset currentProgram = "default"/>
		<cfif len(trim(application.sessionManager.getProgramSetting()))>
		  <cfset currentProgram = application.sessionManager.getProgramSetting()/>
		</cfif>
		
		<cfif Structkeyexists(ATTRIBUTES,"showSubSection") and isBoolean(ATTRIBUTES.showSubSection)>
			<cfset showSubSection = ATTRIBUTES.showSubSection/>
		</cfif>
		
		
		
		</cfsilent>
	</cfif>

   	<!---<cfif not application.sessionManager.userHasPermission("PCS_ACTTS_SPARES")>
        <cfthrow message="You have insufficent privs to access this content" type="UnauthorizedUser"/>
        <cfabort/>
    </cfif>--->
   	
</cfoutput>


<script>

	   $(document).ready(function(){
        <cfoutput>setupSubSystem('#lcase(trim(currentProgram))#');</cfoutput>
	   });

</script>
<cfif application.sessionManager.userModelExists() or len(trim(submenuProgram))>
	<div class="clearfix subSection" <cfoutput>id="#lcase(trim(subSection))#"</cfoutput>>
		<div id="maintenance_menu">
		    <div id="maintenance_menu_buttons">
		    	<cfoutput>
		        
		        <form name="notification_menu_form" method="post" action="#application.rootPath#/#ATTRIBUTES.layout#/notifications/index.cfm">
		            <input type="submit" name="createNotification" value="CREATE NOTIFICATION" id="createNotification" class="menubuttons left" onfocus="if(this.blur)this.blur()" onclick="setAction('add.notification',this);setMethod('forward',this);" />
					<input type="submit" name="listNotifications" value="LIST NOTIFICATIONS" id="listNotifications" class="menubuttons middle" onfocus="if(this.blur)this.blur()" onclick="setAction('list.notifications',this);setMethod('forward',this);" />
		        </form> 

				</cfoutput>                            
		    </div>
		</div>
	</div>
</cfif>