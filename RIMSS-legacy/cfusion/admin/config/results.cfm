

<style>
	.ui-widget-header {
    	background: #027fd1;
	}
	
	.tabs{
		width:600px;		
	}	
}
</style>
<script>
	
    <cfoutput>#toScript(form.cfgSetId,"cfgSetId")#</cfoutput>
	
	$(function(){
		
		$(".editForm").hide();
		/*$('.editDiv').show();
		$('.addDiv').hide();*/
		
		/*$("input[type=radio]").change(function(){
			var data = $(this).closest(".data").data("id");			
			var val = $(this).val();
			
			if(val=='edit'){
				console.log("edit if");
				$('#add_'+data).hide();
				$('#edit_'+data).fadeIn();
			}else if(val=='add'){
				console.log("add if");
				$('#edit_'+data).hide();
				$('#add_'+data).fadeIn();
			}
		});*/
		
		$('input[type=button][name="cancel"]').bind("click", function(){
			var id = $(this).closest(".data").data("id");			
			
			$('#editForm_'+id).fadeToggle();
		});
		
		$('input[type=button][name="save"]').bind("click", function(){
			var id = $(this).closest(".data").data("id");
			var action = $(this).closest(".action").data("action");
			
			
			
			if(action=="edit"){
				var partnoId = $("#editPartnoId_"+id).val();
				if(partnoId==""){
					partnoId = $("#c_partno_"+id).val();
					}
				var qpa = $("#qpa_"+id).val();								
				
					$.ajax({
						url: 'BomController.cfc?method=updateConfig&listId='+id+'&partnoId='+partnoId+'&qpa='+qpa+'&returnFormat=json',
						success : function (data) {
							var obj = $.parseJSON(data);
								
							if(obj.SUCCESS==false){								
							    $(".message").addClass("global_error_msg").html(obj.MESSAGE);
							}else if(obj.SUCCESS==true){
								$(".message").addClass("global_success_msg").html(obj.MESSAGE);
								$('#editForm_'+id).fadeToggle();
							}
						}
					}).done(function(){
						loadResults(); // Reload configuration table
						$('#loadingDiv').hide();
						/*$('html, body').animate({
					        scrollTop: $('.message').offset().top-50
					    }, 2000);*/
					});
			}else if(action=="add"){				
				var partnoId = $("#addPartnoId_"+id).val();
				var p_partno = $("#c_partno_"+id).val();
				var addqpa = $("#addqpa_"+id).val();					
				
				$.ajax({
					url: 'BomController.cfc?method=addToConfig&cfgSetId='+cfgSetId+'&partnoC='+partnoId+'&partnoP='+p_partno+'&qpa='+addqpa+'&returnFormat=json',
					success : function (data) {
						var obj = $.parseJSON(data);
							
						if(obj.SUCCESS==false){								
						    $(".message").addClass("global_error_msg").html(obj.MESSAGE);
						}else if(obj.SUCCESS==true){
							$(".message").addClass("global_success_msg").html(obj.MESSAGE);
							$('#editForm_'+id).fadeToggle();
						}
					}
				}).done(function(){
					loadResults(); // Reload configuration table
					$('#loadingDiv').hide();
					/*$('html, body').animate({
				        scrollTop: $('.message').offset().top-50
				    }, 2000);*/
				});
			}else if(action="delete"){
				$.ajax({
					url: 'BomController.cfc?method=deleteConfig&listId='+id+'&returnFormat=json',
					success : function (data) {
						var obj = $.parseJSON(data);
							
						if(obj.SUCCESS==false){								
						    $(".message").addClass("global_error_msg").html(obj.MESSAGE);
						}else if(obj.SUCCESS==true){
							$(".message").addClass("global_success_msg").html(obj.MESSAGE);
							$('#editForm_'+id).fadeToggle();
						}						
					}
				}).done(function(){
					loadResults(); // Reload configuration table
					$('#loadingDiv').hide();
					/*$('html, body').animate({
				        scrollTop: $('.message').offset().top-50
				    }, 2000);*/
				});
			}
		})
			
		$('input[type=button][name="delete"]').bind("click", function(){
			var id = $(this).closest(".data").data("id");
		});
		
		$(".showForm").bind("click", function(e){
			e.preventDefault();
			var id = $(this).closest(".data").data("id");	
			
			$('#editForm_'+id).fadeToggle();
		});
		
		
		setupManageConfigDialog();
		setupAddPartListDialog();
		
		$( ".tabs" ).tabs({
			hide: {}
		});
		
	});
</script>

<cfset dbLookups = application.objectFactory.create("DbUtils") />
<cfset bomController = createObject("component", "BomController").init() />
<!---<cfset parentPart = bomController() />--->

<cfset qGetCfgListBySetId = dbLookups.getCfgListBySetId(form.cfgSetId) />

<cfset parentPart = bomController.getParentPartByCfgSetId(form.cfgSetId) />


 <table class="globalTable sticky-headers" id="configTable" style="width: 100%; margin: 0 auto">
	 <thead>	 	
	 	<tr>
	 		<td></td>
	 		<td>Level</td>
	 		<td>Noun</td>
	 		<td>NSN</td>
	 		<td>Partno</td>
	 		<td>QPA</td>		 			
	 	</tr>
	 </thead>
	<cfoutput query="parentPart">
	<tbody class="data" data-id="0">
	 	<tr>
	 		<td  class="edit editIcon">
	 			<span><a href="##" class="showForm"></a></span>
	 		</td>
	 		<td>1</td>
	 		<td>#encodeForHTML(Noun)#</td>
	 		<td>#encodeForHTML(NSN)#</td>
	 		<td>
	 			#encodeForHTML(Partno)#	 			
	   			<input type="hidden" id="c_partno_0" value="#encodeForHTML(Partno_id)#">
	 		</td>
	 		<td>#encodeForHTML(QPA)#&nbsp;</td>
	 	</tr>
	 	
	 	<tr class="editForm" id="editForm_0">
	   			<td colspan="5">
	   				<div>
	   					<table  style="margin:0 auto">
	   						<tr>
	   							<td>
	   								<div class="tabs">
	   									<ul>
	   										<li><a href="##add_0">Add a Child</a></li>
	   									</ul>
		   								
										<div class="formField addDiv action" id="add_0" data-action="add">
		   									<div>Add a child to <b>#encodeForHTML(NOUN)#</b></div><label class="font10" id="partno_label" for="noun"><span class="font10">&nbsp;</span>NOUN:</label>				                      
					                        <input class="form_field font10 lookup_ref" id="addNoun_0" type="text" name="addNoun" value="" readonly="readonly" />										
											<a href="#application.rootpath#/dialogs/manageConfigDialog.cfm" class="lookup lookup_ref" id="lookup_noun_ref" data-action="add"><img id="lookup_img" src="#application.rootpath#/common/images/lookup.png" /></a>
											<span  class="addIcon"><a class="btnAddPart" href="#application.rootpath#/dialogs/addPartListDialog.cfm"><img src="#application.rootpath#/common/images/icons/add.png"/></a></span>
											<label class="font10" id="partno_label" for="qpa"><span class="font10">&nbsp;</span>QPA:</label>
											<input class="form_field font10" id="addqpa_0" type="text" name="addqpa" value="1" />	
											<input type="hidden" id="addPartnoId_0" value="">
											<div>
												<input name="save" type="button" value="Save"></input>
												<input name="cancel" type="button" value="Cancel"></input>
			 								</div>
										</div>
	   								</div>
	   							</td>
	   						</tr>
	   					</table>
	   				</div>
	   			</td>
	   		</tr>
	 </tbody>
	 </cfoutput>
	 <!---<cfdump var="#qGetCfgListBySetId#">--->
	 <!---<cfabort>--->
 	 <cfoutput query="qGetCfgListBySetId"> 
	   <tbody class="data" data-id="#encodeForHTML(list_id)#"> 	
		 	<tr>
		 		<td  class="edit editIcon">
		 			<!---<span><a href="#application.rootpath#/dialogs/manageConfigDialog.cfm?id=#p_partno_id#" class="lookup lookup_ref" data-id="#list_id#" data-action="edit">Edit</a></span>
		 			<span><a href="#application.rootpath#/dialogs/manageConfigDialog.cfm?id=#c_partno_id#" class="lookup lookup_ref" data-id="#list_id#" data-action="add">Add Child</a></span>--->
		 			<span><a href="##" class="showForm"></a></span>
		 		</td>
		 		<td>
		 			#encodeForHTML(LVL)#
		 		</td>
	   			<td style="white-space: pre; " title="Level (#encodeForHTML(LVL)#)">#encodeForHTML(PADDING)# #encodeForHTML(C_NOUN)#</td>
	   			<td>#encodeForHTML(NSN)#</td>	
	   			<td>
	   				#encodeForHTML(c_partno)#
	   				<input type="hidden" id="c_partno_#encodeForHTML(list_id)#" value="#encodeForHTML(c_partno_id)#">
	   			</td> 
	   			<td>#encodeForHTML(QPA)#&nbsp;</td>  			
	   		</tr>	
	   		<tr class="editForm" id="editForm_#encodeForHTML(list_id)#">
	   			<td colspan="5">
	   				<div>
	   					<table  style="margin:0 auto">
	   						<tr>
	   							<td>
	   								<div class="tabs">
	   									<ul>
	   										<li><a href="##edit_#encodeForHTML(list_id)#">Edit</a></li>
	   										<li><a href="##add_#encodeForHTML(list_id)#">Add a Child</a></li>
	   										<li><a href="##delete_#encodeForHTML(list_id)#">Delete</a></li>
	   									</ul>
		   								<!---<input type="radio" name="form_#list_id#" value="edit" checked="checked">Edit</input>
		   								<input type="radio" name="form_#list_id#" value="add">Add a Child</input>--->
		   								<div class="formField editDiv action" id="edit_#encodeForHTML(list_id)#" data-action="edit">
		   									<div>Choose a replacement for <b>#encodeForHTML(C_NOUN)#</b></div>
					                        <label class="font10" id="partno_label" for="noun"><span class="font10">&nbsp;</span>NOUN:</label>				                      
					                        <input class="form_field font10 lookup_ref" id="editNoun_#encodeForHTML(list_id)#" type="text" name="editNoun" value="" readonly="readonly" />										
											<a href="#application.rootpath#/dialogs/manageConfigDialog.cfm" class="lookup lookup_ref" id="lookup_noun_ref" data-action="edit"><img id="lookup_img" src="#application.rootpath#/common/images/lookup.png" /></a>
											<span  class="addIcon"><a class="btnAddPart" href="#application.rootpath#/dialogs/addPartListDialog.cfm"><img src="#application.rootpath#/common/images/icons/add.png"/></a></span>
											<label class="font10" id="partno_label" for="qpa"><span class="font10">&nbsp;</span>QPA:</label>
											<input class="form_field font10" id="qpa_#encodeForHTML(list_id)#" type="text" name="qpa" value="#encodeForHTML(QPA)#" />	
											<input type="hidden" id="editPartnoId_#encodeForHTML(list_id)#" value="">											
											<div>
												<input name="save" type="button" value="Save"></input>
												<input name="cancel" type="button" value="Cancel"></input>
			 								</div>
										</div>
										<div class="formField addDiv action" id="add_#encodeForHTML(list_id)#" data-action="add">
		   									<div>Add a child to <b>#encodeForHTML(C_NOUN)#</b></div><label class="font10" id="partno_label" for="noun"><span class="font10">&nbsp;</span>NOUN:</label>				                      
					                        <input class="form_field font10 lookup_ref" id="addNoun_#encodeForHTML(list_id)#" type="text" name="addNoun" value="" readonly="readonly" />										
											<a href="#application.rootpath#/dialogs/manageConfigDialog.cfm" class="lookup lookup_ref" id="lookup_noun_ref" data-action="add"><img id="lookup_img" src="#application.rootpath#/common/images/lookup.png" /></a>
											<span  class="addIcon"><a class="btnAddPart" href="#application.rootpath#/dialogs/addPartListDialog.cfm"><img src="#application.rootpath#/common/images/icons/add.png"/></a></span>
											<label class="font10" id="partno_label" for="qpa"><span class="font10">&nbsp;</span>QPA:</label>
											<input class="form_field font10" id="addqpa_#encodeForHTML(list_id)#" type="text" name="addqpa" value="1" />	
											<input type="hidden" id="addPartnoId_#encodeForHTML(list_id)#" value="">
											<div>
												<input name="save" type="button" value="Save"></input>
												<input name="cancel" type="button" value="Cancel"></input>
			 								</div>
										</div>
										
										<div id="delete_#encodeForHTML(list_id)#" class="action" data-action="delete">
											<div>You are about to remove <b>#encodeForHTML(C_NOUN)#</b> from this configuration.</div>
											<div>Be sure to remove all child records associated with #encodeForHTML(C_NOUN)# to prevent orphaning records.</div>
											<div>
												<input name="save" type="button" value="DELETE"></input>
												<input name="cancel" type="button" value="Cancel"></input>
											</div>
										</div>
	   								</div>
	   							</td>
	   						</tr>
	   					</table>
	   				</div>
	   			</td>
	   		</tr>					   	
 		</tbody>
 	</cfoutput>
</table>
<!---
<div id="main" style="white-space: pre; line-height:.3">
	<cfoutput query="qGetCfgListBySetId">
		<div id="#c_partno_id#" data-parent="#p_partno_id#" class="node" title="Level (#level#)">
			#PADDING# #C_NOUN#
		</div>
	</cfoutput>
</div>--->