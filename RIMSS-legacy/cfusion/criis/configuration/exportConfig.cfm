<cfparam name="exportType" default="print" >
<cfset dbUtils = application.objectFactory.create("DBUtils") />

		
<cfsavecontent variable="content" >
	<cfif exportType EQ "pdf">	
	
	</cfif>
		
	<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
		*****CONTROLLED UNCLASSIFIED INFORMATION*****
	</div>	
	<div class="mainContent">	

		<cfif (StructKeyExists(REQUEST.context,"qConfigs") and REQUEST.context.qConfigs.recordcount) OR (StructKeyExists(REQUEST.context,"qSearch") and REQUEST.context.qSearch.recordcount)>
			
			<table class="globalTable" id="configTable" cellspacing="0" cellpadding="0">
				<thead>
				<cfif StructKeyExists(REQUEST.context,"qConfigs") AND REQUEST.context.qConfigs.recordcount>	
					<tr>
						<th>NOUN</th>
						<th>NSN</th>
						<th>PARTNO</th>
						<th>SOFTWARE</th>
						<th>SERNO</th>
					</tr>
				<cfelse>
					<tr>
						<th colspan="3">NHA</th>
						<th colspan="4">SRA</th>
					</tr>
					<tr>
						<th>SYSTYPE</th>
						<th>SERNO</th>
						<th>PARTNO</th>
						<th>SRA NOUN</th>
						<th>SRA SERNO</th>
						<th>SRA PARTNO</th>
						<th>REMARKS</th>
					</tr>				
				</cfif>				
				</thead>
				
				<tbody>
				
				<cfif StructKeyExists(REQUEST.context,"qConfigs") AND REQUEST.context.qConfigs.recordcount>				
					<cfoutput query="RC.qConfigs">
						<cfset swQry = #dbUtils.getSoftwareByAssetId(val(rc.qconfigs.asset_id))# />	
						
						<tr class="<cfif RC.qConfigs.currentrow mod 2> odd <cfelse> even </cfif>">
							<td>#HTMLEditFormat(trim(NOUN))#</td>
							<td>#HTMLEditFormat(trim(NSN))#</td>
							<td>#HTMLEditFormat(trim(PARTNO))#</td>
							<td>
								<cfif swQry.recordcount GT 0>
									<ul>
										<cfloop query="swQry">
											<li>#HTMLEditFormat(sw_number)# / #HTMLEditFormat(sw_title)#</li>																	
										</cfloop>
									</ul>
								</cfif>		
							</td>
							<td>#trim(SERNO)#&nbsp;</td>	
						</tr>
					</cfoutput>
				<cfelse>
					<cfoutput query="RC.qSearch">
						<tr class="<cfif RC.qSearch.currentrow mod 2> odd <cfelse> even </cfif>">
							<td>#htmlEditFormat(trim(sys_type))#</td>
							<td>#htmlEditFormat(trim(nha_serno))#</td>
							<td>#htmlEditFormat(trim(nha_partno))#</td>
							<td>#htmlEditFormat(trim(sra_noun))#</td>
							<td class="edit">#htmlEditFormat(trim(sra_serno))#</td>
							<td>#htmlEditFormat(trim(sra_partno))#</td>
							<td>#htmlEditFormat(trim(nha_remarks))#</td>
						</tr>
					</cfoutput>								
				</cfif>
				</tbody>
			</table>
		<cfelse>
			<div class="global_notice_msg">No Data Found</div>
		</cfif>

	</div>
	<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
		*****CONTROLLED UNCLASSIFIED INFORMATION*****
	</div>					
</cfsavecontent>				

<cfif exportType EQ "excel">
	<cfcontent type="application/msexcel">
	<cfheader name="Content-Disposition" value="filename=config.xls">
		
		<cfoutput>#decodeforhtml(encodeforhtml(content))#</cfoutput>
				
<cfelseif exportType EQ "pdf" >
<cfset fileName = "PDF_Export.pdf" />
 	<cfset filePath = ExpandPath("./") & fileName /> 
<cfif StructKeyExists(REQUEST.context,"qConfigs") AND REQUEST.context.qConfigs.recordcount>
	<cfscript>
		file = ExpandPath('./') & 'test.pdf';
		 // create a 'Document' object
		 document = CreateObject("java", "com.lowagie.text.Document");
		 document.init();
		 // get an outputstream for the PDF Writer
		 fileIO = CreateObject("java", "java.io.FileOutputStream");
		 // call the constructor, pass the location where you want
		 // the pdf to be created
		 fileIO.init(filePath);
		 // get a PDF Writer var
		 writer = CreateObject("java", "com.lowagie.text.pdf.PdfWriter");
		 // call the static 'getInstance' factory method
		 writer.getInstance(document, fileIO);
		 
		 
		 // open the document
		 document.open();
		 // create a new paragraph
		 
		 color = CreateObject("java", "java.awt.Color");
	
		 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(5);
		 
		 table.setWidthPercentage(100);
		 font = CreateObject("java", "com.lowagie.text.Font");
		 header = CreateObject("java", "com.lowagie.text.Font").init(1, 5, 1);
		 body = CreateObject("java", "com.lowagie.text.Font").init(1, 5, 0);
		 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");		 		 		 
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("NOUN", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("NSN", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("PARTNO", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SOFTWARE", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);		 
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SERNO", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);	 	 		 
		 
		 swNum = '';
		 swTitle = '';
		 swList = '';
		 for(i=1; i LTE rc.qConfigs.recordcount;i++){
			swQry = dbUtils.getSoftwareByAssetId(val(rc.qConfigs.asset_id[i]));

			for(j=1; j LTE swQry.recordcount;j++){
				swList = listAppend(swList,swQry.sw_number[j] & '/' & swQry.sw_title[j]);
			}
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qConfigs.NOUN[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qConfigs.NSN[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qConfigs.PARTNO[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(swList), body)));	   
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qConfigs.SERNO[i]), body)));	   		   		   	
	     }
							   
		 document.add(table);	
		 
		 
		 // close the document (PDF Writer is listening and will automatically
		 // create the PDF for us
		 document.close();
 	</cfscript>
<cfelse> 	
	<cfscript>
		file = ExpandPath('./') & 'test.pdf';
		 // create a 'Document' object
		 document = CreateObject("java", "com.lowagie.text.Document");
		 document.init();
		 // get an outputstream for the PDF Writer
		 fileIO = CreateObject("java", "java.io.FileOutputStream");
		 // call the constructor, pass the location where you want
		 // the pdf to be created
		 fileIO.init(filePath);
		 // get a PDF Writer var
		 writer = CreateObject("java", "com.lowagie.text.pdf.PdfWriter");
		 // call the static 'getInstance' factory method
		 writer.getInstance(document, fileIO);
		 
		 
		 // open the document
		 document.open();
		 // create a new paragraph
		 
		 color = CreateObject("java", "java.awt.Color");
	
		 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(7);
		 
		 table.setWidthPercentage(100);
		 font = CreateObject("java", "com.lowagie.text.Font");
		 header = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 1);
		 body = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 0);
		 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("NHA", header));
		 cell.setBackgroundColor(color.gray);
		 cell.setColspan(3);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SRA", header));
		 cell.setBackgroundColor(color.gray);
		 cell.setColspan(4);
		 table.addCell(cell);
		 
		 
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SYSTYPE", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SERNO", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("PARTNO", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SRA NOUN", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SRA SERNO", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);	 	 
	
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SRA PARTNO", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("REMARKS", header));
		 cell.setBackgroundColor(color.gray);
		 table.addCell(cell);
		 
		 
		for(i=1; i LTE rc.qsearch.recordcount;i++){
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.SYS_TYPE[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.NHA_SERNO[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.NHA_PARTNO[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.SRA_NOUN[i]), body)));	   
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.SRA_SERNO[i]), body)));	   		   	
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.SRA_PARTNO[i]), body)));
		   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.REMARKS[i]), body)));	   	
	   }
							   
		 document.add(table);	
		 
		 
		 // close the document (PDF Writer is listening and will automatically
		 // create the PDF for us
		 document.close();
	 </cfscript>
</cfif>
<cfcontent type="application/pdf" file="#filePath#"/> 
<cfheader name="content-diposition" value="attachment; filename=#fileName#">

 
  

<cfelseif exportType EQ "print">
	<head>
		<cfoutput>			
        	<link href="#application.rootpath#/common/css/common.css" rel="stylesheet" type="text/css" />	
		</cfoutput>
		
	</head>
	<script>
		window.print();
	</script>	
	<cfoutput>#decodeforhtml(encodeforhtml(content))#</cfoutput>
</cfif>
	         
			
			
			


	            	