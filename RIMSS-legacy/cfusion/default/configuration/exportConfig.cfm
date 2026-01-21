<cfparam name="exportType" default="print" >


		
<cfsavecontent variable="content" >
	<cfif exportType EQ "pdf">	
	
	</cfif>
		
		
	<div class="mainContent">	
		<cfif StructKeyExists(REQUEST.context,"qSearch") and REQUEST.context.qSearch.recordcount>
			
			<table class="globalTable" id="configTable" cellspacing="0" cellpadding="0">
				<thead>
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
				</thead>
				
				<tbody>
				
				<cfoutput query="RC.qSearch">
				<tr class="<cfif RC.qSearch.currentrow mod 2> odd <cfelse> even </cfif>">
					<td>#encodeForHTML(trim(sys_type))#</td>
					<td>#encodeForHTML(trim(nha_serno))#</td>
					<td>#encodeForHTML(trim(nha_partno))#</td>
					<td>#encodeForHTML(trim(sra_noun))#</td>
					<td class="edit">#encodeForHTML(trim(sra_serno))#</td>
					<td>#encodeForHTML(trim(sra_partno))#</td>
					<td>#encodeForHTML(trim(nha_remarks))#</td>
				</tr>
				</cfoutput>
				</tbody>
			</table>
		<cfelse>
			<div class="global_notice_msg">No Data Found</div>
		</cfif>

	</div>
				
</cfsavecontent>				

<cfif exportType EQ "excel">
	<cfcontent type="application/msexcel">
	<cfheader name="Content-Disposition" value="filename=backlog.xls">
	
		<cfoutput>#content#</cfoutput>
				
<cfelseif exportType EQ "pdf" >
<cfset fileName = "PDF_Export.pdf" />
 	<cfset filePath = ExpandPath("./") & fileName /> 
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
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.SYS_TYPE[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.NHA_SERNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.NHA_PARTNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.SRA_NOUN[i]), body)));	   
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.SRA_SERNO[i]), body)));	   		   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.SRA_PARTNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.qsearch.REMARKS[i]), body)));	   	
   }
						   
	 document.add(table);	
	 
	 
	 // close the document (PDF Writer is listening and will automatically
	 // create the PDF for us
	 document.close();
 </cfscript>
 
<cfcontent type="application/pdf" file="#filePath#"/> 
<cfheader name="content-diposition" value="attachment; filename=#fileName#">

 
  

<cfelseif exportType EQ "print">
	<head>
		<cfoutput>			
        	<link href="#application.rootpath#/common/css/common.css" rel="stylesheet" type="text/css" />	
		</cfoutput>
		
	</head>
	
	<cfoutput>#content#</cfoutput>
</cfif>
	         
			
			
			


	            	