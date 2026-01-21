import cfc.facade.SessionFacade;
import cfc.model.Sorties;
import cfc.dao.DBUtils;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;
import cfc.utils.utilities;
import cfc.service.CodeService;


component  hint="Used to import sortie data from excel and access files" output="false"
{   

	variables.instance = {
	   'action' = '',
	   'importAccess' = new importAccess(),
	   'importExcel' = new importExcel(),
	   'temporaryFile' = '',
	   'directory' = Replacenocase(getTempDirectory() & "Sorties/","\","/","ALL"),
	   'mappingsDirectory' = '',
	   'mappingsFileName' = "mappings.xml",
	   'items' = [],
	   'columns'=[],
	   'sortieSummary' = '',
	   'itemType'='',
	   'upload' = this,
	   'type'='',
	   'header'='',
	   'applicationName' = '',
	   'sessionFacade' = new SessionFacade(),
	   'sessionEnabled' = true,
	   'utilities' = new utilities(),
	   'javaLoggerProxy' = new  javaLoggerProxy(),
	   'dbUtils' = '',
	   'sorties' = '',
	   'codeService'='',
	   'sortiesService'=''
	};
    
    //Proxy to the APPLICATION and SESSION information
    variables.name = (IsDefined("APPLICATION.name") and len(trim(APPLICATION.name))) ? APPLICATION.name : "RIMSS";
    variables.instance.applicationName = variables.name;
    variables.instance.sessionEnabled = variables.instance.utilities.isSessionEnabled();
    try{
        variables.instance.unit = (variables.instance.sessionEnabled) ? getSessionFacade().getUnitSetting() : "";
        variables.instance.user = (variables.instance.sessionEnabled) ? getSessionFacade().getUserName() : "";
    }catch(any e){	
    }

    public any function init(String mappings = getMappingsDirectory()){


        if(len(trim(ARGUMENTS.mappings))){
            setMappingsDirectory(ARGUMENTS.mappings);
            
        }else{
            variables.instance.mappingsDirectory = findMappingsDirectory();
            
        }
        
        return this;	
    }
    
    public Struct function getInstance(){
        return variables.instance;
    }
    
    public any function getJavaLoggerProxy(){
       return variables.instance.javaLoggerProxy;      
    }
    
    
    public any function getSessionFacade(){
        return variables.instance.sessionFacade;
    }
    
    public any function getUtilities(){
        return variables.instance.utilities;
    }
    
    public any function getDBUtils(){
    	if(isSimpleValue(variables.instance.dbUtils)){
    	   variables.instance.dbUtils = getObjectFactory().create("DBUtils");	
    	}
        return variables.instance.dbUtils;
    }
    
    public any function getObjectFactory(){
        return APPLICATION.objectFactory;
    }
    
    public any function getCodeService(){
    	var local = {};
    	if(isSimpleValue(variables.instance.codeService)){
    	  variables.instance.codeService =  getObjectFactory().create("CodeService");	
    	}
        return variables.instance.codeService;
    }
    
    public any function getSortiesService(){
        var local = {};
        if(isSimpleValue(variables.instance.sortiesService)){
          variables.instance.sortiesService =  getObjectFactory().create("SortiesService");    
        }
        return variables.instance.sortiesService;
    }
    
    public String function getUnit(){
        return variables.instance.unit;
    }

    public any function getApplicationName(){
        return variables.instance.applicationName; 
    }  

    public any function setApplicationName(required String applicationName){
        variables.instance.applicationName = ARGUMENTS.applicationName; 
        return this;
    }  
    
    public any function getUser(){
        return variables.instance.user;
    }
    
    public any function setUser(required string user){
        variables.instance.user = ucase(trim(ARGUMENTS.user));
        return this;
    }
    
    public any function getImportAccess(){
        return variables.instance.importAccess;	
    }	

    public any function getImportExcel(){
        return variables.instance.importExcel; 
    }
    
    public any function getAction(){
        return variables.instance.action; 
    }  
    
    public any function setAction(required String action){
        variables.instance.action = ARGUMENTS.action; 
        return this;
    }  
    
    public any function getMappingsFileName(){
        return variables.instance.mappingsFileName; 
    }  
     
    public any function setMappingsFileName(required String mappingsFileName){
        variables.instance.mappingsFileName = ARGUMENTS.mappingsFileName; 
        return this;
    }  
    
    public any function getItems(){
        return variables.instance.items; 
    }  
    
    public any function setItems(required Array items){
        variables.instance.items = ARGUMENTS.items; 
        return this;
    }  
    
    public any function getColumns(){
        return variables.instance.columns; 
    }  
    
    public any function setColumns(required Array columns){
        variables.instance.columns = ARGUMENTS.columns; 
        return this;
    }  
    
    public any function getSortieSummary(){
        return variables.instance.sortieSummary; 
    }  
    
    public any function setSortieSummary(required any sortieSummary){
        variables.instance.sortieSummary = ARGUMENTS.sortieSummary; 
        return this;
    }  
    
    public any function getItemType(){
        return variables.instance.itemType; 
    }  
    
    public any function setItemType(required String itemType){
        variables.instance.itemType = ARGUMENTS.itemType; 
        return this;
    }  
    
    public any function getType(){
        return variables.instance.type; 
    }  
    
    public any function setType(required String type){
        variables.instance.type = ARGUMENTS.type; 
        return this;
    }  
    
    public any function getHeader(){
        return variables.instance.header; 
    }  
    
    public any function setHeader(required String header){
        variables.instance.header = ARGUMENTS.header; 
        return this;
    }  
    
    public any function getTemporaryFile(){
       return variables.instance.temporaryFile; 
    }
    
    public any function setTemporaryFile(required String temporaryFile){
       variables.instance.temporaryFile = trim(ARGUMENTS.temporaryFile);
       return this; 
    }
    
    public String function getDirectory(){
    	return variables.instance.directory; 
    }
    
    public String function getMappingsDirectory(){
        return variables.instance.mappingsDirectory; 
    }
    
    public any function getComponent(){
        return this;
    }
    
   
    
    public any function setMappingsDirectory(required String mappingsDirectory){
        variables.instance.mappingsDirectory = ARGUMENTS.mappingsDirectory;
        
        // Create mappingsDirectory if doesn't exist 
       if(not directoryExists(trim(ARGUMENTS.mappingsDirectory))){
             DirectoryCreate(trim(ARGUMENTS.mappingsDirectory));           
       }
         
        return this;
    }
    
    private any function findMappingsDirectory(){
        var local = {};
        local.defaultDirectory = GetDirectoryFromPath(GetCurrentTemplatePath()) & "mappings\";
        
        local.system = CreateObject("java","java.lang.System");
        local.systemProps = local.system.getProperties();

        if(StructKeyexists(local.systemProps,"user.dir")){
            local.defaultDirectory = local.systemProps['user.dir'] & "\" & getApplicationName() & "\mappings\";       
        }
        
        setMappingsDirectory(local.defaultDirectory);
        
        return local.defaultDirectory;      
    }
    
    
    public any function readColumns(required String action,required String filepath,required String item){
        var local = {};
        local.result = [];
        setAction(trim(ARGUMENTS.action)); 
            
            try{
            
	            switch(lcase(trim(ARGUMENTS.action))){
	               case "excel":{
	               	   if(len(trim(ARGUMENTS.item))){
	                       local.importExcel = new importExcel(); 
	                      
                           local.result = local.importExcel.readColumns(filePath=ARGUMENTS.filepath,sheet=trim(ARGUMENTS.item));
                       }
                   break;      	   
	               }
	               
	               case "access":{
                       if(len(trim(ARGUMENTS.item))){
                           local.importAccess = new importAccess(); 
                           local.result = local.importAccess.readColumns(filePath=ARGUMENTS.filepath,tableName=trim(ARGUMENTS.item));        
                       }  
                   break;          
                   }
	               
	               
	            }
            }catch(any e){
            }
        
        setColumns(local.result);
        return local.result;   	
    }
    
    
    public any function upload(required String action,required String formField){
       var local = {};
       setTemporaryFile('');
       setAction(trim(ARGUMENTS.action));
       local.results = {};
       	 try{

            switch(lcase(trim(ARGUMENTS.action))){
                case "excel":{
                   local.importExcel = new importExcel(); 
				   
				   local.importExcel.setDirectory(getDirectory());
	               local.results.upload = local.importExcel.upload(ARGUMENTS.formField);
	               local.results.tempFile = local.importExcel.getTemporaryFile();
	               
	               local.results.importArray = local.importExcel.getSheetNames();
	               local.results.importColumns = local.importExcel.getHeaders();
	               local.results.importSummary = local.importExcel.getSummary();
	               local.results.header = "Sheets";
	               local.results.type = ReReplace(trim(ARGUMENTS.action),"(.)","\u\1");
	               
	               setTemporaryFile(local.importExcel.getTemporaryFile());
                   setItems(local.importExcel.getSheetNames());
                   setColumns(local.importExcel.getHeaders());
                   setSortieSummary(local.importExcel.getSummary());
                   setItemType("Sheets");
                   setType(local.results.type);
                   setHeader(local.results.header);
	               
                break;	
                }	
                
                case "access":{
                   local.importAccess = new importAccess(); 
				   local.importAccess.setDirectory(getDirectory());
	               local.results.upload = local.importAccess.upload(ARGUMENTS.formField);
	               local.results.tempFile = local.importAccess.getTemporaryFile();
	               local.results.importArray = local.importAccess.getTableNames(); 
	               local.results.importColumns = local.importAccess.getTableColumns();
	               local.results.importSummary = local.importAccess.getSummary(); 
	               local.results.header = "Tables"; 
	               local.results.type = ReReplace(trim(ARGUMENTS.action),"(.)","\u\1");
	               
	               setTemporaryFile(local.importAccess.getTemporaryFile());
                   setItems(local.importAccess.getTableNames());
                   setColumns(local.importAccess.getTableColumns());
                   setSortieSummary(local.importAccess.getSummary());
	               setItemType("Tables");
                   setType(local.results.type);
	               setHeader(local.results.header);
	               
                break;  
                }
                
                default:{
                    throw(message = "Unknown upload type '#trim(ARGUMENTS.action)#'", type="cfc.utils.import.importSortie.UnknownUploadType");	
                }   
            	
            }
            
            
        }catch(coldfusion.tagext.io.FileUtils$InvalidUploadTypeException e){
            
            throw(message = "File not the correct format" detail=e.message, type="coldfusion.tagext.io.FileUtils$InvalidUploadTypeException");
            
  
        }catch(coldfusion.tagext.io.FileUtils$FormFileNotFoundException e){
            throw(message = "File is empty.  Please select a file." detail=e.message);	
        }catch(any e){
            rethrow;	
        }    	
        
        return this;
    }   
	
	public any function loadMappingFromFile(){
	   var local = {};

       local.unit = getUnit();
	   if(!len(trim(local.unit))){
            throw(message="Unit not found.  Please login!" type="UndefinedUserModel");  
       }
       local.mappings = loadMappings();
       
       if(!(isStruct(local.mappings)) or (Structkeyexists(local.mappings,"fieldMappings") and not ArrayLen(local.mappings['fieldMappings']))
           or (not StructkeyExists(local.mappings,"fieldMappings"))){
            throw(message="Cannot find mappings for unit #local.unit#" type="MappingsNotFound");   
       }	   
       return loadMappings();

	}

	
	public any function loadMappings(){
	   var local = {};
	     
	   local.userMappingStruct = {};
	   local.unit = getUnit();
	   
	   //Make sure mappings directory is populated when making an ajax call
	   if(not len(trim(getMappingsDirectory()))){
	       findMappingsDirectory();	   
	   }
    
	   local.userMappingStruct.unit = getUnit();
	   local.mappingsFile = getMappingsDirectory() &  getMappingsFileName();
	   local.userMappingStruct.mappingsFile = local.mappingsFile;
	   if(fileExists(local.mappingsFile)){
	       lock name="#local.mappingsFile#" type="exlusive" timeout="30"{
                local.readMappings = fileRead(local.mappingsFile);    
           }

           if(isXml(local.readMappings) and len(trim(local.unit))){
                local.userMapping = xmlSearch(local.readMappings,"//user_mapping[unit='#ucase(trim(local.unit))#']"); 
                    	   
                local.userMappingStruct = {
                	user='',
                	unit='',
                	fileType='',
                	dataTable='',
                	mapDate='',
                	fieldMappings=[]
                };
                
                if(Arraylen(local.userMapping)){
                	local.fieldMappings = xmlSearch(local.userMapping[1],".//field_mapping"); 
                	
                    if(StructKeyexists(local.userMapping[1],"user")){
                        local.userMappingStruct.user = local.userMapping[1]['user'].XmlText;	
                    }   
                    
                    if(StructKeyexists(local.userMapping[1],"unit")){
                        local.userMappingStruct.unit = local.userMapping[1]['unit'].XmlText;  
                    }   
                    
                    if(StructKeyexists(local.userMapping[1],"file_type")){
                        local.userMappingStruct.fileType = local.userMapping[1]['file_type'].XmlText;  
                    }  
                    
                    if(StructKeyexists(local.userMapping[1],"data_table")){
                        local.userMappingStruct.dataTable = local.userMapping[1]['data_table'].XmlText;  
                    }   
                    
                    if(StructKeyexists(local.userMapping[1],"map_date")){
                        local.userMappingStruct.mapDate = local.userMapping[1]['map_date'].XmlText;  
                    } 
                    
                    for(local.f=1;local.f <= Arraylen(local.fieldMappings);local.f++){
                        local.fieldStruct = {};
                        
                        if(Structkeyexists(local.fieldMappings[local.f],"rampod_field_name")){
                            local.fieldStruct['rampod_field_name'] =  local.fieldMappings[local.f]['rampod_field_name'].xmlText;   	
                        }	
                        
                        if(Structkeyexists(local.fieldMappings[local.f],"rampod_field_position")){
                            local.fieldStruct['rampod_field_position'] =  local.fieldMappings[local.f]['rampod_field_position'].xmlText;    
                        }   
                        
                        if(Structkeyexists(local.fieldMappings[local.f],"foreign_field_name")){
                            local.fieldStruct['foreign_field_name'] =  local.fieldMappings[local.f]['foreign_field_name'].xmlText;    
                        }
                        
                        if(Structkeyexists(local.fieldMappings[local.f],"foreign_field_position")){
                            local.fieldStruct['foreign_field_position'] =  local.fieldMappings[local.f]['foreign_field_position'].xmlText;    
                        }   
                        
                        if(Structkeyexists(local.fieldMappings[local.f],"constant_field_value")){
                            local.fieldStruct['constant_field_value'] =  local.fieldMappings[local.f]['constant_field_value'].xmlText;    
                        } 
                        
                        if(Structkeyexists(local.fieldMappings[local.f],"auto_fill")){
                            local.fieldStruct['auto_fill'] =  local.fieldMappings[local.f]['auto_fill'].xmlText;    
                        }
                        
                        if(!StructIsEmpty(local.fieldStruct)){
                            ArrayAppend(local.userMappingStruct.fieldMappings,local.fieldStruct);	
                        }   
                        
                    }
                       	
                }
    
           }
    	   
	   }else{
	       throw(message="Unit Mapping not found!");        	   
	   }
	   
	   return local.userMappingStruct;	
	}
	
	
	
	public any function saveMappings(required any mappings){
       var local = {}; 
       local.result={
            'success'=false,
            'message'=''
       };
       
       try{
	       local.unit = getUnit();
	       local.user = getUser();
            
           //Unit must be found 
	       if(!len(trim(local.unit))){
	            throw(message="Unit not found.  Please login!" type="UnknownUserModel");  
	       } 
	       
	       //Make sure mappings directory is populated when making an ajax call
	       if(not len(trim(getMappingsDirectory()))){
	           findMappingsDirectory();    
	       }
	
	       local.mappingsFile = getMappingsDirectory() &  getMappingsFileName();
            
			//Create mappings file if it doesn't exist
			lock name="#local.mappingsFile#" type="exlusive" timeout="30"{
		        local.xmlDoc = readMappings(local.mappingsFile);
		        if(not isXML(local.xmlDoc)){
		            local.document = createObject("java","org.jdom.Document").init(createObject("java","org.jdom.Element").init("mappings"));
		            local.xmlDoc = outputXmlString(local.document);	  
		        }
		        
		        local.builder = createObject("java","org.jdom.input.SAXBuilder");
		        local.reader = createObject("java","java.io.StringReader").init(local.xmlDoc);
		        
		        local.doc = builder.build(local.reader);
	            local.root = local.doc.getRootElement();
	            local.mappings = local.root.getChildren();
		        
		        local.found = false;
		        
		        for(local.parent in local.mappings){
		           local.unitMapping =  local.parent.getChild("unit");	
		           if(isDefined("local.unitMapping") and UCASE(TRIM(local.unitMapping.getText())) eq local.unit){
		               local.found=true;
		               break;	   
		           }
		        }
		        
		        if(local.found){
		           local.parent = local.unitMapping.getParent();
		           local.parent.removeContent();  	
		        }else{
		           local.parent = createObject("java","org.jdom.Element").init("user_mapping");	
		           local.root.addContent(local.parent);
		        }
		        
		        local.mapDate = UCASE(DateFormat(now(),"dd-mmm-yyyy") & " " & TimeFormat(now(),"HH:mm"));
		        
		        if(isStruct(ARGUMENTS.mappings)){
		           
		           local.parent.addContent(createObject("java","org.jdom.Element").init("user").setText(UCASE(TRIM(local.user))));	
		           local.parent.addContent(createObject("java","org.jdom.Element").init("unit").setText(UCASE(TRIM(local.unit)))); 
		           
		           local.fileType = createObject("java","org.jdom.Element").init("file_type");
		           local.parent.addContent(local.fileType);
		           
		           if(Structkeyexists(ARGUMENTS.mappings,"file_type") and len(trim(ARGUMENTS.mappings['file_type']))){
		           	   local.fileType.setText(trim(ARGUMENTS.mappings['file_type']));       	   
		           }
		           
		           local.dataTable = createObject("java","org.jdom.Element").init("data_table");
	               local.parent.addContent(local.dataTable);
	               
	               if(Structkeyexists(ARGUMENTS.mappings,"data_table") and len(trim(ARGUMENTS.mappings['data_table']))){
	                   local.dataTable.setText(trim(ARGUMENTS.mappings['data_table']));              
	               }
	               
	               local.parent.addContent(createObject("java","org.jdom.Element").init("map_date").setText(local.mapDate));
	               
	               if(Structkeyexists(ARGUMENTS.mappings,"field_mapping") and isArray(ARGUMENTS.mappings['field_mapping'])){ 
				     local.fieldMappings = ARGUMENTS.mappings['field_mapping'];
				     
				     for(local.f in local.fieldMappings){
				         if(isStruct(local.f)){
				             local.field = createObject("java","org.jdom.Element").init("field_mapping");
				             
				             if(Structkeyexists(local.f,"rampod_field_name")){
				                 local.element = createObject("java","org.jdom.Element").init("rampod_field_name");
				                 if(len(trim(local.f.rampod_field_name))){
				                     local.element.setText(JavaCast("string",local.f.rampod_field_name));	 
				                 }
				                 local.field.addContent(local.element);	 
				             }
				             
				             if(Structkeyexists(local.f,"rampod_field_position")){
				             	
	                             local.element = createObject("java","org.jdom.Element").init("rampod_field_position");
	                             if(len(trim(local.f.rampod_field_position))){
	                                 local.element.setText(JavaCast("string",local.f.rampod_field_position));   
	                             } 
	                             local.field.addContent(local.element);   
	                         }
	                         
	                         if(Structkeyexists(local.f,"foreign_field_name")){
	                             local.element = createObject("java","org.jdom.Element").init("foreign_field_name");
	                             if(len(trim(local.f.foreign_field_name))){
	                                 local.element.setText(local.f.foreign_field_name);   
	                             } 
	                             local.field.addContent(local.element);  
	                         }
	                         
	                         if(Structkeyexists(local.f,"foreign_field_position")){
	                             local.element = createObject("java","org.jdom.Element").init("foreign_field_position");
	                             if(len(trim(local.f.foreign_field_position))){
	                                 local.element.setText(JavaCast("string",local.f.foreign_field_position));   
	                             } 
	                             local.field.addContent(local.element);  
	                         }
	                         
	                         if(Structkeyexists(local.f,"constant_field_value")){
	                             local.element = createObject("java","org.jdom.Element").init("constant_field_value");
	                             if(len(trim(local.f.constant_field_value))){
	                                 local.element.setText(JavaCast("string",local.f.constant_field_value));   
	                             } 
	                             local.field.addContent(local.element);  
	                         }
	                         
	                         if(Structkeyexists(local.f,"auto_fill")){
	                             local.element = createObject("java","org.jdom.Element").init("auto_fill");
	                             if(len(trim(local.f.auto_fill))){
	                                 local.element.setText(JavaCast("string",local.f.auto_fill));   
	                             }
	                             local.field.addContent(local.element);   
	                         }
 	 
				         }
				         if(ArrayLen(local.field.getChildren())){
				            local.parent.addContent(local.field);  
				         } 	 
				     }
				           	
				   }
	               	
		        }
		        
		        local.xmlString = outputXmlString(local.root.getDocument());
		        
		        fileWrite(local.mappingsFile,local.xmlString);
		        
		        local.result.success = true;
		    
	
		  }
        }catch(any e){
        	local.result.success = false;
        	local.result.message = e.message;
        	//rethrow;
        }
       return local.result; 
    }
	
	public any function readMappings(required String mappingsFile){
	  var local = {};
	  local.readMappings = {};

           if(!fileExists(ARGUMENTS.mappingsFile)){
               fileWrite(ARGUMENTS.mappingsFile,"","utf-8");          
           }
           local.readMappings = fileRead(ARGUMENTS.mappingsFile);
      return local.readMappings;	
	}
	
	private boolean function checkMinimumMappings(required array columns, required array minColumns){
		var local = {};
		local.result = false;
		
		if(ArrayLen(ARGUMENTS.columns) lt ArrayLen(ARGUMENTS.minColumns)){
		  	return false;
		}
		
		for(local.c=1;local.c<=Arraylen(ARGUMENTS.minColumns);local.c++){
		  	
		  if(not ListContainsNoCase(ArrayToList(ARGUMENTS.columns),ARGUMENTS.minColumns[local.c])){
		      local.result = false;
		      break;  
		  } else{
		      local.result = true;	  
		  } 
		}
		
		
		return local.result;
	}
	
	public any function getSortie(){
	   if(isSimpleValue(variables.instance.sorties)){
	       variables.instance.sorties = new Sorties();	   
	   }else{
	       variables.instance.sorties.init();   
	   }	
	   return variables.instance.sorties;
	}
	
	public any function importData(required string filepath,required string action,required string item,required any mappings){
		   var local = {};
		   local.result={
            'success'=false,
            'message'='',
            'item'=''
            };
		   local.columns=[];
		   local.aliases=[];
	       local.minCols = ['MISSION_ID','SERNO','AC_TAILNO','SORTIE_DATE','CURRENT_UNIT'];
	       local.autoFillFields = {};
	       local.constantValueFields = {};
	       local.sortieFailures=[];
	       
	        getJavaLoggerProxy().info("////////////////calling importData method!!\\\\\\\\\\\\\\\\\\\\\\");
	       
	       if(isStruct(arguments.mappings) and Structkeyexists(ARGUMENTS.mappings,"field_mapping") and isArray(ARGUMENTS.mappings['field_mapping'])){
	           local.mappingsArray = ARGUMENTS.mappings['field_mapping'];
	           
	           for(local.m=1;local.m<=Arraylen(local.mappingsArray);local.m++){
	               if(isStruct(local.mappingsArray[local.m])){
	                   if(Structkeyexists(local.mappingsArray[local.m],"foreign_field_name")){
	                   	   local.foreignField = local.mappingsArray[local.m]["foreign_field_name"];
	                   	   //Replace the column with the constant value if it exists
	                   	   if(Structkeyexists(local.mappingsArray[local.m],"constant_field_value") and len(trim(local.mappingsArray[local.m]["constant_field_value"]))){
	                   	       ArrayAppend(local.columns,"'#local.mappingsArray[local.m]["constant_field_value"]#'");  
	                   	   }else{
	                   	       ArrayAppend(local.columns,local.mappingsArray[local.m]["foreign_field_name"]);
	                   	   }  
	                       	   
	                   }
	                   if(Structkeyexists(local.mappingsArray[local.m],"rampod_field_name")){
                           ArrayAppend(local.aliases,local.mappingsArray[local.m]["rampod_field_name"]);     
                       }
                       if(Structkeyexists(local.mappingsArray[local.m],"auto_fill") and Structkeyexists(local.mappingsArray[local.m],"foreign_field_name")){
                           local.autoFillFields[local.mappingsArray[local.m]["foreign_field_name"]] = local.mappingsArray[local.m]["auto_fill"];      
                       } 
                       
                       if(Structkeyexists(local.mappingsArray[local.m],"auto_fill") and Structkeyexists(local.mappingsArray[local.m],"foreign_field_name")){
                           local.autoFillFields[local.mappingsArray[local.m]["foreign_field_name"]] = local.mappingsArray[local.m]["auto_fill"];      
                       }
                       
                       if(Structkeyexists(local.mappingsArray[local.m],"constant_value") and Structkeyexists(local.mappingsArray[local.m],"foreign_field_name")){
                           local.constantValueFields[local.mappingsArray[local.m]["foreign_field_name"] & "_constant_value"] = local.mappingsArray[local.m]["constant_value"];      
                       }
                       
                       
					        	   
	               }        
	           }

	           if(not checkMinimumMappings(local.aliases,local.minCols)){
	               throw(message="Mappings must at least contain: '" & ArrayToList(local.minCols) & "'",type="cfc.utils.import.importSortie.InvalidMappings"); 
	               return;	   
	           }
   	   
	       }else{
	           throw(message="Mappings cannot be found", type="cfc.utils.importSortie.UnknownMappings");	      
	       }
	       
	       
		   if(fileExists(ARGUMENTS.filePath)){
		       local.results = {};
		        getJavaLoggerProxy().info("FILE EXISTS!! #ARGUMENTS.filePath#");
	         try{
	
	            switch(lcase(trim(ARGUMENTS.action))){
	                case "excel":{
	                   local.importExcel = new importExcel(); 
	                   
	                   local.importExcel.setDirectory(getDirectory());
	                   local.results['item'] = local.importExcel.readSheet(ARGUMENTS.filepath,ARGUMENTS.item,local.columns,local.aliases);
	                   
	                   
	                break;  
	                }   
	                
	                case "access":{
	                   local.importAccess = new importAccess(); 
	                   local.importAccess.setDirectory(getDirectory());
	                   local.results['item'] = local.importAccess.getTableRecords(ARGUMENTS.filepath,ARGUMENTS.item,local.columns,local.aliases);
	                   
	                   
	                break;  
	                }
	                
	                default:{
	                    throw(message = "Unknown type '#trim(ARGUMENTS.action)#'", type="cfc.utils.import.importSortie.UnknownType"); 
	                break; 
	                }   
	                
	            }  
	            
	           if(not isQuery(local.results.item)){
	           	   local.results['success'] = false;
	               throw(message = "Data is not valid query", type="cfc.utils.import.importSortie.InvalidData");
	               return;
	           }
                
               
                
	           local.itemColumns = ArrayToList(local.results.item.getColumnList());
	           
	           
	           getJavaLoggerProxy().info("Columns: #local.itemColumns#"); 


	           getJavaLoggerProxy().info("Processing Sorties....#local.results.item.RecordCount#");
	           
	            local.total = local.results.item.RecordCount;
                  local.processed = 0;
                  local.constraints = 0;
                  local.errors = 0;
                  
                  local.results['importResult'] = {
                     'total' = 0,
                     'constraints' = 0,
                     'processed' = 0,
                     'errors' = 0   
                  };
			   
			   
	           local.sortie = new Sorties();
	           local.sortie.setInsBy(getSessionFacade().getUserName());
               local.sortie.setInsDate(now());
               local.sortie.setPgmId(getSessionFacade().getProgramIdSetting());
               local.sortie.setValid("N");
	           
	           
	           local.acTypeValue = "";
	           local.currentUnitValue = "";
	           local.assignedUnitValue = "";
	           local.rangeValue = "";
	           local.sortieEffectValue = "";
	           
	           for (local.row = 1 ;local.row <= local.results.item.RecordCount ;local.row++){
	           	    
	           local.sortie = new Sorties();
	           local.sortie.setInsBy(getSessionFacade().getUserName());
               local.sortie.setInsDate(now());
               local.sortie.setPgmId(getSessionFacade().getProgramIdSetting());
               local.sortie.setValid("N");
                  
	               local.autoFill = false;
	               local.sourceData = [];

	               //Populate AC_STATION
	               if(listFindNocase(local.itemColumns,"AC_STATION")){

	               	   if(len(trim(local.results.item['AC_STATION'][local.row]))){
	               	       local.sortie.setAcStation(local.results.item['AC_STATION'][local.row]);
	               	   }else{
	               	       if(Structkeyexists(local.autoFillFields,'AC_STATION') and !len(trim(local.autoFillFields['AC_STATION']))){
                                local.sortie.setAcStation(local.results.item['AC_STATION'][local.row]);
                           } 	  
	               	   }
 
                   }
	               
	               //Populate AC_TAILNO
                   if(listFindNocase(local.itemColumns,"AC_TAILNO")){
                   	   
                   	   if(len(trim(local.results.item['AC_TAILNO'][local.row]))){
                           local.sortie.setAcTailNo(local.results.item['AC_TAILNO'][local.row]);
                       }else{
                           if(Structkeyexists(local.autoFillFields,'AC_TAILNO') and !len(trim(local.autoFillFields['AC_TAILNO']))){
                                local.sortie.setAcTailNo(local.results.item['AC_TAILNO'][local.row]);
                           }      
                       }

                        
                   }
                   
                   //Populate AC_TYPE
                   if(listFindNocase(local.itemColumns,"AC_TYPE")){

                   	   if(len(trim(local.results.item['AC_TYPE'][local.row]))){
                   	   	   local.acType =   local.results.item['AC_TYPE'][local.row]; 
                   	   	   local.acTypeValue = local.acType; 
                   	   	   local.code = findCodeId('ACFT_TYPE',local.acType);
                   	   	   if(isNumeric(local.code) and local.code lte 0){
		                      ArrayAppend(local.sourceData,"AC_TYPE: " & local.acTypeValue);  
		                   }
		                   getJavaLoggerProxy().info("AC_TYPE CODE = '#local.code#', AC_TYPE VALUE = '#local.acTypeValue#'");
		                   local.sortie.setAcType(local.code);
                   	   	   
                           
                       }else{
                           if(Structkeyexists(local.autoFillFields,'AC_TYPE') and !len(trim(local.autoFillFields['AC_TYPE']))){
                           	    local.acType =   local.results.item['AC_TYPE'][local.row];  
		                        local.code = findCodeId('ACFT_TYPE',local.acType);
		                        if(isNumeric(local.code) and local.code lte 0){
		                            ArrayAppend(local.sourceData,"AC_TYPE: " & local.acTypeValue);  
		                        }
		                        getJavaLoggerProxy().info("AC_TYPE CODE = '#local.code#', AC_TYPE VALUE = '#local.acTypeValue#'");
		                        local.sortie.setAcType(local.code);
   
                           }      
                       }
    
                   }
	               
	               //Populate CURRENT_UNIT
                   if(listFindNocase(local.itemColumns,"CURRENT_UNIT")){

                   	   if(len(trim(local.results.item['CURRENT_UNIT'][local.row]))){
                           local.currentUnit =   local.results.item['CURRENT_UNIT'][local.row]; 
                           local.currentUnitValue = local.currentUnit;  
                           local.code = findCodeId('UNIT',local.currentUnitValue);
                           if(isNumeric(local.code) and local.code lte 0){
                           	  //local.code = getDBUtils().getLocationIdBySiteUnitValue("UNKN","UNKN");
                              ArrayAppend(local.sourceData,"CURRENT_UNIT: " & local.currentUnitValue);  
                           }
                           getJavaLoggerProxy().info("CURRENT_UNIT CODE = '#local.code#', CURRENT_UNIT VALUE = '#local.currentUnitValue#'");
                           local.sortie.setCurrentUnit(local.code);
                          
                       }else{
                           if(Structkeyexists(local.autoFillFields,'CURRENT_UNIT') and !len(trim(local.autoFillFields['CURRENT_UNIT']))){
                                local.currentUnit =   local.results.item['CURRENT_UNIT'][local.row];  
                                local.code = findCodeId('UNIT',local.currentUnitValue);
                                if(isNumeric(local.code) and local.code lte 0){
                                    ArrayAppend(local.sourceData,"CURRENT_UNIT: " & local.currentUnitValue);  
                                }
                                getJavaLoggerProxy().info("CURRENT_UNIT CODE = '#local.code#', CURRENT_UNIT VALUE = '#local.currentUnitValue#'");
                                local.sortie.setCurrentUnit(local.code);  
                           }      
                       }
   
                        
                   }
                   
                   //Populate ASSIGNED_UNIT
                   if(listFindNocase(local.itemColumns,"ASSIGNED_UNIT")){

                   	   if(len(trim(local.results.item['ASSIGNED_UNIT'][local.row]))){
                           local.assignedUnit =   local.results.item['ASSIGNED_UNIT'][local.row]; 
                           local.assignedUnitValue = local.assignedUnit;  
                           local.code = findCodeId('UNIT',local.assignedUnitValue);
                           if(isNumeric(local.code) and local.code lte 0){
                           	  //local.code = getDBUtils().getLocationIdBySiteUnitValue("UNKN","UNKN");
                              ArrayAppend(local.sourceData,"ASSIGNED_UNIT: " & local.currentUnitValue);  
                           }
                           getJavaLoggerProxy().info("ASSIGNED_UNIT CODE = '#local.code#', ASSIGNED_UNIT VALUE = '#local.assignedUnitValue#'");
                           local.sortie.setAssignedUnit(local.code);
                          
                       }else{
                           if(Structkeyexists(local.autoFillFields,'ASSIGNED_UNIT') and !len(trim(local.autoFillFields['ASSIGNED_UNIT']))){
                                local.assignedUnit =   local.results.item['ASSIGNED_UNIT'][local.row];  
                                local.code = findCodeId('UNIT',local.assignedUnitValue);
                                if(isNumeric(local.code) and local.code lte 0){
                                    ArrayAppend(local.sourceData,"ASSIGNED_UNIT: " & local.assignedUnitValue);  
                                }
                                getJavaLoggerProxy().info("ASSIGNED_UNIT CODE = '#local.code#', ASSIGNED_UNIT VALUE = '#local.assignedUnitValue#'");
                                local.sortie.setAssignedUnit(local.code);  
                           }      
                       }
   
                        
                   }
	               
	               //Populate MISSION_ID
	               if(listFindNocase(local.itemColumns,"MISSION_ID")){
	               	   
	               	   if(len(trim(local.results.item['MISSION_ID'][local.row]))){
                           local.sortie.setMissionId(local.results.item['MISSION_ID'][local.row]);
                       }else{
                           if(Structkeyexists(local.autoFillFields,'MISSION_ID') and !len(trim(local.autoFillFields['MISSION_ID']))){
                                local.sortie.setMissionId(local.results.item['MISSION_ID'][local.row]);
                           }      
                       }
   	
	               }
	               
	               //Populate RANGE
                   if(listFindNocase(local.itemColumns,"RANGE")){
                   	   
                   	   
                   	   if(len(trim(local.results.item['RANGE'][local.row]))){
                           local.range =   local.results.item['RANGE'][local.row]; 
                           local.rangeValue = local.range;                          
                           
                           local.rangeAdded = local.rangeValue;
                                
                            if(!findnocase("RANGE",local.rangeValue)){
                                local.rangeAdded &= "";    
                            }
                            
                            local.code = findCodeId('ACTS_RANGES',local.rangeAdded);

                            if(isNumeric(local.code) and local.code lte 0){
                                local.code = findCodeId('ACTS_RANGES',local.rangeValue);                 
                            }
                           

                           if(isNumeric(local.code) and local.code lte 0){
                              ArrayAppend(local.sourceData,"RANGE: " & local.rangeValue);  
                           }
                           getJavaLoggerProxy().info("RANGE CODE = '#local.code#', RANGE VALUE = '#local.acTypeValue#'");
                            local.sortie.setRange(local.code);
                          
                       }else{
                           if(Structkeyexists(local.autoFillFields,'RANGE') and !len(trim(local.autoFillFields['RANGE']))){
                                local.range =   local.results.item['RANGE'][local.row]; 
                                
                                local.rangeAdded = local.range;
                                
                                if(!findnocase("RANGE",local.range)){
                                    local.rangeAdded &= "";    
                                }
                                
                                local.code = findCodeId('ACTS_RANGES',local.rangeAdded);

                                if(isNumeric(local.code) and local.code lte 0){
                                    local.code = findCodeId('ACTS_RANGES',local.range);                	
                                }

                                if(isNumeric(local.code) and local.code lte 0){
                                    ArrayAppend(local.sourceData,"RANGE: " & local.rangeValue);  
                                }
                                local.sortie.setRange(local.code);  
                           }      
                       }
    
                   }
                   
                   //Populate REASON
                   if(listFindNocase(local.itemColumns,"REASON")){
                   	   
                   	   if(len(trim(local.results.item['REASON'][local.row]))){
                           local.sortie.setReason(local.results.item['REASON'][local.row]);
                       }else{
                           if(Structkeyexists(local.autoFillFields,'REASON') and !len(trim(local.autoFillFields['REASON']))){
                                local.sortie.setReason(local.results.item['REASON'][local.row]);
                           }      
                       }
    
                   }
                   
                   //Populate SORTIE_DATE
                   if(listFindNocase(local.itemColumns,"SORTIE_DATE")){
                       
                       
                       
                   	   if(len(trim(local.results.item['SORTIE_DATE'][local.row]))){
                           local.sortie.setSortieDate(local.results.item['SORTIE_DATE'][local.row]);
                       }else{
                           if(Structkeyexists(local.autoFillFields,'SORTIE_DATE') and !len(trim(local.autoFillFields['SORTIE_DATE']))){
                                local.sortie.setSortieDate(local.results.item['SORTIE_DATE'][local.row]);
                           }
                           
                           if(Structkeyexists(local.autoFillFields,'SORTIE_DATE') and !len(trim(local.autoFillFields['SORTIE_DATE']))){
                           	   
                           }      
                       }
   
                   }
                   
                   //Populate SERNO
                   if(listFindNocase(local.itemColumns,"SERNO")){
                   	   
                   	   if(len(trim(local.results.item['SERNO'][local.row]))){
                   	   		if(len(trim(local.results.item['SERNO'][local.row]))){
                   	   			// SERNO value does exist
                   	   			local.sortie.setSerno(local.results.item['SERNO'][local.row]);	
                   	   		}else{
                   	   			// If SERNO value does not exist, then assume NON-PODDED
                   	   			local.sortie.setSerno('NON-PODDED');
                           		local.sortie.setIsNonPodded('Y');
                   	   		}
                           
                       }else{
                           if(Structkeyexists(local.autoFillFields,'SERNO') and !len(trim(local.autoFillFields['SERNO']))){
                                if(len(trim(local.results.item['SERNO'][local.row]))){
                   	   			// SERNO value does exist
                   	   			local.sortie.setSerno(local.results.item['SERNO'][local.row]);	
                   	   		}else{
                   	   			// If SERNO value does not exist, then assume NON-PODDED
                   	   			local.sortie.setSerno('NON-PODDED');
                           		local.sortie.setIsNonPodded('Y');
                   	   		}
                           }      
                       }
                   }
                   
                   //Populate SORTIE_EFFECT
                   if(listFindNocase(local.itemColumns,"SORTIE_EFFECT")){
                   	   
                   	   if(len(trim(local.results.item['SORTIE_EFFECT'][local.row]))){
                           local.sortieEffect =   local.results.item['SORTIE_EFFECT'][local.row];
                           local.sortieEffectValue = local.sortieEffect;  
                           local.code = findCodeId('SORTIE_TYPES',local.sortieEffect);
                           if(isNumeric(local.code) and local.code lte 0){
                              ArrayAppend(local.sourceData,"SORTIE_EFFECT: " & local.sortieEffectValue);  
                           }
                           getJavaLoggerProxy().info("SORTIE_EFFECT CODE = '#local.code#', SORTIE_EFFECT VALUE = '#local.sortieEffectValue#'");
                            local.sortie.setSortieEffect(local.code);
                          
                       }else{
                           if(Structkeyexists(local.autoFillFields,'SORTIE_EFFECT') and !len(trim(local.autoFillFields['SORTIE_EFFECT']))){
                                local.sortieEffect =   local.results.item['SORTIE_EFFECT'][local.row];  
                                local.code = findCodeId('SORTIE_TYPES',local.sortieEffect);
                                if(isNumeric(local.code) and local.code lte 0){
                                    ArrayAppend(local.sourceData,"SORTIE_EFFECT: " & local.sortieEffectValue);  
                                    
                                }
                                local.sortie.setSortieEffect(local.code);  
                                getJavaLoggerProxy().info("SORTIE_EFFECT CODE = '#local.code#', SORTIE_EFFECT VALUE = '#local.sortieEffectValue#'");
                           }      
                       }
   
                   }
	               
	               //Populate REMARKS
                   if(listFindNocase(local.itemColumns,"REMARKS")){
                       
                       if(len(trim(local.results.item['REMARKS'][local.row]))){
                           local.sortie.setRemarks(local.results.item['REMARKS'][local.row]);
                       }else{
                           if(Structkeyexists(local.autoFillFields,'REMARKS') and !len(trim(local.autoFillFields['REMARKS']))){
                                local.sortie.setRemarks(local.results.item['REMARKS'][local.row]);
                           }      
                       }	   
   
                   }
                   
                   //Populate IS_NON_PODDED
                   if(listFindNocase(local.itemColumns,"IS_NON_PODDED")){
                       
                       if(len(trim(local.results.item['IS_NON_PODDED'][local.row]))){
                           local.sortie.setIsNonPodded(local.results.item['IS_NON_PODDED'][local.row]);
                       } 
                   }
                   
                   //Populate IS_DEBRIEF
                   if(listFindNocase(local.itemColumns,"IS_DEBRIEF")){
                       
                       if(len(trim(local.results.item['IS_DEBRIEF'][local.row]))){
                           local.sortie.setIsDebrief(local.results.item['IS_DEBRIEF'][local.row]);
                       } 
                   }
                   
                   //Populate IS_LIVE_MONITOR
                   if(listFindNocase(local.itemColumns,"IS_LIVE_MONITOR")){
                       
                       if(len(trim(local.results.item['IS_LIVE_MONITOR'][local.row]))){
                           local.sortie.setIsLiveMonitor(local.results.item['IS_LIVE_MONITOR'][local.row]);
                       } 
                   }
	              
	              if(Arraylen(local.sourceData)){
	                   local.sortie.setSourceData(ArrayToList(local.sourceData));
	              }
                  
                  
                 
                  
				  
	              try{
	              	  
	              	  getJavaLoggerProxy().info("SORTIE_PROPS....#local.sortie.toString()#");
	              	  
                      getSortiesService().createSorties(local.sortie);
                      local.processed++;   
                   }catch(Database e){
                        getUtilities().recordError(e,getMetaData(this).name,"importData");
                        if(isDefined("e.stacktrace") and findnocase("java.sql.SQLIntegrityConstraintViolationException",e.stacktrace)){
                           	   local.constraints++;  
		               	   	   local.sortie.setRemarks('CONSTRAINT');
				               local.sortieFailure.missionId = local.sortie.getMissionId();
				               local.sortieFailure.serno = local.sortie.getSerno();
				               local.sortieFailure.sortieDate = local.sortie.getSortieDate();
				               local.sortieFailure.remarks = "CONSTRAINT";
		                       ArrayAppend(local.sortieFailures, local.sortieFailure);
                        };
                        local.errors++;  
                        continue;	   
	               }catch(any e){
	                   getUtilities().recordError(e,getMetaData(this).name,"importData");
	                   local.errors++;  
		               local.sortie.setRemarks('OTHER');
		               local.sortieFailure.missionId = local.sortie.getMissionId();
		               local.sortieFailure.serno = local.sortie.getSerno();
		               local.sortieFailure.sortieDate = local.sortie.getSortieDate();
		               local.sortieFailure.remarks = "OTHER";
	                   ArrayAppend(local.sortieFailures, local.sortieFailure);
	                      
	                   continue;  
   
	               }
	                 	   
	           }
                
               local.results['importResult'] = {
                     'total' = local.total & "",
                     'constraints' = local.constraints & "",
                     'processed' = local.processed & "",
                     'errors' = local.errors & ""   
                  }; 
                  local.results['importFailures'] = local.sortieFailures;
                
	           local.results['success'] = true; 
     
		   }catch(any e){
		   	  local.result.success = false;
              local.result.message = e.message; 
              getUtilities().recordError(e,getMetaData(this).name,"importData",true); 
              rethrow;
		   }
		   
		}
		
		return local.results;
	
	}
	
	public string function findCodeId(required string codeType,required string codeValue){
	   var local = {};
	   	local.codeId = "";
	   	try{
	   	local.codeQry =  getCodeService().getCodeByREValue(arguments.codeType,arguments.codeValue);
	   	local.codeId = trim(local.codeQry.getCodeId());
	   	}catch(any e){
	   	   local.codeId = "";
	   	   getUtilities().recordError(e,getMetaData(this).name,"findCodeId");
	   	   
	   	} 
	   return local.codeId;
	}
	
	public void function cleanUp(){
        var local = {};
        var deleteOldFiles = '';
        local.threadName = createUUID();
        
         deleteOldFiles = DirectoryList(getDirectory() ,false,"query","*.xls|*.xlsx|*.mdb|*.accdb");
         local.qry = new query();
	     local.qry.setName("tempDelete");
	     local.qry.setDBType("query");
	     local.qry.setAttributes(deleteOldFiles = deleteOldFiles);
	     local.qry.addParam(name="currentDate", value=DateFormat(DateAdd("d","-1",now()),"mm/dd/yyyy"), cfsqltype="CF_SQL_DATE");
	     local.qry.setSql("SELECT * from deleteOldFiles where cast([DATELASTMODIFIED] as integer) <= cast(:currentDate as integer)");
	     local.qResult=local.qry.execute().getresult();
	     
	     for (local.row = 1 ;local.row <= local.qResult.RecordCount;local.row++){
	        try{
	            local.filePath = local.qResult["directory"][local.row] & "/" & local.qResult["name"][local.row]; 
	            fileDelete(local.filePath);
	        }catch(any e){
	            continue;
	        }
	     }

    }
   
   public struct function uploadSortie(String action="",String formField=""){
        var local = {};
        local.uploadResults = {};
        
        if(!len(trim(ARGUMENTS.action))){
            throw(message="Please select a file type", type="UnknownImportType");	
        }

        
        if(!len(trim(ARGUMENTS.formField))){
            local.uploadResults = upload(argumentCollection=ARGUMENTS);            
        }

        return local.uploadResults;
             	   
   }
   
   public any function getSortieColumns(){
        var local = {};
        local.sortieColumns =[
           'MISSION_ID',
           'AC_TAILNO',
           'SERNO',
           'SDATE',
           'AC_STATION',
           'AC_TYPE',
           'CURRENT_UNIT',
           'RANGE',
           'SORTIE_EFFECT',
           'REMARKS',
           'REASON'
        ];
        return local.sortieColumns;	   
   }
      
   public void function xmlDeleteNodes(required any xmlDocument,any nodes){
       var local = {};
       
       if(not isArray(arguments.nodes)){
           local.node = ARGUMENTS.nodes;
           ARGUMENTS.nodes = [local.node];     
       }
       
       for(local.nodeIndex = ArrayLen(ARGUMENTS.nodes);local.nodeIndex >=1;local.nodeIndex--){
           local.Node = ARGUMENTS.Nodes[ local.NodeIndex ];
            if(StructKeyExists( LOCAL.Node, "XmlChildren" )){
               local.Node.XmlAttributes[ "delete-me-flag" ] = "true";       
            }else{
                ArrayDeleteAt(ARGUMENTS.Nodes,local.NodeIndex);
            }   
       }
       
       for(local.node in ARGUMENTS.Nodes){
           local.ParentNodes = XmlSearch( local.Node, "../" );
           if(ArrayLen( LOCAL.ParentNodes ) AND StructKeyExists( LOCAL.ParentNodes[ 1 ], "XmlChildren" )){
               local.ParentNode = local.ParentNodes[1]; 
               
               for(local.nodeIndex = ArrayLen(local.ParentNode.XmlChildren);local.nodeIndex >=1;local.nodeIndex--){
                   local.Node = local.ParentNode.XmlChildren[ local.NodeIndex ];
                   if(StructKeyExists( local.Node.XmlAttributes, "delete-me-flag" )){
                       ArrayDeleteAt(local.ParentNode.XmlChildren,local.NodeIndex);
                       StructDelete(local.Node.XmlAttributes,"delete-me-flag");   
                   }           
               }
                       
           }              
       }       
        
    } 
    
    public String function outputXmlString(required any document){
       var local = {};
       local.format = createObject("java","org.jdom.output.Format").getPrettyFormat();
       local.xmlOutputter = createObject("java","org.jdom.output.XMLOutputter");
       local.xmlOutputter.setFormat(local.format);
       local.xmlStr = local.xmlOutputter.outputString(ARGUMENTS.document);     
       return local.xmlStr;
    }
    
	
}