<cfparam name="exportType" default="print" >

<cfset dbUtils = application.objectFactory.create("DBUtils") />
		
<cfsavecontent variable="content" >
	<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
		*****CONTROLLED UNCLASSIFIED INFORMATION*****
	</div>	
	<br/>
	<cfif exportType EQ "pdf">	
	
	</cfif>
		
		
		<cfif isDefined("rc.qSpares")>
		<div class="mainContent">  
			<cfif rc.qSpares.count()>
			<form id="searchSparesResults" name="searchSparesResults" method="post" action="index.cfm">
			   <table class="globalTable" id="sparesTable" cellspacing="0" cellpadding="0">
			         <thead>			         	
			         	<tr>
							<th>Spare Noun</th>
							<th>Spare Part Number</th>
							<th>Spare Serial Number</th>
							<th>Status</th>
							<th>Warranty Exp</th>
							<th>Location</th>
							<th>Depot</th>
							<th>Software Number/Title</th>
							<th>Remarks</th>
			         	</tr>
						
			         </thead>
				   <tbody> 	     	
			       <cfoutput>
				   <cfloop condition="#rc.qSpares.next()#">
				   	   <cfset swQry = #dbUtils.getSoftwareByAssetId(val(rc.qspares.getAssetId()))# />
				   	   <cfset warrantyDate = isDate(rc.qSpares.getMfgDate()) ? UCASE(TRIM(DateFormat(rc.qSpares.getMfgDate(),"dd-mmm-yyyy"))) : ""/>    
				        <tr class="<cfif rc.qSpares.getCursor() mod 2> odd <cfelse> even </cfif>">
                            <td>#EncodeForHTML(trim(rc.qSpares.getNoun()))#</td>
                            <td>#EncodeForHTML(trim(rc.qSpares.getPartNo()))#</td>
                            <td>#EncodeForHTML(trim(rc.qSpares.getSerNo()))#</td>
                            <td>#EncodeForHTML(trim(rc.qSpares.getStatus()))#</td>
							<td>#EncodeForHTML(trim(warrantyDate))#</td>
                            <td>#EncodeForHTML(trim(rc.qSpares.getCurrentLoc()))#</td>
							<td>#EncodeForHTML(trim(rc.qSpares.getDepotLoc()))#</td>
							<td width="30%">
							  <div class="sw1">
								<ul>
							  	<cfloop query="swQry">
							  		<li>#encodeForHTML(SW_TITLE)# - #encodeForHTML(SW_NUMBER)#</li>
							  	</cfloop>
							  	</ul>
							  </div>	                          							
							</td>
						<td>	
							#encodeForHTML(trim(rc.qspares.getRemarks()))#		
						</td>
                        </tr>	   
				   </cfloop>
				   </cfoutput>
				   </tbody>
		   	   </table>
			   </form>
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
	<cfheader name="Content-Disposition" value="filename=spares.xls">
	
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

	 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(7);
	 
	 table.setWidthPercentage(100);
	 font = CreateObject("java", "com.lowagie.text.Font");
	 header = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 1);
	 body = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 0);
	 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");
	 
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Spare Noun", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Spare Part Number", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Spare Serial Number", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Status", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Warranty Exp", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);	 	 

	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Location", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Depot", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 
	for(i=1; i LTE rc.qsearch.recordcount;i++){
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.NOUN[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.PARTNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.SERNO[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.STATUS[i]), body)));	   
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(DateFormat(rc.qsearch.MFG_DATE[i],"dd-mmm-yyyy"), body)));	   		   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.CURRENT_LOC[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.qsearch.DEPOT_LOC[i]), body)));	   	
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
	         
			
			
			


	            	