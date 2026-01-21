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
	
	<cfset configSearch = new cfc.facade.SessionFacade().getValue("configurationCriteria")>
   	<cfif len(trim(configSearch))>
    	<cfparam name="form.configurationCriteria" default="#trim(configSearch)#"/>
   	</cfif>
   	<cfparam name="request.context.assetID" default="0"/>
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
			padding-right: 10px;
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
        
        
               try{
			    		
			    		var subpage = document.getElementById("headerTitle").innerHTML;
			    		//alert(subpage);
			    		if(subpage == 'Search Configuration'){
				    		var searchString = document.getElementById("configurationCriteria").value;
				    		
						 	if(searchString.length > 0 ){
						 							 		
						 		document.getElementById("btnClear").style.visibility = "visible";
						 	}
						 	else{
						 		document.getElementById("btnClear").style.visibility = "hidden";
						 	}   
					 	} 		    		
    			}catch(err){
  							//document.getElementById("demo").innerHTML = err.message;
						}
    		  			
			});
        
       
        
        
        
        
	
	   
	   
	   
	   try {
		$(document).ready(function(){
		
			$('#configurationCriteria').keydown(function(event){
				//13 = enter key is pressed
				if (event.which == 13) {
					setAction('search.configuration', this);
					setMethod('forward', this);
				}
			}).keyup(function(event){
				//13 = enter key is pressed
				if (event.which == 13) {
					event.preventDefault();
					$('#searchConfiguration').trigger('click');
					return false;
				}
			});
			
			$('#createConfiguration').click(function(event){
				createConfig();
			});
			
		});
	}catch(err){
		
	}

</script>
<script>
	function clearSearch(){
		try{
		document.getElementById("configurationCriteria").value = "";
		setAction('search.configuration','');
		//$('#searchConfiguration').trigger('click');
		
		var url = window.location.origin + '/RIMSS/236/configuration/configuration.cfm?ClearSearch=true';
		//alert(url);
	    
		location.replace(url);
		}catch(err){
		
		}	
				
	}
	
	function SearchKeyPress(){
		try{
		        var subpage = document.getElementById("headerTitle").innerHTML;
			    //alert(subpage);
				if(subpage == 'Search Configuration'){
					var searchString = document.getElementById("configurationCriteria").value;
		    		//alert(searchString.length);
				 	if(searchString.trim().length > 0 ){
				 							 		
				 		document.getElementById("btnClear").style.visibility = "visible";
				 	}
				 	else{
				 		document.getElementById("btnClear").style.visibility = "hidden";
				 	}  
			 	}  	
			 }catch(err){
		
			}	 		    	    
		
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
					        
					        <form name="maintenance_menu_form" method="post" action="#application.rootPath#/#ATTRIBUTES.layout#/configuration/index.cfm">
					            <input type="submit" name="createConfiguration" value="CREATE CONFIGURATION" id="createConfiguration" class="menubuttons left" onfocus="if(this.blur)this.blur()" onclick="setAction('new.configuration',this);setMethod('forward',this);" />								
								<cfif structKeyExists(url, "ClearSearch") and url.ClearSearch EQ 'true' >
					            	<input type="text" alt="Search Configuration"  onkeypress="SearchKeyPress();" onkeyup="SearchKeyPress();" onchange="SearchKeyPress();" title="Search Configuration" name="configurationCriteria" id="configurationCriteria" <cfif Structkeyexists(form,"configurationCriteria")>value=""</cfif>/>								
								<cfelse>
									<input type="text" alt="Search Configuration" onkeypress="SearchKeyPress();" onkeyup="SearchKeyPress();" onchange="SearchKeyPress();" title="Search Configuration" name="configurationCriteria" id="configurationCriteria" <cfif Structkeyexists(form,"configurationCriteria")>value="#encodeForHTML(form.configurationCriteria)#"</cfif>/>
								</cfif>														
								<input type="submit" alt="Search Configuration" title="Search Configuration" name="searchConfiguration" id="searchConfiguration" class="search" value="" onclick="setAction('search.configuration',this);"/>
					            <input type="button" id="btnClear" name="btnClear" value="Clear Search" onclick="clearSearch();" style="visibility:hidden;" />
					        </form> 
			
							</cfoutput>                            
					    </div>
					</td>
					<td>
						<div id="system_category_menu" style="width:100%"><!--- system_category_menu --->
					        <cfif showSubSection>
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
					</td>
					<td>
						<div class="exportOptions">
						<cfif (StructKeyExists(REQUEST.context,"qSearch") and REQUEST.context.qSearch.recordcount) OR (StructKeyExists(REQUEST.context,"qconfigs") and REQUEST.context.qconfigs.recordcount)>
							<cfoutput>
							<ul >
			                    <li class="noLabel" id="printLink"><a href="#application.rootPath#/#ATTRIBUTES.layout#/configuration/index.cfm?action=export.config&exportType=print&assetID=#request.context.assetID#" target="_blank"></a></li>
			                    <!---<li id="pdfLink"><a href="#application.rootPath#/#ATTRIBUTES.layout#/configuration/index.cfm?action=export.config&exportType=pdf&assetID=#request.context.assetID#">Export to PDF </a></li>--->
			                    <!---<li id="excelLink"><a href="#application.rootPath#/#ATTRIBUTES.layout#/configuration/index.cfm?action=export.config&exportType=excel&assetID=#request.context.assetID#">Export to Excel</a></li>--->
			                	<li id="exportButtons"></li>
			                </ul>
							</cfoutput>
						</cfif>
						</div>
					</td>
				</tr>
			</table>
		   
		   
		   	
		</div>
	</div>
</cfif>