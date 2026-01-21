component  displayname="IUID Registry" output="false"
{
	
	variables.instance = {
	   	
	   	'UIIRetrieval' = "https://iuid.logisticsinformationservice.dla.mil/apis/ws/v2.0/retrieval/retrieval.asmx",
	   	'UIIValidation' = "https://iuid.logisticsinformationservice.dla.mil/apis/ws/v2.0/uiivalidation/uiivalidation.asmx",
	   	'UIIVerification' = "https://iuid.logisticsinformationservice.dla.mil/apis/ws/v2.0/uiiverification/uiiverification.asmx",
	   	'UIIWarranty' = "https://iuid.logisticsinformationservice.dla.mil/apis/ws/v2.0/Warranty/Warranty.asmx",
	   	'UIIPartNumber' = "https://iuid.logisticsinformationservice.dla.mil/apis/ws/v2.0/sretrieval/uiifrompn.asmx",
	   	'useSOAP12' = true,
	   	'useSOAP11' = false,
	   	'UserName' = "",
	   	'Email' = "",
	   	'Organization' = "",
	   	'Phone' = "",
	   	'userAgent' = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)",
	   	'timeout' = 300,
	   	'buildVersion'=CreateDateTime('2013','03','13','18','25','00')
	};
	
	
	public any function init(){
	   return this;	
    }

    
    public any function ElementRetrieval(string uiiList="",string email = getProperty("Email"), string userName = getProperty("UserName"), string organization = getProperty("Organization"), string phone = getProperty("Phone")){
        var local = {};
        
        local.uiiStrings = "";
        local.uiiArray = ListToArray(ARGUMENTS.uiiList);
        for(local.uii = 1;local.uii <= ArrayLen(local.uiiArray);local.uii++){
        	if(len(trim(local.uiiArray[local.uii]))){
                local.uiiStrings &="<string><![CDATA[" & trim(local.uiiArray[local.uii])  & "]]></string>";	
            }
        }
       
        local.xmlDoc = '
            <ElementRetrievalRequestObject xmlns="http://www.bpn.gov/IUIDAPI/">
                <Request>
	                <UIIList>
	                    #local.uiiStrings#
	                </UIIList>
                </Request>
            </ElementRetrievalRequestObject>    
        '; 
        
        local.send = sendSoap(getProperty("UIIRetrieval"),local.xmlDoc,"http://www.bpn.gov/IUIDAPI/ElementRetrievalRequestObject");
        
        return local.send;
             
    }
    
    public any function UIIRetrievalByPartNumber(string partNumber="", string serialNumber="",string email = getProperty("Email"), string userName = getProperty("UserName"), string organization = getProperty("Organization"), string phone = getProperty("Phone")){
        var local = {};
        local.xmlDoc = '
        <UIIRetrievalByPartNumberObject xmlns="http://www.bpn.gov/IUIDAPI/">
	      <Request>
	        <RequestList>
	          <RequestItem>
	            <PartNumber><![CDATA[' & trim(ARGUMENTS.partNumber)  & ']]></PartNumber>
                <SerialNumber><![CDATA[' & trim(ARGUMENTS.serialNumber)  & ']]></SerialNumber>
	          </RequestItem>
	        </RequestList>
	      </Request>
	    </UIIRetrievalByPartNumberObject>'; 
      
        local.send = sendSoap(getProperty("UIIPartNumber"),local.xmlDoc,"http://www.bpn.gov/IUIDAPI/UIIRetrievalByPartNumberObject");
        return local.send;
             
    }
    
    public any function UIIRetrieval(array pedigrees = [], string email = getProperty("Email"), string userName = getProperty("UserName"), string organization = getProperty("Organization"), string phone = getProperty("Phone")){
        var local = {};
        local.pedigrees = "";

        //Create Pedigrees
        for(local.p = 1;local.p<=ArrayLen(ARGUMENTS.pedigrees);local.p++){
        	local.ped = "";
            if(isStruct(Arguments.pedigrees[local.p])){
                if(Structkeyexists(ARGUMENTS.pedigrees[local.p],"issuingAgencyCode")  && len(trim(ARGUMENTS.pedigrees[local.p]["IssuingAgencyCode"]))){
                    local.ped &= "<IssuingAgencyCode>" & trim(ARGUMENTS.pedigrees[local.p]["IssuingAgencyCode"]) & "</IssuingAgencyCode>";
                }
                if(Structkeyexists(ARGUMENTS.pedigrees[local.p],"EnterpriseIdentifier")  && len(trim(ARGUMENTS.pedigrees[local.p]["EnterpriseIdentifier"]))){
                    local.ped &= "<EnterpriseIdentifier>" & trim(ARGUMENTS.pedigrees[local.p]["EnterpriseIdentifier"]) & "</EnterpriseIdentifier>";
                }   
                
                if(Structkeyexists(ARGUMENTS.pedigrees[local.p],"SerialNumber")  && len(trim(ARGUMENTS.pedigrees[local.p]["SerialNumber"]))){
                    local.ped &= "<SerialNumber>" & trim(ARGUMENTS.pedigrees[local.p]["SerialNumber"]) & "</SerialNumber>";
                }   
                
                if(Structkeyexists(ARGUMENTS.pedigrees[local.p],"OriginalPartNumber")  && len(trim(ARGUMENTS.pedigrees[local.p]["OriginalPartNumber"]))){
                    local.ped &= "<OriginalPartNumber>" & trim(ARGUMENTS.pedigrees[local.p]["OriginalPartNumber"]) & "</OriginalPartNumber>";
                }   
                
                if(Structkeyexists(ARGUMENTS.pedigrees[local.p],"PartNumber")  && len(trim(ARGUMENTS.pedigrees[local.p]["PartNumber"]))){
                    local.ped &= "<PartNumber>" & trim(ARGUMENTS.pedigrees[local.p]["PartNumber"]) & "</PartNumber>";
                }  
                
                if(Structkeyexists(ARGUMENTS.pedigrees[local.p],"BatchLot")  && len(trim(ARGUMENTS.pedigrees[local.p]["BatchLot"]))){
                    local.ped &= "<BatchLot>" & trim(ARGUMENTS.pedigrees[local.p]["BatchLot"]) & "</BatchLot>";
                }   	
            	
            }
            
            if(len(trim(local.ped))){
                local.pedigrees &= "<Pedigree>" & trim(local.ped) & "</Pedigree>";
            }
            	
        }
        if(len(trim(local.pedigrees))){    
            local.pedigrees &="<Pedigrees>" & local.pedigrees & "</Pedigrees>";
        }

      local.xmlDoc = '
	      <UIIRetrievalRequestObject xmlns="http://www.bpn.gov/IUIDAPI/">
		      <Request>
		        #local.pedigrees#
		      </Request>
	      </UIIRetrievalRequestObject>';  
      local.send = sendSoap(getProperty("UIIRetrieval"),local.xmlDoc,"http://www.bpn.gov/IUIDAPI/UIIRetrievalRequestObject");
      
      return local.send;        	
    }
    
    
    public any function UIIVerification(string uiiList="",string email = getProperty("Email"), string userName = getProperty("UserName"), string organization = getProperty("Organization"), string phone = getProperty("Phone")){
        var local = {};
        
        local.uiiStrings = "";
        local.uiiArray = ListToArray(ARGUMENTS.uiiList);
        for(local.uii = 1;local.uii <= ArrayLen(local.uiiArray);local.uii++){
            if(len(trim(local.uiiArray[local.uii]))){
                local.uiiStrings &="<string><![CDATA[" & trim(local.uiiArray[local.uii])  & "]]></string>"; 
            }
        }
       
        local.xmlDoc = '
            <Verification_DataObject xmlns="http://www.bpn.gov/IUIDAPI/">
                <Request>
                    <UIIList>
                        #local.uiiStrings#
                    </UIIList>
                </Request>
            </Verification_DataObject>   
        '; 
        
        local.send = sendSoap(getProperty("UIIVerification"),local.xmlDoc,"http://www.bpn.gov/IUIDAPI/Verification_DataObject");
        
        return local.send;
             
    }

    public any function sendSOAP(required string url,required string xml,string soapAction=""){
        var local = {};
        local.result="";
        
        
        try{
        local.soapType = "soap12";
        if(isBoolean(getProperty("useSOAP11")) && getProperty("useSOAP11")){
            local.soapType="soap";	
        }
        
        local.soap = '<?xml version="1.0" encoding="utf-8"?>
        <#local.soapType#:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:#local.soapType#="http://www.w3.org/2003/05/soap-envelope">
        <#local.soapType#:Body>#ARGUMENTS.xml#</#local.soapType#:Body>
		</#local.soapType#:Envelope>';

		//Setup new http connection
		local.httpService = new http();
		local.httpService.setUrl(trim(ARGUMENTS.url));
		local.httpService.setMethod("POST");
		local.httpService.setThrowOnError(false);
		local.httpService.setTimeout(getProperty("timeout"));

		//Add Parameters
		local.httpService.addParam(type="header", name="User-Agent", value=getProperty("userAgent"));
		
		if(isBoolean(getProperty("useSOAP11")) && getProperty("useSOAP11")){
		  local.httpService.addParam(type="header", name="Content-Type", value="text/xml; charset=utf-8");
		  local.httpService.addParam(type="header", name="SOAPAction", value="#trim(ARGUMENTS.soapAction)#");  
		}else{
			  local.httpService.addParam(type="header", name="Content-Type", value='application/soap+xml; charset=utf-8; action="#trim(ARGUMENTS.soapAction)#"');   
		}

       local.httpService.addParam(type="body", value="#TRIM(local.soap)#");
       
       local.startTimer = getTickCount();
       local.httpResult = local.httpService.send().getPrefix();
       local.endTimer = getTickCount();

       if(isDefined('local.httpResult') && isStruct(local.httpResult) && StructKeyExists(local.httpResult,"fileContent")){
        local.result = removeSoap(local.httpResult["fileContent"]);	   
       }
       }catch(any e){
       	    local.message = "";
       	    local.detail = "";
       	    if(isDefined("e.message")){
                local.message = e.message;       
            }
       	    if(isDefined("e.detail")){
       	        local.detail = e.detail;	   
       	    }
       	    return e;
            local.result = setError(local.message,local.detail,ARGUMENTS.xml);     	   
       }

            local.result = XmlParse(local.result);

    return local.result;     	
    }

    public any function getProperty(required String prop){
       if(not StructKeyexists(VARIABLES.instance,trim(ARGUMENTS.prop))){
           throw("Property #ARGUMENTS.prop# does not exist");
       }else{
           return VARIABLES.instance[ARGUMENTS.prop];
       }    
    }

    public any function setProperty(required String prop,required any value){
       VARIABLES.instance[UCase(ARGUMENTS.prop)] = ARGUMENTS.value;
       return this;   
    }
    
    public any function removeProperty(required String prop){
       structDelete(VARIABLES.instance,ARGUMENTS.prop);
       return this;   
    }
    
    public any function getProperties(){
        return variables.instance;  
    }
    
    public string function removeSoap(required string soap){
        var local = {};
        local.response = "";
        if(isXml(ARGUMENTS.soap)){
            local.response =  getSOAPMessage(arguments.soap);              
        }   
        return local.response;    
    }
    
    public string function getSoapMessage(required string soap){
       var local = {};
       local.result = ARGUMENTS.soap;
       local.hasError = false;

       if(isXml(ARGUMENTS.soap)){
           //Try removing SOAP via JAVA & Axis
           local.message = rereplaceNocase(ARGUMENTS.soap,"<\?xml.*\?>","","ONE");
           local.bytes = local.message.getBytes();
           local.bis = createObject("java","java.io.ByteArrayInputStream").init(local.bytes);
           local.envelope = createObject("java","org.apache.axis.message.SOAPEnvelope").init(local.bis);
           local.result = local.envelope.getFirstBody().toString();
           local.bis.close();
         }
       return local.result; 
    }
    
    public string function setError( required string message, string detail = "", string parameters = ""){
        var local = {};
        local.XmlDoc = '
           <IUIDRegistryResponse xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <ProcessDate>#DateFormat(NOW(),"yyyy-mm-dd")# #TimeFormat(NOW(),"HH:mm:ss")#</ProcessDate>
			    <Version><![CDATA[#DateFormat(getBuildVersion(),"yyyy-mm-dd")# #TimeFormat(getBuildVersion(),"HH:mm:ss")#]]></Version>
			    <ResultStatus>
			        <Success>false</Success>
			        <Message><![CDATA[#trim(ARGUMENTS.message)#]]></Message>
			        <Detail><![CDATA[#trim(ARGUMENTS.detail)#]]></Detail>
			        <Parameters>#trim(ARGUMENTS.parameters)#</Parameters>
			    </ResultStatus>
            </IUIDRegistryResponse>';
        return local.xmlDoc;
    }
    
    public any function getBuildVersion(){
        return getProperty("buildVersion"); 
    }
    
}