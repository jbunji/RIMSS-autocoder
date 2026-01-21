component  hint="Used to Read/Import Excel files" output="false"
{
	import cfc.utils.tagLib;
	import cfc.utils.utilities;
	
	variables.instance = {
	   'file' = '',
	   'directory' = getTempDirectory(),
	   'tempFile' = '',
	   'headers' = [],
	   'sheetNames' = [],
	   'data' = '',
	   'summary'={},
	   'mimeTypes'='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	   'currentSheet' = 1
	};
	
	
	public any function init(){
	   return this;   	
	}
	
	public any function getExcelFile(){
	   return variables.instance.excelFile;	
	}
	
	public any function setExcelFile(required String file){
       variables.instance.file = trim(ARGUMENTS.file);
       return this; 
    }
    
    public any function getDirectory(){
       return variables.instance.directory; 
    }
    
    public any function setDirectory(required String directory){
    
        if(not directoryExists(ARGUMENTS.directory)){
           DirectoryCreate(ARGUMENTS.directory);  
        }   	
       variables.instance.directory = trim(ARGUMENTS.directory);
       return this; 
    }
    
    public any function getTemporaryFile(){
       return variables.instance.tempFile; 
    }
    
    public any function setTemporaryFile(required String tempFile){
       variables.instance.tempFile = trim(ARGUMENTS.tempFile);
       return this; 
    }
    
    public any function getCurrentSheet(){
       return variables.instance.currentSheet; 
    }
    
    public any function setExcelCurrentSheet(required numeric currentSheet){
       variables.instance.currentSheet = trim(ARGUMENTS.currentSheet);
       return this; 
    }
    
    public any function getHeaders(){
       return variables.instance.headers; 
    }
    
    public any function setHeaders(required Array headers){
       variables.instance.headers = ARGUMENTS.headers;
       return this; 
    }
    
    public any function getSheetNames(){
       return variables.instance.sheetNames; 
    }
    
    public any function setSheetNames(required Array sheetNames){
       variables.instance.sheetNames = ARGUMENTS.sheetNames;
       return this; 
    }
    
    public any function getMimeTypes(){
       return variables.instance.mimeTypes; 
    }
    
    public any function getSummary(){
       return variables.instance.summary; 
    }
    
    public any function setSummary(required any summary){
       variables.instance.summary = ARGUMENTS.summary;
       return this; 
    }
    
    
    public any function readExcel(required String filePath,any sheet){
        var local = {};
        local.read = {};
        local.tagLib = new tagLib();
        local.convertToQuery = "";
        setHeaders([]);
        if(Structkeyexists(ARGUMENTS,"sheet") and len(trim(ARGUMENTS.sheet))){
            local.read = SpreadsheetRead(ARGUMENTS.filepath,ARGUMENTS.sheet);
            try{
            	if(isNumeric(ARGUMENTS.sheet)){
                    local.convertToQuery = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheet=trim(ARGUMENTS.sheet));
                }else{
                    local.convertToQuery = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheetName=trim(ARGUMENTS.sheet));	
                }
            }catch(any e){}
        }else{
            local.read = SpreadsheetRead(ARGUMENTS.filepath);
            try{
                local.convertToQuery = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheet=1);
            }catch(any e){}	
        }
        
        if(isQuery(local.convertToQuery)){
            setHeaders(local.convertToQuery.getColumnList());	
        }
        
        return local.read;    	
    }
    
    public any function readSheet(required String filePath,any sheet, array columns=[],array aliases=[]){
        var local = {};
        local.tagLib = new tagLib();
        local.utils = new utilities();
        //local.read = readExcel(argumentCollection=arguments);
        
        try{
            if(isNumeric(ARGUMENTS.sheet)){
                local.read = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheet=trim(ARGUMENTS.sheet));
            }else{
                local.read = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheetName=trim(ARGUMENTS.sheet));    
            }
            
        }catch(any e){}

	        local.columns = ARGUMENTS.columns;
	        local.aliases = ARGUMENTS.aliases;

        
        
        
        
        
        local.selected = "*";
        local.selectedColumns = [];
        
        
        
        if(Arraylen(local.columns) and ArrayLen(local.aliases)){
            for(local.c=1;local.c<=Arraylen(local.columns);local.c++){
            	
            	if(UCASE(TRIM(local.columns[c])) != UCASE(TRIM(local.aliases[c]))){
                    ArrayAppend( local.selectedColumns,"[" & local.columns[c] & "]" & " AS " & local.aliases[c]); 
                    
                }else{
                    ArrayAppend(local.selectedColumns,"[" & local.columns[c] & "]");

    
                }   
            	
                //ArrayAppend(local.selectedColumns,"[" & local.columns[c] & "]" & " AS " & local.aliases[c]);    
            }       
        }
        if(ArrayLen(local.selectedColumns)){
            local.selected = ArrayToList(local.selectedColumns);    
        }

        //Query of Query to alias the columns based on the mappings
        if(len(trim(local.selected)) and trim(local.selected) neq "*"){
            if(isQuery(local.read)){
                local.qofq = new Query();
                local.qofq.setAttributes(originalRead = local.read);
                local.readqofq = local.qofq.execute(sql="select #local.selected# from originalRead", dbtype="query"); 
                local.read = local.readqofq.getResult(); 
            }    	
        }

        return local.read;	
    }
    
    public any function readColumns(required String filePath,any sheet) output=false{
        var local = {};
        local.read = {};
        local.result = [];
        local.tagLib = new tagLib();
        local.convertToQuery = "";
        setHeaders([]);
        
        if(Structkeyexists(ARGUMENTS,"sheet") and len(trim((ARGUMENTS.sheet)))){
            //local.read = SpreadsheetRead(ARGUMENTS.filepath,ARGUMENTS.sheet);
            try{
            	if(isNumeric(ARGUMENTS.sheet)){
                    local.convertToQuery = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheet=trim(ARGUMENTS.sheet));
                }else{
                	local.convertToQuery = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheetName=trim(ARGUMENTS.sheet));
                }
            }catch(any e){ rethrow;}
        }else{
            //local.read = SpreadsheetRead(ARGUMENTS.filepath);
            try{
                local.convertToQuery = local.tagLib.spreadsheetRead(src=ARGUMENTS.filepath, query="temp",headerRow=1,excludeheaderRow=true,sheet=1);
            }catch(any e){}
        }
        
        if(isQuery(local.convertToQuery)){
        	local.result = ListToArray(ArrayToList(local.convertToQuery.getColumnList()));
            setHeaders(local.convertToQuery.getColumnList());
        }
        
        return local.result;      
    }
    
    
    public any function upload(required String formField){
       var local = {};
       setTemporaryFile("");
       
       local.temp = getTempDirectory();	
       local.upload = FileUpload(getTempDirectory(),ARGUMENTS.formField,getMimeTypes(),"MakeUnique");	
       //local.upload = FileUpload(getTempDirectory(),ARGUMENTS.formField);	
       
       if(isStruct(local.upload) and Structkeyexists(local.upload,"filewassaved") and local.upload.fileWasSaved){
            local.filePath = upload.serverDirectory & "/" & upload.serverFile;
            
            setTemporaryFile(local.filePath);
            
            if(IsSpreadsheetFile(local.filePath)){
                local.read = readExcel(local.filePath);
                if(Structkeyexists(local.read,"summaryInfo")){
                    setSummary(local.read);
                    local.summaryInfo = Duplicate(local.read.summaryInfo);
                    if(Structkeyexists(local.summaryInfo,"sheetNames")){
                        setSheetNames(ListToArray(local.summaryInfo.sheetNames));
                    } 
                }   
   	
            }
                 
       }

       return this; 
    }
    
    public struct function getInstance(){
        return variables.instance;	
    }          	
	
	
	
	
}