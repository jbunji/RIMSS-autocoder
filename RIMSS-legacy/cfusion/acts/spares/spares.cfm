<cfsilent>
	<cfimport taglib="../layout" prefix="RIMSS"/>
	<cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
	<cfset dbUtils = application.objectFactory.create("DBUtils") />
	<cfset utils = new cfc.utils.utilities()/>
    <cfset spareNouns = dropDownUtilities.getNouns(program = APPLICATION.sessionmanager.getProgramSetting()) />
    <cfset spareStatusList = dropDownUtilities.getProgramPartStatus(UCASE(TRIM(APPLICATION.sessionmanager.getProgramSetting()))) />
	<cfset spareLocList = dropDownUtilities.getSpareLocations(UCASE(TRIM(APPLICATION.sessionmanager.getProgramSetting()))) />
	<cfset programLookup = application.sessionManager.getProgramSetting() />
	<cfset programIdLookup = application.sessionManager.getProgramIdSetting() />
	<cfset sysLookup = dbUtils.getSysIdByProgram(programLookup)/>	   
	<cfset getSoftwareList = dbUtils.getSoftwareBySysId(sysLookup)/> 
	
	<cfsetting showdebugoutput="false" >
	
</cfsilent>


<RIMSS:layout section="spares">
    <RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<style>
		.disable{
			opacity:0.5;
			-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
			color:gray;
		}
		
		#softwareTable {
		    height: 100px;
		    
		    display: block;
		    
		    width: 100%;
		    overflow: auto;
		}	
		
		#btnUpdate{
			display: none;
		}		
		
		.highlightrow td {
			color: black;
		    background-color: yellow;
		}
		
		#remarks {
			width: 400px; 
		}
		
		td {
		    padding:.2em .5em
		}	
		
	</style>
	<script src="../layout/js/spares.js"></script>
	<script>
	$(function() { 
	
	//Creating report timestamp for exports	
	var d = new Date();
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	function addZero(i) {
	    if (i < 10) {
	        i = "0" + i;
	    }
	    return i;
	}
	
	var reportTimeStamp = "Report Prepared on: " +  days[d.getUTCDay()] + ", " +  months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " +  d.getUTCFullYear() + ", " + addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes()) + ":" + addZero(d.getUTCSeconds()) + " ZULU";
	
	//Setting date string for excel filename
	var excelDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
	
	var buttonCommon = { exportOptions: { format: { body: function(data, column, row, node) {if (column == 4) { return $(data).find("option:selected").text() } else return data } } } };
	
	var sparesTable = $('#sparesTable').DataTable( {
		        dom: 'Brtp',
		        "paging": false,
		        //Options below control the size and scrolling options of tables
		    	"bAutoWidth": false,
				"bScrollCollapse": false,
		        "bSort" : true,
		        "aaSorting": [],
		        "columnDefs": [{
		        	"targets": 'noSort',
		        	"orderable": false
		        }],
		        buttons: [
		        	{
		        		extend: 'pdfHtml5',
		        		className: 'pdfBtn',
		        		messageTop: document.getElementById("skin_sub_title").innerText + ' - NOUN: ' + document.getElementById("spareNouns").value,
		        		
		        		//PLACEHOLDER text is overwritten below
		        		title: 'PLACEHOLDER',
		                messageBottom: 'PLACEHOLDER',
		                
		                filename: 'CUI_Spares_' + excelDate,
		                orientation: 'landscape',
		                text: 'Export to PDF',
		                exportOptions: {
				            columns: 'th:not(.noSort)',
				              format: {
							    body: function ( inner, rowidx, colidx, node ) {
							      if ($(node).children("select").length > 0) {
							        // Select Drop Down
							        var selectNode = node.firstElementChild;
							        var txt = selectNode.options[selectNode.selectedIndex].text;
							        return txt;
							        // Input Drop Down
							      } else if($(node).children("input").length > 0){
							      		return $(node).children("input").val();
							      	}
							      	// This is the software column
							      	else if(colidx == 7){
							      		var li_array = node.children[0].children[0].children;
							      		var returnVal = "";
							      		for (i in li_array) {
							      			if (typeof li_array[i].innerText !== 'undefined') {
							      				//if last element of array, don't add " | " at end of string
							      				if (i == (li_array.length - 1)) {
							      					returnVal = returnVal + li_array[i].innerText;
							      				//adding " | " at end to add separation if there are multiple software items
							      				} else {
							      					returnVal = returnVal + li_array[i].innerText + " | ";
							      				}
							      			}
							      		}
							      		return returnVal;
							      	}
							      else{
							        return inner; // the standard cell contents
							      }
							    }
							  }
				         },
		                customize: function(doc) {
							//Overwriting PLACEHOLDER text above with CUI in order to add asterisks. Styling CUI text
			   				doc.content[0].alignment = 'center';
			   				doc.content[0].text = '*****CONTROLLED UNCLASSIFIED INFORMATION*****';
			   				doc.content[0].bold = 'true';
			   				doc.content[0].fontSize = '14';
			   				
			   				//Styling report title
			   				doc.content[1].alignment = 'center';
			   				doc.content[1].fontSize = '15';
			   				
			   				//Overwriting PLACEHOLDER text above with CUI in order to add asterisks. Styling CUI text.
			   				doc.content[3].alignment = 'center';
			   				doc.content[3].text = '*****CONTROLLED UNCLASSIFIED INFORMATION*****';
			   				doc.content[3].bold = 'true';
			   				doc.content[3].fontSize = '14';
			   				
			   				//Setting font size for table. Setting size too large can cause table to cut off on PDF export
			   				doc.styles.tableHeader.fontSize = 10;
	                        doc.styles.tableBodyEven.fontSize = 10;
	                        doc.styles.tableBodyOdd.fontSize = 10;     
				      	}
		        	},
		            {
		                extend: 'excelHtml5',
		                className: 'excelBtn',
		                title: "CONTROLLED UNCLASSIFIED INFORMATION",
		                //messageTop: 'NOUN: ' + document.getElementById("sranoun").value + ' | PARTNO: ' + document.getElementById("srapartno").value + ' | SERNO: ' + document.getElementById("sraserno").value,
		                messageTop: document.getElementById("skin_sub_title").innerText + ' - NOUN: ' + document.getElementById("spareNouns").value,
		                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
		                filename: 'CUI_Spares_' + excelDate,
		                text: 'Export to Excel',
		                exportOptions: {
				            columns: 'th:not(.noSort)',
				              format: {
						    body: function ( inner, rowidx, colidx, node ) {
						      if ($(node).children("select").length > 0) {
						        // Select Drop Down
						        var selectNode = node.firstElementChild;
						        var txt = selectNode.options[selectNode.selectedIndex].text;
						        return txt;
						        // Input Drop Down
						      } else if($(node).children("input").length > 0){
						      		return $(node).children("input").val();
						      	}
						      	// This is the software column
						      	else if(colidx == 7){
						      		var li_array = node.children[0].children[0].children;
						      		var returnVal = "";
						      		for (i in li_array) {
						      			if (typeof li_array[i].innerText !== 'undefined') {
						      				//if last element of array, don't add " | " at end of string
						      				if (i == (li_array.length - 1)) {
						      					returnVal = returnVal + li_array[i].innerText;
						      				//adding " | " at end to add separation if there are multiple software items
						      				} else {
						      					returnVal = returnVal + li_array[i].innerText + " | ";
						      				}
						      			}
						      		}
						      		return returnVal;
						      	}
						      else{
						        return inner; // the standard cell contents
						      }
						    }
						  }
				         },
		            }		            
		            
		        ]
		} ); 	
		    
	//Detatching buttons from table and appending them to a div, so that buttons can be moved on page   	
	sparesTable.buttons().container().appendTo('#exportButtons');
});
	</script>
	<script>
        try {
            $(document).ready(function(){
            	
                //setupEditHighlight();
                setupHighlight();

				
                $('#btnSearch').on("click",function(){
                    $(this).closest("form").setActionMethod("list.spares","forward");
					$(this).closest("form").submit();
                });
				
				/*$('#spareNouns').on("change keyup",function(){
                    $(this).closest("form").setActionMethod("list.spares","forward");
					$(this).closest("form").submit();
                });*/
				
				$('#btnAdd').on("click",function(){
                    $(this).closest("form").setActionMethod("add.spare","forward");
                });
                
				$('#btnUpdate').on("click",function(){
					var path = "<CFOUTPUT>#application.rootpath#</CFOUTPUT>";
					
                    window.location.href = path + "/acts/spares/controller.cfm?action=updateSpares";
                });                                            
				
				$('.deleteIcon').on("click",function(event){
                    if (removeConfirmation()) {
                        $(this).closest("form").setActionMethod("delete.spare", "forward");
                    }else{
						event.preventDefault();
						return false;
						
					}
                });
				
				$("input[name='check']").change(function() {
					var id = $(this).closest(".rootNode").attr("id");
				
					if($(this).attr("checked")){ 
						//enable everything in the row including embedded form elements
						$(this).closest("tr").children().children().removeAttr("disabled");
						$(this).closest("tr").children().children().children().removeAttr("disabled");
						$(this).closest("tr").children().children().children().children().children().children().removeAttr("disabled");	
						$(this).closest("tr").children().children().children().children().children().children().children().removeAttr("disabled");		
						$(this).closest("tr").toggleClass('highlightrow');
						
						document.getElementById("btnUpdate").style.display="block";
							
						$("#"+id).find(".sw2").show();
						$("#"+id).find(".sw1").hide();
						
					}
					else {				
						
						//make all disabled
						$(this).closest("tr").find("[disabled!=true]").attr("disabled",true);
						$(this).closest("tr").toggleClass('highlightrow');
						
						//but enable the check box to edit
						$(this).removeAttr("disabled") 	
						checkChecked('searchSparesResults');
						
						$("#"+id).find(".sw1").show();
						$("#"+id).find(".sw2").hide();
						
						} ;
					});
						
					function checkChecked(formname) {
						// check to see if any edit checkboxes are checked
						// to hide/show the Mass Update button
					    var anyBoxesChecked = false;
					    $('#' + formname + ' #check').each(function() {
					        if ($(this).is(":checked")) {
					            anyBoxesChecked = true;
					        }
					    });
					 
					    if (anyBoxesChecked == false) {
					      document.getElementById("btnUpdate").style.display="none";
					      return false;
					    } 
					}											
						
				
                $('#dtSearch').on('keyup',function(e){
                    dt.fnFilter($(this).val());
                   });
                
                //Add Data Table
                /*var dt = $('#sparesTable').dataTable({ 
                      "bFilter": true,
                      "sDom":"t"
               });*/

               //modifyDTColumns();
			   
            });                                   
			
        }catch(err){}

    </script>
	
	
	<cfoutput>
       <div class="message #msgStatus#">#msg#</div>
       
    </cfoutput>
    <div class="headerContent">
        <div class="headerTitle">List Spares</div>
    </div>
    
	<div class="font12 mainContent">
        <form id="searchSpares" name="searchSpares" method="post" action="index.cfm?action=list.spares">
            <table class="two_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                        <td class="column">
                            <div class="columnContent" style="text-align:center">
                                <div class="formField">
                                    <label class="font10" id="asset_id_label">Noun:</label> 
                                    <cfoutput>
                                        <select name="spareNouns" id="spareNouns" >
                                        	<option value=""></option>
											<cfif isDefined("spareNouns") and isQuery(spareNouns)>
												<cfloop query="spareNouns">
													<option <cfif Structkeyexists(form,"spareNouns") and UCASE(TRIM(form.spareNouns)) eq UCASE(TRIM(NOUN))>selected="selected"</cfif>  value="#encodeForHTML(noun)#">#encodeForHTML(noun)#</option>
												</cfloop>
											</cfif>
											
                                        </select>
                                    </cfoutput>
								</div>
                            </div>
                        </td>    
                    </tr>
                    <tr>
                        <td class="column" colspan="2">
                            <div class="columnContent">
                                <div class="formField button_container">
                                    <input type="submit" value="ADD" name="btnAdd" id="btnAdd" />
                                    <input type="submit" value="SEARCH" name="btnSearch" id="btnSearch" />
                                    
                                </div>                                    
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
	<cfif isDefined("rc.qSpares")>			
		<div class="mainContent">  
			<cfif rc.qSpares.count()>
			<form id="searchSparesResults" name="searchSparesResults" method="post"  action="controller.cfm?action=updateSpares"><input type="submit" value="MASS UPDATE" name="btnUpdate" id="btnUpdate" />
			
			   <table class="globalTable sticky-headers" id="sparesTable">
			         <thead>
			         	<tr>
							<th colspan="13" class="filter">
								<cfoutput><cfif rc.qSpares.count() gt 1> <div style="float:left">Spares Count: #rc.qSpares.count()#</div></cfif></cfoutput>
                              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
                            </th>
                        </tr>
			         	<tr>
			         		<th class="noSort">&nbsp;</th>
			         		<th class="noSort">&nbsp;</th>
							<th>Spare Noun</th>
							<th>Spare Part Number</th>
							<th>Spare Serial Number</th>
							<th>Status</th>
							<th>Warranty Exp</th>
							<th>Location</th>
							<th>Depot</th>
							<th>Software Number/Title</th>
							<th>Remarks</th>
							<th class="noSort">&nbsp;</th>
							<th class="noSort ">&nbsp;</th>
			         	</tr>
						
			         </thead>
				   <tbody> 	     	
			       <cfoutput>
				   <cfloop condition="#rc.qSpares.next()#">					   
				   	   <cfset swQry = #dbUtils.getSoftwareByAssetId(val(rc.qSpares.getAssetId()))# />				   	   
				   	   
				   	   <cfset warrantyDate = isDate(rc.qSpares.getMfgDate()) ? UCASE(TRIM(DateFormat(rc.qSpares.getMfgDate(),"dd-mmm-yyyy"))) : ""/>    
				        <tr id="node_#rc.qSpares.getEncryptedAssetId()#" data-id="node_#rc.qSpares.getEncryptedAssetId()#" class="<cfif rc.qSpares.getCursor() mod 2> odd <cfelse> even </cfif> <cfif rc.qSpares.getIsOrdered() EQ 'Y'>disable</cfif> rootNode">
				        	
				        	<td><cfif rc.qSpares.getIsOrdered() EQ 'N'><input type="checkbox" id="check" name="check"></cfif><input disabled="true" name="assetID" type="hidden" value="#rc.qSpares.getAssetId()#"></td>
				        	
                            <td class="edit editIcon"><cfif rc.qSpares.getIsOrdered() EQ 'N'><a href="index.cfm?action=edit.spare&spareAsset=#rc.qSpares.getEncryptedAssetId()#"></a></cfif></td>
                            <td>#encodeForHTML(trim(rc.qSpares.getNoun()))#</td>
                            <td>#encodeForHTML(trim(rc.qSpares.getPartNo()))#</td>
                            <td>#encodeForHTML(trim(rc.qSpares.getSerNo()))#</td>
                            <td>
								<select class="disabled" disabled="true" name="spareStatus" id="spareStatus">
									<cfif isDefined("spareStatusList") and isArray(spareStatusList)>
									    <cfloop array="#spareStatusList#" index="curSpare">
											<cfif Arraylen(curSpare) gte 2>
											  <option value="#curspare[1]#" <cfif trim(rc.qSpares.getStatus()) eq trim(curSpare[2])>selected="selected"</cfif>>#curSpare[2]#</option>
											</cfif>
										</cfloop>
									</cfif>
								</select>   
							</td>                         
							<td>#encodeForHTML(trim(warrantyDate))#</td>
                            <td>
                            	<select class="disabled" disabled="true" name="spareLocation" id="spareLocation">
                            		<cfif isDefined("spareLocList") and isArray(spareLocList)>
                            			<cfloop array="#spareLocList#" index="curSpare">
                                            <cfif Arraylen(curSpare) gte 2>
                                              <option value="#curSpare[1]#" <cfif trim(rc.qSpares.getlocIDC()) eq trim(curSpare[1])>selected="selected"</cfif>>#curSpare[2]#</option>
                                            </cfif>                            				
                            			</cfloop>
                            		</cfif>
                            		<!---<p title="Site: #encodeForHTML(trim(rc.qSpares.getCurrentLoc()))# Unit: #encodeForHTML(trim(rc.qSpares.getCurrentUnit()))#">#encodeForHTML(trim(rc.qSpares.getCurrentLoc()))#</p>--->
                            	</select>
                            </td>
							<td>#encodeForHTML(trim(rc.qSpares.getDepotLoc()))#</td>
							<td width="30%">
									  <div class="sw1">
										<ul class="swul">
										<cfif swQry.recordCount>
										  	<cfloop query="swQry">
										  		<li>#encodeForHTML(SW_TITLE)# - #encodeForHTML(SW_NUMBER)#</li>
										  	</cfloop>
									  	<cfelse>
									  		<li style="list-style-type:none">&nbsp;</li>
									  	</cfif>
									  	</ul>
									  </div>
									  <div class="sw2" style="display:none">
	                                	  <cfset swIDs = ValueList(swQry.sw_id)>
	                                      <cfif getSoftwareList.recordcount GT 0>
	                                         <table class="globaltable" name="softwareTable" id="softwareTable">
	                                            <thead>
	                                                <tr>
	                                                    <th>Number</th>
	                                                    <th>Title</th>
	                                                    <th class="noSort ">&nbsp;</th>
	                                                </tr>
	                                            </thead>
	                                            <tbody>
	                                                <cfloop  query="getSoftwareList" >
	                                                    <cfoutput>
	                                                        <tr>
	                                                            <td>#encodeForHTML(getSoftwareList.SW_NUMBER)#</td>
	                                                            <td>#encodeForHTML(getSoftwareList.SW_TITLE)#</td>
	                                                            <td><input id="swCheck" disabled="true" name="swCheck" value="#encodeForHTML(rc.qSpares.getAssetId())#$#encodeForHTML(getSoftwareList.sw_id)#" type="checkbox" <cfif ListFindNocase(swIDs,getSoftwareList.sw_id)>checked="checked"</cfif>></input></td>
	                                                        </tr>
	                                                    </cfoutput>
	                                                </cfloop>
	                                            </tbody>
	                                        </table>
	                                      </cfif>                                        	
                                	 </div>                            							
							</td>
							<td>	
								<input class="disabled" name="remarks" id="remarks" disabled="true" type="text" title="#encodeForHTML(trim(rc.qSpares.getRemarks()))#" value="#encodeForHTML(trim(rc.qSpares.getRemarks()))#">		
							</td>
							<td class="add addIcon"><cfif rc.qSpares.getIsOrdered() EQ 'N'><a href="index.cfm?action=add.like.spare&spareAsset=#rc.qSpares.getEncryptedAssetId()#"></a></cfif></td>
							<td class="delete deleteIcon "><cfif rc.qSpares.getIsOrdered() EQ 'N'><a href="index.cfm?action=delete.spare&spareAsset=#rc.qSpares.getEncryptedAssetId()#"></a></cfif></td>
                        </tr>		
				   </cfloop>
				   </cfoutput>
				   </tbody>
		   	   </table>
			   </form>
			<cfelse>
                <div class="global_notice_msg">No Data Found</div>   
			</cfif>
		</div>	

	</cfif>
</RIMSS:layout>