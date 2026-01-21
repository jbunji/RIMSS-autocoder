<cfsilent>
	<cfimport taglib="../layout" prefix="RIMSS"/>
	<cfsetting showdebugoutput="false" >
</cfsilent>

<RIMSS:layout section="configuration">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
    <script type="text/javascript">

		
		$(function() {
			setupHighlight(); 

		
			//Creating report timestamp for exports	
			var d = new Date();
		
			var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			
			function addZero(i) {
			    if (i < 10) {
			        i = "0" + i;
			    }
			    return i;
			}
			
			//Setting date string for excel filename
			var excelDate = d.getFullYear() + "" + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
						
			var reportTimeStamp = "Report Prepared on: " +  days[d.getUTCDay()] + ", " +  months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " +  d.getUTCFullYear() + ", " + addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes()) + ":" + addZero(d.getUTCSeconds()) + " ZULU";
			
			
			var dt = $('#configTable').DataTable( {
			        dom: 'Brtp',
			        "paging": false,
			        //Options below control the size and scrolling options of tables
		        	"bAutoWidth": false,
					"bScrollCollapse": false,
					"bFilter": true,
			        "bSort" : true,
			        "aaSorting": [],
			         "columnDefs": [{
			        	"targets": 'noSort',
			        	"orderable": false
			        }],
			        buttons: [
		    		    {
		        		extend: 'pdfHtml5',
		        		className: 'pdfBtn',
		        		messageTop: 'Search Configuration Results',
		        		
		        		//PLACEHOLDER text is overwritten below
		        		title: 'PLACEHOLDER',
		                messageBottom: 'PLACEHOLDER',
		                
		                filename: 'CUI_CONFIG_' + excelDate,
		                orientation: 'landscape',
		                text: 'Export to PDF',
		                exportOptions: {
				            columns: 'th:not(.noSort)',
				         },
		                customize: function(doc) {
							//Overwriting PLACEHOLDER text above with CUI in order to add asterisks. Styling CUI text
			   				doc.content[0].alignment = 'center';
			   				doc.content[0].text = '*****CONTROLLED UNCLASSIFIED INFORMATION*****';
			   				doc.content[0].bold = 'true';
			   				doc.content[0].fontSize = '14';
			   				
			   				//Styling report title
			   				doc.content[1].alignment = 'center';
			   				doc.content[1].fontSize = '15';
			   				
			   				//Overwriting PLACEHOLDER text above with CUI in order to add asterisks. Styling CUI text.
			   				doc.content[3].alignment = 'center';
			   				doc.content[3].text = '*****CONTROLLED UNCLASSIFIED INFORMATION*****';
			   				doc.content[3].bold = 'true';
			   				doc.content[3].fontSize = '14';
			   				
			   				//Setting font size for table. Setting size too large can cause table to cut off on PDF export
			   				doc.styles.tableHeader.fontSize = 10;
	                        doc.styles.tableBodyEven.fontSize = 10;
	                        doc.styles.tableBodyOdd.fontSize = 10;     
				      	}
		        	},
			            {
		                extend: 'excelHtml5',
		                className: 'excelBtn',
		                title: "CONTROLLED UNCLASSIFIED INFORMATION",
		                messageTop: 'Search Configuration Results',
		                messageBottom: 'CONTROLLED UNCLASSIFIED INFORMATION',
		                filename: 'CUI_CONFIG_export_' + excelDate,
		                text: 'Export to Excel',
			                exportOptions: {
					            columns: 'th:not(.noSort)'
					         },
			                //"CustomizeData" below allows for data to maintain formatting in export
				            customizeData: function(data) {
				          		//Looping over data in table body
						        for(var i = 0; i < data.body.length; i++) {
						          for(var j = 0; j < data.body[i].length; j++) {
						            data.body[i][j] = '\u200C' + data.body[i][j].trim();
						          }
								}
							},
	                		customize: function( xlsx ) {
                				var sheet = xlsx.xl.worksheets['sheet1.xml'];
                				//console.log(sheet);
                        		
                				//Loops through table on what would be column "G" in excel spreadsheet
                				$('row c[r^="G"]', sheet).each( function (index) {
									
									var rowNum = index + 3;
									
                    		   		var cellValue = $(this).text().replace('\u200C','');
                    		   		
                    		   		//Ignoring header
		           				    if (index > 0) {
		            		   		  	 //Adding word-wrap property to Remarks columns in Excel 
		            		   		  	 $(this).attr( 's', '55' );
		                		   }  
                        		})
                        	}
			            }		            
			            
			        ]
			} ); 	
				    
			//De-tatching buttons from table and appending them to a div, so that buttons can be moved on page   	
			dt.buttons().container().appendTo('#exportButtons');
			
			
			$('#dtSearch').on('keyup',function(e){
				dt.search($(this).val()).draw();
			});
			

        });  
		
		
		
		
    </script>
	
	<cfoutput>
	   <div class="message #msgStatus#">#msg#</div>
	</cfoutput>

	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle" >Search Configuration</div>
    </div>
	

	<div class="mainContent">	
		<cfif StructKeyExists(REQUEST.context,"qSearch") and REQUEST.context.qSearch.recordcount>
			
			<table class="globalTable" id="configTable">
				<thead>
				<tr>
					<th colspan="8" class="filter">
						Filter Results: <input type="text" id="dtSearch"/>						
					</th>
				</tr>
				<tr>
					<th colspan="3">NHA</th>
					<th colspan="5">SRA</th>
				</tr>
				<tr>
					<th>SYSTYPE</th>
					<th>SERNO</th>
					<th>PARTNO</th>
					<th>SRA NOUN</th>
					<th>SRA SERNO</th>
					<th>SRA PARTNO</th>
					<th>REMARKS</th>
					<th class="noSort "></th>
				</tr>
				</thead>
				
				<tbody>
				
				<cfoutput query="RC.qSearch">
				<tr class="<cfif RC.qSearch.currentrow mod 2> odd <cfelse> even </cfif>">
					<td>#encodeForHTML(trim(sys_type))#</td>
					<td>#encodeForHTML(trim(nha_serno))#</td>
					<td>#encodeForHTML(trim(nha_partno))#</td>
					<td>#encodeForHTML(trim(sra_noun))#</td>
					<td class="edit"><a href="index.cfm?action=edit.configuration&assetid=#encodeForURL(rc.util.encryptId(sra_asset_id))#">#encodeForHTML(trim(sra_serno))#</a></td>
					<td>#encodeForHTML(trim(sra_partno))#</td>
					<td>#encodeForHTML(trim(nha_remarks))#</td>
					<cfif application.sessionManager.userHasPermission("PCS_ACTTS_SU") or application.sessionManager.userHasPermission("PCS_SU")  >
					<td class="delete iconClass ">
						<a id="#encodeForHTML(trim(sra_asset_id))#" class="removeSRA" href="index.cfm?action=remove.sra&assetid=#encodeForURL(rc.util.encryptId(sra_asset_id))#">
							<img src="../../common/images/icons/delete.png" border="0"/>
						
						</a>
					</td>
					<cfelse>
						<td></td>
					</cfif>
					
				</tr>
				</cfoutput>
				</tbody>
			</table>
		<cfelse>
			<div class="global_notice_msg">No Data Found</div>
		</cfif>

	</div>
	
</RIMSS:layout>