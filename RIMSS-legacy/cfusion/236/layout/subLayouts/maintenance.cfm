<cfscript>
    import cfc.dao.DBUtils;        
</cfscript>

<cfset dbUtils = application.objectFactory.create("DBUtils") />

<cfoutput>
	<cfset request.subSection = "AIRBORNE"/>
	<cfparam name="showSubSection" default="true"/>
	<cfif IsDefined("ATTRIBUTES")>
		<cfif Structkeyexists(ATTRIBUTES,"layout") and len(trim(ATTRIBUTES.layout))>
		   <link href="#application.rootpath#/#Lcase(attributes.layout)#/layout/css/maintenance.css" rel="stylesheet" type="text/css" />
		</cfif>
		
		<cfif Structkeyexists(ATTRIBUTES,"subSection") and len(trim(ATTRIBUTES.subSection))>
		      <cfset request.subSection = ATTRIBUTES.subSection>	
		</cfif>
		
		<cfset currentProgram = "default"/>
		<cfif len(trim(application.sessionManager.getProgramSetting()))>
		  <cfset currentProgram = application.sessionManager.getProgramSetting()/>
		</cfif>
		
		<cfif Structkeyexists(ATTRIBUTES,"showSubSection") and isBoolean(ATTRIBUTES.showSubSection)>
            <cfset showSubSection = ATTRIBUTES.showSubSection/>
        </cfif>
		
	</cfif>
	
</cfoutput>

<script>

	   $(document).ready(function(){
        <cfoutput>setupSubSystem('#lcase(trim(currentProgram))#');</cfoutput>
	   });

</script>
<div class="clearfix subSection"  <cfoutput>id="#lcase(trim(request.subSection))#"</cfoutput>>
	<div id="maintenance_menu">
	    <div id="maintenance_menu_buttons">
	    	<!---/rimss/acts/controller/mainController.cfc?method=forward--->
	        <form name="maintenance_menu_form" method="post" <cfoutput>action="#application.rootpath#/#Lcase(attributes.layout)#/maintenance/index.cfm"</cfoutput>>
	            <input type="submit" name="createMaintenance" value="CREATE NEW JOB" id="createmaint" class="menubuttons left" onfocus="if(this.blur)this.blur()" onclick="setAction('create.maintenance',this);setMethod('forward',this);"/>
	            <input type="submit" name="createUidMaintenance" value="CREATE JOB W/ UID" id="createuidmaint" class="menubuttons middle" onfocus="if(this.blur)this.blur()" onclick="setAction('create.maintenance.uid',this);setMethod('forward',this);"/>
	            <!---<input type="button" name="changeLocation" value="CHANGE ITEM LOCATION" id="changelocation" class="menubuttons right" onfocus="if(this.blur)this.blur()" />--->
				<!---<cfoutput><input type="hidden" readonly="readonly" name="subSection" id="subSection" <cfif Structkeyexists(form,"subSection")>value="#form.subSection#"<cfelseif Structkeyexists(request,"subSection")>value="#request.subSection#"</cfif>/></cfoutput>--->
	        </form>                             
	    </div>
	    <div id="system_category_menu" style="padding-left:450px"><!--- system_category_menu --->
            <cfif showSubSection AND DBUtils.isDepotLocation(application.sessionmanager.getlocidsetting()).recordcount EQ 0>
		        <ul id="system_category"><!--- system_category --->
		            <li><a id="as">AIRBORNE</a></li>
		            <!---<li><a id="gs">GROUND</a></li>
		            <li><a id="ds">DISPLAYS</a></li>--->
		            <li><a id="se">SUPPORT EQUIPMENT</a></li>
		        </ul>
			</cfif>
	        <!---<input type="hidden" name="equipType" value=""/>--->
	        <span id="syscat" style="display:none">as</span>
	    </div>
	</div>
</div>
