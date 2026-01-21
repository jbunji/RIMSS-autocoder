<!DOCTYPE html>
<cfsilent>
	
	<!--- don't use a template on this page.  will be used as a dialog box. --->
	<cfsetting showDebugOutput="false">

   <cfset programLookup = application.sessionManager.getProgramSetting() />
	<cfset unitLookup = application.sessionManager.getUnitSetting() />

	<cfset sysCatLookup = "AIRBORNE" />
	<cfif IsDefined("form.systemcat")>
    	<cfset sysCatLookup = ucase(form.systemcat) />
	</cfif>
	
	<cfset testsLookup = application.objectFactory.create("DbLookups") />

    <cftry>
		<cfset tests = testsLookup.lookupTests(programLookup, unitLookup, sysCatLookup) />
    <cfcatch>
        <cfset tests = [] />
    </cfcatch>
    </cftry>
	
</cfsilent>

<div id="testsLookup" style="width: 100%;">
    
	
	<table class="lookupDialog font10" id="userTests" cellpadding="0" cellspacing="0" >
        <thead>
        <cfif ArrayLen(tests) gt 0> 
        <tr>
            <th colspan="2" class="filter">
              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
            </th>
        </tr>
        </cfif> 	
		<tr class="header">            
			<th>TEST TYPE</th>
			<th>TEST</th>
        </tr></thead>
		<tbody>
			
    	<cfif ArrayLen(tests) gt 0>
			<cfloop index="idx" from="1" to="#ArrayLen(tests)#">
			<cfset userTest = tests[idx] />
            <tr class="test <cfif (idx mod 2) eq 0>even<cfelse>odd</cfif>">
            	<td class="testType" data-testtype="<cfoutput>#userTest.test_type_id#</cfoutput>"><span><cfoutput>#userTest.test_type#</cfoutput></span></td>
		        <td class="testName" id='<cfoutput>#userTest.test_id#</cfoutput>' data-testname="<cfoutput>#userTest.test_name#</cfoutput>">
		        	<span><cfoutput>#userTest.test_name#</cfoutput></span>
		        </td>
            </tr>
            </cfloop>
        <cfelse>
            <tr class="code">
                <td colspan="2">
                    No TESTs found.
                </td>
            </tr>
        </cfif>
        </tbody>
    </table>
</div><!---
---><cfif ArrayLen(tests) gt 0>
    <script type="text/javascript">
        $(document).ready(function() {
            $("#userTests").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					var t = $('#testFailCntr').val();
					t++;
					testName=$.trim($(this).parent().find(".testName").data("testname"));
					testId=$.trim($(this).parent().find(".testName").attr("id"));
					$("#testFailCntr").val(t);
					document.getElementById("list_testsFailed").innerHTML += "<table width='100%' id='testsFailReg"+t+"'><tr><td><input type='hidden' name='failTestId"+t+"' id='failTestId"+t+"' value='"+testId+"'><input type='hidden' name='failTestName"+t+"' id='failTestName"+t+"' value='"+testName+"'  readonly='readonly'  /><label class='font10' for='failTestName"+t+"'>&nbsp;"+testName+"</label> - <label class='font10'><a href='javascript: removeTest("+t+");'>remove</a></label></td></tr></table>";
					
                    $("#dialogLookup").dialog("close");
                }
            });
			
			var dt = $('.lookupDialog:visible').dataTable({ 
                      "bFilter": true,
                      "sDom":"t"
               });
            $('.lookupDialog:visible').find('#dtSearch').on('keyup',function(e){
                
                    dt.fnFilter($(this).val());
            });

        });
    </script><!---
---></cfif>