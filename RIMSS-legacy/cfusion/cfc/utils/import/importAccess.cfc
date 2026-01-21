component  hint="Used to Read/Import Excel and Access files" output="false"
{
	variables.instance = {
	   'file' = '',
	   'directory' = getTempDirectory(),
	   'tempFile' = '',
	   'headers' = [],
	   'tableNames' = [],
	   'tableColumns' = [],
	   'data' = '',
	   'mimeTypes'='application/msaccess,application/x-msaccess,application/vnd.msaccess,application/vnd.ms-access,application/mdb,application/x-mdb,zz-application/zz-winassoc-mdb,application/octet-stream',
	   'currentTable' = 1,
	   'connection' = '',
	   'connMetaData' = '',
	   'summary' ='',
	   'resultSet'='',
	   'statement'=''
	   
	};
	
	
	public any function init(){
	   return this;   	
	}
	
	public any function getFile(){
	   return variables.instance.file;	
	}
	
	public any function setFile(required String file){
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
    
    public any function getCurrentTable(){
       return variables.instance.currentTable; 
    }
    
    public any function setCurrentTable(required numeric currentTable){
       variables.instance.currentTable = trim(ARGUMENTS.currentTable);
       return this; 
    }
    
    public any function getHeaders(){
       return variables.instance.headers; 
    }
    
    public any function setHeaders(required Array headers){
       variables.instance.headers = ARGUMENTS.headers;
       return this; 
    }
    
    public any function getTableNames(){
       return variables.instance.tableNames; 
    }
    
    public any function setTableNames(required Array tableNames){
       variables.instance.tableNames = ARGUMENTS.tableNames;
       return this; 
    }
    
    public any function getTableColumns(){
       return variables.instance.tableColumns; 
    }
    
    public any function setTableColumns(required Array tableColumns){
       variables.instance.tableColumns = ARGUMENTS.tableColumns;
       return this; 
    }
    
    public any function getMimeTypes(){
       return variables.instance.mimeTypes; 
    }
    
    public any function getConnection(){
        return variables.instance.connection;    	
    }
    
    public any function setConnection(required any connection){
        variables.instance.connection = ARGUMENTS.connection;  
        return this;     
    }
    
    public any function getConnMetaData(){
        return variables.instance.connMetaData;       
    }
    
    public any function setConnMetaData(required any connMetaData){
        variables.instance.connMetaData = ARGUMENTS.connMetaData;  
        return this;     
    }
    
    public any function getStatement(){
        return variables.instance.statement;       
    }
    
    public any function setStatement(required any statement){
        variables.instance.statement = ARGUMENTS.statement;  
        return this;     
    }
    
    public any function getResultSet(){
        return variables.instance.resultSet;       
    }
    
    public any function setResultSet(required any resultSet){
        variables.instance.resultSet = ARGUMENTS.resultSet;  
        return this;     
    }
    
    public any function getSummary(){
       return variables.instance.summary; 
    }
    
    public any function setSummary(required any summary){
       variables.instance.summary = ARGUMENTS.summary;
       return this; 
    }
    
    public array function findTableNames(){
        var local = {};	
        local.tableNames = [];
        local.rs = getConnMetaData().getTables(JavaCast("null", ""), JavaCast("null", ""), "%",['TABLE']);
        local.tableNames = [];
        while(local.rs.next()){
            ArrayAppend(tableNames,local.rs.getString("TABLE_NAME"));    	
        }
           setTableNames(local.tableNames);
           return local.tableNames;
    }
    
    public any function readTable(required String tableName,String columns="",String aliases=""){
        var local = {};

        local.sql = "select * from " & "[#ARGUMENTS.tableName#]";
        setStatement(getConnection().createStatement());
        setResultSet(getStatement().executeQuery(local.sql));
        
        return getResultSet();     	
    }
    
    public array function getTableCount(){
        var local = {}; 

        local.count = getConnMetaData().getTables(JavaCast("null", ""), JavaCast("null", ""), "%",['TABLE']).getMetaData().getColumnCount();

        
           return local.count;
    }
    
    public array function findTableColumns(required String tableName){
        var local = {}; 
        local.tableColumns = [];

         local.resultSet = readTable(ARGUMENTS.tableName);
        
        local.rsmd = local.resultSet.getMetaData();

        local.columnCount = local.rsmd.getColumnCount();
        for(local.i = 1;local.i<=local.columnCount;local.i++){
            ArrayAppend(local.tableColumns,local.rsmd.getColumnName(local.i));	
        }

       setTableColumns(local.tableColumns);
       
       closeAll();
       
       return local.tableColumns;
    }
    
    public array function readColumns(required String filePath,required String tableName){
        var local = {}; 
        local.tableColumns = [];
        local.sql = "select * from " & "[#ARGUMENTS.tableName#]";
        createConnection(ARGUMENTS.filePath);
        setStatement(getConnection().createStatement());
        setResultSet(getStatement().executeQuery(local.sql));

        local.rsmd = getResultSet().getMetaData();
        local.columnCount = local.rsmd.getColumnCount();
        for(local.i = 1;local.i<=local.columnCount;local.i++){
            ArrayAppend(local.tableColumns,local.rsmd.getColumnName(local.i));  
        }

       setTableColumns(local.tableColumns);
       
       closeAll();
       
       return local.tableColumns;
    }
    
    public any function getTableRecords(required String filepath, required String tableName,array columns=[],array aliases=[]){
        var local = {};
        
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
            }       
        }
        if(ArrayLen(local.selectedColumns)){
            local.selected = ArrayToList(local.selectedColumns);    
        }

        local.sql = "select #local.selected# from " & "[#ARGUMENTS.tableName#]";

        

        createConnection(ARGUMENTS.filePath);
        setStatement(getConnection().createStatement());
        local.rs = getStatement().executeQuery(local.sql);

         local.read = CreateObject('java','coldfusion.sql.QueryTable').init(local.rs);

        setResultSet(local.read);

        /*//Query of Query to alias the columns based on the mappings
        if(len(trim(local.selected)) and trim(local.selected) neq "*"){
            if(isQuery(local.read)){
                local.qofq = new Query();
                local.qofq.setAttributes(originalRead = local.read);
                local.readqofq = local.qofq.execute(sql="select #local.selected# from originalRead", dbtype="query"); 
                local.read = local.readqofq.getResult();  
                setResultSet(local.read);  
            }       
        }*/
        
        
        return getResultSet();     	
    }
    
    
    
    public any function closeAll(){
        try{
        	
        	if(not isSimpleValue(getConnection())){
                getConnection().close(); 
            }
        	
        	/*if(not isSimpleValue(getResultSet())){
                getResultSet().close();	
            }
            
            if(not isSimpleValue(getStatement())){
                getStatement().close(); 
            }*/
        	
        }catch(any e){
        	
        }	
    }
    
    public void function loadDriver(){
        var local = {};
        local.class = createObject("java", "java.lang.Class");
        local.class.forName("sun.jdbc.odbc.JdbcOdbcDriver");    	
        local.error="";
    }
    
    public any function createConnection(required String filePath){
        var local = {};
        loadDriver();
         
        local.conn = createObject("java","java.sql.DriverManager").getConnection("jdbc:odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=#ARGUMENTS.filePath#");
   
        setConnection(local.conn);
        setConnMetaData(local.conn.getMetaData());
        return local.conn;	
    }

    public any function upload(required String formField){
      
       local.temp = getTempDirectory();	
       local.upload = FileUpload(getDirectory(),ARGUMENTS.formField,getMimeTypes(),"MakeUnique");	
       if(isStruct(local.upload) and Structkeyexists(local.upload,"filewassaved") and local.upload.fileWasSaved){
            local.filePath = trim(upload.serverDirectory & "/" & upload.serverFile);
            
            setTemporaryFile(local.filePath);
            
            createConnection(getTemporaryFile());

            local.tableNames = findTableNames();
            if(ArrayLen(local.tableNames)){
                findTableColumns(local.tableNames[1]);
            }
            
            setSummary(local.upload);
            closeAll();
                     
       }

       return this; 
    }
    
    public struct function getInstance(){
        return variables.instance;	
    }          	
	
	
}