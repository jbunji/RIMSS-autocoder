import cfc.utils.javaLoggerProxy;

component displayname="DbLookups" {
    variables.instance = {};
    variables.instance = {
        javaLoggerProxy = new  javaLoggerProxy(),
        dbUtils = "",
        typeCodes = {
            tmCode = "TYPE_MAINT",
            wdCode = "WHEN_DISC",
            hmCode = "HOW_MAL",
            pmiHmCode = "PMI_HOW_MAL",
            atCode = "ACTION_TAKEN",
            unitCode = "UNIT",
            rangeCode = "ACTS_RANGES",
            sortieEffectCode = "SORTIE_TYPES",
            acTypeCode = "ACFT_TYPE",
            pmiCode = 'PMI_TYPE'
        }
    };


    /* init */
    public any function init() output=false {
        return this;
    }

    private any function getDbUtils() {
       return application.objectFactory.create("DBUtils");
    }

    private any function getJavaLoggerProxy() {
       return variables.instance.javaLoggerProxy;      
    }
    
    private any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")) {
           variables.instance.componentName = getMetaData(this).name;   
        }
        return variables.instance.componentName;      
    }

    private any function getTypeCodes() {
        return variables.instance.typeCodes;
    }

    private any function getCodeTypeValue(required string typeCodeKey) {
        var local = {};
        local.keys = StructFindKey(getTypeCodes(),arguments.typeCodeKey,"all");
        if (ArrayLen(local.keys)) {
            return local.keys[1].value;
        } else {
            return "";
        }
    }

    private Array function populateLookupCodes(required query qry) {
        var local = {};
        local.codes = [];
        for (i = 1; i lte arguments.qry.recordcount; i++) {
            local.code = {};
            local.code.code_id = arguments.qry.CODE_ID[i];
            local.code.code_value = arguments.qry.CODE_VALUE[i];
            local.code.description = arguments.qry.DESCRIPTION[i];
            ArrayAppend(local.codes,local.code);
        }
        return local.codes;
    }

    private Query function lookupCodesByPartno(required string typeCode, required string partno) {
        var local = {};
        
        writeLog(file="HowMal" text="DbLookups - lookupCodesByPartno - CodeTypeValue(#getCodeTypeValue(arguments.typeCode)#)");

        local.sql = "select c.code_id, c.code_value, c.description " &
                    "from globaleye.code c, globaleye.part_list pl, globaleye.partno_code pc, " &
                         "globaleye.code gc " &
                    "where pl.partno_id = pc.partno_id " &
                    "and pc.group_cd = gc.code_id " &
                    "and pc.code_id = c.code_id " &
                    "and pl.partno = ? " &
                    "and gc.code_type = 'GROUP' " &
                    "and gc.code_value = ? " &
                    "order by c.code_value ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.partno,"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam("PARTNO_" & getCodeTypeValue(arguments.typeCode),"CF_SQL_VARCHAR"));

        return getDbUtils().executeQuery(local.sql, local.params);
    }

    private Query function lookupCodesBySystemCat(required string typeCode, required string systemcat) {
        var local = {};

        local.sql = "select cb.code_id, cb.code_value, cb.description " &
                    "from globaleye.code ca, globaleye.code cb, " &
                         "globaleye.code_by_code cbc, globaleye.code gc " &
                    "where gc.code_id = cbc.group_cd " &
                    "and cbc.code_a = ca.code_id " &
                    "and cbc.code_b = cb.code_id " &
                    "and ca.code_value = ? " &
                    "and gc.code_type = 'GROUP' " &
                    "and gc.code_value = ? " &
                    "order by cb.code_value ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.systemcat,"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam("SYSTEMCAT_" & getCodeTypeValue(arguments.typeCode),"CF_SQL_VARCHAR"));

        return getDbUtils().executeQuery(local.sql, local.params);
    }

    private Query function lookupCodesByProgram(required string typeCode, required string program) {
        var local = {};

        local.sql = "select c.code_id, c.code_value, c.description " &
                    "from globaleye.code c, globaleye.code gc, globaleye.code_group cg " &
                    "where cg.group_cd = gc.code_id " &
                    "and cg.code_id = c.code_id " &
                    "and gc.code_type = 'GROUP' " &
                    "and gc.code_value = ? " &
                    "order by c.code_value ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.program & "_" & getCodeTypeValue(arguments.typeCode),"CF_SQL_VARCHAR"));

        return getDbUtils().executeQuery(local.sql, local.params);
    }
    
    private Query function lookupCodeByProgramHowMal(required string typeCode, required string program) {
        var local = {};

        local.sql = "select cb.code_id, cb.code_value, cb.description " &
                    "from globaleye.code_by_code cbc, globaleye.code gp, GLOBALEYE.CODE ca, globaleye.code cb " &
                    "where cbc.group_cd = gp.code_id " &
                    "and cbc.code_a = ca.code_id " &
                    "and gp.code_type = 'GROUP' " &
                    "and gp.code_value = 'HM_BY_SYS' " &
                    "and cbc.code_b = cb.code_id " &
                    "and ca.code_value = ? " &
                    "order by cb.code_value ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.program,"CF_SQL_VARCHAR"));

        return getDbUtils().executeQuery(local.sql, local.params);
    }

    private Array function populateLookupTctos(required query qry) {
        var local = {};
        local.tctos = [];
        for (i = 1; i lte arguments.qry.recordcount; i++) {
            local.tcto = {};
            local.tcto.tcto_id = arguments.qry.TCTO_ID[i];
            local.tcto.ct_tcto_id = arguments.qry.CT_TCTO_ID[i];
            local.tcto.tcto_no = arguments.qry.TCTO_NO[i];
            local.tcto.eff_date = arguments.qry.EFF_DATE[i];
            ArrayAppend(local.tctos,local.tcto);
        }
        return local.tctos;
    }

    private Query function lookupTctosByPartno(required string program, required string partno) {
        var local = {};

        local.sql = "select t.tcto_id, it.tcto_id ct_tcto_id, t.tcto_no, to_char(t.eff_date,'dd-MON-yyyy') eff_date " &
                    "from globaleye.tcto t, globaleye.part_list pl, core_tables.inv_tcto it, " &
                         "globaleye.code pgm " &
                    "where t.old_partno_id = pl.partno_id " &
                    "and t.tcto_no = it.tcto_no(+) " &
                    "and t.pgm_id = pgm.code_id " &
                    "and pgm.code_type = 'PROGRAM_ID' " &
                    "and pgm.code_value = ? " &
                    "and pl.partno = ? " & 
                    "and t.active = 'Y' " &
                    "order by t.tcto_no ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.program,"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.partno,"CF_SQL_VARCHAR"));

        return getDbUtils().executeQuery(local.sql, local.params);
    }

    private Query function lookupTctosBySystemCat(required string program, required string systemcat) {
        var local = {};

        local.sql = "select t.tcto_id, it.tcto_id ct_tcto_id, t.tcto_no, to_char(t.eff_date,'dd-MON-yyyy') eff_date " &
 					"from globaleye.code grp, globaleye.code syscat, globaleye.code systype, " &
					     "globaleye.code_by_code cbc, globaleye.tcto t, core_tables.inv_tcto it, " &
                         "globaleye.code pgm " &
					"where grp.code_id = cbc.group_cd " &
					"and cbc.code_a = syscat.code_id " &
					"and cbc.code_b = systype.code_id " &
					"and systype.code_id = t.sys_type " &
					"and t.tcto_no = it.tcto_no(+) " &
                    "and t.pgm_id = pgm.code_id " &
                    "and pgm.code_type = 'PROGRAM_ID' " &
                    "and pgm.code_value = ? " &
					"and grp.code_value = 'ACTS_SYSTYPE_BY_CAT' " &
					"and syscat.code_value = ? " &
                    "and t.active = 'Y' " &
                    "order by t.tcto_no ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.program,"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.systemcat,"CF_SQL_VARCHAR"));

        return getDbUtils().executeQuery(local.sql, local.params);
    }
    
    public Array function lookupInspectionTypeByPMIHowMal(string hmCode) {
        var local = {};

        local.sql = "select cb.code_id, cb.code_value, cb.description " &
                    "from globaleye.code_by_code cbc, globaleye.code gp, GLOBALEYE.CODE ca, globaleye.code cb " &
                    "where cbc.group_cd = gp.code_id " &
                    "and cbc.code_a = ca.code_id " &
                    "and gp.code_type = 'GROUP' " &
                    "and gp.code_value = 'INSPECTION_BY_PMI_HOWMAL' " &
                    "and cbc.code_b = cb.code_id " &
                    "and ca.code_id = ? " &
                    "order by cb.code_value ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.hmCode,"CF_SQL_VARCHAR"));
        
        local.results = getDbUtils().executeQuery(local.sql, local.params);
        
        if (local.results.recordcount == 0)
        {
        	local.sql = "select cb.code_id, cb.code_value, cb.description " &
                    "from globaleye.code_by_code cbc, globaleye.code gp, GLOBALEYE.CODE ca, globaleye.code cb " &
                    "where cbc.group_cd = gp.code_id " &
                    "and cbc.code_a = ca.code_id " &
                    "and gp.code_type = 'GROUP' " &
                    "and gp.code_value = 'INSPECTION_BY_PMI_HOWMAL' " &
                    "and cbc.code_b = cb.code_id " &
                    "order by cb.code_value ";
                    
                    local.results = getDbUtils().executeQuery(local.sql, local.params);
        } 
        
        return populateLookupCodes(local.results); 
    }

    private Query function lookupTctosByProgram(required string program) {
        var local = {};

        local.sql = "select t.tcto_id, it.tcto_id ct_tcto_id, t.tcto_no, to_char(t.eff_date,'dd-MON-yyyy') eff_date " &
                    "from globaleye.tcto t, globaleye.code pgm, core_tables.inv_tcto it " &
                    "where t.pgm_id = pgm.code_id " &
                    "and t.tcto_no = it.tcto_no(+) " &
                    "and pgm.code_type = 'PROGRAM_ID' " &
                    "and pgm.code_value = ? " &
                    "and t.active = 'Y' " &
                    "order by t.tcto_no ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.program,"CF_SQL_VARCHAR"));

        return getDbUtils().executeQuery(local.sql, local.params);
    }

    /**
     * returns an array of structs containing user asssets in the form of:
     *     struct.asset_id
     *     struct.partno_id
     *     struct.serno
     *     struct.partno
     *     struct.sys_type
     *     struct.ct_asset_id
     */
    public Array function lookupUserAssets(required string program, required string unit, required string systemCategory, boolean getEtm=false, string active='Y') {
    	try{  
        var local = {};

        
        local.codeService = application.objectFactory.create("CodeService");
        local.partnoCodeService = application.objectFactory.create("PartnoCodeService");
        local.codeByCodeService = application.objectFactory.create("CodeByCodeService");
        local.locationService = application.objectFactory.create("LocationService");
        local.cfgMetersService = application.objectFactory.create("CfgMetersService");

        
        local.unitCode = local.codeService.findByCodeTypeCodeValue('UNIT', arguments.unit);
        local.locationId = local.locationService.getLocIdValueListByUnitCode(local.unitCode.getCodeId()); 
        local.programCode = local.codeService.findByCodeTypeCodeValue('PROGRAM_ID',arguments.program);
        local.partnoIdList = local.partnoCodeService.getPartnoIdAsValueListByProgram(local.programCode.getCodeId());
        
        local.systemCatCode = local.codeService.findByCodeTypeCodeValue(UCASE(TRIM(ARGUMENTS.program)) & '_SYSTEM_CATS', arguments.systemCategory);
        local.systemTypeCodeList = local.codeByCodeService.getAllCodeBAsValueListByCodeA(local.systemCatCode.getCodeId());

        
        local.sql = "SELECT ASSET.ASSET_ID, PART.PARTNO_ID, ASSET.SERNO, PART.PARTNO, SYS_TYPE.CODE_VALUE SYS_TYPE, ASSET.CT_ASSET_ID, PART.NOUN " &
                    "FROM GLOBALEYE.ASSET ASSET, GLOBALEYE.PART_LIST PART, " &
                    "     GLOBALEYE.CODE SYS_TYPE " &
                    "WHERE ASSET.PARTNO_ID = PART.PARTNO_ID " &
                    "AND PART.SYS_TYPE = SYS_TYPE.CODE_ID " &
                    "AND ASSET.ACTIVE LIKE ? " ;
                    if(application.sessionManager.getMaintLevelSetting() EQ "DEPOT"){
		            	local.sql = local.sql &  " AND SYS_TYPE.CODE_ID IN (?, (select code_id
																		from code
																		where code_value = 'PART'
																		and code_type = 'SYS_TYPE')) " ;	            	
		            }else{
		            	local.sql = local.sql & "AND SYS_TYPE.CODE_ID IN (?) " &
                    							"AND PART.PARTNO_ID IN (?) " ;
		            }
		            local.sql = local.sql & "AND (ASSET.LOC_IDA IN (?) OR ASSET.LOC_IDC IN (?) ) " &
		            "ORDER BY SYS_TYPE.CODE_VALUE, ASSET.SERNO, PART.PARTNO ";

     				
        local.params = [];     
        
        ArrayAppend(local.params, getDbUtils().addQueryParam(ARGUMENTS.active,"CF_SQL_VARCHAR","yes"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(local.systemTypeCodeList,"CF_SQL_INTEGER","yes"));
        if(application.sessionManager.getMaintLevelSetting() NEQ "DEPOT"){
        	ArrayAppend(local.params, getDbUtils().addQueryParam(local.partnoIdList,"CF_SQL_INTEGER","yes")); 
        }
        ArrayAppend(local.params, getDbUtils().addQueryParam(local.locationId,"CF_SQL_INTEGER","yes"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(local.locationId,"CF_SQL_INTEGER","yes"));
        
        
        WriteLog(text="SQL: #local.sql#", file="CRIIS.log");
        WriteLog(text="locationId: #local.locationId#", file="CRIIS.log");
        WriteLog(text="systype: #local.systemTypeCodeList#", file="CRIIS.log");
        WriteLog(text="partnoid: #local.partnoIdList#", file="CRIIS.log");


        local.results = getDbUtils().executeQuery(local.sql, local.params);

        /* load value objects */
        local.assets = [];
        
        for(i=1;i<="#local.results.recordcount#";i++) {
            local.userAssets = {};
            local.userAssets.asset_id = local.results.ASSET_ID[i];
            //local.qAsset = getDbUtils().getAssetsByProgram(application.sessionManager.getProgramIdSetting(),application.sessionManager.getLocIdSetting(),local.results.ASSET_ID[i]);
            local.userAssets.partno_id = local.results.PARTNO_ID[i];
            local.userAssets.serno = local.results.SERNO[i];
            local.userAssets.partno = local.results.PARTNO[i];
            local.userAssets.sys_type = local.results.SYS_TYPE[i];
            local.userAssets.ct_asset_id = local.results.CT_ASSET_ID[i];
            local.userAssets.noun = local.results.NOUN[i];
            if(getEtm){
            	try{
            		local.userAssets.etm_start = (!len(trim(local.userAssets.ct_asset_id))) ? 0 : local.cfgMetersService.getCfgMetersCurrentMeter(local.userAssets.ct_asset_id).getValueOut();
            	} catch (any e) {
            		local.userAssets.etm_start="0";
            	}
            }else{
            	local.userAssets.etm_start="0";
            }

            //local.userAssets.etm_start = local.qAsset.etm);
            
            ArrayAppend(local.assets,local.userAssets);
            }
        } catch (any e) {
		   writeLog(file="dbLookups" text="#e.message#");
		}

        return local.assets;
    }
    
    public Array function lookupSorties(required string program, required string unit, required string systemCategory, required string assetId) {
    	var local = {};
    	   	
    	local.codeService = application.objectFactory.create("CodeService");
        //local.partnoCodeService = application.objectFactory.create("PartnoCodeService");
        local.locationService = application.objectFactory.create("LocationService");

        local.unitCode = local.codeService.findByCodeTypeCodeValue('UNIT', arguments.unit);
        local.locationId = local.locationService.getLocIdValueListByUnitCode(local.unitCode.getCodeId()); 
        local.systemCatCode = local.codeService.findByCodeTypeCodeValue(UCASE(TRIM(ARGUMENTS.program)) & '_SYSTEM_CATS', arguments.systemCategory);
        //local.programCode = local.codeService.findByCodeTypeCodeValue('PROGRAM_ID',arguments.program);
        //local.partnoIdList = local.partnoCodeService.getPartnoIdAsValueListByProgram(local.programCode.getCodeId());
        //local.systemTypeCodeList = local.codeByCodeService.getAllCodeBAsValueListByCodeA(local.systemCatCode.getCodeId());

        local.sql = "SELECT SORTIE_ID, MISSION_ID, A.SERNO, AC_TAILNO, SORTIE_DATE, A.ASSET_ID, SE.CODE_VALUE SORTIE_EFFECTIVE, AC_STATION, AC_TYPE, " &
              		"CURRENT_UNIT, SU.CODE_VALUE CURRENT_UNIT_VALUE " &
                    "FROM GLOBALEYE.SORTIES S, GLOBALEYE.CODE SP, GLOBALEYE.CODE SE, GLOBALEYE.CODE SU, GLOBALEYE.ASSET A " &
                    "WHERE S.PGM_ID =  SP.CODE_ID " &
                    "AND SP.CODE_VALUE = ? " &
                    "AND CURRENT_UNIT = ? " &
                    "AND A.ASSET_ID = ? " &                      
 					"AND A.SERNO = S.SERNO " &
                    "AND S.CURRENT_UNIT = SU.CODE_ID " &
                    "AND S.SORTIE_EFFECT = SE.CODE_ID " &
                    "AND SE.CODE_VALUE = 'NON-EFFECTIVE' " &
		            "ORDER BY MISSION_ID, SERNO, AC_TAILNO";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.program,"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(local.unitCode.getCodeId(),"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.assetId,"CF_SQL_VARCHAR"));

        local.results = getDbUtils().executeQuery(local.sql, local.params);
        
        /* load value objects */
        local.sorties = [];
        
        for(i=1;i<=#local.results.recordcount#;i=i+1) {
            local.loadSorties = {};
            local.loadSorties.sortie_id = local.results.SORTIE_ID[i];
            local.loadSorties.mission_id = local.results.MISSION_ID[i];
            local.loadSorties.serno = local.results.SERNO[i];
            local.loadSorties.ac_tailno = local.results.AC_TAILNO[i];
            local.loadSorties.sortie_date = local.results.SORTIE_DATE[i];
            local.loadSorties.asset_id = local.results.ASSET_ID[i];
            local.loadSorties.sortie_effective = local.results.SORTIE_EFFECTIVE[i];
            local.loadSorties.ac_station = local.results.AC_STATION[i];
            local.loadSorties.ac_type = local.results.AC_TYPE[i];
            local.loadSorties.current_unit = local.results.CURRENT_UNIT[i];
            local.loadSorties.current_unit_value = local.results.CURRENT_UNIT_VALUE[i];
            
            
            ArrayAppend(local.sorties,local.loadSorties);
        }

        return local.sorties;

    }
    
    
    public Array function lookupTests(required string program, required string unit, required string systemCategory) {
    	var local = {};
    	   	
    	local.codeService = application.objectFactory.create("CodeService");
        //local.partnoCodeService = application.objectFactory.create("PartnoCodeService");
        local.locationService = application.objectFactory.create("LocationService");

        local.unitCode = local.codeService.findByCodeTypeCodeValue('UNIT', arguments.unit);
        local.locationId = local.locationService.getLocIdValueListByUnitCode(local.unitCode.getCodeId()); 
        local.systemCatCode = local.codeService.findByCodeTypeCodeValue(UCASE(TRIM(ARGUMENTS.program)) & '_SYSTEM_CATS', arguments.systemCategory);
        //local.programCode = local.codeService.findByCodeTypeCodeValue('PROGRAM_ID',arguments.program);
        //local.partnoIdList = local.partnoCodeService.getPartnoIdAsValueListByProgram(local.programCode.getCodeId());
        //local.systemTypeCodeList = local.codeByCodeService.getAllCodeBAsValueListByCodeA(local.systemCatCode.getCodeId());

        local.sql = "SELECT AA.CODE_VALUE TEST_TYPE, UPPER(BB.CODE_VALUE) TEST_NAME, BB.CODE_ID TEST_ID, AA.CODE_ID TEST_TYPE_ID " &
                    "FROM GLOBALEYE.CODE_BY_CODE CBC, GLOBALEYE.CODE GP, GLOBALEYE.CODE AA, GLOBALEYE.CODE BB " &
                    "WHERE CBC.GROUP_CD =  GP.CODE_ID " &
                    "AND CBC.CODE_A = AA.CODE_ID " &
                    "AND CBC.CODE_B = BB.CODE_ID " &
                    "AND GP.CODE_VALUE = ? " &
                    "AND AA.CODE_VALUE = ? " &
		            "ORDER BY TEST_NAME ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.program & '_TESTS_GP',"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam('POD',"CF_SQL_VARCHAR"));

        local.results = getDbUtils().executeQuery(local.sql, local.params);
        
        /* load value objects */
        local.tests = [];
        
        for(i=1;i<=#local.results.recordcount#;i=i+1) {
            local.loadTests = {};
            local.loadTests.test_type = local.results.TEST_TYPE[i];
            local.loadTests.test_name = local.results.TEST_NAME[i];
            local.loadTests.test_id = local.results.TEST_ID[i];
            local.loadTests.test_type_id = local.results.TEST_TYPE_ID[i];            
            
            ArrayAppend(local.tests,local.loadTests);
        }

        return local.tests;

    }
    

    public Array function lookupCodesByTypeCode(required string typeCode, string programLookup, string systemcat, string partno) {
        var local = {};

        if (StructKeyExists(arguments, "partno") and len(trim(arguments.partno))) {
            local.qry = lookupCodesByPartno(arguments.typeCode, arguments.partno);
            if (local.qry.recordcount) {
                return populateLookupCodes(local.qry);
            }
        }

        if (StructKeyExists(arguments, "systemcat") and len(trim(arguments.systemcat))) {
            local.qry = lookupCodesBySystemCat(arguments.typeCode, arguments.systemcat);
            if (local.qry.recordcount) {
                return populateLookupCodes(local.qry);
            }
        }

        if (StructKeyExists(arguments, "programLookup") and len(trim(arguments.programLookup))) {
            if (typecode EQ "hmCode") {
            	local.qry = lookupCodeByProgramHowMal(arguments.typeCode, arguments.programLookup);
            } else {
            	local.qry = lookupCodesByProgram(arguments.typeCode, arguments.programLookup);
            }
            if (local.qry.recordcount) {
                return populateLookupCodes(local.qry);
            }
        }

        local.codeService = application.objectFactory.create("CodeService");
        local.codes = local.codeService.findCodesByCodeType(getCodeTypeValue(arguments.typeCode));
        local.results = [];
        if (StructKeyExists(local,"codes") and ArrayLen(local.codes)) {
            for (i = 1; i lte ArrayLen(local.codes); i++) {
	            local.code = local.codes[i];
	            local.code.code_id = local.code.getCodeId();
	            local.code.code_value = local.code.getCodeValue();
	            local.code.description = local.code.getDescription();
	            ArrayAppend(local.results,local.code);
            }
        }

        return local.results;
	}

    /**
     * returns an array of strings containing sra nouns for the NHA asset.
     */
    public Array function lookupSraNouns(required string partno, numeric configSet) {
    	try{
	        var local = {};
	        
	        writeLog(file="236" text="DbLookups - lookupSRANouns - Partno (#arguments.partno#)");
	        
	        
	      if (arguments.configSet GT 0){
	      local.sql = "select distinct plc.noun " &
						"from globaleye.part_list pl, globaleye.cfg_list cl, globaleye.part_list plc " &
						"where pl.partno_id = cl.partno_p " &
						"and cl.partno_c = plc.partno_id " &
						"and pl.partno = ? " &
						"and cl.cfg_set_id = ? " &
						"order by 1 ";	      	
	      }
	      else{  
	      local.sql = "select distinct plc.noun " &
						"from globaleye.part_list pl, globaleye.cfg_list cl, globaleye.part_list plc " &
						"where pl.partno_id = cl.partno_p " &
						"and cl.partno_c = plc.partno_id " &
						"and pl.partno = ? " &
						"order by 1 ";
			}			
			/*local.sql = "select distinct plc.noun 
						from globaleye.part_list pl, globaleye.cfg_list cl, globaleye.part_list plc 
						where pl.partno_id = cl.partno_p 
						and cl.partno_c = plc.partno_id 
						AND PL.PGM_ID = ?
						AND PL.LSRU_FLAG = 'L'
						order by 1 ";*/
	
	        local.params = [];
	       ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.partno,"CF_SQL_VARCHAR"));
			if (arguments.configSet GT 0){
					ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.configSet,"CF_SQL_INTEGER"));
				}
	
	
	        local.qry = getDbUtils().executeQuery(local.sql, local.params);
	        local.results = [];
	        if (local.qry.recordcount) {
	            for (i = 1; i lte local.qry.recordcount; i++) {
	                ArrayAppend(local.results, local.qry.NOUN[i]);
	            }
	        }
	
	        return local.results;
		}catch(any e){
			
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="editConfig");
	
			request.context.errorType = e.type;
			request.context.error = e;
		}
    }
    
    public Array function lookupSraNounsFlat(required string partno) {
    	//Now Filter out Bit Pieces 01/24/18 JJP
    	try{
	        var local = {};
	        
	        writeLog(file="236" text="DbLookups - lookupSRANouns - Partno (#arguments.partno#)");
	        
	        local.sql = "SELECT DISTINCT noun
							FROM globaleye.part_list
							WHERE partno_id IN
							(SELECT partno_c 
							FROM globaleye.cfg_list
							START WITH partno_p IN
							(SELECT partno_id
							FROM globaleye.part_list pl1,
							globaleye.code c1,
							globaleye.code c2
							WHERE pl1.pgm_id   = c1.code_id
							AND UPPER(TRIM(c1.code_value)) = ?
							AND pl1.sys_type   = c2.code_id
							AND c2.code_value != 'PART'
							)
							CONNECT BY nocycle prior partno_c = partno_p
							)
							AND noun NOT IN
							(SELECT noun
							FROM globaleye.part_list pl,globaleye.partno_code pc, code c
							WHERE pl.partno_id = pc.partno_id
							AND c.CODE_ID = pc.group_cd
							AND c.code_value IN ('BIT_PC'))
							and active = 'Y'   
							ORDER BY 1";
								        
	        
	        /*local.sql = "SELECT DISTINCT CHILD_NOUN NOUN
							FROM GLOBALEYE.CFG_LIST_VIEW CFV
							START WITH CFV.PARTNO_P IN (
							                                    SELECT PL.PARTNO_ID
							                                    FROM GLOBALEYE.PART_LIST PL, 
							                                         GLOBALEYE.CODE PGM,
							                                         GLOBALEYE.CODE SYS
							                                    WHERE PL.PGM_ID = PGM.CODE_ID
							                                    AND PGM.CODE_ID = ?
							                                    AND PL.SYS_TYPE = SYS.CODE_ID      
							                                    AND SYS.CODE_VALUE IN ('POD', 'RAP')
							                                )              
							CONNECT BY PRIOR PARTNO_C = PARTNO_P  
							AND CHILD_NOUN NOT IN
				                 (SELECT CHILD_NOUN
				                    FROM globaleye.part_list pl,globaleye.partno_code pc, code c
				                   WHERE pl.partno_id = pc.partno_id
				                         AND c.CODE_ID = pc.group_cd
				                         AND c.code_value IN ('BIT_PC', 'NSP'))								
							ORDER BY 1 ";*/
	
	       /* local.sql = "select distinct plc.noun " &
						"from globaleye.part_list pl, globaleye.cfg_list cl, globaleye.part_list plc " &
						"where pl.partno_id = cl.partno_p " &
						"and cl.partno_c = plc.partno_id " &
						"and pl.partno = ? " &
						"order by 1 ";*/
						
			/*local.sql = "select distinct plc.noun 
						from globaleye.part_list pl, globaleye.cfg_list cl, globaleye.part_list plc 
						where pl.partno_id = cl.partno_p 
						and cl.partno_c = plc.partno_id 
						AND PL.PGM_ID = ?
						AND PL.LSRU_FLAG = 'L'
						order by 1 ";*/
	
	        local.params = [];
	        ArrayAppend(local.params, getDbUtils().addQueryParam(application.sessionManager.getProgramSetting(),"CF_SQL_VARCHAR"));
	
	
			//local.qry.addParam(name="program", value="#UCASE(TRIM(application.sessionManager.getProgramSetting()))#",cfsqltype="CF_SQL_VARCHAR"); 
	        local.qry = getDbUtils().executeQuery(local.sql, local.params);
	        local.results = [];
	        if (local.qry.recordcount) {
	            for (i = 1; i lte local.qry.recordcount; i++) {
	                ArrayAppend(local.results, local.qry.NOUN[i]);
	            }
	        }
	
	        return local.results;
		}catch(any e){
			
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="editConfig");
	
			request.context.errorType = e.type;
			request.context.error = e;
		}
    }
    
    
    public Array function lookupMaintSraNouns(required string partno) {
    	try{
	        var local = {};
	        
	       local.sql =  " select distinct noun " &
						" from part_list pl, code lc, " &
						"      (select partno_c FROM cfg_list " &
						"       start with partno_p = ? " &
						"       connect by prior partno_c = partno_p) " &
						" where partno_c = pl.partno_id " &
						" and PL.PGM_ID = lc.code_id " &
						" and lc.code_value = ? " &
						" AND pl.partno NOT IN (SELECT PL.PARTNO " &
						" FROM GLOBALEYE.PARTNO_CODE PC, " &
						" GLOBALEYE.PART_LIST PL " &
						" WHERE PL.PARTNO_ID = PC.PARTNO_ID " &
						" AND GROUP_CD IN " &
						" (SELECT CODE_ID " &
						" FROM GLOBALEYE.CODE " &
						" WHERE (CODE_VALUE LIKE 'NSP') AND CODE_TYPE LIKE 'GROUP')) " &
						" order by noun ";
	
	        local.params = [];
	       ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.partno,"CF_SQL_VARCHAR"));
	       ArrayAppend(local.params, getDbUtils().addQueryParam(application.sessionManager.getProgramSetting(),"CF_SQL_VARCHAR"));	
	
	        local.qry = getDbUtils().executeQuery(local.sql, local.params);
	        local.results = [];
	        if (local.qry.recordcount) {
	            for (i = 1; i lte local.qry.recordcount; i++) {
	                ArrayAppend(local.results, local.qry.NOUN[i]);
	            }
	        }
	
	        return local.results;
		}catch(any e){
			
			getJavaLoggerProxy().severe(message="#e.message#",sourceClass=getComponentName(), methodName="editConfig");
	
			request.context.errorType = e.type;
			request.context.error = e;
		}
    }

    /**
     * returns an array of structs containing sra asssets in the form of:
     *     struct.asset_id
     *     struct.serno
     *     struct.partno_id
     *     struct.partno
     *     struct.nsn
     */
    public Array function lookupSraAssetsByNoun(required string noun, string location="%") {
        var local = {};

        /*local.sql = "select a.asset_id, a.serno, a.partno_id, pl.partno, pl.nsn " &
                    "from globaleye.part_list pl, globaleye.asset a " &
                    "where pl.partno_id = a.partno_id " &
                    "and a.nha_asset_id is null " &
                    "and pl.noun = ? " &
                    "order by 4,2 ";*/
        
        //JJP 01/09/17 Modified query to filter out In Transit parts and NON-FMC Parts
        //JJP 06/17/22 Modified query to filter out INACTIVE Assets
                    
		local.sql = " SELECT A.SERNO,A.ASSET_ID, A.PARTNO_ID, PL.PARTNO, PL.NSN 
					FROM GLOBALEYE.ASSET A, GLOBALEYE.PART_LIST PL
					WHERE A.PARTNO_ID = PL.PARTNO_ID 
					AND A.NHA_ASSET_ID IS NULL
					AND A.STATUS_CD = (select code_id from code where code_type = 'STATUS' and code_value = 'FMC')
					AND A.IN_TRANSIT = 'N'
					AND A.ACTIVE = 'Y'						
					AND A.PARTNO_ID IN (SELECT CFV.PARTNO_C
					                    FROM GLOBALEYE.CFG_LIST_VIEW CFV
					                    WHERE CFV.CHILD_NOUN LIKE ?)
					AND (A.LOC_IDC like ? OR SERNO = 'NSP')
					ORDER BY PL.PARTNO, SERNO  ";    
					                

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.noun,"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.LOCATION,"CF_SQL_VARCHAR"));
        local.qry = getDbUtils().executeQuery(local.sql, local.params);
        local.results = [];
        if (local.qry.recordcount) {
            for (i = 1; i lte local.qry.recordcount; i++) {
                local.sraAsset = {};
                local.sraAsset.asset_id = local.qry.ASSET_ID[i];
                local.sraAsset.serno = local.qry.SERNO[i];
                local.sraAsset.partno_id = local.qry.PARTNO_ID[i];
                local.sraAsset.partno = local.qry.PARTNO[i];
                local.sraAsset.nsn = local.qry.NSN[i];
                ArrayAppend(local.results, local.sraAsset);
            }
        }

        return local.results;
    }
    
    public Array function lookupSraAssetByParentPart(required string noun, required string partnoid) {
        var local = {};

        local.sql = "SELECT A.SERNO,A.ASSET_ID, A.PARTNO_ID, PL.PARTNO, PL.NSN 
					FROM GLOBALEYE.ASSET A, GLOBALEYE.PART_LIST PL
					WHERE A.PARTNO_ID = PL.PARTNO_ID 
					AND A.NHA_ASSET_ID IS NULL
					AND A.PARTNO_ID IN (SELECT CFV.PARTNO_C
					                    FROM GLOBALEYE.CFG_LIST_VIEW CFV
					                    WHERE CFV.CHILD_NOUN LIKE ?
					                    AND CFV.PARTNO_P LIKE ?)
					ORDER BY PL.PARTNO, SERNO   ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.noun,"CF_SQL_VARCHAR"));
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.partnoid,"CF_SQL_VARCHAR"));
        
        local.qry = getDbUtils().executeQuery(local.sql, local.params);
        local.results = [];
        if (local.qry.recordcount) {
            for (i = 1; i lte local.qry.recordcount; i++) {
                local.sraAsset = {};
                local.sraAsset.asset_id = local.qry.ASSET_ID[i];
                local.sraAsset.serno = local.qry.SERNO[i];
                local.sraAsset.partno_id = local.qry.PARTNO_ID[i];
                local.sraAsset.partno = local.qry.PARTNO[i];
                local.sraAsset.nsn = local.qry.NSN[i];
                ArrayAppend(local.results, local.sraAsset);
            }
        }

        return local.results;
    }
    

    /**
     * returns an array of structs containing sra asssets in the form of:
     *     struct.asset_id
     *     struct.serno
     *     struct.partno
     *     struct.nsn
     *     struct.noun
     */
    public Array function lookupSRAAssets(required string nhaAssetId) {
        var local = {};

        /*local.sql = "select pl.noun sra_noun, pl.partno partno, pl.nsn nsn, a.serno serno, a.asset_id asset_id " &
                    "from globaleye.part_list pl, globaleye.asset a " &
                    "where a.partno_id = pl.partno_id " &
                    "and a.nha_asset_id = ? " &
                    "order by 1,2,4 ";
                    select pl.noun sra_noun, pl.partno partno, pl.nsn nsn, a.serno serno, a.asset_id asset_id 
						from globaleye.part_list pl, globaleye.asset a 
						where a.partno_id = pl.partno_id 
						and (a.nha_asset_id = ?
						    or
						    A.NHA_ASSET_ID in (select a.asset_id  
						                        from globaleye.part_list pl1, globaleye.asset a1 
						                        where a1.partno_id = pl1.partno_id 
						                        and a1.nha_asset_id = a.nha_asset_id )
						    ) 
						order by 1,2,4*/

		local.sql = " select pl.noun sra_noun, pl.partno, pl.nsn, a.serno, a.asset_id, pl.partno_id, PL.NOUN
						from globaleye.asset a, globaleye.part_list pl, globaleye.code c,
						(
						select asset_id, nha_asset_id, serno, level
						from globaleye.asset
						start with asset_id = ?
						connect by prior asset_id = nha_asset_id
						order siblings by asset_id) b
						where a.asset_id in b.asset_id
						and a.partno_id = pl.partno_id
						and pl.sys_type = c.code_id
						and c.code_value != 'POD'
						order by pl.noun

";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.nhaAssetId,"CF_SQL_VARCHAR"));
        local.qry = getDbUtils().executeQuery(local.sql, local.params);
        local.results = [];
        if (local.qry.recordcount) {
            for (i = 1; i lte local.qry.recordcount; i++) {
                local.sraAsset = {};
                local.sraAsset.asset_id = local.qry.ASSET_ID[i];
                local.sraAsset.serno = local.qry.SERNO[i];
                local.sraAsset.partno = local.qry.PARTNO[i];
                local.sraAsset.partnoid = local.qry.PARTNO_ID[i];
                local.sraAsset.nsn = local.qry.NSN[i];
                local.sraAsset.noun = local.qry.SRA_NOUN[i];
                ArrayAppend(local.results, local.sraAsset);
            }
        }

        return local.results;
    }

    /**
     * returns an array of structs containing sra asssets in the form of:
     *     struct.asset_id
     *     struct.serno
     *     struct.partno
     *     struct.nsn
     *     struct.noun
     */
    public Array function lookupSRAAssetsByNhaPartno(required string nhaPartno) {
        var local = {};

        local.sql = "select plc.noun sra_noun, plc.partno partno, plc.nsn nsn, a.serno serno, a.asset_id asset_id " &
                    "from globaleye.cfg_list cl, globaleye.part_list pl, globaleye.part_list plc, globaleye.asset a " &
                    "where cl.partno_p = pl.partno_id " &
                    "and cl.partno_c = plc.partno_id " &
                    "and plc.partno_id = a.partno_id " &
                    "and pl.partno = ? " &
                    "order by 1,2,4 ";

        local.params = [];
        ArrayAppend(local.params, getDbUtils().addQueryParam(arguments.nhaPartno,"CF_SQL_VARCHAR"));
        local.qry = getDbUtils().executeQuery(local.sql, local.params);
        local.results = [];
        if (local.qry.recordcount) {
            for (i = 1; i lte local.qry.recordcount; i++) {
                local.sraAsset = {};
                local.sraAsset.asset_id = local.qry.ASSET_ID[i];
                local.sraAsset.serno = local.qry.SERNO[i];
                local.sraAsset.partno = local.qry.PARTNO[i];
                local.sraAsset.nsn = local.qry.NSN[i];
                local.sraAsset.noun = local.qry.SRA_NOUN[i];
                ArrayAppend(local.results, local.sraAsset);
            }
        }

        return local.results;
    }

    public Array function lookupTctos(required string program, string systemcat, string partno) {
        if (StructKeyExists(arguments, "partno") and len(trim(arguments.partno))) {
            local.qry = lookupTctosByPartno(arguments.program, arguments.partno);
            if (local.qry.recordcount) {
                return populateLookupTctos(local.qry);
            }
        }

        if (StructKeyExists(arguments, "systemcat") and len(trim(arguments.systemcat))) {
            local.qry = lookupTctosBySystemCat(arguments.program, arguments.systemcat);
            if (local.qry.recordcount) {
                return populateLookupTctos(local.qry);
            }
        }

        local.qry = lookupTctosByProgram(arguments.program);
        return populateLookupTctos(local.qry);
    }
    
    public query function lookupUserConfigList(required string program, required string locationId, required string systemCategory){
    	
   	    var local = {};
    	
        local.codeService = application.objectFactory.create("CodeService");
        local.codeByCodeService = application.objectFactory.create("CodeByCodeService");
    	
        local.systemCatCode = local.codeService.findByCodeTypeCodeValue(UCASE(TRIM(ARGUMENTS.program)) & '_SYSTEM_CATS', arguments.systemCategory);
        local.systemTypeCodeList = local.codeByCodeService.getAllCodeBAsValueListByCodeA(local.systemCatCode.getCodeId());
        
        
	      
	       
	       local.sql = " SELECT LEVEL,
						           A.ASSET_ID,
						           A.SERNO,
						           PL.PARTNO,
						           A.NHA_ASSET_ID,
						           C.CODE_VALUE STATUS,
						           SYS_CONNECT_BY_PATH (a.serno, '/') SERNO_PATH,
						           SYS_CONNECT_BY_PATH (PL.PARTNO, '/') PARTNO_PATH
						      FROM globaleye.asset a, GLOBALEYE.PART_LIST PL, GLOBALEYE.CODE C
						     WHERE A.PARTNO_ID = PL.PARTNO_ID AND A.STATUS_CD = C.CODE_ID
						START WITH a.asset_id IN (SELECT ASSET.ASSET_ID
						                            FROM GLOBALEYE.ASSET ASSET,
						                                 GLOBALEYE.PART_LIST PART,
						                                 GLOBALEYE.CODE SYS_TYPE
						                           WHERE     ASSET.PARTNO_ID = PART.PARTNO_ID
						                                 AND PART.SYS_TYPE = SYS_TYPE.CODE_ID
						                                 AND ASSET.ACTIVE = 'Y'
						                                 AND SYS_TYPE.CODE_ID IN (?)
						                                 AND PART.PARTNO_ID IN (SELECT PARTNO_ID
						                                                          FROM GLOBALEYE.PARTNO_CODE
						                                                         WHERE CODE_ID = (SELECT CODE_ID
						                                                                        FROM GLOBALEYE.CODE 
						                                                                        WHERE CODE_TYPE = 'PROGRAM_ID'
						                                                                         AND CODE_VALUE = ?))
						                                 AND (   ASSET.LOC_IDA IN (?)
						                                      OR ASSET.LOC_IDC IN (?)))
						CONNECT BY PRIOR A.ASSET_ID = A.NHA_ASSET_ID ";
						
	       /*local.sql = " select 4 from dual";*/
        	local.params = [];
	        ArrayAppend(local.params, getDbUtils().addQueryParam(local.systemTypeCodeList,"CF_SQL_INTEGER","yes"));	    
	        ArrayAppend(local.params, getDbUtils().addQueryParam(ARGUMENTS.program,"CF_SQL_VARCHAR","yes"));        
	        ArrayAppend(local.params, getDbUtils().addQueryParam(ARGUMENTS.locationId,"CF_SQL_INTEGER","yes"));
	        ArrayAppend(local.params, getDbUtils().addQueryParam(ARGUMENTS.locationId,"CF_SQL_INTEGER","yes"));

        	local.qry = getDbUtils().executeQuery(local.sql, local.params);
	       
	       
	       return local.qry;    
   }
   


}