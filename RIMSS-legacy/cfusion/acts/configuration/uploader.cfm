<cfsetting showdebugoutput="no">
<link href="#programPath#/layout/css/skin.css" rel="stylesheet" type="text/css" />

<script type="text/javascript">
	function SendData(obj)
	{	
		if(document.getElementById("desc").value.length > 2000)
		{
			alert("The Description field can only contain a maximum of 2000 characters. \nThere are currently "+document.getElementById("desc").value.length+ " characters.");	
			return false;
		}
		
		parent.getiFrame(obj);
	}

</script>

<body  style="background-color:#f5f5dc"; font:11px Arial, Helvetica, sans-serif">  


<!---<cfset qExtension = CreateObject("component", "cfc.GRVE_Base").getFileExt() />--->
        
        
<cfif IsDefined("form.dir")>

	<cfform name="objForm" method="post" action="uploader.cfm"> 
    	<cfset dirMgr = CreateObject("component", "cfc.utils.Directory_Mgr") />
        <cfset dirMgr.createDir(#application.sessionManager.getUserName()#) />
        
        <cfset path="#ExpandPath('#application.rootpath#/#application.sessionManager.getUserName()#')#">
		<!---<cfset path = getTempDirectory() />--->
        <cflog file="RIMSS" text="uploader.cfm:: #path#">
      	<cftry>
      		<cffile action="upload" filefield="dir" destination="#path#" nameconflict="overwrite" accept="image/*, application/msword, application/pdf, application/vnd.ms-excel,application/vnd.openxmlfor,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/pjpeg ">
			<cfcatch>
				<cfif FindNoCase("not accepted", cfcatch.Message)>
            		<script>                	
                    	alert("Only the following file types are allowed: .doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg");
						window.location='uploader.cfm';
            		</script>
            		<cfabort />
        		<cfelse>
            		<!--- looks like non-MIME error, handle separately --->
            		<cfdump var="#cfcatch#" abort />
        		</cfif>
			</cfcatch>
		</cftry>
		<cfset fileSz = getFileInfo(#path#&"/"&#file.ClientFile#) />
        <cfset fileNm = #path#&"/"&#file.ClientFile# />
        <cfset ext = #FILE.ClientFileExt# />
        
        
        <cfinput type="hidden" name="ext" id="ext" value="#ext#" />
        <cfinput type="hidden" name="fileName" id="fileName" value="#fileSz.name#" />
		
         <!---<cfoutput query="qExtension">
        	<cfif ext EQ code_value>
            	<cfset tmpp = #qExtension.code_id# />
            </cfif>
		</cfoutput>
        <cfinput type="hidden" name="extCode" id="extCode" value="#tmpp#">	--->
      <table border="0" align="center" width="100%">
            <tr>
            	<td colspan="2" style="font-size:16px; text-align:center">
                	<cfoutput>#fileSz.name#</cfoutput>
                </td>
            </tr>
        	<tr>
            	<td valign="top" align="right">Description:</td>
                <td><cftextarea rows="5" cols="40" name="desc" id="desc" onkeydown="return MaxLen(this, 2000);"></cftextarea></td>
            </tr>
            <tr>
            	<td colspan="2" align="center">
        			<cfinput type="button" name="send" id="send" value="Send Data" onclick="SendData(this.form);"  />
                    <cfinput type="button" name="cancel" id="cancel" value="Cancel" onClick="parent.canceliFrame();" />
                </td>
            </tr>
        </table> 
    </cfform>
<cfelse>
    <form name="obj" enctype="multipart/form-data" method="post" action="uploader.cfm">
   	
    	<br /><br />
		<table border="0" align="center">
        	<tr>
            	<td>
                	<input type="file" name="dir" id="dir" />
                </td>
                <td>
                	<input type="submit" value="Upload"  onclick="return validate();" />
                </td>
            </tr>
            <tr>
            	<td><font color="#FF0000" size="-4">Allowable formats: (.doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg)</font></td>
                <td><div id="stat"></div></td>
            </tr>
        </table>
        <br /><br /><br /><br />
		<cfoutput><input type="hidden" name="param" id="param" value="" /></cfoutput>
    </form>
</cfif>
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