/***********************************************************************************************************
*
* Made by Raymond Camden, Jedi Master
*
*  Copyright 2011 
*  All Rights Reserved.
*
*************************************************************************************************************/

/**
 * Collection Service to perform solr collection operations in cfscript
 * @name collection
 * @displayname ColdFusion Collection Service 
 * @output false
 * @accessors true
 */
component extends="base" {

	property string action;
	property string categories;
	property string collection;
	property string engine;
	property string language;
	property string name;
	property string path;

	property name="properties" type="any" getter="false" setter="false";

	//service tag to invoke
	variables.tagName = "CFCOLLECTION";
	
    //cfcollection tag attributes
    variables.tagAttributes = getSupportedTagAttributes(getTagName());

	/**
	 * Default constructor invoked when search objects are created. 
	 * @return search object
	 * @output false
	 */
    public collection function init() 
	{
		if(!structisempty(arguments)) structappend(variables,arguments);
        return this;
    }


    /**
	 * Invoke the cfcollection service tag to get categories for a collection
     * Usage :: new collection().categoryList(collection="fivetag");
	 * @output false      
	 */
    public struct function categoryList()
    {
        //store tag attributes to be passed to the service tag in a local variable
        var tagAttributes = duplicate(getTagAttributes());

        //attributes passed to service tag action like send() override existing attributes and are discarded after the action
		if (!structisempty(arguments))
        {
    		 structappend(tagAttributes,arguments);
        }

		tagAttributes.action="categorylist";

		//trim attribute values
		tagAttributes = trimAttributes(tagAttributes);

		return super.invokeTag(getTagName(),tagAttributes);
    }

    /**
	 * Invoke the cfcollection service tag to create collections
     * Usage :: new collection().create(collection="fivetag",path="c...");
	 * @output false      
	 */
    public struct function create()
    {
        //store tag attributes to be passed to the service tag in a local variable
        var tagAttributes = duplicate(getTagAttributes());

        //attributes passed to service tag action like send() override existing attributes and are discarded after the action
		if (!structisempty(arguments))
        {
    		 structappend(tagAttributes,arguments);
        }

		tagAttributes.action="create";

		//trim attribute values
		tagAttributes = trimAttributes(tagAttributes);

		return super.invokeTag(getTagName(),tagAttributes);
    }

    /**
	 * Invoke the cfcollection service tag to delete collections
     * Usage :: new collection().delete(collection="boom");
	 * @output false      
	 */
    public struct function delete()
    {
        //store tag attributes to be passed to the service tag in a local variable
        var tagAttributes = duplicate(getTagAttributes());

        //attributes passed to service tag action like send() override existing attributes and are discarded after the action
		if (!structisempty(arguments))
        {
    		 structappend(tagAttributes,arguments);
        }

		tagAttributes.action="delete";

		//trim attribute values
		tagAttributes = trimAttributes(tagAttributes);

		return super.invokeTag(getTagName(),tagAttributes);
    }

    /**
	 * Invoke the cfcollection service tag to list solr collections in cfscript
     * Usage :: new collection().list();
	 * @output false      
	 */
    public struct function list()
    {
        //store tag attributes to be passed to the service tag in a local variable
        var tagAttributes = duplicate(getTagAttributes());

        //attributes passed to service tag action like send() override existing attributes and are discarded after the action
		if (!structisempty(arguments))
        {
    		 structappend(tagAttributes,arguments);
        }

		tagAttributes.action="list";

		//trim attribute values
		tagAttributes = trimAttributes(tagAttributes);

		return super.invokeTag(getTagName(),tagAttributes);
    }

    /**
	 * Invoke the cfcollection service tag to optimize collections
     * Usage :: new collection().optimize(collection="boom");
	 * @output false      
	 */
    public struct function optimize()
    {
        //store tag attributes to be passed to the service tag in a local variable
        var tagAttributes = duplicate(getTagAttributes());

        //attributes passed to service tag action like send() override existing attributes and are discarded after the action
		if (!structisempty(arguments))
        {
    		 structappend(tagAttributes,arguments);
        }

		tagAttributes.action="optimize";

		//trim attribute values
		tagAttributes = trimAttributes(tagAttributes);

		return super.invokeTag(getTagName(),tagAttributes);
    }


}