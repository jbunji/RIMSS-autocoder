<cfparam name="exportType" default="print" >


		
<cfsavecontent variable="content" >
	
		<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
			*****CONTROLLED UNCLASSIFIED INFORMATION*****
		</div>	
		<br/>
		<div class="mainContent">  
			<cfif rc.qSearch.count()>
			<form id="searchPmiResults" name="searchPmiResults" method="post" action="index.cfm">
			   <table class="globalTable" id="pmiTable">
			         <thead>
			         	<tr>
			         		<!---<th bgcolor="#027FD1">Config</th>--->
			         		<th class="noSort" bgcolor="#5A5A5A">&nbsp;</th>
							<th bgcolor="#5A5A5A" width="4%">Unit</th>
							<th bgcolor="#5A5A5A" width="6%">Pod Serial No.</th>
							<th bgcolor="#5A5A5A" width="8%">Job No.</th>
							<th bgcolor="#5A5A5A" width="18%">PMI Type</th>
							<th bgcolor="#5A5A5A" width="6%" >Job Start</th>
							<th bgcolor="#5A5A5A" width="5%">Status</th>
							<th bgcolor="#5A5A5A" width="5%">ETM In</th>
							<th bgcolor="#5A5A5A">Remarks</th>
							<th class="noSort admin" bgcolor="#5A5A5A">&nbsp;</th>
			         	</tr>
						
			         </thead>
				   <tbody> 	     	
			       <cfoutput>
				   <cfloop condition="#rc.qSearch.next()#"> 
				        <tr class="<cfif rc.qSearch.getCursor() mod 2> odd <cfelse> even </cfif>">
                            <td class="edit editIcon"><a href="index.cfm?action=edit.maintenance&eventJob=#rc.qSearch.getEncryptedEventId()#"></a></td>
                            <td>#HTMLEditFormat(trim(rc.qSearch.getUnit()))#</td>
							<td>#HTMLEditFormat(trim(rc.qSearch.getPodSerNo()))#</td>
                            <td class="link"><cfif #HTMLEditFormat(trim(rc.qSearch.getRepairSeq()))# NEQ 0><a href="index.cfm?action=edit.maintenance.detail&eventRepair=#rc.qSearch.getEncryptedRepairId()#"></cfif>#HTMLEditFormat(trim(rc.qSearch.getJobNo()))#<cfif #HTMLEditFormat(trim(rc.qSearch.getRepairSeq()))# NEQ 0></a></cfif></td>
                            <td>#HTMLEditFormat(trim(rc.qSearch.getPmiType()))#</td>
							<td>#DateFormat(HTMLEditFormat(trim(rc.qSearch.getStartJob())),"dd-mmm-yyyy")#</td>
							<td>#HTMLEditFormat(trim(rc.qSearch.getStatus()))#</td>
							<td>#HTMLEditFormat(trim(rc.qSearch.getMeterIn()))#</td>
                            <td>#HTMLEditFormat(trim(rc.qSearch.getNarrative()))#</td>
							<td class="delete deleteIcon admin"><a href="index.cfm?action=delete.maintenance&eventJob=#rc.qSearch.getEncryptedEventId()#&page=pmi"></a></td>
                        </tr>
						<cfset prevConfig = #HTMLEditFormat(trim(rc.qSearch.getConfig()))#>	   
				   </cfloop>
				   </cfoutput>
				   </tbody>
		   	   </table>
			   </form>
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
	<cfheader name="Content-Disposition" value="filename=maintenance.xls">
	
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
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Unit", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Pod Serial No.", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("PMI Type", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Job Start", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Status", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("ETM In", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Remarks", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 
	 
	 
	for(i=1; i LTE rc.search.recordcount;i++){
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.unit[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.pod_serno[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.pmi_type[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(DateFormat(HTMLEditFormat(rc.search.start_job[i]),"dd-mmm-yyyy"), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.status[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(rc.search.meter_in[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(HTMLEditFormat(''), body)));
	   	
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
	         
			
			
			


	            	