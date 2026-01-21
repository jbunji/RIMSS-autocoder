<cfsilent>
	<cfset utils = new cfc.utils.utilities()>
	<cfif isDefined("rc.file")>
	    <cfset rc.log = fileRead(rc.file)/>
	</cfif>
</cfsilent>

<cfif isDefined("rc.file")>
	
<cfoutput><cfif isDefined("rc.log")>#trim(rc.log)#</cfif></cfoutput>

<cfabort/>
</cfif>



<!--- Handles Save and Reset --->
<cfsilent>
	<cfimport taglib="../../default/layout" prefix="RIMSS"/>
	<cfset utils = new cfc.utils.utilities()>
	<cfset cflogpath = utils.getCFLogDirectory(SERVER)/>
	<cfif directoryExists(application.logPath)>
	   <cfdirectory action="list" directory="#application.logPath#" name="logPath" type="file" sort="DATELASTMODIFIED desc" filter="*.log" >
	</cfif>
	<cfif directoryExists(cflogpath)>
	   <cfdirectory action="list" directory="#cflogpath#" name="cflogPath" type="file" sort="DATELASTMODIFIED desc" filter="*.log" >
	</cfif>
	<cfif directoryExists(APPLICATION.mappingPath)>
	   <cfdirectory action="list" directory="#APPLICATION.mappingPath#" name="mappingPath" type="file" sort="DATELASTMODIFIED desc" filter="*.xml" >
	</cfif>
	<cfparam name="form.log" default=""/>
	<cfif structkeyexists(form,"btnReset")>
	   <cfset StructDelete(form,"logFile")>
	</cfif>
	
	<cfif structkeyexists(rc,"logFile") and len(trim(rc.logFile))>
	    <cfif StructkeyExists(form,"btnLogSave")>
			<cfheader name="Content-disposition" value="attachment;filename=#getFileFromPath(rc.logFile)#">
            <cfcontent type="text/plain" file="#rc.logFile#">
			<cfabort/>
		<cfelse>
			<!---<cfset form.log = fileRead(rc.logFile)/>--->
		</cfif>
	
	</cfif>
	
	
</cfsilent>


<RIMSS:layout section="utilities">

<script>

	$(function() {

		$('#btnLogReset').on("click",function(event){
		  $('.fileOutput').empty();
		  $('#logFile').get(0).selectedIndex=0;  	
		});
		

        $('#btnLogRetrieve').on("click",function(event){
			event.preventDefault();
			$('.fileOutput').empty();
			d = {};
			d.file = $('#logFile option:selected').val();
            d.file.replace(/\\/g,"/");
			
			if ($.trim(d.file).length > 0) {
				var filename = d.file.replace(/^.*[\\\/]/, '');
				$('.fileOutput').text('Loading '+filename);

            $('.fileOutput').load(document.location.href,d,function(response){
                    response = response.replace(/(\r\n|\n|\r)/gm,"\n");
					try {
						html = $($.trim(response));
						
						if ($(html).find("div.errorMsg").length > 0) {
							$(this).empty();
						}
						else {
							$(this).text(response);
						}
					}catch(err){
						$(this).text(response);
					}
                    
				});


			}
		});

	});
				
			

</script>


<style type="text/css">

	.fileOutput{
		height:500px; 
		margin:5px auto; 
		padding:5px; 
		width:95%; 
		border:1px solid black; 
		background-color:white;
		overflow: auto; 
		font-size:12px;
		white-space:pre;

	}

	.menuButtons{
		padding:5px;
		border-bottom:2px 
		solid white;
	}

</style>

	<div class="headerContent" >
        <div class="headerTitle">Log / Mappings Viewer</div>
    </div>
	<div class="font12 mainContent">   	
		<form name="logListing" id="logListing" method="post" action="">
			<div class="menuButtons button_container">
				<cfoutput>
						<select name="logFile" id="logFile">
			                <option value=""></option>
							<cfif isDefined("logPath") and isQuery(logPath) and logPath.recordcount>
								<optgroup class="appLogs" label="#UCASE(application.name)# Log File(s)">
					                <cfloop query="logPath">
										<cfset curDirectory = directory & "/" & name/>
										<cfset directoryPath = ReplaceNoCase(curDirectory,"\","/","ALL")/>
					                    <option <cfif Structkeyexists(rc,"logFile") and rc.logFile eq "#encodeForHTML(directoryPath)#">selected="selected"</cfif> value="#encodeForHTML(directoryPath)#">#encodeForHTML(name)# | #encodeForHTML(size)# | #DateFormat(DATELASTMODIFIED)# #TimeFormat(DATELASTMODIFIED,'HH:mm:ss')#</option>
					                </cfloop>
				                </optgroup>
							</cfif>
							<cfif isDefined("cflogPath") and isQuery(cfLogPath) and cfLogPath.recordcount>
								<optgroup class="cfLogs" label="#UCASE(application.name)# ColdFusion Log File(s)">
									<cfloop query="cflogPath">
										<cfset curDirectory = directory & "/" & name/>
                                        <cfset directoryPath = ReplaceNoCase(curDirectory,"\","/","ALL")/>
					                    <option <cfif Structkeyexists(rc,"logFile") and rc.logFile eq "#encodeForHTML(directoryPath)#">selected="selected"</cfif> value="#encodeForHTML(directoryPath)#">#encodeForHTML(name)# | #encodeForHTML(size)# | #DateFormat(DATELASTMODIFIED)# #TimeFormat(DATELASTMODIFIED,'HH:mm:ss')#</option>
					                </cfloop>	
								</optgroup>
							</cfif>
							<cfif isDefined("mappingPath") and isQuery(mappingPath) and mappingPath.recordcount>
                                <optgroup class="mappings" label="#UCASE(application.name)# Mapping File(s)">
                                    <cfloop query="mappingPath">
										<cfset curDirectory = directory & "/" & name/>
                                        <cfset directoryPath = ReplaceNoCase(curDirectory,"\","/","ALL")/>
                                        <option <cfif Structkeyexists(rc,"logFile") and rc.logFile eq "#encodeForHTML(directoryPath)#">selected="selected"</cfif> value="#encodeForHTML(directoryPath)#">#encodeForHTML(name)# | #encodeForHTML(size)# | #DateFormat(DATELASTMODIFIED)# #TimeFormat(DATELASTMODIFIED,'HH:mm:ss')#</option>
                                    </cfloop>   
                                </optgroup>
                            </cfif>
			            </select>
				</cfoutput>
	            <input type="button" class="input_buttons" name="btnLogRetrieve" id="btnLogRetrieve" value="RETRIEVE"/>
				<input type="submit" class="input_buttons" name="btnLogSave" id="btnLogSave" value="SAVE"/>
				<input type="button" class="input_buttons" name="btnLogReset" id="btnLogReset" value="RESET"/>
			</div>
			<cfoutput>
				<div class="fileOutput"></div>
            </cfoutput>
		</form>
	</div>	
</RIMSS:layout>



