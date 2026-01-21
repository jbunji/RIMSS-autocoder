import cfc.model.Attachments;
import cfc.utils.Datasource;

component output="false" displayName="AttachmentsDao" name="AttachmentsDao" {
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
	public any function create(required Attachments newAttachments) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var path = #ExpandPath(#UCase(application.rootpath)#&'/'&#application.sessionManager.getUserName()#&'/'&#arguments.newAttachments.getName()#)#;
        //var path = getTempDirectory() & arguments.newAttachments.getName();
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.ATTACHMENTS ( " &
                    "ATT_ID, ASSET_ID, REPAIR_ID, NAME,  " & 
                    "ATTACHMENT, CONTENT_TYPE, DESCRIPTION, INS_BY, INS_DATE,  " & 
                    "CHG_BY, CHG_DATE, VALID, VAL_BY, VAL_DATE )" &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		cleanFileName = reReplace(arguments.newAttachments.getName(),"[^a-zA-Z0-9\._]","","ALL");

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getAttId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getAttId()) and !len(trim(arguments.newAttachments.getAttId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getAssetId()) and !len(trim(arguments.newAttachments.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getRepairId()) and !len(trim(arguments.newAttachments.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(cleanFileName)),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getName()) and !len(trim(arguments.newAttachments.getName()))) ? "true" : "false");
        local.q.addParam(value=FileReadBinary(path),cfsqltype="CF_SQL_BLOB",null=(IsNull(arguments.newAttachments.getName()) and !len(trim(arguments.newAttachments.getName()))) ? "true" : "false");
        //local.q.addParam(value=FileReadBinary(arguments.newAttachments.getThumbnail()),cfsqltype="CF_SQL_BLOB",null=(IsNull(arguments.newAttachments.getThumbnail()) and !len(trim(arguments.newAttachments.getThumbnail()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getContentType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getContentType()) and !len(trim(arguments.newAttachments.getContentType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getDescription()) and !len(trim(arguments.newAttachments.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getInsBy()) and !len(trim(arguments.newAttachments.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newAttachments.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAttachments.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getChgBy()) and !len(trim(arguments.newAttachments.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newAttachments.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAttachments.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getValid()) and !len(trim(arguments.newAttachments.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAttachments.getValBy()) and !len(trim(arguments.newAttachments.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newAttachments.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAttachments.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        
        try {
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;
        } catch (any e) {
        	throw(type="CreateException", message=e.message);
        }
        
        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="AttachmentsDao could not insert the following record: #arguments.newAttachments.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string attId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Attachments();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.attId = arguments.attId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AttachmentsDao could not find the following record: Att_Id[#arguments.attId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Attachments();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AttachmentsDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }
    
    public Query function readByRepairId(required string repairId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Attachments();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.repairId = arguments.repairId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AttachmentsDao could not find the following record: ROWID[#arguments.repairId#]");
        }
    }

	/* update */
	public void function update(required Attachments chgAttachments) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.ATTACHMENTS SET " & 
                    "ASSET_ID = ?, REPAIR_ID = ?, NAME = ?, ATTACHMENT = ?,  " &
                    "THUMBNAIL = ?, CONTENT_TYPE = ?, DESCRIPTION = ?, INS_BY = ?,  " &
                    "INS_DATE = ?, CHG_BY = ?, CHG_DATE = ?, VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?  " &
                "WHERE ATT_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getAssetId()) and !len(trim(arguments.chgAttachments.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getRepairId()) and !len(trim(arguments.chgAttachments.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getName()) and !len(trim(arguments.chgAttachments.getName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getAttachment())),cfsqltype="CF_SQL_BLOB",null=(IsNull(arguments.newAttachments.getAttachment()) and !len(trim(arguments.newAttachments.getAttachment()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAttachments.getThumbnail())),cfsqltype="CF_SQL_BLOB",null=(IsNull(arguments.newAttachments.getThumbnail()) and !len(trim(arguments.newAttachments.getThumbnail()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getContentType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getContentType()) and !len(trim(arguments.chgAttachments.getContentType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getDescription()) and !len(trim(arguments.chgAttachments.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getInsBy()) and !len(trim(arguments.chgAttachments.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAttachments.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAttachments.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getChgBy()) and !len(trim(arguments.chgAttachments.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAttachments.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAttachments.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getValid()) and !len(trim(arguments.chgAttachments.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getValBy()) and !len(trim(arguments.chgAttachments.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAttachments.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAttachments.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAttachments.getAttId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAttachments.getAttId()) and !len(trim(arguments.chgAttachments.getAttId()))) ? "true" : "false");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="AttachmentsDao could not update the following record: #arguments.chgAttachments.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string attId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.ATTACHMENTS " &
                "WHERE ATT_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.attId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="AttachmentsDao could not delete the following record: Att_Id[#arguments.attId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ATT_ID, ASSET_ID, REPAIR_ID, NAME, ATTACHMENT,  " & 
                    "THUMBNAIL, CONTENT_TYPE, DESCRIPTION, INS_BY, INS_DATE,  " & 
                    "CHG_BY, CHG_DATE,  VALID, VAL_BY, VAL_DATE  " &
                "FROM GLOBALEYE.ATTACHMENTS ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"attId")) {
            if (whereClauseFound) {
                local.sql &= " AND ATT_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ATT_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.attId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"rowId")) {
            if (whereClauseFound) {
                local.sql &= " AND ROWIDTOCHAR(ROWID) = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ROWIDTOCHAR(ROWID) = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.rowId),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"repairId")) {
            if (whereClauseFound) {
                local.sql &= " AND REPAIR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE REPAIR_ID = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.repairId),cfsqltype="CF_SQL_VARCHAR");
        }

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
