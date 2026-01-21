<cfsilent>
<cfparam name="attributes.exportTypes" default=""/>
<cfparam name="attributes.id" default=""/>
<cfparam name="attributes.query" default=""/>
<cfparam name="attributes.headerFontColor" default="000000"/>
<cfparam name="attributes.headerBackgroundColor" default="CCCCCC"/>
<cfparam name="attributes.convertColumns" default=""/>
<cfparam name="attributes.title" default=""/>
<cfparam name="attributes.exportTitle" default="Export Excel"/>
<cfparam name="hasSession" default="false"/>
<cfparam name="attributes.xlsx" default="true"/>
<cfparam name="attributes.cssFile" default=""/>
<cfparam name="attributes.customTagsFolder" default="admin/adhoc"/>

<cfset formAdded = false>

<cfset idArray = ArrayNew(1)>
<cfif isSimpleValue(ATTRIBUTES.id)>
	<cfset idArray = ListToArray(ATTRIBUTES.id)>
</cfif>

<cffunction name="findRoot" output="no">
	<cfset var local = StructNew()>
	<cfset local.sRoothPath = "/">
	<cfset local.objPattern = CreateObject( "java", "java.util.regex.Pattern" ).Compile( "^/{1}.[A-Za-z0-9_-]+" ) />
    <cfset local.objMatcher = local.objPattern.Matcher( getPageContext().getRequest().getRequestURI() ) />
    <cfset local.objMatcher.find()/>
    <cfset local.sRootPath = local.objMatcher.group() />
	<cfreturn local.sRootPath>
</cffunction>

<cffunction name="getCustomTagPath" output="yes">
	<cfset var local = structnew()>
	<cfset local.currentPath = replaceNoCase(getCurrentTemplatePath(),"/cfusion","","ONE")>
	
	<cfif isDefined("CGI.CONTEXT_PATH") and len(trim(CGI.CONTEXT_PATH))>
		<cfset local.contextPath = rereplacenocase(trim(CGI.CONTEXT_PATH),"[\\/]+$","","all") & "/"/>
        <cfset local.rootPath = trim(local.contextPath) & "/" & ATTRIBUTES.customTagsFolder & "/">
        <cfreturn local.rootpath/>
    </cfif>

	<cfset local.rootPath = replaceNoCase(findRoot(),"/cfusion","","ONE")>
	<cfset local.currentPath = replaceNocase(local.currentPath,"\","/","ALL")>
	<cfset local.rootPath = replaceNocase(local.rootPath,"\","/","ALL")>
	<cfset local.currentPage = listLast(local.currentPath,"/")>
	<cfset local.findRootPosition = findNoCase(local.rootpath,local.currentPath)>
	<cfset local.currentPathLength = len(local.currentPath)-local.findRootPosition>
	<!---<cfset local.end = Val(local.currentPathLen)-val(local.findRootPosition)>--->
	<cfif local.findRootPosition gt 0>
		<cfset local.path = mid(local.currentPath,local.findRootPosition,local.currentPathLength+1)>
		<cfset local.path = replaceNocase(local.path,local.currentPage,"","ONE")>
		<cfreturn local.path>
	</cfif>
	
	<cfreturn local.rootpath>
</cffunction>


<cfset serializer = createObject("component","export.assets.exportPage.JSONUtil")>

<cfif structKeyExists(attributes, "rootpath")>
	<cfset sRootPath = attributes.rootpath />
<cfelseif structKeyExists(Application, "root")>
    <cfset sRootPath = Application.root />
<cfelse>
    <cfset objPattern = CreateObject( "java", "java.util.regex.Pattern" ).Compile( "^/{1}.[A-Za-z_-]+" ) />
    <cfset objMatcher = objPattern.Matcher( cgi.script_name ) />
    <cfset objMatcher.find()/>
    <cfset sRootPath = objMatcher.group() />
</cfif>




	<!--- 
		Namespace used to include code to run only once.  
		This is used if you call this tag multiple times.
		For example this is used to include the javascript libraries on the page one time. 
	--->
	<cfparam name="ATTRIBUTES.NameSpace" default="REQUEST.CustomTagExport.Demo"/>
	
	<cfif NOT StructKeyExists( CALLER, ATTRIBUTES.NameSpace )>
		<!--- Create default name space for this tag. --->
        <cfset obj = StructNew()>
        <cfset obj.JavaScriptRendered = false>
        <cfset obj.TagCount = 0>
		 <cfset CALLER[ ATTRIBUTES.NameSpace ] = obj />
	</cfif>

	<cfset variables.customTagPath = getCustomTagPath()>
	
	<cfset export_styleSheet = "#APPLICATION.rootpath#admin/export/assets/css/exportMenu.css"/>
	<cfif len(trim(ATTRIBUTES.cssfile))>
		<cfset export_styleSheet = trim(ATTRIBUTES.cssFile)/>
	</cfif>
	
</cfsilent> 
<cfset uniqueString = CreateUUID()>
<cfif StructKeyExists(CALLER,ATTRIBUTES.NameSpace) AND NOT CALLER[ ATTRIBUTES.NameSpace ].JavaScriptRendered>	
<cfsavecontent variable="head">
<cfoutput>
    <!--- begin export include files --->
	<script src="#variables.customTagPath#export/assets/js/export.js"></script>
	<link href="#variables.customTagPath#export/assets/css/exportMenu.css" rel="stylesheet" type="text/css">
    <script>
   
	$(function(){
		
		<cfoutput>
			#ToScript(variables.customTagPath,'customTagPath')#
			#ToScript(idArray,'id')#
			#ToScript(uniqueString,'uniqueString')#
			#toScript(attributes.exportTitle,'exporttitle')#
			#toScript(attributes.title,'title')#
			#toScript(export_styleSheet,'cssFile')#
			
			#toScript(CGI.SCRIPT_NAME,'link')#
		</cfoutput>
		
		setupPrintLink(id,title,cssFile);
		
		setupPDFLink(id,title,exporttitle,cssFile);
		
		setExportRootPath(customTagPath);
		setupExcelLink();
		
		setReturnLink(link);
		
		});
	
	</script>
	<!-- end export include files -->
</cfoutput>

</cfsavecontent>

<cfhtmlhead text="#head#"/>
<cfset formAdded = true>
</cfif>



<cfsilent>


	
	<cfset newColumns = ArrayNew(1)>
	<cfset newQArray = ArrayNew(1)>
	<cfif isArray(attributes.query)>
		<cfset columnArray = ArrayNew(1)>
		<cfset newQArray = ArrayNew(1)>
		<cfloop from="1" to="#ArrayLen(attributes.query)#" index="q">
			<cfif isQuery(attributes.query[q])>
				<cfset columnArray = ArrayNew(1)>
				<cfset ArrayAppend(columnArray,ArrayToList(attributes.query[q].getColumnList()))>
				<cfset ArrayAppend(columnArray,ArrayToList(attributes.query[q].getColumnList()))>
				<cfset ArrayAppend(newColumns,columnArray)>
				<cfset qryStruct = StructNew()>
				<cfset qryStruct['Sheet#q#'] = attributes.query[q]>
				<cfset qryStruct['Sheet#q#'] = serializer.serializeToJSON(qryStruct)>
				<cfset ArrayAppend(newQArray,qryStruct)>
			<cfelseif isStruct(attributes.query[q])>
				<cfset columnArray = ArrayNew(1)>
				<cfset qryStructNames = ListToArray(StructKeyList(attributes.query[q]))>
				<cfset qrySheetName = qryStructNames[1]>
				<cfset currentQuery = attributes.query[q][qrySheetName]>
				<cfset ArrayAppend(columnArray,ArrayToList(currentQuery.getColumnList()))>
				<cfset ArrayAppend(columnArray,ArrayToList(currentQuery.getColumnList()))>
				<cfset attributes.query[q][qrySheetName] = serializer.serializeToJSON(attributes.query[q])>
				<cfset ArrayAppend(newColumns,columnArray)>
				<cfset ArrayAppend(newQArray,attributes.query[q])>
			</cfif>	
		</cfloop>
	<cfelseif isQuery(attributes.query)>
		<cfset newQArray = ArrayNew(1)>
		<cfset columnArray = ArrayNew(1)>
		<cfset ArrayAppend(columnArray,ArrayToList(attributes.query.getColumnList()))>
		<cfset ArrayAppend(columnArray,ArrayToList(attributes.query.getColumnList()))>
		<cfset ArrayAppend(newColumns,columnArray)>
		<cfset qryStruct = StructNew()>
		<cfset qryStruct['Sheet1'] = attributes.query>
	
		<cfset qryStruct['Sheet1'] = serializer.serializeToJSON(qryStruct)>
		<cfset ArrayAppend(newQArray,qryStruct)>
	</cfif>
	
	<cfif not isArray(attributes.convertColumns) or (isArray(attributes.convertColumns) and not ArrayLen(attributes.convertColumns))>
		<cfset attributes.convertColumns = columnArray>
	</cfif>
	
	<cfset qryColumns = attributes.convertColumns>
	<cfif isArray(attributes.convertColumns) and ArrayLen(attributes.convertColumns)>
		<cfset qryColumns = serializer.serializeToJSON(attributes.convertColumns)>
	</cfif>
</cfsilent>

<cfif listlen(attributes.exportTypes)>
	<cfsilent>
			<cfset variables.exportList = "PRINT,PDF,EXCEL">
			<cfset variables.tempList = "">
			<cfset variables.i = 0>
			<cfloop from="1" to="#listLen(variables.exportList)#" index="i">
				<cfset attributes.exportTypes = rereplacenocase(attributes.exportTypes," ","","ALL")>
				<cfif ListFindNocase(attributes.exportTypes,ListGetAt(variables.exportList,i))>
					<cfset variables.tempList = ListAppend(variables.tempList,ListGetAt(variables.exportList,i))>
				</cfif>
			</cfloop>
	</cfsilent>
	<cfif listlen(variables.tempList)>
		<div class="exportContainer exportnoprint" align="right">
			<div>
				<ul class="exportMenu exportclearfix" title="Export Options">
					<!---<cfif listFindNoCase(attributes.exportTypes,"PRINT")>
						<li class="printLink" title="Print Friendly"><a href="#"><cfoutput><img  src="#variables.customTagPath#export/assets/images/print.png" border="0"/></cfoutput> Print</a></li>
					</cfif>
					<cfif listFindNoCase(attributes.exportTypes,"PDF")>
						<li class="pdfLink" title="Export to PDF"><a href="#"><cfoutput><img src="#variables.customTagPath#export/assets/images/acrobat.png" border="0"/></cfoutput> PDF</a></li>
					</cfif>
					<cfif listFindNoCase(attributes.exportTypes,"EXCEL")>
						<li class="excelLink" title="Export to Excel"><a href="#"><cfoutput><img src="#variables.customTagPath#export/assets/images/excel.png" border="0"/></cfoutput> Excel</a></li>
					</cfif>--->
					<li id="exportButtons"></li>
				</ul>
			</div>
		</div>
	</cfif>
</cfif>
<cfsilent>
	<cfset request.uniqueUser = CreateUUID()>
	<cfset request.convertColumns = qryColumns>
	<cfset request.headerColor = attributes.headerBackgroundColor>
	<cfset request.fontColor = attributes.headerFontColor>
	<cfset request.title = attributes.title>
	<cfset request.exceltitle = attributes.exporttitle>
	<cfset request.xlsx = attributes.xlsx>
	<cfset request.submitted = NOW()>
	<cfset excelList = ArrayNew(1)>
	<cfset excelCounter = 0>
	<cfloop from="1" to="#ArrayLen(newQArray)#" index="e">
		<cfset names = ListToArray(StructKeyList(newQArray[e]))>
		<cfset getExcelName = names[1]>
		<cfset getExcelValue = newQArray[e][names[1]]>
		<cfset request['EXCELCONTENT' & excelCounter]  = newQArray[e][getExcelName]>
		<cfset request['Sheet'&excelCounter]  = getExcelName>
		<cfset excelCounter = excelCounter + 1>
	</cfloop>

	<cfset SESSION.ExcelExportInfo = Duplicate(REQUEST)>
</cfsilent>

<cfif isDefined("form.exportField")>
	<cflocation url="#variables.customTagPath#/export/assets/exportPage/exportDocument.cfm" addtoken="false"/>
	<!---<cfif isDefined("CGI.CONTEXT_PATH") and len(trim(CGI.CONTEXT_PATH))>
		
		<cfset GetPageContext().forward("export/assets/exportPage/exportDocument.cfm")>
	<cfelse>
		<cfset GetPageContext().forward("#variables.customTagPath#/export/assets/exportPage/exportDocument.cfm")>
	</cfif>--->
	<cfabort/>
</cfif>

<cfoutput>	
<form name="exportExcelForm" style="display:none" id="exportExcelForm" action="#CGI.SCRIPT_NAME#" method="POST">
	<input type="hidden" name="exportField" id="exportField" value="true"/>
	<cfloop collection="#form#" item="f">
		<cfif isSimpleValue(form[f])>
		<cfoutput><input type="hidden" name="#f#" id="#f#" value="#htmleditFormat(trim(form[f]))#"/></cfoutput>
		</cfif>
	</cfloop>
</form>
</cfoutput>

<cfexit method="exittag" />


