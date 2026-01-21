<cfsilent>
	<cfsetting showdebugoutput="false" />
<cfif structKeyExists(Application, "root")>
    <cfset sRootPath = Application.root />
<cfelse>
    <cfset objPattern = CreateObject( "java", "java.util.regex.Pattern" ).Compile( "^/{1}.[A-Za-z_-]+" ) />
    <cfset objMatcher = objPattern.Matcher( cgi.script_name ) />
    <cfset objMatcher.find()/>
    <cfset sRootPath = objMatcher.group() />
</cfif>
    
    
</cfsilent>

<html>
<head>
<title>Export Document</title>
</head>
<body >
<cfsilent>	



<cfset excelInfo = StructNew()>



<cfif Structkeyexists(form,"pdfContent")>
	<cfset StructDelete(FORM,"excelContent0")>
</cfif>

<cfif not Structkeyexists(form,"pdfContent")>
	<cfif isDefined("SESSION.excelExportInfo")>
		<cfset excelInfo = duplicate(SESSION.excelExportInfo)>
	</cfif>
</cfif>

<cfloop collection="#excelInfo#" item="r">
	<cfset form[r] = excelInfo[r]>
</cfloop>

<cfset serializer = createObject("component","JSONUtil")>

<cfscript>
/**
 * Splits a string according to another string or multiple delimiters.
 * 
 * @param str 	 String to split. (Required)
 * @param splitstr 	 String to split on. Defaults to a comma. (Optional)
 * @param treatsplitstrasstr 	 If false, splitstr is treated as multiple delimiters, not one string. (Optional)
 * @return Returns an array. 
 * @author Steven Van Gemert (&#115;&#118;&#103;&#50;&#64;&#112;&#108;&#97;&#99;&#115;&#46;&#110;&#101;&#116;) 
 * @version 3, February 12, 2005 
 */
function split(str) {
	var results = arrayNew(1);
	var splitstr = ",";
	var treatsplitstrasstr = true;
	var special_char_list      = "\,+,*,?,.,[,],^,$,(,),{,},|,-";
	var esc_special_char_list  = "\\,\+,\*,\?,\.,\[,\],\^,\$,\(,\),\{,\},\|,\-";	
	var regex = ",";
	var test = "";
	var pos = 0;
	var oldpos = 1;

	if(ArrayLen(arguments) GTE 2){
		splitstr = arguments[2]; //If a split string was passed, then use it.
	}
	
	regex = ReplaceList(splitstr, special_char_list, esc_special_char_list);
	
	if(ArrayLen(arguments) GTE 3 and isboolean(arguments[3])){
		treatsplitstrasstr = arguments[3]; //If a split string method was passed, then use it.
		if(not treatsplitstrasstr){
			pos = len(splitstr) - 1;
			while(pos GTE 1){
				splitstr = mid(splitstr,1,pos) & "_Separator_" & mid(splitstr,pos+1,len(splitstr) - (pos));
				pos = pos - 1;
			}
			splitstr = ReplaceList(splitstr, special_char_list, esc_special_char_list);
			splitstr = Replace(splitstr, "_Separator_", "|", "ALL");
			regex = splitstr;
		}
	}
	test = REFind(regex,str,1,1);
	pos = test.pos[1];

	if(not pos){
		arrayAppend(results,str);
		return results;
	}

	while(pos gt 0) {
		arrayAppend(results,mid(str,oldpos,pos-oldpos));
		oldpos = pos+test.len[1];
		test = REFind(regex,str,oldpos,1);
		pos = test.pos[1];
	}
	//Thanks to Thomas Muck
	if(len(str) gte oldpos) arrayappend(results,right(str,len(str)-oldpos + 1));

	if(len(str) lt oldpos) arrayappend(results,"");

	return results;
}
</cfscript>

<cffunction name="CapFirst" returntype="string" output="false">
    <cfargument name="str" type="string" required="true" />
    
    <cfset var newstr = "" />
    <cfset var word = "" />
    <cfset var separator = "" />
    
    <cfloop index="word" list="#arguments.str#" delimiters=" ">
        <cfset newstr = newstr & separator & UCase(left(word,1)) />
        <cfif len(word) gt 1>
            <cfset newstr = newstr & right(word,len(word)-1) />
        </cfif>
        <cfset separator = " " />
    </cfloop>

    <cfreturn newstr />
</cffunction>

	<cffunction name="excelToArray" access="private" output="no">
		<cfargument name="excelStruct">
		<cfset var local = structNew()>
		<cfset local.excelArray = ArrayNew(1)>
		<cfset local.keyListArray = ListToArray(ListSort(StructKeyList(arguments.excelStruct), "text", "ASC")) >
		<cfloop from="1" to="#ArrayLen(local.keyListArray)#" index="local.k">
			<cfif findnocase("excelContent",local.keyListArray[local.k])>
				<cfset local.currentKey = local.keyListArray[local.k]>
				<cfset ArrayAppend(local.excelArray,arguments.excelStruct[local.currentKey])>
			</cfif>
		</cfloop>
		
		<cfreturn local.excelArray>
	</cffunction>
	
	<cffunction name="sheetNameArray" access="private" output="no">
		<cfargument name="sheetStruct">
		<cfset var local = structNew()>
		<cfset local.sheetArray = ArrayNew(1)>
		<cfset local.keyListArray = ListToArray(ListSort(StructKeyList(arguments.sheetStruct), "text", "ASC")) >
		<cfloop from="1" to="#ArrayLen(local.keyListArray)#" index="local.k">
			<cfif findnocase("sheet",local.keyListArray[local.k])>
				<cfset local.currentKey = local.keyListArray[local.k]>
				<cfset ArrayAppend(local.sheetArray,arguments.sheetStruct[local.currentKey])>
			</cfif>
		</cfloop>
		
		<cfreturn local.sheetArray>
	</cffunction>

	<cffunction name = "getFirstKeyValue" output="no">
		<cfargument name="struct">
		<cfset var local = StructNew()>
		<cfset local.result = "">
		<cfif isStruct(arguments.struct)>
			<cfset local.keyListArray  = ListToArray(StructKeyList(arguments.struct))>
			<cfset local.currentKey = local.keyListArray[1]>
			<cfset local.result =  arguments.struct[local.keyListArray[1]]>
		</cfif>
		<cfreturn local.result>
	</cffunction>
	
	<cffunction name = "getFirstKeyName" output="no">
		<cfargument name="struct">
		<cfset var local = StructNew()>
		<cfset local.result = "">
		<cfif isStruct(arguments.struct)>
			<cfset local.keyListArray  = ListToArray(StructKeyList(arguments.struct))>
			<cfset local.currentKey = local.keyListArray[1]>
			<cfset local.result =  local.keyListArray[1]>
		</cfif>
		<cfreturn local.result>
	</cffunction>

</cfsilent>
	
	<cfif Structkeyexists(form,"excelContent0") and len(trim(form.excelContent0))>		
	<cfsilent>
	
		<cfset excelTest = CreateObject("component","excel").init()>
		<cfset newFileName = "ExcelExport">
		<cfif StructkeyExists(form,"excelTitle")>
			<cfset newFileName = rereplacenocase(form.excelTitle,'[\/\\?\%\*\:\|\"\<\>\.]',"","ALL")>
			<cfset newFileName = rereplacenocase(newFileName,' ',"_","ALL")>
			<cfif not len(trim(newFileName))>
				<cfset newFileName = "ExcelExport">
			</cfif>
			<cfif StructkeyExists(form,"title") and  not len(trim(form.title))>
				<cfset form.title = form.excelTitle>
			</cfif>
		</cfif>
		
		<cfif not StructkeyExists(form,"title")>
			<cfset form.title = "Excel Export">
		</cfif>
	
		<cfset getExcelFields = excelToArray(form)>
	
		<cfset getSheetNames = sheetNameArray(form)>
	
		<cfif not isDefined("form.fontcolor")>
			<cfset form.fontcolor = '000000'>
		</cfif>
		<cfif not isDefined("form.headercolor")>
			<cfset form.headercolor = 'CCCCCC'>
		</cfif>
	
		<cfloop from="1" to="#ArrayLen(getExcelFields)#" index="e">
			<cfset getExcelFields[e] = getExcelFields[e]>
		</cfloop>
		
		
		
		<cfloop from="1" to="#ArrayLen(getExcelFields)#" index="e">
			<cfset qryContent = getFirstKeyValue(serializer.deserializeFromJSON(getExcelFields[e],false))>
			<cfset qryName = getFirstKeyName(serializer.deserializeFromJSON(getExcelFields[e],false))>
			
			<cfif isQuery(qryContent)>
				<cfset form.originalColumns = ArrayToList( qryContent.getColumnNames())>
				<cfset form.aliasColumns = ArrayToList( qryContent.getColumnNames())>	

				<cfif StructKeyexists(form,"convertColumns")>
					<cfif len(trim(form.convertColumns))>
						<cfset form.convertedColumns = serializer.deserializeFromJSON(form.convertColumns)>
					<cfelse>
						<cfset form.convertedColumns = ArrayNew(1)>
					</cfif>
					<!--- convert the columns to pass to excel --->
					<cfif isArray(form.convertedColumns)>
						<cfif ArrayLen(form.convertedColumns) gte e>
	
							<cfif isStruct(form.convertedColumns[e])>
								
								<cfif StructKeyExists(form.convertedColumns[e],"original")>
									<!--- Set Original columns --->
									<cfset form.originalColumns = form.convertedColumns[e]['original']>
								</cfif>
								<cfif StructKeyExists(form.convertedColumns[e],"alias")>
									<!--- Set Alias columns --->
									<cfset form.aliasColumns = form.convertedColumns[e]['alias']>
								</cfif>
							<cfelseif isArray(form.convertedColumns[e])>
								<cfif ArrayLen(form.convertedColumns[e]) gte 2>
									<cfset form.originalColumns = form.convertedColumns[e][1]>
									<cfset form.aliasColumns = form.convertedColumns[e][2]>
								</cfif>
							</cfif>
						</cfif>
					</cfif>
				</cfif>	
			<cfset wb = excelTest.queryToExcel( xlsx= form.xlsx,headers = form.originalColumns, aliases = form.aliasColumns,headerBackgroundColor=trim(form.headercolor),headerFontColor=trim(form.fontColor),query=qryContent,headerText=form.title,sheetName="#CapFirst(qryName)#")>
			
			</cfif>
		</cfloop>

		<!---<cfif isDefined("wb")>
			<!---Stream to Browser---->
			<cfset fileName = GetTempFile(GetTempDirectory(), "xls")>
			<cfset stream = CreateObject("java","java.io.FileOutputStream")>
			<cfset stream.init(fileName)>
			<cfset wb.write(stream)>
			<cfset stream.close()>
			<cfheader
			  name="Content-Disposition"
			  value="attachment; filename=""#newFileName#.xls""">
			<cfcontent
			reset="yes"
			 type="application/vnd.ms-excel"
			 file="#fileName#"
			 deleteFile="false">
		 </cfif>--->

		<cfif isDefined("wb")>
			<cfset stream = CreateObject("java","java.io.ByteArrayOutputStream")>
			<cfset stream.init()>
			<cfset wb.write(stream)>
			<cfset excelData = stream.toByteArray()/>
			<cfset stream.close()>
			<cfif form.xlsx>
				<cfset request.headerValue = 'attachment; filename=' & newFileName & '.xlsx'>
			<cfelse>
				<cfset request.headerValue = 'attachment; filename=' & newFileName & '.xls'>	
			</cfif>
			<cfheader
				name="Content-Disposition"
				value="#trim(request.headerValue)#"/>
			
			
			<cfif form.xlsx>
				<cfcontent
				reset="yes"
				type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				variable="#excelData#"
				/>
			<cfelse>
				<cfcontent
				reset="yes"
				type="application/vnd.ms-excel"
				variable="#excelData#"
				/>
			</cfif>
		</cfif>
		
	</cfsilent>
	<cfif not isdefined("wb")>
	 	No Excel Content Found
	</cfif>
	 
<cfelseif Structkeyexists(form,"pdfContent") and len(trim(form.pdfContent))>

	<cfset newFileName = "ExportPDFDocument">
	<cfset form.pdfContent = ReplaceList(URLDecode(form.pdfContent),'&amp;,&lt;,&gt;,&quot;','&,<,>,"')>
	<cfset pdfContentArray = split(form.pdfContent,"export_content")>

	<!---<cfset form.css = ReplaceList(URLDecode(form.cssFile),'%2F,&amp;,&lt;,&gt;,&quot;','/,&,<,>,"')>--->
	<cfset cssLink = "/RIMSS/admin/adhoc/export/assets/css/exportMenu.css">
	<cfif StructKeyExists(form,"cssFile")>
			<cfset cssLink = ReplaceList(URLDecode(form.cssFile),'%2F,&amp;,&lt;,&gt;,&quot;','/,&,<,>,"')>
		</cfif>
	<cfif StructkeyExists(form,"pdfTitle")>
		<cfset newFileName = rereplacenocase(form.pdfTitle,'[\/\\?\%\*\:\|\"\<\>\.]',"","ALL")>
		<cfset newFileName = rereplacenocase(newFileName,'[ |+]',"_","ALL")>
		<cfset form.title = rereplacenocase(form.title,'[+]'," ","ALL")>
		<cfif not len(trim(newFileName))>
			<cfset newFileName = "ExportPDFDocument">
		</cfif>
	</cfif>
		
    	<cfoutput>
		<cfheader name="Content-Disposition" value="attachment; filename=#encodeforURL(newFileName)#.pdf">
		<cfcontent type="application/pdf">
		<cfdocument format="PDF" orientation = "landscape" marginTop = "1" marginLeft = ".25" marginBottom=".25"  marginRight=".25">
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">	
		<head>
		<!---<style type="text/css">@import url("#cssLink#");</style>	--->
		<link href="file:///#ExpandPath(cssLink)#" rel="stylesheet" type="text/css">
		</head>
		<body>
		<cfloop from="1" to="#ArrayLen(pdfContentArray)#" index="c">
		
		<cfdocumentitem type="header"> 
        <!---<link href="#cssLink#" rel="stylesheet" type="text/css">--->
        <div  align="center" style="margin-top:50px"><font size="12px"> #form.title# (Page(s) #cfdocument.currentpagenumber# of #cfdocument.totalpagecount#)</font></div>
    	</cfdocumentitem> 
		<div style="text-align:center">#pdfContentArray[c]#</div>
		<cfif c lt ArrayLen(pdfContentArray)>
			<cfdocumentitem type="pagebreak" /> 
		</cfif>
		</cfloop>
		</body>
		</html>
		</cfdocument>
		</cfoutput>
<cfelse>

	<div align="center" style="border:1px solid black;background-color:#FCF9E6;font-family:sans-serif;">
		<div>No content Available or content has expired</div>
		<cfif StructKeyExists(form,"returnLink") and len(trim(form.returnLink))>
			<div><cfoutput><a href="#encodeForURL(trim(form.returnLink))#">Back</a></cfoutput></div>
		</cfif>
	</div>
</cfif>

</body>
</html>

