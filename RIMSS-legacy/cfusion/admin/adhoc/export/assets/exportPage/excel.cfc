<cfcomponent output="false">
	<cfset variables.instance.spreadsheet = ""/>
	<cfset variables.instance.wb = ""/>
	<cfset variables.instance.xlsx = true/>

	
	<cffunction name="init" output="false">
		<cfreturn this/>
	</cffunction>

	<cffunction name="getSpreadSheet" output="false" access="public">
		<cfreturn variables.instance.spreadsheet/>
	</cffunction>

	<cffunction name="getWorkBook" output="false">
		<cfreturn getSpreadSheet().getWorkbook()/>
	</cffunction>

	<cffunction name="getXLSX" output="false" access="public">
		<cfreturn variables.instance.xlsx/>
	</cffunction>
	
	<cffunction name="setXLSX" output="false" access="public">
		<cfargument name="xlsx" type="boolean" required="true">
		<cfreturn variables.instance.xlsx/>
	</cffunction>

	<cffunction name="queryToExcel" output="true">
		<cfargument name="query" required="no" type="query" default="#QueryNew('ben,jerry')#"/>
        <cfargument name="showHeaders" required="no" default="true" type="boolean">
        <cfargument name="headers" required="no" default="#arrayToList(arguments.query.getColumnList())#"/>
        <cfargument name="aliases" required="no" default="#arrayToList(arguments.query.getColumnList())#"/>
		<cfargument name="headerText" required="no" default="">
		<cfargument name="sheetName" required="no" default="Sheet1"/>
		<cfargument name="headerBackgroundColor" required="no" default="cccccc"/>
		<cfargument name="headerFontColor" required="no" default="000000"/>
		<cfargument name="xlsx" required="no" default="true" type="boolean"/>
		<cfset var local = StructNew()>
		
		<!--- Create Sheet --->
		<cfset createSheet(ARGUMENTS.sheetname,ARGUMENTS.xlsx)/>
		<cfset setXLSX(ARGUMENTS.xlsx)>
		<!---Set sheet properties --->
		<cfset local.headerArray = ListToArray(arguments.headers)>
        <cfset local.aliasArray = ListToArray(arguments.aliases)>
		<cfset local.wb = getSpreadSheet().getWorkBook()>
		<cfset local.style = local.wb.createCellStyle()/>
		<cfset local.font = local.wb.createFont()/>
		<cfset local.bgcolor = CreateObject("java","org.apache.poi.hssf.util.HSSFColor$LIME")>
		<cfset local.fontColor = CreateObject("java","org.apache.poi.hssf.util.HSSFColor$CORAL")>
		<cfset local.bgrgb = hex2rgb(UCase(ARGUMENTS.headerBackgroundColor))/>
		<cfset local.fontrgb = hex2rgb(UCase(ARGUMENTS.headerFontColor))/>
		
		<cfif not ARGUMENTS.xlsx>
			<cfset local.palette = local.wb.getCustomPalette()/>
		</cfif>
		
		<cfset local.sheet = local.wb.getSheetAt(local.wb.getActiveSheetIndex())>
		
		<cfset local.header = local.sheet.getHeader()>
		<cfif ARGUMENTS.xlsx>
			<cfset local.sheet.setPrintGridlines(true)>
		<cfelse>
			<cfset local.sheet.setGridsPrinted(true)>
		</cfif>
		<cfset local.sheet.setHorizontallyCenter(true)> 
        <cfset local.header.setCenter(arguments.headerText)>
		<cfset local.ps = local.sheet.getPrintSetup()>
		<cfset local.ps.setLandscape(true)>
		<cfset local.ps.setScale(JavaCast("int",'73'))>
		
		<cfif not ARGUMENTS.xlsx>
			<!---foreground color--->
			<cfset local.palette.setColorAtIndex(local.bgcolor.GetIndex(),JavaCast('int',local.bgrgb[1]).bytevalue(),JavaCast('int',local.bgrgb[2]).bytevalue(),JavaCast('int',local.bgrgb[3]).bytevalue())/>
			<!---font color--->
			<cfset local.palette.setColorAtIndex(local.fontcolor.GetIndex(),JavaCast('int',local.fontrgb[1]).bytevalue(),JavaCast('int',local.fontrgb[2]).bytevalue(),JavaCast('int',local.fontrgb[3]).bytevalue())/>--->
		</cfif>
		
		<!--- Add header row (Use alias if there is an alias for a particular header item) --->
		<cfif arguments.showHeaders>
			<cfset local.rowHeaderArray = ArrayNew(1)>
			<cfif not ArrayLen(local.headerArray)>
				<cfset local.rowHeaderArray = arguments.query.getColumnList()>	
			<cfelse>
				<cfset local.rowHeaderArray = ArrayNew(1)>
				<cfloop from="1" to="#ArrayLen(local.headerArray)#" index="local.h">
		        	<cfif local.h gt arrayLen(local.aliasArray)>
		            	<cfset ArrayAppend(local.rowHeaderArray,UCase(local.headerArray[local.h]))>
		            <cfelse>
						<cfset ArrayAppend(local.rowHeaderArray,UCase(local.aliasArray[local.h]))>
		            </cfif>
		        </cfloop>
			</cfif>
			
			<cfset SpreadsheetAddRow(getSpreadSheet(),ArrayToList(local.rowHeaderArray))>
			<cfset spreadSheetAddFreezePane(getSpreadSheet(),0,1)/>
			
			<cfif ARGUMENTS.xlsx>
				
				<!--- Add pounds to beginning of color strings if not there --->
				<cfif left(trim(ARGUMENTS.headerBackgroundColor),1) neq "##">
					<cfset ARGUMENTS.headerBackgroundColor = "##" & ucase(trim(ARGUMENTS.headerBackgroundColor))>
				</cfif>
				<cfif left(trim(ARGUMENTS.headerFontColor),1) neq "##">
					<cfset ARGUMENTS.headerFontColor = "##" & ucase(trim(ARGUMENTS.headerFontColor))>
				</cfif>
				<!--- Create a Cell Style --->
				<cfset local.xssfStyle = getWorkbook().createCellStyle()>
			
				<cfset local.font = getWorkbook().createFont()>
				<cfset local.row = local.sheet.getRow(JavaCast('int',0))>
				<cfset local.color = CreateObject("java","java.awt.Color").decode(JavaCast('string',ARGUMENTS.headerBackgroundColor))>
				<cfset local.xssfColor = CreateObject("java","org.apache.poi.xssf.usermodel.XSSFColor").init(local.color)>
				<cfset local.fontColor = CreateObject("java","java.awt.Color").decode(JavaCast('string',ARGUMENTS.headerFontColor))>
				<cfset local.xssfTextColor = CreateObject("java","org.apache.poi.xssf.usermodel.XSSFColor").init(local.fontColor)>
				<cfset local.row = local.sheet.getRow(JavaCast('int',0))>
				<cfset local.xssfStyle.setFillForegroundColor(local.xssfColor)>
				<cfset local.xssfStyle.setAlignment(local.xssfStyle.ALIGN_CENTER)>
				<cfset local.xssfStyle.setFillPattern(local.xssfStyle.SOLID_FOREGROUND)>
				
				<cfset local.font.setColor(local.xssfTextColor)>
				<cfset local.font.setBoldWeight(local.font.BOLDWEIGHT_BOLD)>
				<cfset local.xssfStyle.setFont(local.font)>
				<cfset local.xssfStyle.getFont().setBoldWeight(local.font.BOLDWEIGHT_BOLD)>
				<cfset local.xssfStyle.getFont().setColor(local.xssfTextColor)>
				<cfset local.numberOfCells = local.row.getPhysicalNumberOfCells()>
				
				
				<cfloop from="1" to="#local.numberOfCells#" index="local.c">
					<cfset local.row.getCell(JavaCast("int",local.c-1)).setCellStyle(local.xssfStyle)>
				</cfloop>
				

				
				
			<cfelse>
				<cfset spreadsheetFormatRow(getSpreadSheet(),{bold=true,fgcolor="LIME",color="CORAL",dataformat="text"}, 1)>
			</cfif>
		</cfif>
		
		<!---<cfset local.metaData = getMetaData(arguments.query)>--->
		<cfset local.headerList = arguments.query.getColumnNames()>
		<cfset local.sqlHeaders = ArrayNew(1)>
		<cfloop from="1" to="#ArrayLen(local.headerList)#" index="local.h">
			<cfset ArrayAppend(local.sqlHeaders,"VARCHAR")>
		</cfloop>
		<!--- Create new empty query with columns mapped to varchar type --->
		<cfset local.newQuery = QueryNew(ArrayToList(local.headerList),ArrayToList(local.sqlHeaders))>
		
		<cfset local.combine = queryConcat(local.newQuery,ARGUMENTS.query)>
		
		
		<!--- Query results to just pull headers --->
		<cfquery name="arguments.query" dbtype="query" >
			SELECT #ARGUMENTS.headers# FROM [LOCAL].combine
		</cfquery>
		
		<cfset SpreadSheetAddRows(getSpreadSheet(),ARGUMENTS.query)/>
		
		<!--- Formatting as TEXT --->
		<cfloop from="1" to="#ArrayLen(ListToArray(arguments.headers))#" index="local.a">
			<cfset SpreadsheetFormatColumn(getSpreadSheet(),{dataformat="text"},local.a)>	
		</cfloop>
		
		<!--- Perform extra formatting for numbers,dates,etc --->
		<cfset local.q = arguments.query>
		<cfloop condition="local.q.next()">
			<cfloop from="1" to="#ArrayLen(local.headerArray)#" index="local.h">
			<cfset local.rowNum = local.q.currentrow>
			<cfset local.value = local.q[local.headerArray[local.h]][local.q.currentrow]>
			<!---<cfif isDate(local.value)>
				<cfset local.value = DateFormat(local.value) & " " & TimeFormat(local.value,'HH:mm')>
			</cfif>--->
			<cfif arguments.showHeaders>
				<cfset SpreadsheetSetCellValue( getSpreadSheet(),trim(local.value),local.rowNum+1,local.h )>
			<cfelse>
				<cfset SpreadsheetSetCellValue( getSpreadSheet(),trim(local.value),local.rowNum,local.h )>
			</cfif>
			</cfloop>
		</cfloop>
		
		<!--- Try to auto size the column widths --->
		<cfloop from="1" to="#ArrayLen(ListToArray(arguments.headers))#" index="local.a">
			<cfset local.sheet.autoSizeColumn(JavaCast("short",local.a-1))>
		</cfloop>
	
		<!--- try to set the left and right margins --->
		
		<!---<cfset local.sheet.LeftMargin =JavaCast("short",.25)>	
		<cfset local.sheet.RightMargin =JavaCast("short",.25)>	--->
	
		<cfset SpreadSheetSetActiveSheetNumber(getSpreadSheet(),1)>
		<cfreturn getWorkbook()>
	</cffunction>
	
	<cffunction name="setWorkBook" output="false">
		<cfargument name="wb" requried="true"/>
		<cfset variables.instance.wb = ARGUMENTS.wb/>
	</cffunction>

	
	<cffunction name="createSheet" output="true">
		<cfargument name="sheetname" required="true" type="string">
		<cfargument name="xlsx" required="no" type="boolean" default="true">
		<cfset var sheets = 1/>
		<!--- make sheetname valid --->
		<cfset arguments.sheetname = sanitizeSheetName(arguments.sheetname)>
		
		<cfif isSpreadSheetObject(variables.instance.spreadsheet)>
			<cfset sheets = SpreadSheetInfo(getSpreadSheet()).SHEETS+1/>
			<cfif Len(trim(ARGUMENTS.sheetname))>
				<cfset SpreadSheetCreateSheet(variables.instance.spreadsheet,ARGUMENTS.sheetname)/>
			<cfelse>
				<cfset SpreadSheetCreateSheet(variables.instance.spreadsheet, "Sheet" & sheets)/>
			</cfif>
		<cfelse>
			<cfif Len(trim(ARGUMENTS.sheetname))>
				<cfset variables.instance.spreadsheet = SpreadSheetNew(ARGUMENTS.sheetname,ARGUMENTS.xlsx)/>
			<cfelse>
				<cfset variables.instance.spreadsheet = SpreadSheetNew("Sheet" & sheets,ARGUMENTS.xlsx)/>
			</cfif>
			
		</cfif>

		<cfset sheets = SpreadSheetInfo(variables.instance.spreadsheet).SHEETS/>
		<cfset spreadsheetSetActiveSheetNumber(variables.instance.spreadsheet,sheets)/>
		
		<cfreturn SpreadSheetInfo(getSpreadSheet())>
	</cffunction>
	
	<cffunction name="setSheetName" output="false">
		<cfargument name="sheetname" required="true" type="string">
		<cfset variables.instance.sheetname = ARGUMENTS.sheetname/>
	</cffunction>
	<cfscript>
/**
 * Concatenate two queries together.
 * 
 * @param q1 	 First query. (Optional)
 * @param q2 	 Second query. (Optional)
 * @return Returns a query. 
 * @author Chris Dary (&#117;&#109;&#98;&#114;&#97;&#101;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;) 
 * @version 1, February 23, 2006 
 */
function queryConcat(q1,q2) {
	var row = "";
	var col = "";

	if(q1.columnList NEQ q2.columnList) {
		return q1;
	}

	for(row=1; row LTE q2.recordCount; row=row+1) {
	 queryAddRow(q1);
	 for(col=1; col LTE listLen(q1.columnList); col=col+1)
		querySetCell(q1,ListGetAt(q1.columnList,col), q2[ListGetAt(q1.columnList,col)][row]);
	}
	return q1;
}
</cfscript>
	
	<!---hex2rgb--->
	<!---code based from HexToRGB() on cflib.org--->
	<cffunction name="hex2rgb" returnType="array" output="no" access="private">
		<cfargument name="hex" required="no" default="ffffff"/>
		
		<cfset var local = StructNew()/>
		<cfset local.RGBlist = ''/>
		<cfset local.RGBpart = ''/>
		
		<cfset ARGUMENTS.hex =replace(ARGUMENTS.hex,'##','','ALL')/>
		
		<cfif not len(trim(ARGUMENTS.hex)) eq 6>
			<cfset ARGUMENTS.hex = 'ffffff'/>
		</cfif>
		
		<cfloop from="1" to="5" index="local.i" step="2">
			<cfset local.RGBpart = InputBaseN(mid(ARGUMENTS.hex,local.i,2),16)/>
			<cfset local.RGBlist = listAppend(local.RGBlist,local.RGBpart)/>
		</cfloop>
		
		<cfreturn ListToArray(local.RGBlist)/>
	
	</cffunction>
	
	<cffunction name="sanitizeSheetName" output="no" returnType="string" access="private">
		<cfargument name="sheetName" required="true" type="String"  hint="Sheet Name">
		<cfreturn ReReplaceNoCase(Left(ARGUMENTS.sheetName,31),'[\/\\\?\*\]\[]','','ALL')/>
	</cffunction>
	
</cfcomponent>