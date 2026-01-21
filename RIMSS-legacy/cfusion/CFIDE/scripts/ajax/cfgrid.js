// � 2006 Adobe Macromedia Software LLC. All rights reserved.

cfinitgrid = function () { // Wrap in a function so the var scoped variables stay local
if (!ColdFusion.Grid) ColdFusion.Grid = {}; var $G = ColdFusion.Grid; 

var $L = ColdFusion.Log;

$G.init = function(id, name, formId, dynamic, edit, bindOnLoad, autoSizeColumns,  autoExpandColumnId, 
								colModelData, dataModel, width, height, stripeRows, styles,
								pageSize, selectOnLoad, preservePageOnSort, checkBoxSelection, collapsible, grouping, title, insertButtonLabel, deleteButtonLabel,
								cellClickInfo, onChangeFunction, onErrorFunction, onLoadFunction,checkColumnPlugin ,bindElements )
{
	var grid;	
	var selModel;
	var multiRowSelection = false;
	if(checkBoxSelection && typeof(checkBoxSelection) != 'undefined' )
	{		
		selModel = checkBoxSelection;
		multiRowSelection = true;		
	}
	else 
	{
		selModel = new Ext.grid.RowSelectionModel({singleSelect:true});
	} 
	
	var colModel = new Ext.grid.ColumnModel(colModelData);
	var config = {ds:dataModel, cm:colModel, sm:selModel,
					 autoSizeColumns:autoSizeColumns, autoSizeHeaders:autoSizeColumns, 
					 stripeRows:stripeRows, autoExpandColumnId:autoExpandColumnId};

	if(checkColumnPlugin != null && typeof checkColumnPlugin != 'undefined')
		config.plugins = checkColumnPlugin;
		
	if(!width || typeof(width) == 'undefined')
	{	
		width = 100 * (colModelData.length-1);
	}
    
	// Adding width style to grid div.
	var actionsObj = ColdFusion.objectCache[id];
    var element = document.getElementById(actionsObj.gridId);
	if (element != null) {
		var style = element.style.cssText;
		if(typeof style == 'undefined')
			style = '';
		style = "width:" + width + 'px;' + style;											
		element.style.cssText = style;
	}

	config.width = width;
	if(autoSizeColumns === true)
		config.viewConfig = {forceFit:true};
	else {
		if (checkBoxSelection && typeof(checkBoxSelection) != 'undefined') {
			config.autoExpandColumn = autoExpandColumnId;
		}
		else 
			config.autoExpandColumn =  autoExpandColumnId;	
	}
	if(height)
	{
		config.height = height;
	}
	else
	{
		config.autoHeight = true;
		// Ext2.2 IE Issue: In width and autoHight combination,
		// Column header disappear on mouse over.
		// Source of Solution:  http://extjs.com/forum/showthread.php?t=51050	 
		var cssClass = ".x-grid3-header {position: relative;}";
		Ext.util.CSS.createStyleSheet( cssClass, '_cf_grid' + id);	
	}
	
	
	if(grouping && typeof (grouping) != 'undefined')
	{
		config.view =  new Ext.grid.GroupingView({ forceFit:false, 
		                        groupTextTpl: '{[values.text.indexOf("x-grid3-check-col") > 0 ? (values.text.indexOf("x-grid3-check-col-on") > 0 ? "Yes" : "No") : values.text]} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'});
    }
	
	config.title = title;
	config.collapsible  = collapsible;
	if(collapsible && title == null)
	{
		// Set dummy title, without this collapsible toggle won't get displayed
		config.title = '  ';
	}
	

	var actions = ColdFusion.objectCache[id];
	actions.bindOnLoad = bindOnLoad;
	actions.dynamic = dynamic;
	actions.styles = styles;
	actions.grouping = grouping;
	actions.onLoadFunction = onLoadFunction;
	actions.multiRowSelection =  multiRowSelection;
	
    config.renderTo = actions.gridId;
	
	// Bug: 82064, TopToolbar is being added as default so if someone wants it later,
	// can get the handle and work. If we don't add it now, this cannot be added later. 
	// 
	config.tbar = new Ext.Toolbar({hidden:true});
	if(dynamic)
	{
	    config.bbar = new Ext.PagingToolbar({
            pageSize: pageSize,
            store: dataModel,
            emptyMsg: "No topics to display"
        });	
		if (onChangeFunction && (insertButtonLabel || deleteButtonLabel)) {
			// Add the delete button to EditableGridView toolbar
			// Insert is not supported, since there's no way of knowing
			// when the row is sufficiently complete to call the back
			// end to do the insert. This could be done later by providing
			// a required flag on CFGRIDCOLUMN.
			
			var toolbar =  config.bbar;
			if (insertButtonLabel) {
				toolbar.addButton({text: insertButtonLabel,handler: $G.insertRow,scope: actions});
				toolbar.addButton({text: " save ",handler: $G.saveNewRecord,scope: actions});
				toolbar.addButton({text: " cancel ",handler: $G.cancelNewRecord,scope: actions});
			}
			if (deleteButtonLabel) 
				toolbar.addButton({text: deleteButtonLabel,handler: $G.deleteRow,scope: actions});
		}
	}
	if (edit && !dynamic)
	{
	    if (insertButtonLabel || deleteButtonLabel)
		{
			var bbar = new Ext.Toolbar();	
			if (insertButtonLabel) {
				bbar.addButton({text: insertButtonLabel, xtype:'button', handler: $G.insertRow,scope: actions});
			}
			if (deleteButtonLabel) 
				bbar.addButton({text: deleteButtonLabel,handler: $G.deleteRow,scope: actions});
		}
		else
		{
			 // As default, adding bottomtool as line with toptoolbar implementation. bug: 82064
			var bbar = new Ext.Toolbar({hidden:true});
		}
		config.bbar = bbar;
			 	
	}
	
	if (edit)
	{
		  config.clicksToEdit = 1;
		  grid = new Ext.grid.EditorGridPanel(config);
	}
	else
	{
		  grid = new Ext.grid.GridPanel(config);
	}
	
	//bug: 82079, support for case insensitive sorting. 
	$G.Ext_caseInsensitive_sorting();
	
	dataModel.addListener("load", $G.Actions.onLoad, actions, {delay: 50});
	// Column to remove CFGRIDROWINDEX..
   	grid.view.colMenu.addListener("beforeshow", function(menu){
	   	var count = colModel.getColumnCount();
	   	for(var i = 0; i < count; i++){
	    	if("CFGRIDROWINDEX" == colModel.getDataIndex(i)) {
			 	menu.remove(menu.items["items"][i]);
	         	break;
	      	}
	   	}
	},this);
	
	actions.grid = grid;
	grid.render();

	if (!dynamic)
	{
		dataModel.addListener("load", $G.Actions.onLoad, actions, {delay: 50});	
		dataModel.load();
	}

	if (dynamic)
	{
		// Register the load listener for the data model so
		// that the selected row variable can be reset
		// BugId: 76849. Regression in Ext3.0 as they have introdued deferred row rendering.
		// Defining a delay of 50 ms is a workaround and will have proper fix later.  
		dataModel.addListener("load", $G.Actions.onLoad, actions, {delay: 50});
		dataModel._cf_errorHandler = onErrorFunction;
		dataModel.proxy._cf_actions = actions;		
		dataModel.load({params:{start:0,limit:pageSize}});
	}
	else
	{
		// Apply styles right away for static grids
		$G.applyStyles(actions)
	}
	
	if (bindElements)
	{
		ColdFusion.Bind.register(bindElements, {actions:actions}, $G.bindHandler, false);
	}
	
	$L.info("grid.init.created", "widget", [id]);
	
	actions.init(id, name, formId, cellClickInfo, dynamic, edit, onChangeFunction, onErrorFunction,
				preservePageOnSort, pageSize, selectOnLoad, grouping);
};


$G.applyStyles = function(actions)
{
	// If styles have been applied already, short circuit here
	if (actions.stylesApplied) return;
	
	Ext.util.CSS.createStyleSheet(actions.styles);
	
	actions.stylesApplied = true;
};

// Specialized bind handler for grid. Whenever the grid bind has to be
// evaluated, simply reset the data model state by going back to page 1
$G.bindHandler = function(e, params)
{
	$G.refresh(params.actions.id);
}
$G.bindHandler._cf_bindhandler = true; // marker for custom event propagation

//A function that refreshes the content of the grid for the gridId passed to
//the function 
$G.refresh = function(gridId, preservePage)
{
	var actions = ColdFusion.objectCache[gridId];
	if(actions && $G.Actions.prototype.isPrototypeOf(actions) == true)
	{
		var dataSource = actions.grid.getStore();

		if(actions.dynamic)
		{
			// Reset internal state			
			actions.editOldValue = null;
			actions.selectedRow = -1;
			
			if (preservePage)
			{
				dataSource.reload();
			}
			else
			{
				dataSource.lastOptions.page = 1;
				dataSource.currentPage = 1;
				dataSource.reload({params:{start:0,limit:actions.pageSize}});
			}
		}
	}
	else
	{
		ColdFusion.handleError(null, "grid.refresh.notfound", "widget", [gridId], null, null, true);
		return;
	}
	
	if(actions.multiRowSelection) {
		//Bug:81252 This will return TD element of first header which represents selection checkbox. The div elemnt which will be 
		// first child has class 'x-grid3-hd-checker-on' which display ticked image which needs to be replaced.  
		var tdElement = actions.grid.getView().getHeaderCell(0);
		if (tdElement != null) {
			var extEle = Ext.Element.get(tdElement).first();
			if(extEle) extEle.replaceClass("x-grid3-hd-checker-on");
		}
	}

	$L.info("grid.refresh.success", "widget", [gridId]);
};

// bug: 82079. Ext grid Sorting is case sensitive. Need to override to make it case insensitive
	$G.Ext_caseInsensitive_sorting = function(){
		Ext.data.Store.prototype.sortData = function(f, direction){
			direction = direction || 'ASC';
			var st = this.fields.get(f).sortType;
			var fn = function(r1, r2){
				var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
				// ADDED THIS FOR CASE INSENSITIVE SORT
				if (v1.toLowerCase) {
					v1 = v1.toLowerCase();
					v2 = v2.toLowerCase();
				}
				return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
			};
			this.data.sort(direction, fn);
			if (this.snapshot && this.snapshot != this.data) {
				this.snapshot.sort(direction, fn);
			}
		}
	} 



$G.getTopToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.getTopToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	return actions.grid.getTopToolbar();	
}

$G.showTopToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.showTopToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	var tbar = actions.grid.getTopToolbar();
	if(!tbar)
	{
		ColdFusion.handleError(null, "grid.showTopToolbar.toolbarNotDefined", "widget", [gridId], null, null, true);
		return;
	}
	tbar.show();			
}

$G.hideTopToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.hideTopToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	var tbar = actions.grid.getTopToolbar();
	if(!tbar)
	{
		ColdFusion.handleError(null, "grid.hideTopToolbar.toolbarNotDefined", "widget", [gridId], null, null, true);
		return;
	}
	tbar.hide();			
}

$G.refreshTopToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.refreshTopToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	var tbar = actions.grid.getTopToolbar();
	if(!tbar)
	{
		ColdFusion.handleError(null, "grid.refreshTopToolbar.toolbarNotDefined", "widget", [gridId], null, null, true);
		return;
	}
	tbar.doLayout();
	if(tbar.isVisible() == false)
		tbar.show();			
}


$G.getBottomToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.getBottomToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	return actions.grid.getBottomToolbar();	
}

$G.showBottomToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.showBottomToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	var tbar = actions.grid.getBottomToolbar();
	if(!tbar)
	{
		ColdFusion.handleError(null, "grid.showBottomToolbar.toolbarNotDefined", "widget", [gridId], null, null, true);
		return;
	}
	tbar.show();			
}

$G.hideBottomToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.hideBottomToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	var tbar = actions.grid.getBottomToolbar(); 
	if(!tbar)
	{
		ColdFusion.handleError(null, "grid.hideBottomToolbar.toolbarNotDefined", "widget", [gridId], null, null, true);
		return;
	}
	tbar.hide();			
}

$G.refreshBottomToolbar = function (gridId)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.refreshBottomToolbar.notfound", "widget", [gridId], null, null, true);
		return;
	}
	var tbar = actions.grid.getBottomToolbar(); 
	if(!tbar)
	{
		ColdFusion.handleError(null, "grid.refreshBottomToolbar.toolbarNotDefined", "widget", [gridId], null, null, true);
		return;
	}
	tbar.doLayout();
	if(tbar.isVisible() == false)
		tbar.show();			
			
}


// Sorts a grid on the specified column name, in the specified direction
$G.sort = function(gridId, colName, sortDir)
{
	var actions = ColdFusion.objectCache[gridId];
	if(!actions)
	{
		ColdFusion.handleError(null, "grid.sort.notfound", "widget", [gridId], null, null, true);
		return;
	}
	
	colName = colName.toUpperCase();
	
	// validate the column name
	var colIdx = -1;
	var colConfig = actions.grid.getColumnModel().config;
	for (var i=0; i<colConfig.length-1; i++)
	{
		if (colName == colConfig[i].colName)
		{
			colIdx = i;
			break;
		}
	}
	
	if (colIdx == -1)
	{
		ColdFusion.handleError(null, "grid.sort.colnotfound", "widget", [colName, gridId], null, null, true);
		return;
	}
	
	if (!sortDir) sortDir = "ASC";
	sortDir = sortDir.toUpperCase();
	if (sortDir != "ASC" && sortDir != "DESC")
	{
		ColdFusion.handleError(null, "grid.sort.invalidsortdir", "widget", [sortDir, gridId], null, null, true);
		return;
	}
	
	var dataSource = actions.grid.getStore();
	dataSource.sort(colName, sortDir);
};

//A function that returns the underlying grid object from the UI framework given
//the name of the grid
$G.getGridObject = function(gridname)
{
	if(!gridname)
	{
		ColdFusion.handleError(null, "grid.getgridobject.missinggridname", "widget", null, null, null, true);
		return;
	}
	
	var actions = ColdFusion.objectCache[gridname];
	
	if(actions == null || $G.Actions.prototype.isPrototypeOf(actions) == false)
	{
		ColdFusion.handleError(null, "grid.getgridobject.notfound", "widget", [gridname], null, null, true);
		return;
	}
	
	return actions.grid;	
};

//For multiRowSelection case, this  function returns datas for all seletced rows

$G.getSelectedRows= function(gridname)
{
	if(!gridname)
	{
		ColdFusion.handleError(null, "grid.getSelectedRowData.missinggridname", "widget", null, null, null, true);
		return;
	}	
	var actions = ColdFusion.objectCache[gridname];
	var dataArray = new Array();
	// Same Api works well with single Row selection or MultipleRow Selection.
	var gridSelectionModel = actions.grid.getSelectionModel();
	var selectedRows = gridSelectionModel.getSelections();
	// DataSource original RowData  will contain all the columns of query. Extra columns which are not
	// defined as gridcolumn data needs to be filtered out.
	var colModel = actions.grid.getColumnModel();
	var startIndex = 0;
	if(actions.multiRowSelection === true && actions.dynamic  === false)
		startIndex++;
				
	for (i = 0; i < selectedRows.length; i++) 
	{
		 var dataRow = selectedRows[i].data;
		 // dataRow defined as gridcolumn data needs to be filtered out.
		 var currentRowData = {};
		 for (var index=startIndex; index < colModel.getColumnCount()-1; index++) {
			var key = colModel.getDataIndex(index);
			currentRowData[key] = dataRow[key];  
		 }		 		 
		 dataArray[i] = currentRowData;
	}						
	return dataArray;
}

$G.clearSelectedRows = function(gridname)
{
	if(!gridname)
	{
		ColdFusion.handleError(null, "grid.getSelectedRowData.missinggridname", "widget", null, null, null, true);
		return;
	}	
	var actions = ColdFusion.objectCache[gridname];
	// clearSelections Api is applicable for Single and Multiple rows seletion.	
	var gridSelectionModel = actions.grid.getSelectionModel();
	gridSelectionModel.clearSelections();

	if(actions.multiRowSelection) {
		//Bug:81185 This will return TD element of first header which represents selection checkbox. The div elemnt which will be 
		// first child has class 'x-grid3-hd-checker-on' which display ticked image which needs to be replaced.  
		var tdElement = actions.grid.getView().getHeaderCell(0);
		if (tdElement != null) {
			var extEle = Ext.Element.get(tdElement).first();
			if(extEle) extEle.replaceClass("x-grid3-hd-checker-on");
		}
	}
} 


// Models all actions and event handlers for a grid
// grid - the grid to which this object is being attached
// cellClickInfo - data for the cell click handler, to append
//                 URL information on cell click
$G.Actions = function(gridId) 
{
	this.gridId = gridId;
	this.init = $G.Actions.init;
	this.onChangeHandler = $G.Actions.onChangeHandler;
	this.onChangeHandler_MultiRowsDelete = $G.Actions.onChangeHandler_MultiRowsDelete;
	this.selectionChangeEvent = new ColdFusion.Event.CustomEvent("cfGridSelectionChange", gridId);
	this.fireSelectionChangeEvent = $G.fireSelectionChangeEvent;
	this._cf_getAttribute = $G.Actions._cf_getAttribute;
	this._cf_register = $G.Actions._cf_register;
};

// Initializes the actions object
$G.Actions.init = function(id, gridName, formId, cellClickInfo, dynamic, edit,
										onChangeFunction, onErrorFunction, preservePageOnSort, 
										pageSize, selectOnLoad, grouping)
{
	this.id = id;
	this.gridName = gridName;
	this.formId = formId;
	this.form = document.getElementById(formId);
	this.cellClickInfo = cellClickInfo;
	this.edit = edit;
	this.onChangeFunction = onChangeFunction;
	this.onErrorFunction = onErrorFunction;
	this.preservePageOnSort = preservePageOnSort;
	this.pageSize = pageSize;
	this.selectedRow = -1;
	this.selectOnLoad = selectOnLoad;
	this.grouping = grouping;
	
	this.grid.addListener('cellclick', $G.cellClick, this, true);

	// Add in the hidden field to maintain edit and selection state
	this.editField = document.createElement('input');
	this.editField.setAttribute('name', gridName);
	this.editField.setAttribute('type', 'hidden');
	this.form.appendChild(this.editField);
	
	if (edit)
	{
		if (!dynamic)
		{
			var colConfig = this.grid.getColumnModel().config;
			this.editFieldPrefix = '__CFGRID__EDIT__=';
			
			// Now add the columns in
			var i = 0;
			var columnCount = colConfig.length-1
			// In case of static/multirow grid, first column (which is checkbox for multi selection) needs o be ignored.
			if (this.multiRowSelection === true && this.dynamic === false) {
				i++;
				columnCount--;
			}
			this.editFieldPrefix += columnCount + $G.Actions.fieldSep;	 		
			var firstEntry = true;
			for (i; i<colConfig.length-1; i++)
			{
				if (!firstEntry) this.editFieldPrefix += $G.Actions.fieldSep;
				this.editFieldPrefix += colConfig[i].colName;
				this.editFieldPrefix += $G.Actions.valueSep;
				if (colConfig[i].editor)
				{
					this.editFieldPrefix += 'Y';
				}
				else
				{
					this.editFieldPrefix += 'N';
				}
				firstEntry = false;
			}
			
			// Add a trailing field separator
			this.editFieldPrefix += $G.Actions.fieldSep;
			
			// Initialize edit field state
			// This maintains an array of actions performed on each row in the grid.
			// The format follows that which needs to be sent to the editField:
			// It contains an Object with two keys: action and values. Action is a 
			// single character: 'I' (insert), 'U' (update) or 'D' (delete).
			// values is an array with length of the column count. Every element
			// has 2 values - the original value of the column and the new value. 
		}
		
		this.editFieldState = [];
		this.editFieldState.length = this.grid.getStore().getTotalCount();
		
		// Initial value
		$G.Actions.computeEditField(this);
		this.insertInProgress = false;
		this.insertEvent = null;
		// Register the edit listeners
	    this.grid.addListener('beforeedit', $G.Actions.beforeEdit, this, true);
		this.grid.addListener('afteredit', $G.Actions.afterEdit, this, true);
	}
	
	if (dynamic)
	{
		this.grid.getStore().addListener('beforeload', $G.Actions.beforeLoad, this, true);
	}
	
	this.grid.getSelectionModel().addListener('rowselect', $G.rowSelect, this, true);
	this.grid.getSelectionModel().addListener('beforerowselect', $G.beforeRowSelect, this, true);

	if (selectOnLoad && !grouping) this.grid.getSelectionModel().selectFirstRow();
};

$G.Actions.beforeLoad = function(store, options)
{
	var sortState = store.getSortState();
	//BugId:71838 
	//Initially sortInfo will not be defined, and comparing this with store sortinfo may
	// not be correct. This was causing a problem on first click of nextpage icon. In this case
	// sortChanged was being set to true, which forces it to set start parameter to  0 (which is nothing but 
	// loading first page again); 
	var sortChanged = ((typeof this.sortCol != 'undefined' &&  sortState.field != this.sortCol)
						||(typeof this.direction != 'undefined' && sortState.direction != this.sortDir));

	if (sortChanged && !this.preservePageOnSort) options.params.start = 0;
	
	this.sortCol = sortState.field;
	this.sortDir = sortState.direction;
};

// onLoad listener, to reset row selections and fire
// the selection change event when paging through a grid
$G.Actions.onLoad = function()
{
	this.editOldValue = null;
	this.selectedRow = -1;
	this.insertInProgress = false;
	var selectRow = 0;
	
	// Make the selection only if it's a static grid, or
	// if it is a dynamic grid with bindOnLoad=true
	if ((this.bindOnLoad || !this.dynamic) && this.selectOnLoad && !this.grouping)
		this.grid.getSelectionModel().selectRow(selectRow, false);

	// call customized onLoad if onload is being called first time after grid is rendered. 
	// FirstTime is being traced by a flag 'gridRendered'
    if (!this.gridRendered && this.onLoadFunction && typeof this.onLoadFunction == 'function') 
	{
		this.gridRendered = true;
		this.onLoadFunction.call(null, this.grid);
	}

		
};

// Provides a mechanism to get the value of the named column (attribute)
// for the currently selected row.
$G.Actions._cf_getAttribute = function(attribute)
{
	attribute = attribute.toUpperCase();
	
	var rowIndex = this.selectedRow; // No multiple select
	
	var attrValue = null;

	if (rowIndex != 0 && (!rowIndex || rowIndex == -1))
	{
		return attrValue;
	}
	
	var ds = this.grid.getStore();
	var selRecord = (this.dynamic) ? ds.getAt(rowIndex) : ds.getById(rowIndex);
	attrValue = selRecord.get(attribute);
	
	return attrValue;
}

$G.Actions._cf_register = function(event, bindHandler, bindParams)
{
	this.selectionChangeEvent.subscribe(bindHandler, bindParams);
}

// Row select listener, populates hidden field to maintain row selection
// state on form submission
$G.rowSelect = function(selectionModel, row)
{
	var editFieldValue = '';

	var selRecord = selectionModel.getSelected();
	var selRowId = selRecord.get('CFGRIDROWINDEX') || row;

	// Only single selection model, so assume a single row
	if (this.selectedRow != selRowId)
	{
		this.selectedRow = selRowId;
		var first = true;
		for (col in selRecord.data)
		{
			if (col == 'CFGRIDROWINDEX') continue;
			
			// For multirow select and static grid, first column will represent a generic tick/untick image (no column header/name) which  
			// is not part of a record/row.
			if( typeof col == 'undefined' || col == 'undefined') continue;
			// Don't append a trailing ';' for the last field
			if (!first) editFieldValue += '; ';
			
			editFieldValue += '__CFGRID__COLUMN__=' + col + '; ';
			editFieldValue += '__CFGRID__DATA__=' + selRecord.data[col];
			
			first = false;
		}
		// Now fire the change event out to all listener
		this.fireSelectionChangeEvent();
		 //81652: In multiple operation, if first action was insert, then for next operation which may be
		 // update, insert flag needs to be reset.
		 this.insertInProgress = false;

	}
	// commneted this for Bug id: 81222.
	//this.editField.setAttribute('value',editFieldValue);
};

$G.beforeRowSelect = function(selectionModel, row)
{
	var ds = this.grid.getStore();
	var selRecord = ds.getAt(row);
	return !$G.isNullRow(selRecord.data);
};

$G.isNullRow = function(data)
{
	var nullRow = true;
	for (col in data)
	{
		if (data[col] != null)
		{ 
			nullRow = false;
			break;
		}
	}
	return nullRow;
};

// Fires the selection change event to all listeners
// on the grid HTML element's change event
$G.fireSelectionChangeEvent = function()
{
	$L.info("grid.fireselectionchangeevent.fire", "widget", [this.id]);
	this.selectionChangeEvent.fire();
}

// Cell click listener, used for managing HREFs from columns
$G.cellClick = function(grid, rowIndex, columnIndex)
{
	var colInfo = this.cellClickInfo.colInfo[columnIndex];
	if (colInfo) // colInfo must be null for editable cells
	{
		var currentRow = grid.getSelectionModel().getSelected();
		
		// Check if url is actually pointing to a grid column
		// If it is, get the URL from the column
		var url = currentRow.get(colInfo.href.toUpperCase());
		if (!url) url = colInfo.href;
		
		var hrefKey = colInfo.hrefKey; // Pointer to column index, not name
		var target = colInfo.target;
		var appendKey = this.appendKey; // Need this, if hrefKey is not present, append all
			
		if (this.cellClickInfo.appendKey)
		{
			var hrefKeyValue;
			if (hrefKey || hrefKey == 0) // just testing for hrefKey will return false for 0 values
			{
				var clickedRecord = grid.getStore().getAt(rowIndex);
				
				var clickedColName = grid.getColumnModel().config[hrefKey].dataIndex;
				
				hrefKeyValue = clickedRecord.get(clickedColName);
			}
			else
			{
				var colConfig = this.grid.getColumnModel().config;
				hrefKeyValue = currentRow.get(colConfig[0].dataIndex);
				for (var i=1; i<colConfig.length-1; i++)
				{
					hrefKeyValue += ',' + currentRow.get(colConfig[i].dataIndex);
				}
			}
				
			if (url.indexOf('?') != -1)
			{
				url += '&CFGRIDKEY=' + hrefKeyValue;
			}
			else
			{
				url += '?CFGRIDKEY=' + hrefKeyValue;
			}
		}
			
		if (target)
		{
			target = target.toLowerCase();
			if (target == "_top")
			{
				target = "top";
			}
			else if (target == "_parent")
			{
				target = "parent";
			}
			else if (target == "_self")
			{
				target = window.name;
			}
			else if (target == "_blank")
			{
				// Special handling for _blank
				window.open(encodeURI(url));
				return;
			}
			
			if (!parent[target])
			{
				ColdFusion.handleError(null, "grid.cellclick.targetnotfound", "widget", [target]);
				return;
			}
			parent[target].location = encodeURI(url);
		}
		else
		{
			window.location = encodeURI(url);
		}
	}
};

// Inserts a row into the dataset and updates the hidden
// field maintaining edit state
$G.insertRow = function()
{
	if(this.insertInProgress && this.dynamic)
	{
		ColdFusion.handleError(null, "Multiple row insert is not supported", "Grid", [this.gridId], null, null, true);
		return;
	}
	var rowEditState = {action:'I', values:[]};
	var colModel = this.grid.getColumnModel();
	var dataSource = this.grid.getStore();
	var insertData = {};
	
	for (var i=0; i<colModel.getColumnCount()-1; i++)
	{
		var initialValue = '';
		var editor = colModel.getCellEditor(i, 0); 
		if (editor && Ext.form.Checkbox.prototype.isPrototypeOf(editor.field))
		{
			initialValue = false;
		}
		rowEditState.values[i] = [initialValue,initialValue];
		insertData[colModel.getDataIndex(i)] = initialValue;
	}

	insertData['CFGRIDROWINDEX'] = dataSource.getCount()+1;
	
	dataSource.add(new Ext.data.Record(insertData));
    if(this.dynamic == true)
	{
		this.selectedRow = dataSource.getCount();
	}	
	this.editFieldState.push(rowEditState);
	this.grid.getSelectionModel().selectRow(dataSource.getCount()-1);	
	this.insertInProgress = true;	
	$G.Actions.computeEditField(this);
};

$G.saveNewRecord = function()
{
	if(!this.insertInProgress){
		return ;
	}
	var rowIndex = this.selectedRow;
	var event = this.insertEvent;
	if (rowIndex == -1) return;
	if (this.onChangeFunction)
	{
		this.onChangeHandler('I', rowIndex-1, event , $G.insertRowCallback);
	}
	else if(this.dynamic == false)
	{
		var dataSource = this.grid.getStore();
		var record = event.record;
		var newRecordArray = new Array(1);
		newRecordArray[0] = record;
		var recordOld = dataSource.getAt(this.selectedRow-1);
		dataSource.remove(recordOld);
		dataSource.add(newRecordArray);
	}
	this.insertInProgress = false;
	this.insertEvent = null;			
}

$G.cancelNewRecord = function()
{
	if(!this.insertInProgress){
		return ;
	}
	this.editFieldState.pop();
	var dataSource = this.grid.getStore();
	var record = dataSource.getAt(this.selectedRow-1);
	dataSource.remove(record);
	this.insertInProgress = false;
	this.insertEvent = null;
	this.selectedRow = this.selectedrow -1; 
}

// Deletes a row from the dataset and updates the hidden
// field maintaining edit state
$G.deleteRow = function()
{
	var selectedRows = null;
	var rowIndex; 
	if(this.multiRowSelection === true)
	{
		var checkBoxSelectionModule = this.grid.getSelectionModel();
		selectedRows = checkBoxSelectionModule.getSelections(); 
	}

	if (selectedRows == null) {
		rowIndex = this.selectedRow;
	}
	// rowIndex is being considered for SingleRowSelection and selectedRows for MultiRowSelection.  
	if (rowIndex == -1 && selectedRows == null) 
		return;

	if (this.onChangeFunction)
	{
		if (selectedRows != null) {
			this.onChangeHandler_MultiRowsDelete('D', selectedRows, null, $G.deleteRowCallback);
		}
		else {
			this.onChangeHandler('D', rowIndex, null, $G.deleteRowCallback);
		}
	}
	else if (!this.dynamic)
	{
		var dataSource = this.grid.getStore();
		if(selectedRows != null)
		{
			for(i=0; i< selectedRows.length; i++)
			{
				var currentIndex = dataSource.indexOf(selectedRows[i]);
				var rowEditState = this.editFieldState[currentIndex];
				if (rowEditState)
				{
					rowEditState.action = 'D';
				}
				else
				{
					rowEditState = $G.Actions.initEditState(this, 'D', selectedRows[i],currentIndex+1); 
				}
			}
			
			// Remove the row from the data model	
			for (i = 0; i < selectedRows.length; i++) 
			{
				dataSource.remove(selectedRows[i]);	
			}
		}
		else
		{
			var rowEditState = this.editFieldState[rowIndex-1];
			if (rowEditState)
			{
				rowEditState.action = 'D';
			}
			else
			{
				var record = this.grid.getStore().getById(rowIndex);
				rowEditState = $G.Actions.initEditState(this, 'D', record,rowIndex);
			}
			// Remove the row from the data model	
			dataSource.remove(this.grid.getSelectionModel().getSelected());
			
		}
		
		$G.Actions.computeEditField(this);
		
		this.grid.stopEditing();
		//deselect the row on stop editing
		this.selectedRow = -1;
	
	}
};

// Called when a live delete of a row completes insertRowCallback
$G.deleteRowCallback = function(event, params)
{
	var dataSource = params._cf_grid.getStore();
	var actions = params._cf_grid_properties;
	var params = dataSource.lastOptions.params;
	var key = 'start';
	if(dataSource.getCount()== 1)
	{
		//79337: If the current page is the first page, then no need to change the start row.
		if(params.start >=  params.limit)
			params.start = params.start - params.limit; 
		dataSource.reload(params);
	}
	else
		dataSource.reload();			
	
	if(actions.multiRowSelection) { 
		//Bug:81252 This will return TD element of first header which represents selection checkbox. The div elemnt which will be 
		// first child has class 'x-grid3-hd-checker-on' which display ticked image which needs to be replaced.  
		var tdElement = actions.grid.getView().getHeaderCell(0);
		if (tdElement != null) {
			var extEle = Ext.Element.get(tdElement).first();
			if(extEle) extEle.replaceClass("x-grid3-hd-checker-on");
		}
	}
		
};

$G.insertRowCallback = function(event, params)
{
	var dataSource = params._cf_grid.getStore();
	var actions = params._cf_grid.actions;
	
	// Reload the current page of data TODO!!!!
	dataSource.reload();
};


// beforeEdit event listener, sets up state for afterEdit to process
$G.Actions.beforeEdit = function(event)
{
	if ($G.isNullRow(event.record.data))
	{
		// Short circuit for null rows
		return false;
	}
	this.editColumn = event.column;
	this.editOldValue = event.value;
};

// afterEdit event listener, maintains the edit state objects and the edit
// state hidden field
$G.Actions.afterEdit = function(event)
{
    
	var editNewValue = event.value;
	if (this.insertInProgress == false && this.onChangeFunction)
	{
		this.onChangeHandler('U', this.selectedRow, event);
	}
	else if (!this.dynamic)
	{
		// If some rows are deleted in midway, then the selectedRow will be mapped row2row with 
		// editFieldState object and while retrieving rowEditState, deleted row count needs to be added.
		// Example: If selectedRow is 5 and prior to this operation some1 deleted 2nd row, then in
		// editFieldState the corresponding rowIndex will be 6. 
		var nonDeleted_editFieldIndex = $G.computeActualRow_editField(this.editFieldState, this.selectedRow);
		var rowEditState = this.editFieldState[nonDeleted_editFieldIndex-1];
		if (rowEditState)
		{
			var columnIndex = event.column;
			if(this.multiRowSelection === true && this.insertInProgress == true)
				columnIndex = columnIndex -1;
			rowEditState.values[columnIndex][1] = editNewValue;
			
		}
		else
		{
			var record = this.grid.getStore().getById(this.selectedRow);
			rowEditState = $G.Actions.initEditState(this, 'U', record ,nonDeleted_editFieldIndex);
			
			// While this may look weird, it needs doing - ensures that
			// editOldValue gets a copy, rather than a reference, of this.editOldValue
			var editOldValue = this.editOldValue + '';
			// For date column type (which is being checked by Date specific function "getDayOfYear")
			// some extra processing is required to synchronized the original and changed date format and convert it to CF standard function.
			if (editNewValue.getDayOfYear) {
				if(editOldValue && typeof editOldValue == 'string')
					editOldValue = new Date(editOldValue);
				rowEditState.values[event.column][1] = editNewValue.format("F, j Y H:i:s");
				rowEditState.values[event.column][0] = editOldValue ?  editOldValue.format("F, j Y H:i:s") : editOldValue;
			}
			else {
				rowEditState.values[event.column][0] = editOldValue;
				rowEditState.values[event.column][1] = editNewValue;
			}
		}
		
		$G.Actions.computeEditField(this);
	}
	
	this.editOldValue = null;
	
	// Fire a selection change, so bound controls can pick
	// up the edit changes
	this.fireSelectionChangeEvent();
};

// Look for actual rowIndex in "editFieldState" considering non deleted record only.
$G.computeActualRow_editField = function(editFieldState, rowIndex)
{
	if(editFieldState.length == rowIndex)
		return rowIndex;
	var nonDeleteRecordCount = 0;
	var index =0;		
	for (; index < editFieldState.length && nonDeleteRecordCount < rowIndex; index++) {
		var rowEditState = editFieldState[index];
		if (!rowEditState || rowEditState.action != 'D') 
			nonDeleteRecordCount++;	
	}
	return index;		
}

// Support for live editing of a grid, only update and delete for now
$G.Actions.onChangeHandler = function(action, rowIndex, event, callback)
{
	var rowData = {};
	var changed = {};
	
	var data = event ? event.record.data : this.grid.getStore().getAt(rowIndex).data;

	for (col in data) rowData[col] = data[col];
	if (action == 'U')
	{
		// Bug:82371, If the column value didn't change then we can by pass onChange event handler. 
		if((event.value == null || event.value == '') && (event.originalValue == null || event.originalValue == ''))
			return; 
		// For date column type (which is being checked with Date specific function "getDayOfYear")some extra processing is required.
		// 1. Even if there is no change of data, onChange gets fires which needs to be by passed.
		// 2. Original date and changes date are in different format, need to convert then in CF based 
		//    based date format (ie: January, 22 2010 00:00:00).  
		if (event.value && event.value.getDayOfYear) {
			if (typeof event.originalValue == 'string') 
			{
				var oldDate = new Date(event.originalValue);
			}
			
			if (oldDate != null && oldDate.getElapsed(event.value) == 0)
			{
				return;
			}
			else 
			{
				rowData[event.field] = event.originalValue; // reset column to old value
				changed[event.field] = event.value.format("F, j Y H:i:s"); // Set up the changed column					
			}
			
		}
		else 
		{
			rowData[event.field] = event.originalValue; // reset column to old value
			changed[event.field] = event.value; // Set up the changed column
		}
	}
	
	this.onChangeFunction(action, rowData, changed, callback, this.grid, this.onErrorFunction, this);
}

// For deleting rows (single or multiple) when multiRowSelection is enabled. 
$G.Actions.onChangeHandler_MultiRowsDelete = function(action, records, event, callback)
{
	var rowsData = new Array();
	var changed = {};
	for(i=0; i < records.length; i++)
	{
		rowsData[i] = records[i].data;
	}
	this.onChangeFunction(action, rowsData, changed, callback, this.grid, this.onErrorFunction, this);
}


// Utility function to initialize edit state
$G.Actions.initEditState = function(actions, action, record ,rowIndex)
{
	var rowEditState = {action:action, values:[]};
	var colModel = actions.grid.getColumnModel();
	var colCount = colModel.getColumnCount()-1;
	
	rowEditState.values.length = colCount;
	var i = 0;
	// In case of static multirow, first column needs to be ignored.
	if(actions.multiRowSelection === true && actions.dynamic  === false)
		i = i++;		
	for (i; i<colCount; i++)
	{

		var value = record.get(colModel.getDataIndex(i));
		rowEditState.values[i] = [value,value];
	}
	
	actions.editFieldState[rowIndex-1] = rowEditState;
	
	return rowEditState;
};

// Constants for the grid edit field state
$G.Actions.fieldSep = eval("'\\u0001'");
$G.Actions.valueSep = eval("'\\u0002'");
$G.Actions.nullValue = eval("'\\u0003'");

// Computes and assigns a value to the edit field based on the
// edit state in the actions object.
$G.Actions.computeEditField = function(actions)
{
	if(actions.dynamic) return;
	var editFieldValue = actions.editFieldPrefix;
	var editFieldState = actions.editFieldState;
	var colConfig = actions.grid.getColumnModel().config;	
	var modifiedRowCount = 0;	
	var rowState = '';
	
	// Now add in all the row state
		
	for (var i= 0; i<editFieldState.length; i++)
	{
		var rowEditState = editFieldState[i];
		if (rowEditState)
		{
			modifiedRowCount++;
			rowState += $G.Actions.fieldSep;
			rowState += rowEditState.action + $G.Actions.valueSep;
			
			var values = rowEditState.values;
		
			if(actions.multiRowSelection === true && actions.dynamic  === false && rowEditState.action != 'I')
			{
				// To remove first elements of array which is empty data for multiRow checkbox.
				values = values.slice(1, values.length);
			}
			for (var j=0; j<values.length; j++)
			{
				if (j > 0)
				{
					rowState += $G.Actions.valueSep;
				}
				
				var oldValue = ($G.Actions.isNull(values[j][0])) ? $G.Actions.nullValue : values[j][0];
				var newValue = ($G.Actions.isNull(values[j][1])) ? $G.Actions.nullValue : values[j][1];
				
				// In case of insert, a non editable column needs to be by passed as per server side logic.
				var columnIndex = j;
				
				if(actions.multiRowSelection === true)
				{
					columnIndex++;
				}
					
				if (rowEditState.action != 'I' || (rowEditState.action == 'I' && colConfig[columnIndex].editor)) 
				{
					// Bug 82370: Date columns gets reformated in Ext code, which needs to changed as
					// per CF format. 
					if(colConfig[columnIndex].type == 'date' )
					{  
						if (newValue != null && newValue != $G.Actions.nullValue) {
							if (typeof newValue == 'string') 
								newValue = new Date(newValue);
							newValue = newValue.format("F, j Y H:i:s");
						}
						if (oldValue != null && oldValue != $G.Actions.nullValue) {
							if (typeof oldValue == 'string') 
								oldValue = new Date(oldValue);							
							oldValue = oldValue.format("F, j Y H:i:s");
						}
					}
					rowState += newValue;
					if (rowEditState.action == 'U' &&  colConfig[columnIndex].editor) {
						rowState += $G.Actions.valueSep + oldValue;
					}
				}
			}
		}
	}
	
	editFieldValue += modifiedRowCount + rowState;
	
	actions.editField.setAttribute('value',editFieldValue);
};

$G.Actions.isNull = function(val)
{
	var ret = (val == null || typeof(val) == 'undefined' || val.length == 0);
	return ret;
};

$G.loadData = function(data, params)
{
	params._cf_gridDataProxy.loadResponse(data, params);
	var actions = ColdFusion.objectCache[params._cf_gridname];
	$G.applyStyles(actions);
	$L.info("grid.loaddata.loaded", "widget", [params._cf_gridname]);
	//Bug 70285: If totalrowcount is defined, check to see if its zero. If zero then 
	//fire the selectionchangeevent to make sure that empty load also qualifies
	//as a valid change to the grid and not just selection of a row.
	if($G.Actions.isNull(data.TOTALROWCOUNT) == false && data.TOTALROWCOUNT == 0)
	{
		actions.fireSelectionChangeEvent();
	}
};

$G.printObject = function(obj)
{
	var str = '';
	for(key in obj)
	{
		str  =  str + '  ' + key + '=';
		value = obj[key] ;
//		if(typeof(value) == Object){
//        	value = $G.printObject(value);		
//		}
		str += value;
	}
	return str;
};

$G.formatBoolean = function(v, p, record){       
      // alert('v value: '  + v); 
    //   p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
  };
  
$G.formatDate = function(dateValue, p, record)
{
//  Need to create Date Object if same has not done already.
	if(dateValue && !dateValue.dateFormat)
		dateValue = new Date(dateValue);

	// If date format is not defined, assign default format.
	var format = this.dateFormat ? this.dateFormat : 'm/d/y';
	return dateValue ?  dateValue.dateFormat(format) : '';
}  

$G.convertDate = function(dateValue, p, record)
{
	// Need to create Date Object if same has not done already.
	if(dateValue && !dateValue.dateFormat)
		dateValue = new Date(dateValue);
	// If date format is not defined, assign default format.
	var format = this.dateFormat ? this.dateFormat : 'm/d/y';
	return dateValue;
	//return dateValue ?  dateValue.dateFormat(format) : '';
}  


// CF implementation of the Ext DataProxy, for dynamic grids
$G.ExtProxy = function(bindHandler, errorHandler)
{
	// Added for Ext3.0 upgrade..
	this.api = 
	 {
    	load : true,
    	create : undefined,
    	save : undefined,
    	destroy : undefined
	};
	
	$G.ExtProxy.superclass.constructor.call(this);
	this.bindHandler = bindHandler;
	this.errorHandler = errorHandler;
};

Ext.extend($G.ExtProxy, Ext.data.DataProxy,
{
	// We need this to maintain state for cases where bindOnLoad=false
	_cf_firstLoad : true,
	
	load : function(params, reader, callback, scope, arg)
	{
		if (!this._cf_actions.bindOnLoad)
		{
			// If bindOnLoad is set to false, then the grid needs to be
			// loaded up with dummy rows initially
			var lrParams = {'_cf_reader':reader, 
							'_cf_grid_errorhandler':this.errorHandler, 
							'_cf_scope':scope, 
							'_cf_gridDataProxy':this, 
							'_cf_gridname':this._cf_gridName, 
							'_cf_arg':arg, 
							'_cf_callback':callback,
							'ignoreData':true};
			
			var data = [];
			for (i=0; i<params.limit; i++) data.push(new Ext.data.Record({}));
			
			this.loadResponse(data, lrParams);
			this._cf_actions.bindOnLoad = true;
		}
		else
		{
			var pageNo = (params.start/params.limit)+1;
			
			// Set sort and dir to '' if not specified
			// These should always be passed through
			if (!params.sort) params.sort= '';
			if (!params.dir) params.dir = '';
			
			this.bindHandler(this, pageNo, params.limit, params.sort, params.dir, this.errorHandler, callback, scope, arg, reader);
		}
	},
	
	loadResponse : function(data, params)
	{
		var result = null;
		if (params.ignoreData)
		{
			result = {success:true, records:data, totalRecords:data.length}
		}
		else
		{
			var errorCode;
			if (!data)
			{
				errorCode = "grid.extproxy.loadresponse.emptyresponse";
			}
			else if (!data.TOTALROWCOUNT && data.TOTALROWCOUNT != 0)
			{
				errorCode = "grid.extproxy.loadresponse.totalrowcountmissing";
			}
			else if (!ColdFusion.Util.isInteger(data.TOTALROWCOUNT))
			{
				errorCode = "grid.extproxy.loadresponse.totalrowcountinvalid";
			}
			else if (!data.QUERY)
			{
				errorCode = "grid.extproxy.loadresponse.querymissing";
			}
			else if (!data.QUERY.COLUMNS || !ColdFusion.Util.isArray(data.QUERY.COLUMNS)
				|| !data.QUERY.DATA || !ColdFusion.Util.isArray(data.QUERY.DATA)
				|| (data.QUERY.DATA.length > 0 && !ColdFusion.Util.isArray(data.QUERY.DATA[0])))
			{
				errorCode = "grid.extproxy.loadresponse.queryinvalid";
			}
				
			if (errorCode)
			{
				ColdFusion.handleError(params._cf_grid_errorHandler, errorCode, "widget");
	
				this.fireEvent("loadexception", this, params, data, e);
				return;
			}
			
			result = params._cf_reader.readRecords(data);
		}

        this.fireEvent("load", this, params, params._cf_arg);
        params._cf_callback.call(params._cf_scope, result, params._cf_arg, true);
    },
    
    update : function(dataSet)
	{
    },
    
    updateResponse : function(dataSet)
	{
    }
});

// CF implementation of the Ext Reader, for dynamic grids
$G.ExtReader = function(colModel)
{
	this.recordType = Ext.data.Record.create(colModel);
};

Ext.extend($G.ExtReader, Ext.data.DataReader,
{
	readRecords : function(response)
	{
		var records = [];
		var cols = response.QUERY.COLUMNS;
		var data = response.QUERY.DATA;
		
		for (var i=0; i<data.length; i++)
		{
			var recordObj = {};
			for (var j=0; j<cols.length; j++)
			{
				recordObj[cols[j]] = data[i][j];
			}
			records.push(new Ext.data.Record(recordObj));
		}
		
		return {success:true, records:records, totalRecords:response.TOTALROWCOUNT};
	}
});


$G.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

 
$G.CheckColumn.prototype = {    
    init : function(grid){
        this.grid = grid;
        this.count = 0;
		this.columnIndex = this.grid.getColumnModel().findColumnIndex(this.dataIndex);
        this.grid.on('render', function(){
            var view = this.grid.getView();
            if(this.editable == true)
				view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this); 
    },
    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
			
			// Store old row  data that needs to be  passes in afterEdit Event
			var oldRecord = ColdFusion.clone(record);
			oldRecord.data = ColdFusion.clone(record.data);

            //BugId:73411 rowselect, beforeedit and afteredit Event needs to be fires explicitely as Checkbox column is a customized columnModel 
			// ans Ext.grid does not have control over it.
			this.grid.getSelectionModel().selectRow(index);
			this.grid.getSelectionModel().fireEvent('rowselect', this.grid.getSelectionModel(), index);
			this.grid.fireEvent('beforeedit', {grid:this.grid, row:index,record:record,column:this.columnIndex, field:this.dataIndex, value:record.data[this.dataIndex]});
            record.set(this.dataIndex, this.toggleBooleanValue(record.data[this.dataIndex]));
            this.grid.fireEvent('afteredit', {grid:this.grid, row:index, record:oldRecord, column:this.columnIndex, field:this.dataIndex, value:record.data[this.dataIndex], originalValue:oldRecord.data[this.dataIndex]});
        }
    },
    
	toggleBooleanValue : function(v){
	    v = typeof v == 'undefined'? 'N' : (typeof v == 'string' ? v.toUpperCase() : v) ;		
		if(v === 'Y')
			return 'N';
		if(v === 'N')
			return 'Y';
		if(v === true)
			return false;
		if(v === false)
			return true;
		if(v === 0)
			return 1;
		if(v === 1)
			return 0;
		if(v === 'YES')
			return 'NO';
		if(v === 'NO')
			return 'YES'
		if(v === 'T')
			return 'F';
		if(v === 'F')
			return 'T';			
		return 'Y'									
	},
	
    renderer : function(v, p, record){	       
       p.css += ' x-grid3-check-col-td';
	   var booleanV = false;
	   v = (typeof v == 'string') ? v.toUpperCase() : v;
	   if(typeof v != 'undefined' && (v == 1 || v == '1' || v == 'Y' || v == 'YES' || v === true || v === 'T'))
		   booleanV = true; 
       return '<div class="x-grid3-check-col'+(booleanV == true ?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
  };



} // Close cfinitgrid function
cfinitgrid(); // Call function to set everything up