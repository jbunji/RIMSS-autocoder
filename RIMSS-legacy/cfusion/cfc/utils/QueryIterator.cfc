/*
#######################################################################################################
SVN: $Id: QueryIterator.cfc 2234 2013-07-10 15:29:03Z Andrew.Abbott $
Filename: QueryIterator.cfc 
Author(s): andrew.abbott 
Email: andrew.abbott@robins.af.mil
Version:0.1
Date Created: 6/19/2013 16:05:17
Description: Iterator for Queries
Notes:
------------
    	
	
	
Updates:
------------
	
#######################################################################################################
*/

component {
    
    
  
  public any function init( query q ){
    variables.recordcount = 0;
    variables.cursor = 0;
    if ( StructKeyExists( arguments, "q" ) ){
      setQuery( arguments.q );
    }
    return this;
  }

  
  
  /* Iterator methods
  ------------------------------------------------------------------------*/
  
  public  any function setQuery( required query q ){
    var row = 1;
    var col = 1;
    var colStruct = {};
    var columnList = [];
    var column = "";
    
    variables.query = arguments.q;
    variables.columnMapping = {};
    variables.recordset = [];
    variables.colStruct = {}; 
    columnList = ListToArray(ARGUMENTS.q.columnlist);
    
    
    //Create Column Mapping   
    for (column in columnList ){
        variables.columnMapping[Replace(column,"_","","ALL")] = column;	  
    }
    
    variables.recordcount = variables.query.recordCount;
    return this;
  }

  // resets cursor counter
  public any function reset(){
    variables.cursor = 0;
    return this;	  
  }
  
  // ends cursor counter
  public any function end(){
    variables.cursor = count(); 
    return this;    
  }
 
  // returns true if not at the end of the records
  public boolean function hasNext(){
    if ( count() > variables.cursor ){
      return true;
    }else{
      return false;
    }
  }
  
   // returns true if not at the end of the records
  public boolean function hasPrevious(){
  	var checkCursor = variables.cursor - 1;
  	var total = count();
    if ( total-(total-checkCursor) > 0 ){
      return true;
    }else{
      return false;
    }
  }
 
 
  // returns true if not at the end of the records or iterator object
  public any function next(boolean returnIterator = false){
  	 var result = ""; 
    if ( hasNext() ){
    variables.cursor++; 	
      result =  true;
    }else{
      result = false;
    }
    
    if(ARGUMENTS.returnIterator){
        return this;	
    }else{
        return result;	
    }
    
  }
  
  // returns true if not at the end of the records or iterator object
  public any function previous(boolean returnIterator = false){
  	var checkCursor = variables.cursor - 1;
  	var total = count();  
  	var result = ""; 
    if (hasPrevious()){
      variables.cursor--;     
      result =  true;
    }else{
      result =  false;
    }
    
    if(ARGUMENTS.returnIterator){
        return this;    
    }else{
        return result;  
    }
    
  }
  
  // returns the current cursor.
  public any function getCursor(){
    return variables.cursor;
  }
  
  // returns the recordcount.
  public any function count(){
    return variables.recordcount;
  }
  
  //returns the query columns (getters can reference columns with or without underscores)
  public any function getColumns(){
    if ( isDefined("variables.query") && isQuery(variables.query) ){
        return ArrayToList(variables.query.getColumnNames());
    }else{
        return "";
    }
  }
  
  //returns a structure representing the current row based on the cursor position
  public any function getRow(){
  	 var keys = ListToArray(getColumns());
  	 var rowStruct = {};
    if ( variables.recordcount >= variables.cursor){
        for(var col in keys){
        	if(variables.cursor > 0){
                rowStruct[replace(col,"_","","ALL")] = variables.query[col][variables.cursor];
            }else{
            	rowStruct[replace(col,"_","","ALL")] = variables.query[col];
            }
        }   
    }
    return rowStruct;
  }
  
  // returns the value for current cursor position 
  public any function get( required string key ){
  	var local = {};
  	local.column = trim(ARGUMENTS.key);
  	local.result = "";
  	if(!findnocase("_",ARGUMENTS.key)){
  	     if(Structkeyexists(variables.columnMapping,trim(ARGUMENTS.key))){
  	     	 local.column = variables.columnMapping[trim(ARGUMENTS.key)];
  	     	 if(variables.cursor && count() >= variables.cursor){
  	             local.result = variables.query[local.column][ variables.cursor ]; 
  	         }else{
  	             local.result = variables.query[local.column]; 	  
  	              
  	         }         	   
  	     }	
  	     
  	}else{
  	     if(findnocase(local.column,variables.query.columnlist)){
  	         if(variables.cursor && count() >= variables.cursor){
                 local.result = variables.query[local.column][ variables.cursor ]; 
             }else{
                 local.result = variables.query[local.column];      
             }            
  	     } 	
  		
  	}
  	return local.result;
	  
    /*if(count() && Structkeyexists(variables.recordset[variables.cursor],key)){    
        return variables.recordset[ variables.cursor ][ key ];
    }else{
        return "";	
    }*/
    
  }

  // returns an array of structs, only here for debugging
  public array function getRows(){
    return variables.query;
  }
  
  /* Allow for get*key*() style calls without needing to create getters 
  ------------------------------------------------------------------------*/
  public any function onMissingMethod( missingMethodName, missingMethodArguments ){
    var prefix = Left( arguments.missingMethodName, 3 );
    if ( "get" == prefix ){
    	
      var key = replace(Right(arguments.missingMethodName, len( trim(arguments.missingMethodName) ) - 3 ),"_","","ALL");
      return get( key );      
    }
    else{	
      throw "Method '#arguments.missingMethodName#' not found";
    }
  }
  
}