<cfparam name="exportType" default="print" >


		
<cfsavecontent variable="content" >
	
		<div align="center" style="background-color:green; color:white; font-weight:bold; font-family:Verdana, Arial, Helvetica, sans-serif; font-size:10pt">
			*****CONTROLLED UNCLASSIFIED INFORMATION*****
		</div>	
		<br/>
		<div class="mainContent">  
					<cfif rc.qSearch.count()>
						
						<cfquery dbtype="query" name="QoQSearch">
							select *
							from rc.search 
							<cfif session.maintStatus EQ "O">
								where stop_job is null
							</cfif>
							<cfif session.maintStatus EQ "C">
								where stop_job is not null
							</cfif>
						</cfquery>
		
					<form id="searchBacklogResults" name="searchBacklogResults" method="post" action="index.cfm">
					   <table class="globalTable" id="backlogTable" cellspacing="0" cellpadding="0">
					         <thead>
					         	<tr>
									<th bgcolor="#5A5A5A" width="4%">Unit</th>
									<th bgcolor="#5A5A5A" width="6%">NHA Serial No.</th>
									<th bgcolor="#5A5A5A" width="6%">NHA Part No.</th>
									<th bgcolor="#5A5A5A" width="6%">Cumulative Hrs</th>
									<th bgcolor="#5A5A5A" width="9%">Job No.</th>
									<th bgcolor="#5A5A5A" width="6%">SRA Noun</th>
									<th bgcolor="#5A5A5A" width="6%">SRA Part No.</th>
									<th bgcolor="#5A5A5A" width="6%">SRA Serial No.</th>
									<th bgcolor="#5A5A5A" width="6%" >Date In</th>
									<th bgcolor="#5A5A5A" width="5%">Status</th>
									<th bgcolor="#5A5A5A" width="5%">CPOT In</th>
									<th bgcolor="#5A5A5A">Remarks</th>
					         	</tr>
								
					         </thead>
						   <tbody> 	     	
					       <cfoutput query="QoQSearch" group="config"> 
							   <tbody>
							   		<tr>
							   			<td bgcolor="##027FD1" style="text-align:center;font-weight:bold;color:white" colspan="12">#encodeForHTML(trim(config))#</td>	
									</tr>
									<cfoutput>												
							        <tr class="<cfif currentRow mod 2> odd <cfelse> even </cfif>">
			                             <td>#encodeForHTML(trim(unit))#</td>
										<td>#encodeForHTML(trim(pod_serno))#</td>
										<td>#encodeForHTML(trim(partno))#</td>
										<td>#encodeForHTML(trim(delta))#</td>
			                            <td class="link">
			                            	<table style="border:0px">
			                            		<tr>
			                            			<td width="97%" style="border:0px">
			                            				#encodeForHTML(trim(jobno))#
						                            				
			                            			</td>
													<!---<td width="3%" style="border:0px">
														<cfif dbUtils.hasAttachmentsByRepairId(REPAIRID)>
															<div class="attachIcon"></div>
														</cfif>
													</td>--->
			                            		</tr>
			                            	</table>
			                            </td>
			                            <td>#encodeForHTML(trim(sra_noun))#</td>
										<td>#encodeForHTML(trim(sra_partno))#</td>
										<td>#encodeForHTML(trim(sra_serno))#</td>
										<td>#encodeForHTML(DateFormat(trim(insdate),"dd-mmm-yyyy"))#</td>
										<td>#encodeForHTML(trim(status))#</td>
										<td>#encodeForHTML(trim(meter_in))#</td>
			                            <td>#encodeForHTML(trim(narrative))#</td>
										
			                        </tr>
							   </tbody>
									</cfoutput> 
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
	 table = CreateObject("java", "com.lowagie.text.pdf.PdfPTable").init(12);
	 table.setWidthPercentage(100);
	 font = CreateObject("java", "com.lowagie.text.Font");
	 header = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 1);
	 body = CreateObject("java", "com.lowagie.text.Font").init(1, 7, 0);
	 fontFactory = CreateObject("java", "com.lowagie.text.FontFactory");
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Unit", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("NHA Serial No.", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("NHA Part No.", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 	
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Cumulative Hrs", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Job No.", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SRA Noun", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SRA Part No.", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("SRA Serial No.", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Date In", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Status", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("CPOT In", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 cell = CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init("Remarks", header));
	 cell.setBackgroundColor(color.gray);
	 table.addCell(cell);
	 
	 
	 
	for(i=1; i LTE QoQSearch.recordcount;i++){
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.unit[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.pod_serno[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.partno[i]), body)));	   	
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.delta[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.jobno[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.sra_noun[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.sra_partno[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.sra_serno[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(DateFormat(QoQSearch.insDate[i],"dd-mmm-yyyy")), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.status[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.meter_in[i]), body)));
	   	table.addCell(CreateObject("java", "com.lowagie.text.pdf.PdfPCell").init(CreateObject("java","com.lowagie.text.Phrase").init(encodeForHTML(QoQSearch.narrative[i]), body)));
	   	
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
	         	
			
			


	            	