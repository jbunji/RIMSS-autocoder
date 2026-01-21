<cfimport taglib="../layout" prefix="RIMMS"/>
<cfsetting showdebugoutput="false" >
<cfset program = lcase(trim(application.sessionManager.getProgramSetting())) />

<cfajaximport tags="cfwindow, cfform" />

<cfparam name="form.seq" default="001" />
<RIMMS:layout layout="ards">
    <RIMMS:subLayout subSection="#application.sessionManager.getSubSection()#"/>

    <link href="<cfoutput>#application.rootpath#</cfoutput>/common/css/timePicker.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/ards/layout/js/maintenance.js"></script>
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/jquery.timePicker.min.js"></script>
	<style>
		.deleteIcon {
    		background-image: url('../../common/images/icons/delete.png');
    		background-position:center;
    		background-repeat:no-repeat;
			cursor:pointer;
    		width:20px;
    		height:20px;
		}
		
		.menubuttons.middle1 {
    		cursor: pointer !important;
    		border: 1px solid #fff;
    		background-color: #027FD1;
    		color: #fff;
		}
	</style>
	
	<script type="text/javascript">
		 	
		$(function(){
				$(".admin").click(function(event){
					if (confirm("Are you sure you want to remove this record?")==true){
						return true;
					}else{
						event.preventDefault();
					}
				});
		  })	
		 
		 $(function(){	
		 	
		 	$("#isPqdr").bind("change", function(){
		 		
		 		var isPqdr = $("#isPqdr").val();
		 		
		 		if(isPqdr == "Y"){
		 			$("#dr_num_reg").show();
		 		}else{
		 			$("#dr_num_reg").hide();
		 		};
		 		
		 	})
			
		 	$(".admin").click(function(event){
				if (confirm("Are you sure you want to remove this record?")==true){
					return true;
				}else{
					event.preventDefault();
				}
			});
		 
		    $("input[name=nextPmi]").bind('change', function(){
				nextPmi = $.trim($("#nextPmi").val());
				if ((nextPmi.toUpperCase().indexOf("HANGER") != -1) || (nextPmi.toUpperCase().indexOf("HOUR") != -1)){
					 resetSection($("#nPmiDate"));
					 $("#nPmiDate").hide();
					 $("#nPmiEtm").show();
					 
					 var str = $("#nextPmi").val();
						var arry = str.split("");
						res = "";
						varnum = "n";
						for (var i = 0; i < arry.length; i++) {
							if (!isNaN(parseInt(arry[i], 10))) {
								res += arry[i];
								varnum = "y";
							}
							else {
								if (varnum == "y"){
									break;	
								}
								
							}
					}
					 
					 //var hrs = ($("#nextPmi").val().substring(14, 18));
					 var cumHrs = $("#cumHrs").val();
					 
					 var newHrs = Number(res) + Number(cumHrs);
					 
					 $("#nextPmiEtm").val(newHrs);
					 
				}
				else {
					resetSection($("#nPmiEtm"));
					 $("#nPmiEtm").hide();
					 $("#nPmiDate").show();
					 if ($('#repairCompDate').val().length > 0) {
						var str = $("#nextPmi").val();
						var arry = str.split("");
						res = "";
						varnum = "n";
						for (var i = 0; i < arry.length; i++) {
							if (!isNaN(parseInt(arry[i], 10))) {
								res += arry[i];
								varnum = "y";
							}
							else {
								if (varnum == "y") {
									break;
								}
							}
						}
						
						var hm = $("#howMal").val();
						hmVal = 0;
						
						if(hm.indexOf('90') != -1){
						   hmVal = 90;						
						}else if(hm.indexOf('180') != -1){
						   hmVal = 180;
						}
						
						/* WO 4684 JJP - Change NEXT PMI DUE based on
						   on previous PMI. Whether it's a 90 or 180 day
						   it should be created 90 days away. */
						if((hmVal == '90') && (res == '180')){
							res = '90';
						}else if((hmVal == '180') && (res == '90')){
							res = '90';
						}							
						
						var days = new Date(Date.parse($('#repairCompDate').val()));
						var additional = parseInt(res);
						days.setDate(days.getDate() + additional);
						
						var day = ("0" + days.getDate()).slice(-2);
						var month = new Date(days).format("mmm");
						var year = days.getFullYear();
						
						if (day.length == 1) {
							day = '0' + day;
						}
						var npmi = day + '-' + month.toUpperCase() + '-' + year;
						$("#nextPmiDate").val(npmi);
					}
				}
			});
		 		
			$('.calendar_field1').datepicker({
       				   dateFormat: "dd-M-yy",
				       changeMonth: true,
				       changeYear: true,
				       onSelect: function(dateText, inst) {
				           var tmpDate = $(this).val();
				           $(this).val(tmpDate.toUpperCase());
				       },
				onClose: function(dateText, inst){
					var nextPmi = $.trim($("#nextPmi").val());
				    if ((nextPmi.toUpperCase().indexOf("DAY") != -1)) {
						var str = $("#nextPmi").val();
						var arry = str.split("");
						res="";
						varnum = "n";
						for (var i = 0; i < arry.length; i++) {
							if (!isNaN(parseInt(arry[i], 10))) {
								res += arry[i];
								varnum = "y";
							}
							else {
								if (varnum == "y") {
									break;
								}
							}
						}
						var days = new Date(Date.parse(dateText));
						var additional = parseInt(res);
						days.setDate(days.getDate()+additional);
					
						var day = ("0" + days.getDate()).slice(-2);
						var month = new Date(days).format("mmm");
						var year = days.getFullYear();
					
						if (day.length == 1) {
							day = '0' + day;
						}
						var npmi = day + '-' + month.toUpperCase() + '-' + year;
						$("#nextPmiDate").val(npmi);
					}
				}	
			 });
		})
		
		
		function resetSection(section) {
			$(section).find('input[type=text], input[type=hidden], textarea').not('.noreset').val('');
		}
		
		
		var deleteTests = new Array();
		IMG_NUM =0;	

		$(function() {
			var IMG_NUM =0;	
			
			onload();			
			
			function onload(){
				
				typeMaint = $.trim($("#typeMaint").val());
				if (typeMaint.toUpperCase().indexOf("TCTO") != -1) {
						$("#tcto").show();
					} else {
						resetSection($("#tcto"));
						$("#tcto").hide();
					}
					$(".when_disc").show();
					$(".action_taken").show();
					//if (typeMaint.toUpperCase().indexOf("INSPECTION") === -1) {
		            //    $(".when_disc").show();
		            //    $(".action_taken").show();
					//} else {
	                //    $(".when_disc").hide();
	                //    $(".action_taken").hide();						
					//}
					if (typeMaint.toUpperCase().indexOf("PERIODIC INSPECTION") != -1) {
						$("#pmi").show();
					} else {
						resetSection($("#pmi"));
					    $("#pmi").hide();
					}
					
				actionTkn = $.trim($("#actionTkn").val());
				if (actionTkn.length) {
					if (actionTkn.toUpperCase().indexOf("REMOVE") != -1) {
	                    resetSection($("#partWorked"));
	                    var isPqdr = $("#isPqdr").val();
						if(isPqdr == "Y"){
				 			$("#dr_num_reg").show();
				 		}else{
				 			$("#dr_num_reg").hide();
				 		};
						
	                    $("#partWorked").hide();
						$("#partRemIns").show();
						if (actionTkn.toUpperCase().indexOf("REINSTALL") === -1) {
							$("#partRequest").show();
						}
						$("td.remove").show();
						$("#btnBitPc").hide();
						$(".bitPc").hide();
						if (actionTkn.toUpperCase().indexOf("INSTALL") != -1 || actionTkn.toUpperCase().indexOf("REPLACE") != -1) {
	                        $("td.install").show();
						} else {
	                        $("td.install").hide();
						}
					}  else if ((actionTkn.toUpperCase().indexOf("REPLACE") != -1) && (actionTkn.toUpperCase().indexOf("REPAIR") != -1)) {
						resetSection($("#partWorked"));
	                    resetSection($("#partRemIns"));                    
						
						$("#btnBitPc").show();
						$(".bitPc").show();
						$("td.install").hide();
	                    $("td.remove").hide();
	                    $("#partRemIns").hide();
						$("#partWorked").hide();
					} else if ((actionTkn.toUpperCase().indexOf("INSTALL") != -1 || actionTkn.toUpperCase().indexOf("REPLACE") != -1) && (actionTkn.toUpperCase().indexOf("INITIAL") === -1)) {
	                    resetSection($("#partWorked"));
	                    $("#partWorked").hide();
	                    $("#partRemIns").show();
						$("#partRequest").show();
						$("#btnBitPc").hide();
						$(".bitPc").hide();
	                    $("td.install").show();
	                    if (actionTkn.toUpperCase().indexOf("REMOVE") != -1) {
	                        $("td.remove").show();
	                    } else {
	                        $("td.remove").hide();
	                    }
					} else if (actionTkn == "F - REPAIR") {
						resetSection($("#partWorked"));
	                    resetSection($("#partRemIns"));                    
						
						$("#btnBitPc").show();
						$(".bitPc").show();
						$("td.install").hide();
	                    $("td.remove").hide();
	                    $("#partRemIns").hide();
						$("#partWorked").hide();
					} else {
		                    $("td.install").hide();
		                    $("td.remove").hide();
							$("#btnBitPc").hide();
							$(".bitPc").hide();
		                    $("#partRemIns").hide();
							$("#partWorked").show();
						}	
					}
					
				nextPmi = $.trim($("#nextPmi").val());
				if (nextPmi.toUpperCase().indexOf("HANGER") != -1) {
					resetSection($("#nPmiDate"));
					$("#nPmiDate").hide();
					$("#nPmiEtm").show();
				}
				else {
					resetSection($("#nPmiEtm"));
					$("#nPmiEtm").hide();
					$("#nPmiDate").show();					
				}
			}
			
			$("input[name=typeMaint]").bind('change', function() {
				typeMaint = $.trim($("#typeMaint").val());
				if (typeMaint.toUpperCase().indexOf("TCTO") != -1) {
					$("#tcto").show();
				} else {
					resetSection($("#tcto"));
					$("#tcto").hide();
				}
					$(".when_disc").show();
					$(".action_taken").show();
				//if (typeMaint.toUpperCase().indexOf("INSPECTION") === -1) {
	            //    $(".when_disc").show();
	            //    $(".action_taken").show();
				//} else {
                //    $(".when_disc").hide();
                //    $(".action_taken").hide();						
				//}
				if (typeMaint.toUpperCase().indexOf("PERIODIC INSPECTION") != -1) {
					$("#pmi").show();
				} else {
					resetSection($("#pmi"));
				    $("#pmi").hide();
				}
					
			});

            $("input[name=actionTkn]").bind('change', function() {
                actionTkn = $.trim($("#actionTkn").val());
				if (actionTkn.toUpperCase().indexOf("REMOVE") != -1) {
                    resetSection($("#partWorked"));
                    resetSection($("#partRemIns"));
					resetSection($("#partRequest"));
                    $("#partWorked").hide();
					$("#partRemIns").show();
					
					 var isPqdr = $("#isPqdr").val();
					if(isPqdr == "Y"){
			 			$("#dr_num_reg").show();
			 		}else{
			 			$("#dr_num_reg").hide();
			 		};
			 		
					if (actionTkn.toUpperCase().indexOf("REINSTALL") === -1) {
						$("#partRequest").show();
					}else{
						$("#partRequest").hide();
					}
						$("#btnBitPc").hide();
						$(".bitPc").hide();
					$("td.remove").show();
					if (actionTkn.toUpperCase().indexOf("INSTALL") != -1 || actionTkn.toUpperCase().indexOf("REPLACE") != -1) {
                        $("td.install").show();
					} else {
                        $("td.install").hide();
					}
				} else if ((actionTkn.toUpperCase().indexOf("REPLACE") != -1) && (actionTkn.toUpperCase().indexOf("REPAIR") != -1)) {
					resetSection($("#partWorked"));
                    resetSection($("#partRemIns"));                    
					
					$("#btnBitPc").show();
					
						$("#btnBitPc").show();
						$(".bitPc").show();
						
					$("td.install").hide();
                    $("td.remove").hide();
                    $("#partRemIns").hide();
					$("#partWorked").hide();
				} else if ((actionTkn.toUpperCase().indexOf("INSTALL") != -1 || actionTkn.toUpperCase().indexOf("REPLACE") != -1) && (actionTkn.toUpperCase().indexOf("INITIAL") === -1)) {
                    resetSection($("#partWorked"));
                    resetSection($("#partRemIns"));
					
						$("#btnBitPc").hide();
						$(".bitPc").hide();
						
                    $("#partWorked").hide();
                    $("#partRemIns").show();
					$("#partRequest").show();
                    $("td.install").show();
                    if (actionTkn.toUpperCase().indexOf("REMOVE") != -1) {
                        $("td.remove").show();
                    } else {
                        $("td.remove").hide();
                    }
				} else if (actionTkn == "F - REPAIR") {
						resetSection($("#partWorked"));
	                    resetSection($("#partRemIns"));                    
						
						$("#btnBitPc").show();
						$(".bitPc").show();
						$("td.install").hide();
	                    $("td.remove").hide();
	                    $("#partRemIns").hide();
						$("#partWorked").hide();
				} else {
					
						$("#btnBitPc").hide();
						$(".bitPc").hide();
                    resetSection($("#partWorked"));
                    resetSection($("#partRemIns"));
					resetSection($("#partRequest"));
                    $("td.install").hide();
                    $("td.remove").hide();
                    $("#partRemIns").hide();
					$("#partRequest").hide();
					$("#partWorked").show();
				}
            });
			
		});
		
		function callUploader()
		{
			var win = ColdFusion.Window.getWindowObject('uploader');
			win.shadow = false;
			ColdFusion.Window.show('uploader');
			ColdFusion.navigate("iFrameContainer.cfm", "uploader");
		}
		
		function getiFrame(obj)
		{
			IMG_NUM++;
			document.getElementById("imgCntr").value = IMG_NUM;
			document.getElementById("list_reg").innerHTML += "<table width='100%' id='subReg"+IMG_NUM+"'><tr><td><label class='font10' for='fileName"+IMG_NUM+"'>&nbsp;"+obj.fileName.value+"</label> - <label class='font10'><a href='javascript: deleteImg("+IMG_NUM+");'>remove</a></label><input type='hidden' name='desc"+IMG_NUM+"' value='"+escape(obj.desc.value)+"' /><input type='hidden' name='ext"+IMG_NUM+"' value='"+obj.ext.value+"' /><input type='hidden' name='fileName"+IMG_NUM+"' value='"+obj.fileName.value+"' /></td></tr></table>";	
			ColdFusion.Window.hide("uploader");	
		}

		function canceliFrame()
			{ColdFusion.Window.hide("uploader");}

		function deleteImg(img)
		{
			var div = document.getElementById("subReg"+img);
			div.parentNode.removeChild(div);
		}
		
		function removeTest(tst)
		{
			var div = document.getElementById("testsFailReg"+tst);
			div.parentNode.removeChild(div);
		}	
		
		function deleteClick(rw, id) {
			if (confirm("Are you sure you want to remove this record?")==true){
				document.getElementById('testFailId'+rw).disabled = true;
				deleteTests.push(id);
			}else{
				event.preventDefault();
			}	
		}
		
		function setFailedTests () {
			$('#deleteFailedTests').val(deleteTests);
		}
		
		function orderPart() {
			var win = ColdFusion.Window.getWindowObject('partRequestWindow');
			win.shadow = false;
			var remSraNoun = $('#remSraNoun').val();
			var remSraPartno = $('#remSraPartno').val();
			var remSraAssetId = $('#remSraAssetId').val();
			var remSraLaborPartId = $('#remSraLaborPartId').val();
			ColdFusion.Window.show('partRequestWindow');
			ColdFusion.navigate("partRequestContainer.cfm?remSraNoun="+remSraNoun+"&remSraPartno="+remSraPartno+"&remSraAssetId="+remSraAssetId+"&remSraLaborPartId="+remSraLaborPartId, "partRequestWindow");
		}
		
		function cancelpartRequest()
			{ColdFusion.Window.hide("partRequestWindow");}
			
		function getorderPartFrame(obj)
		{
			var pONoun = obj.partOrderNoun.value;
			var pOAssetId = obj.partOrderAssetId.value;
			var pOLaborPartId = obj.remSraLaborPartId.value;
			var pOPartNumber = obj.partOrderPartNumber.value;
			var repairId = $('#repairId').val();
			var eventId = $('#eventId').val();
			
			
			var s = getRootPath().toUpperCase();
			var program = $("#prog").val();
			var url = s + "/"+program+"/controller/maintenanceController.cfc";			

			$.post(
              url,
              {
               method:"partOrdered",
			   eventId1: eventId,
			   repairId1: repairId,
			   pOAssetId1: pOAssetId
              }, function(){
			  	 	alert('The part has been requested.'); $('#requestPart').prop("disabled", true);
					$('#partOrderDiv').html('A part has been requested.').addClass('font10');
					});
			  
			
			ColdFusion.Window.hide("partRequestWindow");	
		}

	</script>
	
	<cfwindow name="uploader" title="Upload File" closable="true" draggable="true" center="true"
		height="225" width="500" modal="true" initshow="false" resizable="false"
        x="530" y="220" />
		
	<cfwindow name="partRequestWindow" closable="true" draggable="true" center="true"
		height="195" width="500" modal="true" initshow="false" resizable="false"
        x="530" y="220" />

    <cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
    <div class="headerContent">
        <div class="headerTitle">Update Maintenance Detail</div>
    </div>
    <div class="font12 mainContent">
        <cfform id="updateMaintenance" name="updateMaintenance" method="post" action="index.cfm" enctype="multipart/form-data">
			<input type="hidden" name="imgCntr" id="imgCntr" value="0">
			<input type="hidden" name="testFailCntr" id="testFailCntr" value="0">
			<input type="hidden" name="deleteFailedTests" id="deleteFailedTests" value="">
        	<input type="hidden" id="eventId" name="eventId" value="<cfif StructKeyExists(form, 'eventId')><cfoutput>#HTMLEditFormat(trim(form.eventId))#</cfoutput></cfif>">
			<input type="hidden" id="repairId" name="repairId" value="<cfif StructKeyExists(form, 'eventId')><cfoutput>#HTMLEditFormat(trim(form.repairId))#</cfoutput></cfif>">			
			<input type="hidden" id="laborId" name="laborId" value="<cfif StructKeyExists(form, 'laborId')><cfoutput>#HTMLEditFormat(trim(form.laborId))#</cfoutput></cfif>">
			<input type="hidden" id="assetId" name="assetId" value="<cfif StructKeyExists(form, 'assetId')><cfoutput>#HTMLEditFormat(trim(form.assetId))#</cfoutput><cfelse>659325</cfif>" />
			<input type="hidden" id="nhaAssetId" name="nhaAssetId" value="<cfif StructKeyExists(form, 'assetId')><cfoutput>#HTMLEditFormat(trim(form.nhaAssetId))#</cfoutput><cfelse>659325</cfif>" />
            <input type="hidden" id="partno" name="partno" value="<cfif StructKeyExists(form, 'nhaPartno')><cfoutput>#HTMLEditFormat(trim(form.partno))#</cfoutput><cfelse><cfoutput>#HTMLEditFormat(trim(form.partno))#</cfoutput></cfif>" />
            <input type="hidden" id="partnoId" name="partnoId" value="<cfif StructKeyExists(form, 'partnoId')><cfoutput>#HTMLEditFormat(trim(form.partnoId))#</cfoutput></cfif>" />
            <input type="hidden" id="wucCd" name="wucCd" value="<cfif StructKeyExists(form, 'wucCd')><cfoutput>#HTMLEditFormat(trim(form.wucCd))#</cfoutput></cfif>">
            <input type="hidden" id="partOrderId" name="partOrderId" value="<cfif StructKeyExists(form, 'partOrderId')><cfoutput>#HTMLEditFormat(trim(form.partOrderId))#</cfoutput></cfif>">
			<input type="hidden" name="eventRepair" id="eventRepair" value="<cfif StructKeyExists(form, 'eventRepair')><cfoutput>#HTMLEditFormat(trim(form.eventRepair))#</cfoutput></cfif>">
			<input type="hidden" name="cumHrs" id="cumHrs" value="<cfif StructKeyExists(form, 'cumHrs')><cfoutput>#HTMLEditFormat(trim(form.cumHrs))#</cfoutput></cfif>">
			<div class="formContent">
                <table class="one_column_table" cellpadding="0px" cellspacing="0px">
                    <tbody>
                        <tr>
                        	<td class="section_header">
                        		JOB ID: <cfif StructKeyExists(form, 'jobId')><cfoutput>#HTMLEditFormat(trim(form.jobId))#</cfoutput></cfif> | SERNO: <span id="nhaSerno"><cfif StructKeyExists(form, 'serno')><cfoutput>#HTMLEditFormat(trim(form.serno))#</cfoutput></cfif></span> | PARTNO: <span id="partno"><cfif StructKeyExists(form, 'partno')><cfoutput>#HTMLEditFormat(trim(form.partno))#</cfoutput></cfif></span>
								<br/>
								SRA SERNO: <span id="nhaSerno"><cfif StructKeyExists(form, 'sraSerno')><cfoutput>#HTMLEditFormat(trim(form.sraSerno))#</cfoutput></cfif></span> | SRA PARTNO: <span id="partno"><cfif StructKeyExists(form, 'sraPartno')><cfoutput>#HTMLEditFormat(trim(form.sraPartno))#</cfoutput></cfif></span> | SRA NOUN: <span id="partno"><cfif StructKeyExists(form, 'sraNoun')><cfoutput>#HTMLEditFormat(trim(form.sraNoun))#</cfoutput></cfif></span>
							</td>
						</tr>
                    </tbody>
                </table>
                <table class="one_column_table" cellpadding="0px" cellspacing="0px">
                    <tbody>
                        <tr>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="repair_seq_label"><span class="font10 required_field">&nbsp;</span>SEQ: <cfif len(form.seq EQ 1)>00<cfelseif len(form.seq EQ 2)>0</cfif><cfoutput>#HTMLEditFormat(trim(form.seq))#</cfoutput></label>
									<input type="hidden" id="seq" name="seq" value="<cfoutput>#HTMLEditFormat(trim(form.seq))#</cfoutput>" />
                                </div>
                            </td>
						</tr>
                    </tbody>
                </table>
                <table class="two_column_table" cellpadding="0px" cellspacing="0px">
                    <tbody>
                        <tr>
                        	<td class="column">
                        		<div class="formField">
                                    <label class="font10" id="type_maint_label"><span class="font10 required_field">&nbsp;</span>TYPE MAINT:</label>
                                    <input type="hidden" id="typeMaintCodeId" name="typeMaintCodeId" value="<cfif StructKeyExists(form, 'typeMaintCodeId')><cfoutput>#HTMLEditFormat(trim(form.typeMaintCodeId))#</cfoutput></cfif>" />
                                    <input class="form_field font10" id="typeMaint" type="text" name="typeMaint" value="<cfif StructKeyExists(form, 'typeMaint')><cfoutput>#HTMLEditFormat(trim(form.typeMaint))#</cfoutput></cfif>" readonly="readonly" style="min-width: 50%;" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref" id="tmCode" title="TYPE MAINT"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                        		</div>
                                <div class="formField">
                                    <label class="font10" id="how_mal_label"><span class="font10 required_field">&nbsp;</span>HOW MAL:</label>
                                    <input type="hidden" id="howMalCodeId" name="howMalCodeId" value="<cfif StructKeyExists(form, 'howMalCodeId')><cfoutput>#HTMLEditFormat(trim(form.howMalCodeId))#</cfoutput></cfif>" />
                                    <input class="form_field font10" id="howMal" type="text" name="howMal" value="<cfif StructKeyExists(form, 'howMal')><cfoutput>#HTMLEditFormat(trim(form.howMal))#</cfoutput></cfif>" readonly="readonly" style="min-width: 50%;" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref" id="hmCode" title="HOW MAL"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div class="formField">
								
							</td>
                            <td class="column">
                                <div class="formField when_disc" style="display:none">
                                    <label class="font10" id="when_disc_label"><span class="font10 required_field">&nbsp;</span>WHEN DISC:</label>
                                    <input type="hidden" id="whenDiscCodeId" name="whenDiscCodeId" value="<cfif StructKeyExists(form, 'whenDiscCodeId')><cfoutput>#HTMLEditFormat(trim(form.whenDiscCodeId))#</cfoutput></cfif>" />
                                    <input class="form_field font10" id="whenDisc" type="text" name="whenDisc" value="<cfif StructKeyExists(form, 'whenDisc')><cfoutput>#HTMLEditFormat(trim(form.whenDisc))#</cfoutput></cfif>" readonly="readonly" style="min-width: 50%;" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref" id="wdCode" title="WHEN DISC"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>
                                <div class="formField action_taken" style="display:none">
                                    <label class="font10" id="action_tkn_label"><span class="font10 required_field">&nbsp;</span>ACTION TAKEN:</label>
                                    <input type="hidden" id="actionTknCodeId" name="actionTknCodeId" value="<cfif StructKeyExists(form, 'actionTknCodeId')><cfoutput>#HTMLEditFormat(trim(form.actionTknCodeId))#</cfoutput></cfif>" />
                                    <input class="form_field font10" id="actionTkn" type="text" name="actionTkn" value="<cfif StructKeyExists(form, 'actionTkn')><cfoutput>#HTMLEditFormat(trim(form.actionTkn))#</cfoutput></cfif>" readonly="readonly" style="min-width: 50%;" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref" id="atCode" title="ACTION TKN"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>
							</td>
					    </tr>
                    </tbody>
                </table>
				<table class="two_column_table" cellpadding="0px" cellspacing="0px">
					<tbody>
						<tr>
							<td class="column">
								<div class="formField">
									<label class="font10" id="repair_start_label">&nbsp;REPAIR START:</label> 
                                    <input class="form_field font10 calendar_field" type="text" id="repairStartDate" name="repairStartDate" value="<cfif StructKeyExists(form, 'repairStartDate')><cfoutput>#HTMLEditFormat(trim(form.repairStartDate))#</cfoutput></cfif>"  readonly="readonly" />
                                    <input class="form_field font10 time_field" id="repairStartTime" type="text" name="repairStartTime" value="<cfif StructKeyExists(form, 'repairStartTime')><cfoutput>#HTMLEditFormat(trim(form.repairStartTime))#</cfoutput></cfif>" />
								</div>
							</td>
							<td class="column">
								<div class="formField">
									<label class="font10" id="repair_comp_label">&nbsp;REPAIR COMP:</label> 
                                    <input class="form_field font10 calendar_field1" type="text" id="repairCompDate" name="repairCompDate" value="<cfif StructKeyExists(form, 'repairCompDate')><cfoutput>#HTMLEditFormat(trim(form.repairCompDate))#</cfoutput></cfif>" onchange="RepairComp()"  readonly="readonly" />
                                    <input class="form_field font10 time_field" id="repairCompTime" type="text" name="repairCompTime" value="<cfif StructKeyExists(form, 'repairCompTime')><cfoutput>#HTMLEditFormat(trim(form.repairCompTime))#</cfoutput></cfif>" />
								</div>
							</td>
						</tr>
					</tbody>
				</table>	
				<table class="one_column_table" cellpadding="0px" cellspacing="0px">
                    <tbody>
                        <tr>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="attachment_label">&nbsp;ATTACHMENT: </label>
									<input type="button" name="uploadFile" id="uploadFile" value="Upload" onClick="callUploader()"/>
                                </div>
                            </td>
						</tr>
						<tr>
        					<td colspan="2" align="left">&nbsp;<div id="list_reg"></div></td>
      					</tr>
                    </tbody>
                </table>
				<cfif StructKeyExists(rc, "qAttachments") >
				<table class="one_column_table" cellpadding="0px" cellspacing="0px">
					<tbody>
							<cfoutput query="rc.qAttachments">    
					      			<tr>
					         			<td>&nbsp;
											<label class="font10">
					         					<!---<a href="downloader.cfm?fileName=#rc.qAttachments.name#"> #IIF(rc.qAttachments.name NEQ "", DE('#rc.qAttachments.name#'), DE('#rc.qAttachments.attId#'))# - View</a>--->
												<a target="_blank" href="#application.rootpath#/RIMSS/#application.sessionManager.getUserName()#/#rc.qAttachments.name#"> #REReplace(rc.qAttachments.name,"[^a-zA-Z0-9\._]","","ALL")# - View</a>
												
											</label>
										</td>
					      			</tr>
							</cfoutput> 
					</tbody>
				</table>
				</cfif>
				<table class="two_column_table" cellpadding="0px" cellspacing="0px" id="pmi" style="display:none">
				    <tbody>
                        <tr><td class="section_header" colspan="3">PMI Details:</td></tr>
						<tr>
							<td class="column">
                        	    <div class="formField">
                                    <label class="font10" id="next_pmi_label"><span class="font10 required_field">&nbsp;</span>NEXT PMI TYPE:</label>
									<input type="hidden" id="assetInsId" name="assetInsId" value="<cfif StructKeyExists(form, 'assetInsId')><cfoutput>#HTMLEditFormat(trim(form.assetInsId))#</cfoutput></cfif>" />
									<input type="hidden" id="nextPmiId" name="nextPmiId" value="<cfif StructKeyExists(form, 'nextPmiId')><cfoutput>#HTMLEditFormat(trim(form.nextPmiId))#</cfoutput></cfif>" />
                                    <input class="form_field font10" id="nextPmi" type="text" name="nextPmi" value="<cfif StructKeyExists(form, 'nextPmi')><cfoutput>#HTMLEditFormat(trim(form.nextPmi))#</cfoutput></cfif>" readonly="readonly" style="min-width: 50%;" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupCodeDialog.cfm" class="lookup lookup_ref" id="pmiCode" title="NEXT PMI TYPE"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>	
							</td>
							<td>	
                                <div class="formField" id="nPmiDate" style="display:none">
                                    <label class="font10" id="next_pmi_date_label"><span class="font10 required_field">&nbsp;</span>NEXT PMI DATE:</label>
                                    <input class="form_field font10 calendar_field" id="nextPmiDate" type="text" name="nextPmiDate" value="<cfif StructKeyExists(form, 'nextPmiDate')><cfoutput>#HtmlEditFormat(trim(form.nextPmiDate))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
								<div class="formField" id="nPmiEtm" style="display:none">
                                    <label class="font10" id="next_pmi_etm_label"><span class="font10 required_field"></span>NEXT PMI ETM:</label>
                                    <input class="form_field font10" id="nextPmiEtm" type="text" name="nextPmiEtm" value="<cfif StructKeyExists(form, 'nextPmiEtm')><cfoutput>#HtmlEditFormat(trim(form.nextPmiEtm))#</cfoutput></cfif>" />
									<label class="font10" id="next_pmi_etm_hrs_label"><span class="font10 required_field">&nbsp;</span>(cumulative hrs) </label>
                                </div>
							</td>
						</tr>									
				    </tbody>
				</table>
				<table class="three_column_table" cellpadding="0px" cellspacing="0px" id="tcto" style="display:none">
					<tbody>
                        <tr><td class="section_header" colspan="3">TCTO Details:</td></tr>
						<tr>
							<td class="column">
                                <div class="formField">
                                    <label class="font10" id="tcto_label">&nbsp;TCTO:</label>
                                    <input type="hidden" id="tctoId" name="tctoId" value="<cfif StructKeyExists(form, 'tctoId')><cfoutput>#HTMLEditFormat(trim(form.tctoId))#</cfoutput></cfif>" />
                                    <input type="hidden" id="ctTctoId" name="ctTctoId" value="<cfif StructKeyExists(form, 'ctTctoId')><cfoutput>#HTMLEditFormat(trim(form.ctTctoId))#</cfoutput></cfif>" />
                                    <input class="form_field font10 readonly" id="tctoNo" type="text" name="tctoNo" value="<cfif StructKeyExists(form, 'tctoNo')><cfoutput>#HTMLEditFormat(trim(form.tctoNo))#</cfoutput></cfif>" readonly="readonly" style="min-width: 70%;" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupTctoDialog.cfm" class="lookup lookup_ref" id="luTCTO" title="TCTO"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>
							</td>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="eff_date_label">EFFECTIVE DATE:</label>
                                    <input class="form_field font10 calendar_field" id="effDate" type="text" name="effDate" value="<cfif StructKeyExists(form, 'effDate')><cfoutput>#HTMLEditFormat(trim(form.effDate))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                            </td>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="tcto_comp_label">COMPLETED DATE:</label>
                                    <input class="form_field font10 calendar_field" id="tctoCompDate" type="text" name="tctoCompDate" value="<cfif StructKeyExists(form, 'tctoCompDate')><cfoutput>#HTMLEditFormat(trim(form.tctoCompDate))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                            </td>
						</tr>
					</tbody>
				</table>
				<table class="three_column_table" cellpadding="0" cellspacing="0" id="partWorked" style="display:none">
					<tbody>
						<tr><td class="section_header" colspan="3">Part Worked:</td></tr>
						<tr>
							<td class="column" colspan="3">
                                <div class="formField">
                                    <label class="font10" id="sra_noun_label">&nbsp;SRA NOUN:</label>                                     
									<input class="form_field font10 sraNoun" id="sraNoun" type="text" name="sraNoun" value="<cfif StructKeyExists(form, 'sraNoun')><cfoutput>#HTMLEditFormat(trim(form.sraNoun))#</cfoutput></cfif>" readonly="readonly" size="50" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRAAssets.cfm" class="lookup luSRA" id="luSRA" title="SRA"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>
							</td>
						</tr>
						<tr>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="serno_label">&nbsp;SERNO:</label> 
                                    <input class="sraId" type="hidden" id="sraAssetId" name="sraAssetId" value="<cfif StructKeyExists(form, 'sraAssetId')><cfoutput>#HTMLEditFormat(trim(form.sraAssetId))#</cfoutput></cfif>" />
                                    <input class="form_field font10 sraSerno" id="sraSerno" type="text" name="sraSerno" value="<cfif StructKeyExists(form, 'sraSerno')><cfoutput>#HTMLEditFormat(trim(form.sraSerno))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                            </td>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="partno_label">PART NO:</label>                                     
									<input type="hidden" id="sraPartnoId" name="sraPartnoId" value="<cfif StructKeyExists(form, 'sraPartnoId')><cfoutput>#HTMLEditFormat(trim(form.sraPartnoId))#</cfoutput></cfif>" />
									<input class="form_field font10 sraPartno" id="sraPartno" type="text" name="sraPartno" value="<cfif StructKeyExists(form, 'sraPartno')><cfoutput>#HTMLEditFormat(trim(form.sraPartno))#</cfoutput></cfif>" readonly="readonly" />
                                	<cfif typeMaint EQ "T - TCTO"><a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupPartNoDialog.cfm" class="lookupPartNo" id="luPartNo" title="PART NO"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a></cfif>
								</div>
                            </td>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="nsn_label">NSN:</label> 
                                    <input class="form_field font10 sraNsn" id="sraNsn" type="text" name="sraNsn" value="<cfif StructKeyExists(form, 'sraNsn')><cfoutput>#HTMLEditFormat(trim(form.sraNsn))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                            </td>
						</tr>
					</tbody>
				</table>
                <table class="two_column_table" cellpadding="0" cellspacing="0" id="partRemIns" style="display:none">
                    <tbody>
                        <tr><td class="section_header" colspan="2">Part <span class="remove">Remove</span> / <span class="install">Install</span>:</td></tr>
                        <tr>
                            <td class="column remove" style="display:none">
                                <div class="formField">
                                    <label class="font10" id="rem_noun_label">&nbsp;REMOVE SRA NOUN:</label> 
                                    <input class="form_field font10 sraNoun" id="remSraNoun" type="text" name="remSraNoun" value="<cfif StructKeyExists(form, 'remSraNoun')><cfoutput>#HTMLEditFormat(trim(form.remSraNoun))#</cfoutput></cfif>" readonly="readonly" size="50" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRAAssets.cfm" class="lookup luSRA" id="luRemSRA" title="SRA"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>
                                <div class="formField">
                                    <label class="font10" id="rem_serno_label">&nbsp;REMOVE SERNO:</label> 
									<input class="sraId" type="hidden" id="remSraPartnoid" name="remSraPartnoid" value="<cfif StructKeyExists(form, 'remSraPartnoid')><cfoutput>#HTMLEditFormat(trim(form.remSraPartnoid))#</cfoutput></cfif>" />
									<input class="sraId" type="hidden" id="SraPartnoid" name="remSraPartnoid" value="<cfif StructKeyExists(form, 'remSraPartnoid')><cfoutput>#HTMLEditFormat(trim(form.remSraPartnoid))#</cfoutput></cfif>" />
                                    <input class="sraId" type="hidden" id="remSraAssetId" name="remSraAssetId" value="<cfif StructKeyExists(form, 'remSraAssetId')><cfoutput>#HTMLEditFormat(trim(form.remSraAssetId))#</cfoutput></cfif>" />
									<input class="sraId" type="hidden" id="remSraLaborPartId" name="remSraLaborPartId" value="<cfif StructKeyExists(form, 'remSraLaborPartId')><cfoutput>#HTMLEditFormat(trim(form.remSraLaborPartId))#</cfoutput></cfif>" />
                                    <input class="form_field font10 sraSerno" id="remSraSerno" type="text" name="remSraSerno" value="<cfif StructKeyExists(form, 'remSraSerno')><cfoutput>#HTMLEditFormat(trim(form.remSraSerno))#</cfoutput></cfif>" readonly="readonly" />
                                    
                                    <label class="font10" id="is_pqdr_label">&nbsp;IS PQDR:</label>
                                    <select class="select_field font10" id="isPqdr" name="isPqdr" <cfif (StructKeyExists(form, "isPqdr") AND form.isPqdr EQ "Y") OR (StructKeyExists(form, 'remSraSerno'))>disabled</cfif>>
	                                    <option value="N" default>N</option>
	                                    <option value="Y" <cfif StructKeyExists(form, "isPqdr") AND form.isPqdr EQ "Y">selected</cfif>>Y</option>
	                                </select>
	                                
	                                <span id="dr_num_reg">
	                                	<label class="font10 required_field" id="dr_num_label">&nbsp;DR NUMBER:</label>
	                                	<input class="form_field required_form_field font10 drNum" id="drNum" type="text" name="drNum" value="<cfif StructKeyExists(form, 'drNum')><cfoutput>#HTMLEditFormat(trim(form.drNum))#</cfoutput></cfif>" <cfif StructKeyExists(form, "isPqdr") AND form.isPqdr EQ "Y">disabled</cfif> />
                                    </span>
                                </div>
                                <div class="formField">
                                    <label class="font10" id="rem_partno_label">&nbsp;REMOVE PART NO:</label> 
                                    <input class="form_field font10 sraPartno" id="remSraPartno" type="text" name="remSraPartno" value="<cfif StructKeyExists(form, 'remSraPartno')><cfoutput>#HTMLEditFormat(trim(form.remSraPartno))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                                <div class="formField">
                                    <label class="font10" id="rem_nsn_label">&nbsp;REMOVE NSN:</label> 
                                    <input class="form_field font10 sraNsn" id="remSraNsn" type="text" name="remSraNsn" value="<cfif StructKeyExists(form, 'remSraNsn')><cfoutput>#HTMLEditFormat(trim(form.remSraNsn))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                            </td>
                            <td class="column install" style="display:none">
                                <div class="formField">
                                    <label class="font10" id="ins_noun_label">&nbsp;INSTALL SRA NOUN:</label> 
                                    <input class="form_field font10 sraNoun" id="insSraNoun" type="text" name="insSraNoun" value="<cfif StructKeyExists(form, 'insSraNoun')><cfoutput>#HTMLEditFormat(trim(form.insSraNoun))#</cfoutput></cfif>" readonly="readonly" size="50" />
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRANounsDialog.cfm" class="lookup luInsSRA" id="lookup_sra_noun_ref" name="snounlookup" title="SRA"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                                </div>
                                <div class="formField">
                                    <label class="font10" id="ins_serno_label">&nbsp;INSTALL SERNO:</label> 
                                    <input type="hidden" id="insSraAssetId" name="insSraAssetId" value="<cfif StructKeyExists(form, 'insSraAssetId')><cfoutput>#HTMLEditFormat(trim(form.insSraAssetId))#</cfoutput></cfif>" />
                                    <input class="form_field font10" id="insSraSerno" type="text" name="insSraSerno" value="<cfif StructKeyExists(form, 'insSraSerno')><cfoutput>#HTMLEditFormat(trim(form.insSraSerno))#</cfoutput></cfif>" readonly="readonly" />
		                            <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRAAssetByNounDialog.cfm" class="lookup" id="lookup_sra_asset_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
																		
									<span  class="addIcon"><cfoutput><a id="btnAddSerno" href="addSerno.cfm"><img src="#application.rootpath#/common/images/icons/add.png"/></a></cfoutput></span>
                                </div>
                                <div class="formField">
                                    <label class="font10" id="ins_partno_label">&nbsp;INSTALL PART NO:</label> 
                                    <input class="form_field font10" id="insSraPartno" type="text" name="insSraPartno" value="<cfif StructKeyExists(form, 'insSraPartno')><cfoutput>#HTMLEditFormat(trim(form.insSraPartno))#</cfoutput></cfif>" readonly="readonly" />
									<input class="sraId" type="hidden" id="insSraPartnoId" name="insSraPartnoId" value="<cfif StructKeyExists(form, 'insSraPartnoId')><cfoutput>#HTMLEditFormat(trim(form.insSraPartnoId))#</cfoutput></cfif>" />
                                </div>
                                <div class="formField">
                                    <label class="font10" id="ins_nsn_label">&nbsp;INSTALL NSN:</label> 
                                    <input class="form_field font10" id="insSraNsn" type="text" name="insSraNsn" value="<cfif StructKeyExists(form, 'insSraNsn')><cfoutput>#HTMLEditFormat(trim(form.insSraNsn))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
				<table class="two_column_table" cellpadding="0" cellspacing="0">
					<tbody>
						<tr>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="labor_start_label">&nbsp;LABOR START:</label> 
                                    <input class="form_field font10 calendar_field" type="text" id="laborStartDate" name="laborStartDate" value="<cfif StructKeyExists(form, 'laborStartDate')><cfoutput>#HTMLEditFormat(trim(form.laborStartDate))#</cfoutput></cfif>"  readonly="readonly" />
                                    <input class="form_field font10 time_field" id="laborStartTime" type="text" name="laborStartTime" value="<cfif StructKeyExists(form, 'laborStartTime')><cfoutput>#HTMLEditFormat(trim(form.laborStartTime))#</cfoutput></cfif>" />
                                </div>
                            </td>
                            <td class="column">
                                <!---<div class="formField">
                                    <label class="font10" id="crew_chief_label">CREW CHIEF:</label> 
                                    <input class="form_field font10" id="crewChief" type="text" name="crewChief" value="<cfif StructKeyExists(form, 'crewChief')><cfoutput>#HTMLEditFormat(trim(form.crewChief))#</cfoutput></cfif>" />
                                </div>--->
                            </td>
						</tr>
						<tr>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="labor_comp_label">&nbsp;LABOR COMP:</label> 
                                    <input class="form_field font10 calendar_field" type="text" id="laborCompDate" name="laborCompDate" value="<cfif StructKeyExists(form, 'laborCompDate')><cfoutput>#HTMLEditFormat(trim(form.laborCompDate))#</cfoutput></cfif>"  readonly="readonly" />
                                    <input class="form_field font10 time_field" id="laborCompTime" type="text" name="laborCompTime" value="<cfif StructKeyExists(form, 'laborCompTime')><cfoutput>#HTMLEditFormat(trim(form.laborCompTime))#</cfoutput></cfif>" />
                                </div>
                            </td>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="crew_size_label">CREW SIZE:</label> 
                                    <input class="form_field font10" id="crewSize" type="text" name="crewSize" value="<cfif StructKeyExists(form, 'crewSize')><cfoutput>#HTMLEditFormat(trim(form.crewSize))#</cfoutput></cfif>" />
                                </div>
                            </td>
						</tr>
					</tbody>
				</table>
				<table class="two_column_table" cellpadding="0px" cellspacing="0px" id="partRequest" style="display:none">
					<tbody>
						<tr>
							<td class="column">
								<div>
									&nbsp;
								</div>
							</td>
							<td class="column">
								<div id="partOrderDiv">
									<cfif StructKeyExists(form, 'partOrderId')>
										<font class="font10">A part has been requested.</font>
									<cfelse>	
										<input type="button" name="requestPart" value="REQUEST A PART FROM DEPOT" id="requestPart" class="menubuttons middle1" onclick="orderPart()" onfocus="if(this.blur)this.blur()" />
									</cfif>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				
				<table class="one_column_table" cellpadding="0" cellspacing="0">
					<tbody>
                        <tr>
                            <td>
                                <div class="formField">
                                    <label class="font10" id="corr_action_label" style="vertical-align: top;">&nbsp;CORRECTIVE ACTION:</label><br/>
                                    <textarea class="text_area_field font10 touppercase" id="correctiveAction" name="correctiveAction" rows="4" ><cfif StructKeyExists(form, 'correctiveAction')><cfoutput>#HTMLEditFormat(trim(form.correctiveAction))#</cfoutput></cfif></textarea>
                                </div>
                            </td>
                        </tr>
						<tr>
                            <td>
                                <div class="formField">
                                    <label class="font10" id="remarks_label" style="vertical-align: top;">&nbsp;REMARKS:</label><br/>
                                    <textarea class="text_area_field font10 touppercase" id="remarks" name="remarks" rows="4" ><cfif StructKeyExists(form, 'remarks')><cfoutput>#HTMLEditFormat(trim(form.remarks))#</cfoutput></cfif></textarea>
                                </div>
                            </td>
                        </tr>
					</tbody>
				</table>
				<table class="one_column_table" cellpadding="0" cellspacing="0">
					<tbody>
						<tr><td class="section_header" colspan="3">Tests Failed:</td></tr>
                        <tr>
                            <td>
                            	<div class="formField">
                                    <label class="font10" id="tests_failed_label"><span class="font10">&nbsp;</span>TESTS FAILED:</label>
                                    <a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupTestsDialog.cfm" class="lookup lookup_ref" id="testsDialog" title="TESTS FAILED"><img src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
                        		</div>
                            </td>
                        </tr>
						<tr>
        					<td colspan="2" align="left">&nbsp;<div id="list_testsFailed"></div></td>
      					</tr>
					</tbody>
				</table>
				<cfif StructKeyExists(rc, "qTestFailed") >
				<table class="one_column_table" cellpadding="0px" cellspacing="0px" style="width:50%">
					<tbody>
						    <cfset loopcntr = 1>
							   <tr>
						 	<cfoutput query="rc.qTestFailed"> 
							 	
							 	   <td align="right" style="width:100px">&nbsp;
								   		<label id="test_fail" class="font10">
								   			<input type="text" readonly="true" name="testFailId#currentRow#" id="testFailId#currentRow#" value="#qTestFailed.fail_value[currentRow]#">
										</label>
								   </td>
								   <td class="deleteIcon " onclick="deleteClick(#currentRow#, #qTestFailed.test_Fail_Id[currentRow]#)"></td>
								   <cfif loopcntr EQ 4>
								   		</tr>	
					      				<tr>
								   </cfif>
								   <cfset loopcntr = loopcntr + 1 />
							</cfoutput> 
							</tr>
					</tbody>
					<tr>
						<td>&nbsp;</td>
					</tr>
				</table>
				</cfif>
				
				<cfif StructKeyExists(rc, "qLaborBitPc") AND rc.qLaborBitPc.recordcount NEQ 0>
					<table class="one_column_table bitPc" cellpadding="0px" cellspacing="0px">
	                	<tbody>
	                        <tr>
	                            <td>
	                                <div class="job_detail section_header">
	                                    Bit Pc Detail
	                                </div>
	                            </td>
	                        </tr>
							<tr>
								<td>
						            <div class="font10">
						             <table class="globalTable" id="repairTable">
						                     <thead>
						                        <tr>
					                            	<th class="noSort">&nbsp;</th>
						                            <th>PartNo</th>
						                            <th>Name</th>
						                            <th>Qty</th>
						                            <th class="noSort ">&nbsp;</th>
						                        </tr>
						                        
						                     </thead>
						                   <tbody>          
						                   <cfoutput>
						                   <cfloop query="rc.qLaborBitPc">    
						                        <tr class="<cfif rc.qLaborBitPc.currentRow mod 2> odd <cfelse> even </cfif>">
					                            	<td class="edit editIcon"><a href="index.cfm?action=update.bitPc&labor_bit_id=#rc.qLaborBitPc.ENCRYPTED_LABOR_BIT_ID#&eventRepair=<cfif StructKeyExists(form, 'eventRepair')><cfoutput>#HTMLEditFormat(trim(form.eventRepair))#</cfoutput></cfif>"></a></td>
						                            <td>#HTMLEditFormat(trim(BIT_PARTNO))#</td>
						                            <td>#HTMLEditFormat(trim(BIT_NAME))#</td>
						                            <td>#HTMLEditFormat(trim(BIT_QTY))#</td>
						                            <td class="delete deleteIcon "><a href="index.cfm?action=delete.bitPc&labor_bit_id=#rc.qLaborBitPc.ENCRYPTED_LABOR_BIT_ID#&eventRepair=<cfif StructKeyExists(form, 'eventRepair')><cfoutput>#HTMLEditFormat(trim(form.eventRepair))#</cfoutput></cfif>"></a></td>
						                        </tr>      
						                   </cfloop>
						                   </cfoutput>
						                   </tbody>
						               </table>
					            </td>
						            </div>
					        </tr>
						</tbody>
	                </table>
				</cfif>
                <table class="one_column_table" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td>
                                <div class="button_container">
                                	<input type="submit" class="input_buttons font10" style="display:none" id="btnBitPc" name="btnBitPc" value="ADD BIT PC" onclick="setAction('update.eventDetail.bitPc',this);setMethod('doAction',this);" />						
                                    <input type="submit" class="input_buttons font10" id="btnInsert" name="btnInsert" value="SUBMIT" onclick="setFailedTests();setAction('update.eventDetail',this);setMethod('doAction',this);" />
                                    <input type="reset" class="input_buttons font10 reset" id="btnReset" name="btnReset" value="RESET" />
                                </div>
                            </td>
                        </tr>
						<tr>
							<td class="column" style="text-align:center"><cfoutput><a href="index.cfm?action=edit.maintenance&eventJob=#eventid#">Return to Update Maintenance</a></cfoutput></td>
						</tr>
                    </tbody>
                </table>
            </div>
        </cfform>
    </div>
	
</RIMMS:layout>
