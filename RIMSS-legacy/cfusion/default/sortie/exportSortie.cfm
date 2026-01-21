<cfparam name="exportType" default="print" >

<cfset dbUtils = application.objectFactory.create("DBUtils") />
		
<cfsavecontent variable="content" >
	<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
		*****CONTROLLED UNCLASSIFIED INFORMATION*****
	</div>	
	<br/>
	<cfif exportType EQ "pdf">	
	
	</cfif>
		
		<cfif isDefined("rc.sortieResults")>
		<div class="mainContent">   
		    <cfif rc.sortieResults.recordcount>
		        <cfoutput>
		           <table class="globalTable" id="sortieTable" cellspacing="0" cellpadding="0">
		              <thead>
		                <tr>
		                    <th>Mission Id</th>
							<th class="date">Sortie Date</th>
		                    <th>SerNo</th>
							<th>Unit</th>
							<th>Range</th>
                            <th>AC</th>
							<th>Tail No</th>
							<th>Station</th>
		                    <th>Sortie Effect</th>
		                    <th>Remarks</th>
							<th>Reason</th>
		                </tr>
		              </thead>
		              <tbody>
		               <cfloop query="rc.sortieResults">
		                   <tr class="<cfif currentrow mod 2> odd <cfelse> even </cfif>">
		                       <td >#encodeForHTML(trim(MISSION_ID))#</td>
							   <td class="nowrap">#encodeForHTML(trim(UCASE(LSDateFormat(SORTIE_DATE,"dd-mmm-yyyy"))))#</td>
		                       <td >#encodeForHTML(trim(SERNO))#</td>
							   <td class="nowrap">#encodeForHTML(trim(CURRENT_UNIT_VALUE))#</td>
							   <td  class="nowrap" >#encodeForHTML(trim(RANGE_VALUE))#</td>
							   <td  class="nowrap" >#encodeForHTML(trim(AIRCRAFT_TYPE))#</td>
							   <td >#encodeForHTML(trim(AC_TAILNO))#</td>
							   <td >#encodeForHTML(trim(AC_STATION))#</td>
		                       <td class="nowrap">#encodeForHTML(trim(SORTIE_EFFECT_VALUE))#</td>
		                       <td>#encodeForHTML(trim(REMARKS))#</td>
							   <td>#encodeForHTML(trim(REASON))#</td>
		                   </tr>
		               </cfloop>
		              </tbody>
		           </table>
		        </cfoutput>
		    <cfelse>
		        <div class="global_notice_msg">No Data Found</div>
		    </cfif>
		</div>
		
		</cfif>
		<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
		*****CONTROLLED UNCLASSIFIED INFORMATION*****
		</div>

				
</cfsavecontent>				

<cfif exportType EQ "excel">
	<cfcontent type="application/msexcel">
	<cfheader name="Content-Disposition" value="filename=sortie.xls">
	
		<cfoutput>#content#</cfoutput>
				
<cfelseif exportType EQ "pdf" >
<cfset fileName = "PDF_Export.pdf" />
<cfscript>
	filePath = getTempDirectory() & fileName;
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

	 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(11);
	 
	 table.setWidthPercentage(100);
	 font = CreateObject("java", "com.lowagie.text.Font");
	 header = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 1);
	 body = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 0);
	 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");
	 
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Mission Id", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Sortie Date", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Serno", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Unit", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Range", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("AC", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);	 	 

	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Tail No", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Station", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Sortie Effect", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Remarks", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Reason", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	for(i=1; i LTE rc.sortieResults.recordcount;i++){
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.MISSION_ID[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(trim(UCASE(LSDateFormat(rc.sortieResults.SORTIE_DATE,"dd-mmm-yyyy")))), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.SERNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.CURRENT_UNIT_VALUE[i]), body)));	   
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.RANGE_VALUE[i]), body)));	   		   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.AIRCRAFT_TYPE[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.AC_TAILNO[i]), body)));	   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.AC_STATION[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.SORTIE_EFFECT_VALUE[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.REMARKS[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(rc.sortieResults.REASON[i]), body)));
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
		<script>
			window.print();
		</script>		
	</head>
	
	<cfoutput>#content#</cfoutput>
</cfif>	            	