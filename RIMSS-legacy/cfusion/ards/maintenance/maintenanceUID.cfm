<cfimport taglib="../layout" prefix="RIMSS"/>
<RIMSS:layout section="maintenance">
    <RIMSS:subLayout/>

	<script>

		try {
            $(document).ready(function(){
				$('textarea.reader').focus();
				
				//Setup UID Reader to wait for reader data
				setupUIDReader();
	            
				$('.reset').click(function(event) {
	                event.preventDefault();
	                resetForm($(this).closest('form'));
					$('textarea.reader').focus();
	            });
				
				
            });

        }catch(err){}
		
		
	</script>
	
<cfoutput>	
<div class="message #msgStatus#">#msg#</div>
</cfoutput>      
	   
<div class="headerContent" >
    <div class="headerTitle">UID Reader Input</div>
</div>
<div class="font12 mainContent">
	<form name="inputFromUID" id="inputFromUID" method="post" action="index.cfm" style="text-align:center">
		<table class="one_column_table" cellpadding="0px" cellspacing="0px">
                <tbody>
                    <tr>
                        <td colspan="1">
                            <div class="button_container">
                                 <input type="reset" name="btnReset" value="RESET" class="reset">
								 <textarea type="text" name="uids" id="uids" class="reader hidden" rows="25" cols="100"></textarea> 
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
	</form>	
</div>
<cfdump var="#rc#"/>

</RIMSS:layout>