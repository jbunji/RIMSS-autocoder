import cfc.model.MsgTransmit;
import cfc.utils.Datasource;

component output="false" displayName="MsgTransmitDao" name="MsgTransmitDao" {
	variables.instance = {
        datasource = 0
    };
		
	/* Auto-generated method
		         Add authroization or any logical checks for secure access to your data */
	/* init */
	public any function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;
        return this ;
    }
    
    /* retrieve datasource object from variables.instance */
    private any function getDatasource() {
        return variables.instance.datasource;
    }
	
	/* create */
	public any function create(MsgTransmit aMsgTransmit) {
		/* Auto-generated method
		         Add authroization or any logical checks for secure access to your data */
		var local = {};
		var IdentityCol="";
		
		var qry="";
        var sql="INSERT INTO GLOBALEYE.MSG_TRANSMIT ( " &
                    "MSG_TEXT, INS_BY, INS_DATE, START_DATE,  " & 
                    "STOP_DATE, ACTIVE, PRIORITY, LOC_ID, SYS_ID,  " & 
                    "FROM_USER, TO_USER) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
		q.setDatasource(getDatasource().getDsName());
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getMsgText())),cfsqltype="CF_SQL_VARCHAR");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getInsBy())),cfsqltype="CF_SQL_VARCHAR");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getInsDate())),cfsqltype="CF_SQL_TIMESTAMP");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getStartDate())),cfsqltype="CF_SQL_TIMESTAMP");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getStopDate())),cfsqltype="CF_SQL_TIMESTAMP");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getActive())),cfsqltype="CF_SQL_CHAR");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getPriority())),cfsqltype="CF_SQL_VARCHAR");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getLocId())),cfsqltype="CF_SQL_VARCHAR");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getSysId())),cfsqltype="CF_SQL_VARCHAR");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getFromUser())),cfsqltype="CF_SQL_VARCHAR");
        q.addParam(value=ucase(trim(arguments.aMsgTransmit.getToUser())),cfsqltype="CF_SQL_VARCHAR");
		q.setsql(sql);
		qry=local.q.execute();
		local.recordcount = qry.getPrefix().RECORDCOUNT;
		
		
		if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="SortiesDao could not insert the following record: #arguments.newSorties.toString()#");
        }
	  		

		/* return IdentityCol */
		return IdentityCol;
	}
	
	/* read */
	public Query function read(numeric msgId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var filter = {};
        var msg = "";
        var qry="";

		local.filter.msgId = arguments.msgId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="MsgTransmitDao could not find the following record: Msg_id[#arguments.msgId#]");
        }
    }

    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new MsgTransmit();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.rowId = arguments.rowId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="MsgTransmitDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }
    
	/* update */
	public void function update(MsgTransmit aMsgTransmit) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
		var local = {};
		var qry="";

        var sql="UPDATE GLOBALEYE.MSG_TRANSMIT SET " & 
                    "MSG_TEXT = ?, INS_BY = ?, INS_DATE = ?, START_DATE = ?,  " &
                    "STOP_DATE = ?, ACTIVE = ?, PRIORITY = ?, LOC_ID = ?, SYS_ID = ?,  " &
                    "FROM_USER = ?, TO_USER = ?, CHG_BY = ?, CHG_DATE = ? " &
                "WHERE MSG_ID = ? ";
        
       local.q=new query();
        
		/* update database */
		local.q.setDatasource(getDatasource().getDsName());
		
		local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getMsgText())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getMsgText()) and !len(trim(arguments.aMsgTransmit.getMsgText()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getInsBy()) and !len(trim(arguments.aMsgTransmit.getInsBy()))) ? "true" : "false");
        
        if (IsDate(arguments.aMsgTransmit.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.aMsgTransmit.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }

        
        if (IsDate(arguments.aMsgTransmit.getStartDate())) {
            local.q.addParam(value=ParseDateTime(arguments.aMsgTransmit.getStartDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (IsDate(arguments.aMsgTransmit.getStopDate())) {
            local.q.addParam(value=ParseDateTime(arguments.aMsgTransmit.getStopDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getActive()) and !len(trim(arguments.aMsgTransmit.getActive()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getPriority())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getPriority()) and !len(trim(arguments.aMsgTransmit.getPriority()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getLocId()) and !len(trim(arguments.aMsgTransmit.getLocId()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getSysId()) and !len(trim(arguments.aMsgTransmit.getSysId()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getFromUser())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getFromUser()) and !len(trim(arguments.aMsgTransmit.getFromUser()))) ? "true" : "false"); 
        
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getToUser())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getToUser()) and !len(trim(arguments.aMsgTransmit.getToUser()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.aMsgTransmit.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.aMsgTransmit.getChgBy()) and !len(trim(arguments.aMsgTransmit.getChgBy()))) ? "true" : "false");       
        
        if (IsDate(arguments.aMsgTransmit.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.aMsgTransmit.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }

		q.addParam(value=val(trim(arguments.aMsgTransmit.getMsgId())),cfsqltype="CF_SQL_VARCHAR");
		q.setsql(sql);
	    qry=q.execute().getresult();		
	}
	
	/* delete */
	public void function delete(numeric msgId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.MSG_TRANSMIT " &
                "WHERE MSG_ID = ?  ";

		/* delete from database */
		q.setDatasource(getDatasource().getDsName());
        q.addParam(value=val(trim(arguments.msgId)),cfsqltype="CF_SQL_VARCHAR");        
		q.setsql(sql);
		qry=q.execute().getresult();
	}
	
	private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT MSG_ID, MSG_TEXT, INS_BY, INS_DATE, START_DATE,  " & 
                    "STOP_DATE, ACTIVE, PRIORITY, LOC_ID, SYS_ID,  " & 
                    "FROM_USER, TO_USER, CHG_BY, CHG_DATE " &
                "FROM GLOBALEYE.MSG_TRANSMIT ";

        objQuery.setDatasource(getDatasource().getDsName());

        if (StructKeyExists(arguments.filter,"msgId")) {
            if (whereClauseFound) {
                local.sql &= " AND MSG_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE MSG_ID = ? ";
            }
            objQuery.addParam(value=val(trim(arguments.filter.msgId)),cfsqltype="CF_SQL_NUMERIC");
        }
        
        if (StructKeyExists(arguments.filter,"sysId")) {
            if (whereClauseFound) {
                local.sql &= " AND SYS_ID IN( ? ) ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SYS_ID IN( ? ) ";
            }
            objQuery.addParam(value=trim(arguments.filter.sysId), list="yes", cfsqltype="CF_SQL_NUMERIC");
        }

        if (StructKeyExists(arguments.filter,"rowId")) {
            if (whereClauseFound) {
                local.sql &= " AND ROWIDTOCHAR(ROWID) = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ROWIDTOCHAR(ROWID) = ? ";
            }
            objQuery.addParam(value=trim(arguments.filter.rowId),cfsqltype="CF_SQL_VARCHAR");
        }
        
        //Get Active 
        if (whereClauseFound) {
            local.sql &= " AND ACTIVE = 'Y' ";
        } else {
            whereClauseFound = true;
            local.sql &= " AND ACTIVE = 'Y' ";
        }
        
        local.sql &= " ORDER BY PRIORITY, START_DATE desc nulls last ";
        
        objQuery.setSql(local.sql);
        resultQuery = objQuery.execute().getResult();

        return resultQuery;
    }
	
	
	/* count */
    public numeric function count() {
        var qry = "";
        var q=new query();
        q.setDatasource(getDatasource().getDsName());
        q.setsql('SELECT COUNT(MSG_ID) AS total FROM GLOBALEYE.MSG_TRANSMIT');
        qry=q.execute().getresult();
        return qry.total[1];
    }
	

}
