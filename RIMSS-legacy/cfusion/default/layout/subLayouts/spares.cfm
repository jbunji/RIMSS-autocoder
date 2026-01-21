<cfoutput>
	<cfset request.subSection = "AIRBORNE"/>
	<cfparam name="showSubSection" default="true"/>
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
			<cfset currentProgram = "default"/>
		<cfif len(trim(application.sessionManager.getProgramSetting()))>
		  <cfset currentProgram = application.sessionManager.getProgramSetting()/>
		</cfif>
		
		<cfif Structkeyexists(ATTRIBUTES,"showSubSection") and isBoolean(ATTRIBUTES.showSubSection)>
			<cfset showSubSection = ATTRIBUTES.showSubSection/>
		</cfif>
		
		
		
		</cfsilent>
	</cfif>
	
	<cfset sparesSearch = new cfc.facade.SessionFacade().getValue("sparesCriteria")>
   	<cfif len(trim(sparesSearch))>
    	<cfparam name="form.sparesCriteria" default="#trim(sparesSearch)#"/>
   	</cfif>
   	
   	<cfif not application.sessionManager.userHasPermission("PCS_ACTTS_SPARES")>
        <cfthrow message="You have insufficent privs to access this content" type="UnauthorizedUser"/>
        <cfabort/>
    </cfif>
   	
</cfoutput>


<style>
	.export {
			width:350px;
			min-width:350px; 
		}
		
		.exportOptions {
			clear:both;
			width:auto;
			min-width:350px; 
			float: right;
			margin: 0;
			white-space: nowrap;
			padding-right: 100px;
		}
		
		.exportOptions .noLabel {
           width:50px;
		   height:32px;
		   display:block;
        }
		
        .exportOptions ul {
            margin:0px auto;
            padding:0px;
            list-style:none;
            color:white;
            width:auto;
			font-size:10px;

        }

        .exportOptions li {
            float:left;
			height:32px;
			width:112px;


        }
        
        .exportOptions li a {
            color:white;
            text-decoration:none;
			display:block;
			height:32px;
			padding-left:2px;
			line-height:32px;
			font-weight:bold;
        }
		
		.exportOptions li a:hover {
		  color:#7bbaf9;	
		}
		
		
		.exportOptions #pdfLink a {
			padding-left:5px;
		}
		
		.exportOptions #printLink {
			background-image: url("../../common/images/icons/print.png");
			background-position:center;
			background-repeat:no-repeat;
			
		}
		
		.exportOptions #pdfLink {
            background-image: url("../../common/images/icons/pdf.png");
            background-position:right;
			background-repeat:no-repeat;
			text-align:left;
			padding-left:5px;
            
        }
		
		.exportOptions #excelLink {
            background-image: url("../../common/images/icons/excel.png");
            background-position:right;
			background-repeat:no-repeat;
			text-align:left;

            
        }	
		
		

       .link a{
		   text-decoration:none;
           }	
		
	
</style>

<script>

	   $(document).ready(function(){
        <cfoutput>setupSubSystem('#lcase(trim(currentProgram))#');</cfoutput>
	   });

	   try {
		$(document).ready(function(){

			$('#sparesCriteria').keydown(function(event){
				//13 = enter key is pressed
				if (event.which == 13) {
					setAction('search.spares', this);
					setMethod('forward', this);
				}
			}).keyup(function(event){
				//13 = enter key is pressed
				if (event.which == 13) {
					event.preventDefault();
					$('#sparesCriteria').trigger('click');
					return false;
				}
			});
			
		});
	}catch(err){
		
	}

</script>
<cfif application.sessionManager.userModelExists() or len(trim(submenuProgram))>
	<div class="clearfix subSection" <cfoutput>id="#lcase(trim(subSection))#"</cfoutput>>
		<div id="maintenance_menu">
			<table style="width:100%">
				<tr>
					<td>
						<div id="maintenance_menu_buttons">
					    	<cfoutput>
					        
					        <form name="maintenance_menu_form" method="post" action="#application.rootPath#/#ATTRIBUTES.layout#/spares/index.cfm">
					            <input type="submit" name="createSpare" value="CREATE SPARE" id="createSpare" class="menubuttons left" onfocus="if(this.blur)this.blur()" onclick="setAction('add.spare',this);setMethod('forward',this);" />
								<input type="submit" name="listSpares" value="LIST SPARES" id="listSpares" class="menubuttons middle" onfocus="if(this.blur)this.blur()" onclick="setAction('list.spares.page',this);" />
								<input type="text" alt="Search Spares" title="Search Spares" name="sparesCriteria" id="sparesCriteria" <cfif Structkeyexists(form,"sparesCriteria")>value="#encodeForHTML(trim(form.sparesCriteria))#"</cfif>/>
			                    <input type="submit" alt="Search Spares" title="Search Spares"  name="searchSpares" id="searchSpares" class="search" value="" onclick="setAction('search.spares',this);"  >
					        </form> 
			
							</cfoutput>                            
					    </div>
					</td>
					<td>
						
					</td>
					<td>
						<cfif isDefined("request.context.qSpares")>
						<div class="exportOptions">
							<cfoutput>
							<ul >
			                    <li class="noLabel" id="printLink"><a href="#application.rootPath#/#ATTRIBUTES.layout#/spares/index.cfm?action=export.spares&exportType=print" target="_blank"></a></li>
			                    <li id="pdfLink"><a href="#application.rootPath#/#ATTRIBUTES.layout#/spares/index.cfm?action=export.spares&exportType=pdf">Export to PDF </a></li>
			                    <li id="excelLink"><a href="#application.rootPath#/#ATTRIBUTES.layout#/spares/index.cfm?action=export.spares&exportType=excel">Export to Excel</a></li>
			                </ul>
							</cfoutput>
						</div>
						</cfif>
					</td>
				</tr>
			</table>
		    
		   <!---<div id="system_category_menu"><!--- system_category_menu --->
	        <cfif showSubSection>
		        <ul id="system_category"><!--- system_category --->
		            <li><a id="as">AIRBORNE SYSTEMS</a></li>
		            <li><a id="gs">GROUND SYSTEMS</a></li>
		            <li><a id="ds">DISPLAY SYSTEMS</a></li>
		            <li><a id="se">SUPPORT EQUIPMENT</a></li>
		        </ul>
			</cfif>
	        <!---<input type="hidden" name="equipType" value=""/>--->
	        <span id="syscat" style="display:none">as</span>
			
	   	   </div>--->
		</div>
	</div>
</cfif>