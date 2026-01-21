<cfimport taglib="../../common/layout" prefix="RIMSS"/>

<cfsetting showdebugoutput="true" >
<RIMSS:layout section="admin" subSection="#application.sessionManager.getSubSection()#">
	<RIMSS:subLayout/>
	
<script>
	
		
		
	
		function loadResults(){
			
			$.ajax({
				type: "POST",
				url: "results.cfm",
				data:{'cfgSetId':$("#cfgSetSelect").val()},
				success : function (data) {
					$("#results").html(data);
					
				}
			});
		}
		
		$(function(){
			$('#loadingDiv').hide();
			
			$(document)
			  .ajaxStart(function () {
			    $('#loadingDiv').show();
			  })
			  .ajaxStop(function () {
			    $('#loadingDiv').hide();
			  });
			  
			$("#btnSearch").bind("click", function(){
				//window.setTimeout(function(){$('.message').hide()},5000);				
				loadResults();
			});
			
		});
</script>	


<cfset dbLookups = application.objectFactory.create("DbUtils") />

<cfset qGetCfgSetByPgm = dbLookups.getCfgSetByPgm("ACTS") />



<div class="mainContent">
	<div id="selectDiv" style=" width: 50%; margin: 0 auto; padding-top: 200; text-align:center">	
		
		
		
		<table class="two_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                        <td class="column">
                            <div class="columnContent" style="text-align:center">
                                <div class="formField">
                                    <label class="font10">Config:</label> 
                                    <select   name="cfgSetSelect" id="cfgSetSelect">
										<option value="-1" selected>Select a Configuration</option>
										<cfoutput query="qGetCfgSetByPgm" >
											<option value="#encodeForHTML(cfg_set_id)#" data-parentPart="#encodeForHTML(partno)#">#encodeForHTML(cfg_name)# - #encodeForHTML(description)#</option>
										</cfoutput>				
									</select>
								</div>
                            </div>
                        </td>    
                    </tr>
                    <tr>
                        <td class="column" colspan="2">
                            <div class="columnContent">
                                <div class="formField button_container">
                                    <input type="button" value="SEARCH" name="btnSearch" id="btnSearch" />                                    
                                </div>                                    
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>            
    </div>
	
</div>
<div class="mainContent">
	<div id="loadingDiv" class="global_loading_msg">Loading...</div>
	<div class="message"></div>
	<div id="results"></div>
</div>	
</RIMSS:layout>