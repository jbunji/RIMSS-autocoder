import cfc.dao.MsgTransmitDao;
import cfc.factory.ObjectFactory;
import cfc.model.MsgTransmit;
import cfc.utils.Datasource;


component output="false" hint="CFBuilder-Generated:MSG_TRANSMIT" displayName="MsgTransmitService" name="MsgTransmitService" {

     variables.instance = {
        MsgTransmitDao = '',
        objectFactory = ''
    };

	/* init */
    public function init(required Datasource datasource) {
        variables.instance.MsgTransmitDao = new MsgTransmitDao(arguments.datasource);
        /* return success */
        return this;
    }
    
    public any function getObjectFactory(){
        if(isSimpleValue(variables.instance.objectFactory)){
           variables.instance.objectFactory = APPLICATION.objectFactory;    
        }   
        return variables.instance.objectFactory;      
    }
    
    public any function newMsgTransmit(){
        return new MsgTransmit();      
    }
    
	/* MSGTRANSMIT SERVICES */

	
	/* Create MSG_TRANSMIT */
	remote MsgTransmit function createMsgTransmit(MsgTransmit item) {
		/* Auto-generated method 
		  Insert a new record in MSG_TRANSMIT 
		  Add authorization or any logical checks for secure access to your data */
		var idcol=variables.instance.MsgTransmitDao.create(arguments.item);
        var qry = variables.instance.MsgTransmitDao.readByRowId(idcol);
        var msgTransmit = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.msgTransmit;

	}
	
	
	/* Delete MsgTransmit */
	remote void function deleteMsgTransmit(numeric msgId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.MsgTransmitDao.delete(arguments.msgId); 

		/* return success */
		return;
	}

	/* Get MsgTransmit */
	remote MsgTransmit function getMsgTransmit(numeric msgId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */

		/* return item */
		
		var qry = variables.instance.MsgTransmitDao.read(arguments.msgId);
        var obj = loadObjectFromQuery(qry);  

        /* return item */
        return local.obj;

	}
	
	/* Get MsgTransmit By SysId */
    remote any function getMsgTransmitBySysId(string sysId, string startDate, string stopDate) {
    	var local = {};
    	local.dbUtils = getObjectFactory().create("DBUtils");
        local.qry = local.dbUtils.getMessagesBySysId(argumentCollection = ARGUMENTS);
        return local.qry;
    }
	
	/* Update MSG_TRANSMIT */
	remote MsgTransmit function updateMsgTransmit(MsgTransmit item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update MSG_TRANSMIT */
		variables.instance.MsgTransmitDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}

	/* Count MSG_TRANSMIT */
	remote numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.MsgTransmitDao.count(); 
	}
	
	
    private MsgTransmit function loadObjectFromQuery (required Query resultSet) {
        var obj = '';
        var qry = ARGUMENTS.resultSet;
        //load query result into MsgTransmit object
        local.obj = new MsgTransmit();
        local.obj.setMsgId(qry.MSG_ID[1]);
        local.obj.setMsgText(qry.MSG_TEXT[1]);
        local.obj.setInsBy(qry.INS_BY[1]);
        local.obj.setInsDate(qry.INS_DATE[1]);
        local.obj.setStartDate(qry.START_DATE[1]);
        local.obj.setStopDate(qry.STOP_DATE[1]);
        local.obj.setActive(qry.ACTIVE[1]);
        local.obj.setPriority(qry.PRIORITY[1]);
        local.obj.setLocId(qry.LOC_ID[1]);
        local.obj.setSysId(qry.SYS_ID[1]);
        local.obj.setFromUser(qry.FROM_USER[1]);
        local.obj.setToUser(qry.TO_USER[1]);
        local.obj.setChgBy(qry.CHG_BY[1]);
        local.obj.setChgDate(qry.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';
        var qry = ARGUMENTS.resultSet;
        //load query results into an array of MsgTransmit
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
            local.obj = new MsgTransmit();
            local.obj.setMsgId(qry.MSG_ID[row]);
	        local.obj.setMsgText(qry.MSG_TEXT[row]);
	        local.obj.setInsBy(qry.INS_BY[row]);
	        local.obj.setInsDate(qry.INS_DATE[row]);
	        local.obj.setStartDate(qry.START_DATE[row]);
	        local.obj.setStopDate(qry.STOP_DATE[row]);
	        local.obj.setActive(qry.ACTIVE[row]);
	        local.obj.setPriority(qry.PRIORITY[row]);
	        local.obj.setLocId(qry.LOC_ID[row]);
	        local.obj.setSysId(qry.SYS_ID[row]);
	        local.obj.setFromUser(qry.FROM_USER[row]);
	        local.obj.setToUser(qry.TO_USER[row]);
	        local.obj.setChgBy(qry.CHG_BY[row]);
	        local.obj.setChgDate(qry.CHG_DATE[row]);
            
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
	

} 
