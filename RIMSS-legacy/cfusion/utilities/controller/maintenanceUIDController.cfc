import cfc.facade.SessionFacade;
import cfc.factory.ObjectFactory;
import cfc.utils.javaLoggerProxy;
import cfc.utils.IUIDRegistry;
import cfc.utils.utilities;

component  output="false" extends="cfc.utils.Proxy" 
{
	
	variables.instance = {
		objectfactory='',
		assetService = '',
		utilities = new utilities(),
		componentName = "maintenanceUIDController",
	    IUIDRegistry = new  IUIDRegistry(),
       javaLoggerProxy = new  javaLoggerProxy(),
       sessionFacade = new SessionFacade()

	};
	
	public any function init(){
	   return this;
	}
	
	public any function getSessionFacade(){
       return variables.instance.sessionFacade;      
    }
	
	public any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")){
           variables.instance.componentName = getMetaData(this).name;   
        }
       return variables.instance.componentName;      
    }
    
    public any function getUser(){
       return getSessionFacade().getUserName();      
    }
	
	public any function getRootPath(){
       return Application.rootPath;      
    }
    
    public any function getProgram(){
       return lcase(trim(application.sessionManager.getProgramSetting()));      
    }
	
	public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
	
	public any function getAssetService(){
       if(isSimpleValue(variables.instance.assetService)){
           variables.instance.assetService = APPLICATION.objectFactory.create("AssetService");    
        }       
       return variables.instance.assetService;      
    }
    
    public any function getIUIDRegistry(){
       return variables.instance.IUIDRegistry;      
    }
    
	public string function UIIDecode(string uid){
		return CreateObject("java","mil.af.robins.rampod.uii_scanner.UII_Decode").init(ARGUMENTS.uid);
	}
	
	public any function checkUIIRegistry(required string uid){
	   var local = {};
	   local.utils = new utilities();
	   local.result = [];
	   local.page = getRootPath() & "/utilities/registry/index.cfm";
	   
	   if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
             local.page = trim(rc.httpreferer);      
        } 

	   local.decodeUII = UIIDecode(trim(ARGUMENTS.uid));
	   addToRequest("UIIDecodeResult",local.decodeUII);
	   local.concatenatedUII = local.decodeUII.getConcatenatedUII();
	   
	   try{
	       if( local.decodeUII.isSuccess() && isDefined("local.concatenatedUII") and len(trim(local.concatenatedUII))){
	           local.uiiCageCode = isNull(local.decodeUII.getCageCode()) ? "" : local.decodeUII.getCageCode();
	           local.uiiEnterpriseId = isNull(local.decodeUII.getEnterpriseId() ) ? "" : local.decodeUII.getEnterpriseId() ;
	           local.uiiManufacturer = isNull(local.decodeUII.getManufacturer() ) ? "" : local.decodeUII.getManufacturer();
	           local.uiiOriginalPartNo = local.decodeUII.getOriginalPartNo();
	           local.uiiSerialNo = local.decodeUII.getSerialNo();
	           local.uiiStatus = local.decodeUII.getStatus();
               ArrayAppend(local.result,"UII Decode"); 
		       ArrayAppend(local.result,"Cage Code : #local.uiiCageCode#");
		       ArrayAppend(local.result,"Enterprise Id : #local.uiiEnterpriseId#");	
		       ArrayAppend(local.result,"Manufacturer : #local.uiiManufacturer#");   
		          
		       local.registryLookup = getIUIDRegistry().ElementRetrieval(trim(local.concatenatedUII));
	           addToRequest("UIIRegistryLookup",local.registryLookup); 
	           if(isXml(local.registryLookup)){
	             local.elementResults = xmlsearch(local.registryLookup,"//*[name()='ElementResult']");
	             if(ArrayLen(local.elementResults)){
	                local.elementResultChildren = local.elementResults[1].XmlChildren;
	                 ArrayAppend(local.result,"National Registry : Yes");
	                for(local.ec = 1;local.ec <= ArrayLen(local.elementResultChildren);local.ec++){
	             	  ArrayAppend(local.result,local.elementResultChildren[local.ec].XmlName & " : " & local.elementResultChildren[local.ec].XmlText);       	
	                }   
	              }else{
	                ArrayAppend(local.result,"National Registry : No");
	              }
	            }  	   
	       }
	   }catch(any e){
	   	   local.utils.recordError(e,utils.getComponentName(this),"checkUIIRegistry",getUser());     
            addToRequest("error",{message='There was an error reading the UII Registry Reader'});
	        
	   }
       addToRequest("uiiData",ArrayToList(local.result,chr(10)));
       redirect(local.page,true);      
	   
	}
	
	public any function readUIIByPn(array Element){
	   var local = {};
	   local.utils = new utilities();
	   local.registryLookup = "";
	   	
	   local.page = getRootPath() & "/" & getProgram() & "/maintenance/uiiPNLookup.cfm";
        
       if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
             local.page = trim(rc.httpreferer);      
        }  
        
	   try{
	   	   
	   	 local.registryLookup = getIUIDRegistry().UIIRetrieval(ARGUMENTS.Element);  
	   	 addToRequest("UIIRegistryLookup",local.registryLookup);   
	   	 if(isXml(local.registryLookup)){
	       local.xmlSearch = xmlsearch(local.registryLookup,"//*[name()='UIIResult']");
	       addToRequest("uiiPnResults",local.xmlSearch); 
	     }
	     
	   
	   }catch(any e){
	       local.utils.recordError(e,local.utils.getComponentName(this),"readUIIByPn",getUser()); 
	       addToRequest("error",{message='There was an error reading the UII By Part Number'});	   
	   }
	   redirect(local.page,true);
	   abort;     	
	}
	
	public void function readUII(required string uids){
	   var local = {};
	   local.convertedUIDs = [];
	   local.assets = [];
	   local.uidsArray = ARGUMENTS.uids.split("\n");
	   local.utils = new utilities();
	   
	   local.page = getRootPath() & "/" & getProgram() & "/maintenance/createMaintenanceUID.cfm";
        
       if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
             local.page = trim(rc.httpreferer);      
        }  
        
	   for(local.uid = 1;local.uid<=ArrayLen(local.uidsArray);local.uid++){
	   	  try{
	   	  	   local.decodedUII = UIIDecode(local.uidsArray[local.uid]).getConcatenatedUII();
	   	  	   if(isDefined("local.decodedUII")){
		   	       ArrayAppend(local.convertedUIDs,local.decodedUII);
		   	       ArrayAppend(local.assets,getAssetService().getAssetByUII(local.decodedUII));
	   	       }
	   	  }catch(RecordNotFoundException e){
		       local.utils.recordError(e,utils.getComponentName(this),"readUII",getUser()); 
		       continue;
	   	  }catch(any e){
	   	  	if(isDefined('rc.httpreferer') and len(trim(rc.httpreferer))){
			     local.page = trim(rc.httpreferer);      
			} 
	   	  	local.utils.recordError(e,utils.getComponentName(this),"readUII",getUser());     
            addToRequest("error",{message='There was an error reading the UII codes'});
	   	  }    
	   }

	   addToFormRequest("convertedUIDs",local.convertedUIDs);
	   addToFormRequest("assets",local.assets);
	   redirect(local.page,true);
	}
    	
}