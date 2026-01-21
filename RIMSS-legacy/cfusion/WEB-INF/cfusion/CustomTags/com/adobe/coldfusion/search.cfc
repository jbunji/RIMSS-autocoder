/***********************************************************************************************************
*
* Made by Raymond Camden, Jedi Master
*
*  Copyright 2011 
*  All Rights Reserved.
*
*************************************************************************************************************/

/**
 * Search Service to perform search operations in cfscript
 * @name search
 * @displayname ColdFusion Search Service 
 * @output false
 * @accessors true
 */
component extends="base" {

	property string collection;
	//property string name;
	property string category;
	property string categoryTree;
	property numeric contextBytes;
	property string contextHighlightBegin;
	property string contextHighlightEnd;
	property numeric contextPassages;
	property string criteria;
	//Language is deprecated
	property numeric maxRows;
	property string previousCriteria;
	property numeric startRow;
	property string status;
	property string suggestions;
	property string orderby;
	//Type is deprecated

	property name="properties" type="any" getter="false" setter="false";

	//service tag to invoke
	variables.tagName = "CFSEARCH";
	
    //cffeed tag attributes
    variables.tagAttributes = getSupportedTagAttributes(getTagName());

	/**
	 * Default constructor invoked when search objects are created. 
	 * @return search object
	 * @output false
	 */
    public search function init() 
	{
		if(!structisempty(arguments)) structappend(variables,arguments);
        return this;
    }

    /**
	 * Invoke the cfsearch service tag to search solr collections in cfscript
     * Usage :: new search().search(criteria="foo",maxRows=10);
	 * @output false      
	 */
    public struct function search()
    {
        //store tag attributes to be passed to the service tag in a local variable
        var tagAttributes = duplicate(getTagAttributes());

        //attributes passed to service tag action like send() override existing attributes and are discarded after the action
		if (!structisempty(arguments))
        {
    		 structappend(tagAttributes,arguments);
        }

		//trim attribute values
		tagAttributes = trimAttributes(tagAttributes);

		return super.invokeTag(getTagName(),tagAttributes);
    }

}