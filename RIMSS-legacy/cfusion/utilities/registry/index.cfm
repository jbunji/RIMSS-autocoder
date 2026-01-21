<cfsilent>
    <cfimport taglib="../../default/layout" prefix="RIMSS"/>
</cfsilent>



<RIMSS:layout section="utilities">
	<cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
	<script>
	
	    $(function() {
	
	        $('#btnReset').on("click",function(event){
	          $('.dataOutput').empty(); 
			  $('#UIICodes').empty();
	        });
	        
	        $('#btnRetrieve').on("click",function(event){
	          $(this).closest("form").setActionMethod("retrieve.uii","doAction");
	        });
	    });
	                
	            
	
	</script>
<!---
	<cfset codes = "D987528429354-100747,D1233902501100-1M00245,D1233902501800-1M00252,D1233902501300-1M00234,D1233902501000-1SMP50225A"/>
	<cftry>
		<cfset registry = new cfc.utils.IUIDRegistry()>
	<!---<cfset elemRet = registry.elementRetrieval(codes)>
	<cfdump var="#elemRet#"/>

	<cfset uiiVerRet = registry.UIIVerification(codes)>
    <cfdump var="#uiiVerRet#"/>--->
	
	
	<cfset uiiPartRet = registry.UIIRetrievalByPartNumber("02501300-1","M00245")>
    <cfdump var="#uiiPartRet#"/>
	
	
	
	<cfset pedigree = [
	   {
	       'EnterpriseIdentifier' = "12339",
	       'SerialNumber' = "M00245",
	       'PartNumber' = "02501300-1"

	   }
	]/>
	
	
	<cfset uiiRet = registry.UIIRetrieval(pedigree)>
    <cfdump var="#uiiRet#"/>

	<cfcatch>
		<cfdump var="#cfcatch#"/>
	</cfcatch>
	</cftry>--->
	
	<div class="headerContent" >
        <div class="headerTitle">UID Registry Reader</div>
    </div>
    <div class="font12 mainContent">    
        <form name="UIDListing" id="UIDListing" method="post" action="../index.cfm">
	       <div class="menuButtons button_container">
                <cfoutput>
					<label>UII Codes: </label>
                    <input type="text" name="UIICodes" id="UIICodes" <cfif Structkeyexists(form,"uiiCodes")>value = "#encodeForHTML(trim(form.uiiCodes))#"</cfif> />
                </cfoutput>
                <input type="submit" class="input_buttons" name="btnRetrieve" id="btnRetrieve" value="RETRIEVE"/>
				<input type="reset" class="input_buttons" name="btnReset" id="btnReset" value="RESET"/>
	       </div>
		   <cfoutput>
                <div class="dataOutput"><cfif isDefined("rc.uiidata")>#rc.uiidata#</cfif></div>
            </cfoutput>
        </form>
	</div>
	
</RIMSS:layout>	
	