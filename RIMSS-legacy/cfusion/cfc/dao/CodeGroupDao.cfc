import cfc.model.CodeGroup;
import cfc.utils.Datasource;

component output="false" displayName="CodeGroupDao" name="CodeGroupDao" {
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
	public any function create(required CodeGroup newCodeGroup) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.CODE_GROUP ( " &
                    "CDGRP_ID, GROUP_CD, CODE_ID, INS_BY, INS_DATE,  " & 
                    "SORT_ORDER, DESCRIPTION) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCodeGroup.getCdgrpId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeGroup.getCdgrpId()) and !len(trim(arguments.newCodeGroup.getCdgrpId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeGroup.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeGroup.getGroupCd()) and !len(trim(arguments.newCodeGroup.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeGroup.getCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeGroup.getCodeId()) and !len(trim(arguments.newCodeGroup.getCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeGroup.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeGroup.getInsBy()) and !len(trim(arguments.newCodeGroup.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newCodeGroup.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCodeGroup.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCodeGroup.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeGroup.getSortOrder()) and !len(trim(arguments.newCodeGroup.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeGroup.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeGroup.getDescription()) and !len(trim(arguments.newCodeGroup.getDescription()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="CodeGroupDao could not insert the following record: #arguments.newCodeGroup.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string cdgrpId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new CodeGroup();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.cdgrpId = arguments.cdgrpId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeGroupDao could not find the following record: Cdgrp_Id[#arguments.cdgrpId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CodeGroup();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeGroupDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required CodeGroup chgCodeGroup) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.CODE_GROUP SET " & 
                    "GROUP_CD = ?, CODE_ID = ?, INS_BY = ?, INS_DATE = ?,  " &
                    "SORT_ORDER = ?, DESCRIPTION = ? " &
                "WHERE CDGRP_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgCodeGroup.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeGroup.getGroupCd()) and !len(trim(arguments.chgCodeGroup.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeGroup.getCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeGroup.getCodeId()) and !len(trim(arguments.chgCodeGroup.getCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeGroup.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeGroup.getInsBy()) and !len(trim(arguments.chgCodeGroup.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCodeGroup.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCodeGroup.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCodeGroup.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeGroup.getSortOrder()) and !len(trim(arguments.chgCodeGroup.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeGroup.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeGroup.getDescription()) and !len(trim(arguments.chgCodeGroup.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeGroup.getCdgrpId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CodeGroupDao could not update the following record: #arguments.chgCodeGroup.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string cdgrpId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.CODE_GROUP " &
                "WHERE CDGRP_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.cdgrpId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CodeGroupDao could not delete the following record: Cdgrp_Id[#arguments.cdgrpId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT CDGRP_ID, GROUP_CD, CODE_ID, INS_BY, INS_DATE,  " & 
                    "SORT_ORDER, DESCRIPTION " &
                "FROM GLOBALEYE.CODE_GROUP ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"cdgrpId")) {
            if (whereClauseFound) {
                local.sql &= " AND CDGRP_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CDGRP_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.cdgrpId)),cfsqltype="CF_SQL_VARCHAR");
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

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
