<cfsetting showdebugoutput="no">

<!---<cfdump var="#application#">--->

<head>
	 <script src="#application.rootpath#/common/js/jquery-1.8.2.js"></script>
	 <script src="#application.rootpath#/common/js/jquery-ui-1.9.1.js"></script>
	 <script src="#application.rootpath#/common/js/common.js"></script>
	 <script src="#application.rootpath#/common/js/functions.js"></script>
</head>


<script type="text/javascript">
	
	
	
	function SendData(obj)
	{	
		parent.getorderPartFrame(obj);
	}
	
	function orderPart() {
		var partOrderAssetId = document.getElementById('partOrderAssetId').value;
		var partOrderNoun = document.getElementById('partOrderNoun').value;
		var partOrderPartNumber = document.getElementById('partOrderPartNumber').value;
		var remSraLaborPartId = document.getElementById('remSraLaborPartId').value;
		
		
		alert($('#remSraLaborPartId').val());	
		alert('Asset to be replaced - ('+partOrderAssetId+') Part Noun ('+ partOrderNoun+') Part Number ('+partOrderPartNumber+') Part LaborId ('+remSraLaborPartId+')');
		window.location.href="index.cfm?action=create.partOrder";
	}

</script>


<style>
.menubuttons.yesBut {
 	cursor: pointer !important;
    border: 1px solid #000;
    background-color: #12E8A0;
    color: #000;
}

.menubuttons.cancelBut {
 	cursor: pointer !important;
    border: 1px solid #000;
    background-color: #E21742;
    color: #fff;
}		
</style>

<body  style="background-color:#A1C8EF">  
        
        
    <form name="pr" method="post" <cfoutput>action="#application.rootpath#/criis/maintenance/index.cfm"</cfoutput>>
		<table border="0" width="100%">
    		<tr>
    			<td align="center"><font style="font-family:Arial;font-size:24;"><b>REQUEST A PART</b></td>
    		</tr>
			<tr>
				<td>
					<table border="0" align="center" width="100%" bgcolor="#FFFFFF">
						<tr>
							<td colspan="2" align="center"><font style="font-family:Arial;"><b>ARE YOU SURE YOU WANT TO ORDER A</b></font></td>
						</tr>
			        	<tr>
			            	<td width="60%" align="center">
								<input type="input" name="partOrderNoun" style="width:85%" id="partOrderNoun" value="<cfif StructKeyExists(url, 'remSraNoun')><cfoutput>#encodeForHTML(trim(URLDecode(url.remSraNoun)))#</cfoutput></cfif>" />
								<input type="hidden" name="partOrderAssetId" id="partOrderAssetId" value="<cfif StructKeyExists(url, 'remSraAssetId')><cfoutput>#encodeForHTML(trim(URLDecode(url.remSraAssetId)))#</cfoutput></cfif>">
								<input type="hidden" name="remSraLaborPartId" id="remSraLaborPartId" value="<cfif StructKeyExists(url, 'remSraLaborPartId')><cfoutput>#encodeForHTML(trim(URLDecode(url.remSraLaborPartId)))#</cfoutput></cfif>">
			                </td>
							<td width="40%" align="center">
								<input type="input" name="partOrderPartNumber" style="width:85%" id="partOrderPartNumber" value="<cfif StructKeyExists(url, 'remSraPartno')><cfoutput>#encodeForHTML(trim(URLDecode(url.remSraPartno)))#</cfoutput></cfif>" />
			                </td>                
			            </tr>
			        </table>
					<table width="100%">
						<tr>
							<td width="50%" align="center"><input type="button" class="menubuttons yesBut" id="yesButton" name="yesButton" value="YES" onClick="SendData(this.form);"></td>
							<td width="50%" align="center"><input type="button" class="menubuttons cancelBut" id="noButton" name="noButton" value="CANCEL" onClick="parent.cancelpartRequest();"></td>
						</tr>
					</table>
				</td>
			</tr>
	
        <br />
		
    </form>
</body>

<script type="text/javascript">
	
	function validate()
	{
		document.obj.param.value = document.obj.dir.value;
		
		var pass = false;
		//Parses file string for extension
		var t = document.getElementById("dir").value;
		
		if(t == "")
		{
			alert("You must specify a file.");
			return false;
		}
		
		var extArray = t.split(".");
		var ext = extArray[extArray.length-1];
		//Retrieves valid file extensions
		var temp = document.getElementById("extList").value;
		array = temp.split(", ");
		
		for(i=0; i<array.length; i++)
		{	
			arr = array[i];
			//alert(arr);
			if(arr.toUpperCase()==ext.toUpperCase())
			{
				pass = true;
			}
		}
		if(pass==false)
		{
			alert("This application does not support file extension "+ext.toUpperCase()+". \nPlease contact administration for permissions \nto allow this extension or convert the file type.");
			//window.close();	
		}else
		{
			document.getElementById("stat").innerHTML = "<font size='-4'>Processing...</font>";	 
		}
		return pass;
	}
	
	function MaxLen(obj, len)
	{
		return ((obj.value.length <= len-1) || (event.keyCode==8));	
	}
</script>