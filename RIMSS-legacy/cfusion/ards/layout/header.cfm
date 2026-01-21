<!DOCTYPE html>
<cfsilent>
	<!--- defined the program's path for the application --->
	<cfset ATTRIBUTES.program = 'ards'/>
	<cfset programPath = "#application.rootpath#/#trim(ATTRIBUTES.program)#" />

	<!--- priv list for restricting access --->
	<cfparam name="ATTRIBUTES.privs" default = ""/>
    
    <cfparam name="inbound" default="0"/>
	<cfparam name="outbound" default="0"/>
	
    <cfparam name="ATTRIBUTES.showSpares" default = "false"/>
	<cfparam name="ATTRIBUTES.showSorties" default = "false"/>
	

	
    <!--- Check to make sure user has access to program --->
    <cfset userModel = application.sessionManager.getUserModel() />

    <cfset programs = "" />
    <cfif (IsDefined("userModel")) >
		<cfset ATTRIBUTES.showSpares = application.sessionManager.userHasPermission("PCS_ACTTS_SPARES") OR application.sessionManager.getUserModel().isMemberOfGroup("PCS_SU") OR (application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_DEPOT"))/>
		<cfset ATTRIBUTES.showAdmin = application.sessionManager.getUserModel().isMemberOfGroup("PCS_SU")/>
		<!--- Sorties check --->
	    <cfset maintLevel = application.sessionManager.getMaintLevelSetting()/>
        <cfif len(trim(maintLevel))>
            <cfset ATTRIBUTES.showSorties = ucase(left(maintLevel,1)) neq "D">  
        </cfif>

        <cfif application.sessionManager.isUserLoggedOn() >
            <cfif application.sessionmanager.checkUserSettings()>
	            <cfif !application.sessionManager.userHasPermission("ACCESS_PROGRAM_ID_#UCASE(TRIM(ATTRIBUTES.program))#") and !application.sessionManager.userHasPermission("ACCESS_PROGRAM_ID_ALL")>
	                 <cfif ucase(trim(application.sessionManager.getProgramSetting())) neq ucase(trim(attributes.program))>
	                    <cflocation url="#application.rootpath#" addtoken="no"/>
						<cfabort/>
	                 </cfif>
	            </cfif> 
			</cfif>
            <!--- Check for privs passed in --->
            <cfset local.privArray = listToArray(ATTRIBUTES.privs)>
            <cfif Arraylen(local.privArray)>
                <cfloop array = "#local.privArray#" index="local.p">
                    <cfif not application.sessionManager.userHasPermission(ucase(trim(local.p)))>
						<cfthrow message="You have insufficent privs to access this content" type="UnauthorizedUser"/>
                        <cfabort/>
						<cfbreak/>
					</cfif>
                </cfloop>
                
            </cfif>

            <!--- Get DBUtils --->
            <cfset dbUtils = application.objectFactory.create("DBUtils")>
            <cfset dashboard = dbUtils.getDashboard(application.sessionManager.getProgramIdSetting(),application.sessionManager.getLocIdSetting())>
            <cfset inboundAssets = dbUtils.getInboundAssets(application.sessionManager.getProgramIdSetting(),application.sessionManager.getLocIdSetting())>
			<cfset outboundAssets = dbUtils.getOutboundAssets(application.sessionManager.getProgramIdSetting(),application.sessionManager.getLocIdSetting())>
			<cfset inbound = val(inboundAssets.recordcount)>
			<cfset outbound = val(outboundAssets.recordcount)>

        </cfif>

    </cfif>
    
</cfsilent>

<cfif !ATTRIBUTES.showAdmin>
	<style>
		.admin{
			display:none;
		}	
	</style>
</cfif>
<html>
	<head>
		<title><cfoutput>#APPLICATION.name#</cfoutput> Web Application</title>
		<!--- CSS files --->
        <cfoutput>

		<!---<link rel="stylesheet" type="text/css" href="css/clickmenu.css" />
		<link href="css/StyleSheet.css?_#Now().getTime()#" rel="stylesheet" type="text/css" />--->

        <link href="#application.rootpath#/common/layout/css/default.css" rel="stylesheet" type="text/css" />
        <link href="#application.rootpath#/common/layout/css/skin.css" rel="stylesheet" type="text/css" />
        <link href="#application.rootpath#/common/css/common.css" rel="stylesheet" type="text/css" />
		<link href="#application.rootpath#/common/css/messages.css" rel="stylesheet" type="text/css" />
        <link href="#application.rootpath#/common/css/smoothness/jquery-ui-1.9.1.custom.css" rel="stylesheet" type="text/css" />
        <link href="#application.rootpath#/common/layout/css/content.css" rel="stylesheet" type="text/css" />
        <link href="#application.rootpath#/common/layout/css/application.css" rel="stylesheet" type="text/css" />
        <!---<link href="#application.rootpath#/common/layout/css/application2.css" rel="stylesheet" type="text/css" />--->
        <link href="#application.rootpath#/common/layout/css/ui.datepicker.css" rel="stylesheet" type="text/css" />
        <link href="#application.rootpath#/common/css/timePicker.css" rel="stylesheet" type="text/css" />
		<link href="#application.rootpath#/common/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
		<!---<link href="#application.rootpath#/common/layout/css/bootstrap.min.css" rel="stylesheet" type="text/css" />--->

		<!--- JS files --->
        <script src="#application.rootpath#/common/js/jquery-1.8.2.js"></script>
		<script src="#application.rootpath#/common/js/jquery-ui-1.9.1.js"></script>
		<script src="#application.rootpath#/common/js/common.js"></script>
		<script src="#application.rootpath#/common/js/functions.js"></script>
        <script src="#application.rootpath#/common/js/jquery.timePicker.min.js"></script>
		<script src="#application.rootpath#/common/js/date.js"></script>
		<script src="#application.rootpath#/common/js/jquery.dataTables.min.js"></script>
		<script src="#application.rootpath#/common/js/jquery.dataTables.ext.js"></script>
		<script src="#application.rootpath#/common/js/jquery.stickytableheaders.min.js"></script>
		<script src="#application.rootpath#/common/js/jszip.min.js"></script>
		<script src="#application.rootpath#/common/js/dataTablesButtons.js"></script>
		<script src="#application.rootpath#/common/js/dataTablesHTML5.js"></script>
		<script src="#application.rootpath#/common/js/buttons.print.min.js"></script>
		<script src="#application.rootpath#/common/js/pdfmake.min.js"></script>
		<script src="#application.rootpath#/common/js/vfs_fonts.js"></script>
		<script src="#application.rootpath#/common/js/dataTables.fixedHeader.min.js"></script>
		<script src="#application.rootpath#/common/js/moment.js"></script>
		<script src="#application.rootpath#/common/js/datetime-moment.js"></script>
		
		<script>setRootPath("#APPLICATION.rootPath#");</script>
		</cfoutput>
	</head>
    <cfsilent>
	    <cfset userModel = application.sessionManager.getUserModel()/>
		<!--- define user settings --->
		<cfset programInSession = application.sessionManager.getProgramSetting() />
		<cfset programIdInSession = application.sessionManager.getProgramIdSetting() />
		<cfset unitInSession = application.sessionManager.getUnitSetting() />
		<cfset locIdInSession = application.sessionManager.getLocIdSetting() />
	    <cfset sourceCatInSession = application.sessionManager.getSourceCatSetting() />
	    <cfset maintLevelInSession = application.sessionManager.getMaintLevelSetting() />

		<cfset local.currentPage = replacenocase(CGI.SCRIPT_NAME,"\","/","ALL")/> 

		<cfparam name="showMaintenance" default="true"/>
	    <cfparam name="showConfig" default="true"/>
	    <cfparam name="showReports" default="true"/>
	    <cfparam name="showSorties" default="true"/>
		<cfparam name="unitMaintLevel" default=""/>
        <cfparam name="showInventory" default="true"/>
        <cfparam name="showAdmin" default="true"/>

	</cfsilent>
	
    <script>
        $(function() {
            $('div.detail .dashboardTable').dataTable(
               {
                "sScrollY": "7.5em",
                "asStripeClasses": []
                
               }
            );  
			
			$(".sticky-headers").stickyTableHeaders();
        });
    </script>  
	
	<!---Make sure we aren't on an error page or a login/logout page--->
	<cfif not findnocase("Login.cfm",local.currentPage) and not findnocase("Logout.cfm",local.currentPage) and not findnocase("/error",local.currentPage) and not findnocase("/dialogs",local.currentPage)>
			<script>
			    $(function() {

                    //addAjaxSessionCheck();

			        $('#change_settings').click(function() {
			            changeSettings(getRootPath() + "/index.cfm");	
			        });
					
					
					$('#viewInBound').click(function(){
						viewInTransit('inbound');
					})
					
					$('#viewOutBound').click(function(){
						viewInTransit('outbound');
					})

					var now = new Date();
					$('#skin_header_info').text(now.format("dd-mmm-yyyy").toUpperCase());
					
//					setupTab();
					
					/*$(".parent").click(function(){
						setTab($(this).attr("id"));
						console.log("Tab: "+getTab() + " - " + $(this).attr("id"));
					});*/
					
					$("#menulist").menu({ position: { my: "center top", at: "center bottom" } });
			    });
			</script>   

			<cfif application.sessionManager.userModelExists() and application.sessionManager.isUserLoggedOn()>
				
				<cfif !application.sessionManager.getUserSettingsFlag() and application.sessionManager.getUserAccessFlag()>
				        
				        <script>
				            $(function() {
				                //changeSettings("");
				                //$('#change_settings').click(function() {
				                    
				                   // changeSettings(getRootPath() + "/index.cfm");
				                //});
				                changeSettings(getRootPath() + "/index.cfm");
				 
				            });
				        </script>
						
				    <cfelse>
				    
				</cfif>
			</cfif>
	</cfif>

	<cfsilent>

		<cfset subHeader = "" />
		<cfset section = ""/>
		<cfif isDefined("variables.sub_header")>
		    <cfset subHeader = variables.sub_header />
		<cfelse>
		    <cfset subHeader = "Application Home" />
		</cfif>
		
		<cfif isDefined("ATTRIBUTES.section")>
		   <cfset section = ATTRIBUTES.section />
		<cfelse>
		   <cfset section = "Maintenance" />
		</cfif>
		
		<!--- show/hide sections --->
	    <cfif isDefined("ATTRIBUTES.showMaintenance") and isBoolean(ATTRIBUTES.showMaintenance)>
	      <cfset showMaintenance = ATTRIBUTES.showMaintenance/>
	    </cfif>
	    
	    <cfif isDefined("ATTRIBUTES.showConfig") and isBoolean(ATTRIBUTES.showConfig)>
	      <cfset showConfig = ATTRIBUTES.showConfig/>
	    </cfif>
	    
	    <cfif isDefined("ATTRIBUTES.showReports") and isBoolean(ATTRIBUTES.showReports)>
	      <cfset showReports = ATTRIBUTES.showReports/>
	    </cfif>
	    
	    <cfif isDefined("ATTRIBUTES.showSorties") and isBoolean(ATTRIBUTES.showSorties)>
	      <cfset showSorties = ATTRIBUTES.showSorties/>
	    </cfif>
	    
	    <cfif isDefined("ATTRIBUTES.showSpares") and isBoolean(ATTRIBUTES.showSpares)>
          <cfset showSpares = ATTRIBUTES.showSpares/>
        </cfif>
		
		<!---Add Unit/MaintLevel to appliation header---> 
		<cfif isDefined("unitInSession")>
	        <cfset unitMaintLevel = unitInSession/>

	        <cfif isDefined("maintLevelInSession") and len(trim(maintLevelInSession))>
				<cfset unitMaintLevel &= " " & maintLevelInSession/>
			</cfif>
	        
	    </cfif>
	
	</cfsilent>

    <body <cfif isDefined("section") and len(trim(section))><cfoutput>id="#lcase(trim(section))#"</cfoutput></cfif>>
    	<div class="wrapper">
			<div class="header clearfix">
	    		<cfoutput>
			    <table id="layout" class="layout" cellpadding="0" cellspacing="0">
					<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
						*****CONTROLLED UNCLASSIFIED INFORMATION*****
					</div>				    	
				    <tr id="layout_header" class="layout_header">
				    	<td>	
						    
							<div id="skin_header" class="clearfix">
								<div class="clearfix">
									<div id="skin_header_left">
									     <div><span id="skin_title"><cfif Structkeyexists(APPLICATION,"name")>#APPLICATION.name#:</cfif> </span><span id="skin_sub_title" <cfif isDefined("programIdInSession")>data-programId="#programIdInSession#"</cfif>><cfif isDefined("programIdInSession")>#programInSession#</cfif> <cfif isDefined("unitMaintLevel")>(#unitMaintLevel#)</cfif></span></div>
									     <div id="skin_sub_header"><cfif Structkeyexists(APPLICATION,"subTitle")>#APPLICATION.subTitle#</cfif></div>
									</div>	
								
									<div id="skin_header_right">
										<div id="skin_header_menu">
											<ul>
											<li><a href="/Rampod">RAMPOD Home</a></li>	
											<li> - <a href="<cfoutput>#application.rootpath#</cfoutput>/help/index.cfm">Trouble with RIMSS?</a></li>
											<li> - <a href="<cfoutput>#application.rootpath#</cfoutput>/Logout.cfm">Logout</a></li>
											</ul>
											<br clear="all" />
									    </div>
										<div id="skin_header_welcome">
										Welcome <span id="skin_username"><cfif IsDefined("userModel") and !IsSimpleValue(userModel) and len(trim(userModel.getUserName()))>#userModel.getUserName()#<cfelse>UNKNOWN</cfif></span>
										</div>
										<div id="skin_header_info">
										     <!--Location: Robins AFB Julian: -->#UCASE(TRIM(DateFormat(Now(),"dd-mmm-yyyy")))#
										</div>
										<div id="change_settings" style="font-size:8pt;">
										     <span style="color:white;text-decoration:underline;cursor:pointer;">Change Settings</span>
										</div>
									</div>
								</div>
								<div id="skin_header_bottom">										
                                    <div id="dashboard" >
	                                	<div class="detail">
										    <table class="dashboardTable">
										    	
											   	<thead class="data">
											   		<tr>
														<th>CONFIG</th>
														<th>% FMC</th>
														<th>TOTAL ASSETS</th>
														<th>FMC</th>
														<th>PMC</th>
														<th>NMCM</th>
														<th>NMCS</th>
														<th>CNDM</th>
														<th>UNKN</th>
														
													</tr>
											   	</thead>
												<tbody class="dataTables_scrollBody">
													<cfif isDefined("dashboard") and isQuery(dashboard)>
														<cfloop query="dashboard">
														<tr>
															
				                                            <td>#encodeForHTML(config)#</td>
	                                                        <td>#encodeForHTML(fmc_pct)#</td>
	                                                        <td>#encodeForHTML(total)#</td>
	                                                        <td>#encodeForHTML(fmc)#</td>
	                                                        <td>#encodeForHTML(pmc)#</td>
	                                                        <td>#encodeForHTML(nmcm)#</td>
	                                                        <td>#encodeForHTML(nmcs)#</td>
	                                                        <td>#encodeForHTML(cndm)#</td>
															<td>#encodeForHTML(unkn)#</td>
				                                        </tr>
														</cfloop>
													</cfif>
												</tbody>
										    </table>
									   </div>
									   <div class="intransit" id="dashboardTransit">
									       <table class="dashboardTable">
									       	<caption align="top">ASSET IN-TRANSIT STATUS</caption>
									       	<thead>
									       		<tr>
									       			<th>INBOUND</th>
													<th>OUTBOUND</th>
									       		</tr>
									       	</thead>
											<tbody>
												<tr>
                                                    <td class="inbound">
                                                    	<div id="viewInBound" style="font-size:8pt;">
														     <span style="text-decoration:underline;cursor:pointer;">#inbound#</span>
														</div>
                                                    </td>
                                                    <td class="outbound">
                                                    	<div id="viewOutBound" style="font-size:8pt;">
														     <span style="text-decoration:underline;cursor:pointer;">#outbound#</span>
														</div>
                                                    </td>
                                                </tr>
											</tbody>
										   </table>
									   </div>
                                    </div>
                                    <div id="application_menu">
                                        <cfif isDefined("programPath") and len(trim(programPath))>
                                            <ul id="menulist">
                                                <cfif showMaintenance>
                                                  <li id="menuMaint" class="parent"><a href="<cfoutput>#programPath#</cfoutput>/maintenance/backlog.cfm">MAINTENANCE</a></li>
                                                </cfif>
                                                <cfif showConfig>
                                                  <li id="menuConfig" class="parent"><a href="<cfoutput>#programPath#</cfoutput>/configuration/configuration.cfm">CONFIGURATION</a></li>
                                                </cfif>
                                                <cfif showReports>
                                                  <li id="menuReports" class="parent"><a href="/ReportsGen2/RIMSS/index.cfm?pgm=<cfoutput>#programInSession#</cfoutput>" target="_blank">REPORTS</a></li>
                                                </cfif>
                                                <cfif showSorties>
                                                  <li id="menuSortie" class="parent"><a href="<cfoutput>#programPath#</cfoutput>/sortie/sortieSearch.cfm">SORTIES</a></li>
                                                </cfif>
												<cfif showSpares>
                                                  <li id="menuSpares" class="parent"><a href="<cfoutput>#programPath#</cfoutput>/spares/spares.cfm">SPARES</a></li>
                                                </cfif>
                                                <cfif showInventory>
                                                  <li id="menuInventory" class="parent"><a href="<cfoutput>#programPath#</cfoutput>/inventory/inventory.cfm">INVENTORY</a></li>
                                                </cfif>
                                                <cfif ATTRIBUTES.showAdmin>
                                                	<li id="menuAdmin" class="parent"><a>ADMIN</a>
                                                		<ul>
                                                			<li><div>
                                                				<a href="/RIMSS/admin/adhoc/index.cfm">Ad-Hoc</a>	
                                                			</div></li>
                                                			<!---<li><div>Item2</div></li>
                                                			<li><div>Item3</div></li>
                                                			<li><div>Item4</div></li>--->
                                                		</ul>
                                                	</li>
                                                </cfif>
                                            </ul>
                                        </cfif>
                                    </div>
                                </div>
						 </div>
						</td>
					</tr>		
				</table>	
				</cfoutput>
	    	</div>
		<div class="content">