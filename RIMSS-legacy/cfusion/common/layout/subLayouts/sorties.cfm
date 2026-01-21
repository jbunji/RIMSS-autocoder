
<cfoutput>
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
			<cfset subMenuProgram = ""/>
			
			<cfif isDefined("ATTRIBUTES.program")>
				<cfset subMenuProgram = ATTRIBUTES.program/>
			</cfif>
			<cfset sortieSearch = new cfc.facade.SessionFacade().getValue("sortieCriteria")>
			<cfif len(trim(sortieSearch))>
				<cfparam name="form.sortieCriteria" default="#trim(sortieSearch)#"/>
			</cfif>
			 
			 <cfset maintLevel = application.sessionManager.getMaintLevelSetting()/>
             <cfif ucase(left(maintLevel,1)) eq "D">
			     <cfthrow message="You have insufficent privs to access this content" type="UnauthorizedUser"/>	 
			 </cfif>

		</cfsilent>
	</cfif>
	<cfsilent>
		<cfset sortieSearch = new cfc.facade.SessionFacade().getValue("sortieCriteria")>
	    <cfif len(trim(sortieSearch))>
	        <cfparam name="form.sortieCriteria" default="#trim(sortieSearch)#"/>
	    </cfif>
	</cfsilent>
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

       try {
        $(document).ready(function(){

            $('#sortieCriteria').keydown(function(event){
                //13 = enter key is pressed
                if (event.which == 13) {
                    setAction('search.sortie', this);
                    setMethod('forward', this);
                }
            }).keyup(function(event){
                //13 = enter key is pressed
                if (event.which == 13) {
                    event.preventDefault();
                    $('#sortieCriteria').trigger('click');
                    return false;
                }
            });
			
			$("#excelLink").click(function(){
				$("#exportType").val("excel");
				
				$("#sortie_export_form").submit();
			});
			$("#pdfLink").click(function(){
				$("#exportType").val("pdf");
				
				$("#sortie_export_form").submit();
			});
			$("#printLink").click(function(){
				$("#exportType").val("print");
				
				$("#sortie_export_form").submit();
			});
			
            
        });
    }catch(err){
        
    }

	

</script>




<cfif application.sessionManager.userModelExists() or len(trim(submenuProgram))>
	<div class="clearfix" <cfoutput>id="#lcase(trim(subSection))#"</cfoutput>>
		<div id="maintenance_menu">
			<table style="width: 100%">
				<tr>
					<td>
						<div id="maintenance_menu_buttons">
					    	<cfoutput>
					       <!--- #application.rootPath#/#ATTRIBUTES.layout#/controller/mainController.cfc--->
					        <form name="sorties_menu_form" id="sorties_menu_form" method="post" action="#application.rootPath#/#Lcase(attributes.layout)#/sortie/">
					        	<!---<input type="hidden" readonly="readonly" name="action" id="sortieMenuAction"/>
								<input type="hidden" readonly="readonly" name="method" id="sortieMenuMethod" value="forward"/>--->
					            <input type="submit" name="createSortie" value="CREATE SORTIE" id="createSortie" class="menubuttons left" onfocus="if(this.blur)this.blur()" onclick="setAction('create.sortie',this);setMethod('forward',this);" />
					            <input type="submit" name="importSortie" value="IMPORT SORTIE" id="importSortie" class="menubuttons middle" onfocus="if(this.blur)this.blur()" onclick="setAction('import.sortie',this);setMethod('forward',this);" />
					            <input type="text" alt="Search Sorties" title="Search Sorties" name="sortieCriteria" id="sortieCriteria" <cfif Structkeyexists(form,"sortieCriteria")>value="#encodeForHTML(trim(form.sortieCriteria))#"</cfif>/>
			                    <input type="submit" alt="Search Sorties" title="Search Sorties"  name="searchSpares" id="searchSorties" class="search" value="" onclick="setAction('search.sortie',this);setMethod('doAction',this);"  >  
							</form> 
			
							</cfoutput>                            
					    </div>
					</td>
					<td>
						 <div id="system_category_menu"><!--- system_category_menu --->
					        <!---<ul id="system_category"><!--- system_category --->
					            <li><a id="as">AIRBORNE SYSTEMS</a></li>
					            <li><a id="gs">GROUND SYSTEMS</a></li>
					            <li><a id="ds">DISPLAY SYSTEMS</a></li>
					            <li><a id="se">SUPPORT EQUIPMENT</a></li>
					        </ul>--->
					        <!---<input type="hidden" name="equipType" value=""/>--->
					        <span id="syscat" style="display:none">as</span>
					    </div>
					</td>
					<td>
						<cfif isDefined("request.context.sortieResults")>
						<div class="exportOptions">
							<cfoutput>
							<form name="sortie_export_form" id="sortie_export_form" method="post" action="#application.rootPath#/#Lcase(attributes.layout)#/sortie/">
								<cfif Structkeyexists(form,"sortieCriteria")>
									<input type="hidden" id="sortieCriteria" name="sortieCriteria" value="#encodeForHTML(trim(form.sortieCriteria))#"/>
								</cfif>
								<input  type="hidden" id="serno" name="serno" <cfif StructKeyExists(request.context,'sortieSerno')>value="#request.context.sortieSerno#"</cfif> />
								<input  type="hidden" id="missionid" name="missionid" <cfif StructKeyExists(request.context,'missionId')>value="#request.context.missionId#"</cfif> />
								<input  type="hidden" id="sortieDate" name="sortieDate" <cfif StructKeyExists(request.context,'sortieDate')>value="#request.context.sortieDate#"</cfif> />
								<input type="hidden" id="exportType" name="exportType" value=""/>
								<input type="hidden" id="action" name="action" value="export.sortie"/>
								
								<ul >
				                    <li class="noLabel" id="printLink"><a href="##" target="_blank"></a></li>
				                    <li id="pdfLink"><a href="##">Export to PDF </a></li>
				                    <li id="excelLink"><a href="##">Export to Excel</a></li>
				                </ul>
							</cfoutput>
							</form>
						</div>
						</cfif>
					</td>
				</tr>
			</table>
		    
		   
		</div>
	</div>
</cfif>
