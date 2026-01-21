/////////////////////////////////////////////////////////////////////
//
// CFX_NT_USERDB - Cold Fusion custom tag for adding and deleting
//				   NT user accounts.
//
// ADOBE SYSTEMS INCORPORATED
//  Copyright 1996 Adobe Systems Incorporated
//  All Rights Reserved.
// 
// NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
// terms of the Adobe license agreement accompanying it.  If you have received this file from a 
// source other than Adobe, then your use, modification, or distribution of it requires the prior 
// written permission of Adobe.
//
//
// This tag adds and delete users from the account database of the
// local NT system. When adding a user a privilege level (Guest, 
// User, or Administrator) and list of groups to add the user to
// may be specified.
//
// Example Uses:
//
//	<CFX_NT_USERDB ACTION="ADD" 
//		USERNAME="Foo" PASSWORD="Bar"
//		PrivilegeS="User"
//		GROUPS="Users, Power Users">
//
//  <CFX_NT_USERDB ACTION="DELETE" 
//		USERNAME="Foo">
//
//
// NOTE: If you wish to experiment with this tag from within
//		 Cold Fusion you need to add it to the registry of
//		 custom tags using the Cold Fusion Administrator.
//		 If you want to run the tag from within the debugger
//       you should set the path of the tag to the \Debug
//		 directory of the tag's project directory.
//


#include "stdafx.h"		// Standard MFC libraries
#include "afxpriv.h"	// MFC Unicode conversion macros
#include "cfx.h"		// CFX Custom Tag API
#include "lmaccess.h"	// User-database access functions


// Constants
#define TAG_ERROR_HEADER	"Error occurred in tag CFX_NT_USERDB"


// Forward declarations of implementation functions
LPCSTR GetRequiredAttribute( CCFXRequest* pRequest, LPCSTR lpszParamName ) ;
void AddNTUser( CCFXRequest* pRequest ) ;
void RemoveNTUser( CCFXRequest* pRequest ) ;
DWORD GetPrivileges( CCFXRequest* pRequest, CString strPrivileges ) ;
void GetSIDForUser( CCFXRequest* pRequest, LPCSTR lpszUsername,
				    UCHAR* buffSID, DWORD dwBuffSIDSize ) ;
void VERIFY_NETAPI( CCFXRequest* pRequest, 
	CString strFunction, NET_API_STATUS status ) ;


// Main tag function ///////////////////////////////////////////////////

void ProcessTagRequest( CCFXRequest* pRequest ) 
{
	try
	{
		// Determine the action requested & call the 
		// appropriate helper function
		CString strAction = GetRequiredAttribute( pRequest, "ACTION" ) ;
		if ( !strAction.CompareNoCase( "ADD" ) )
			AddNTUser( pRequest ) ;
		else if ( !strAction.CompareNoCase( "REMOVE" ) )
			RemoveNTUser( pRequest ) ;
		else
		{
			CString strErr =
				"An invalid ACTION attribute (" + strAction + ") "
				"was specified. Valid attributes are ADD and REMOVE." ;
			pRequest->ThrowException( 
				TAG_ERROR_HEADER, strErr ) ;
		}		
	}

	// Catch Cold Fusion exceptions & re-raise them
	catch( CCFXException* e )
	{
		pRequest->ReThrowException( e ) ;
	}
	
	// Catch ALL other exceptions and throw them as 
	// Cold Fusion exceptions (DO NOT REMOVE! -- 
	// this prevents the server from crashing in 
	// case of an unexpected exception)
	catch( ... )
	{
		pRequest->ThrowException( 
			TAG_ERROR_HEADER,
			"Unexpected error occurred while processing tag." ) ;
	}
}


// Add the user (using the specified USERNAME, PASSWORD, ATTRIBUTES,
// and GROUPS) to the NT user database
void AddNTUser( CCFXRequest* pRequest )
{
	// Get attribute values
	CString strUsername = GetRequiredAttribute( pRequest, "USERNAME" ) ;
	CString strPassword = GetRequiredAttribute( pRequest, "PASSWORD" ) ;
	CString strPrivileges = GetRequiredAttribute( pRequest, "PrivilegeS" ) ;
	DWORD dwPrivileges = GetPrivileges( pRequest, strPrivileges ) ;
	CString strGroups = pRequest->GetAttribute( "GROUPS" ) ;

	// Create the user
	USES_CONVERSION ;
	USER_INFO_1 userInfo ;
	userInfo.usri1_name = A2W(strUsername) ;
	userInfo.usri1_password = A2W(strPassword) ;
	userInfo.usri1_password_age = 0 ;
	userInfo.usri1_priv = dwPrivileges ;
	userInfo.usri1_home_dir = NULL ;
	userInfo.usri1_comment = NULL ;
	userInfo.usri1_flags = UF_SCRIPT ;
	userInfo.usri1_script_path = NULL ;
	VERIFY_NETAPI( pRequest, "NetUserAdd", 
		NetUserAdd( NULL, 1, (LPBYTE)&userInfo,	NULL ) ) ;	

	// Get the user's security id
	DWORD dwSIDSize = 1024 ;
	UCHAR buffSID[1024] ;
	GetSIDForUser( pRequest, strUsername, buffSID, dwSIDSize ) ;

	// Add the user to the requested groups
	LPSTR lpszGroups = strGroups.GetBuffer(0) ;
	LPSTR lpszToken = strtok( lpszGroups, "," ) ;
	while ( lpszToken != NULL )
	{
		CString strGroup(lpszToken) ; 
		strGroup.TrimLeft(); strGroup.TrimRight();
		VERIFY_NETAPI( pRequest, "NetLocalGroupAddMember",
			NetLocalGroupAddMember( NULL, A2W(strGroup), (PSID)buffSID ) ) ;	
		lpszToken = strtok( NULL, "," );
   	}
}


// Remove the user (specified by USERNAME) from the NT user database
void RemoveNTUser( CCFXRequest* pRequest )
{
	// Get attribute values
	CString strUsername = GetRequiredAttribute( pRequest, "USERNAME" ) ;

	// Remove the user
	USES_CONVERSION ;
	VERIFY_NETAPI( pRequest, "NetUserDel",
		NetUserDel( NULL, A2W(strUsername) ) ) ;
}


// Check the return code and throw an exception if an 
// error occurred while calling the function
void VERIFY_NETAPI( CCFXRequest* pRequest, CString strFunction, 
					NET_API_STATUS status )
{
	if ( status != 0 )
	{
		CString strErr ;
		strErr.Format( 
			"Unexpected NETAPI error number %ld occurred while "
			"calling function %s.", status, strFunction ) ;
		pRequest->ThrowException( TAG_ERROR_HEADER, strErr ) ;
	}
}


// Retreive the security id (SID) for the passed username
void GetSIDForUser( CCFXRequest* pRequest, LPCSTR lpszUsername,
				    UCHAR* buffSID, DWORD dwBuffSIDSize )
{
	DWORD dwBuffSize = 1024 ;
	char buffRefDomain[1024] ;
   
	SID_NAME_USE sidType ;

	DWORD dwError = LookupAccountName(
		NULL,			// address of string for system name
		lpszUsername,	// address of string for account name
		buffSID,		// address of security identifier
		&dwBuffSIDSize,	// address of size of security identifier
		buffRefDomain,	// address of string for referenced domain 
		&dwBuffSize,	// address of size of domain string
		&sidType  		// address of SID-type indicator
	);

	if ( dwError != ERROR_SUCCESS && dwError != ERROR_INVALID_FUNCTION )
	{
		CString strErr ;
		strErr.Format( 
			"Unexpected Windows NT error number %ld occurred while "
			"calling function LookupAccountName.", ::GetLastError() ) ;
		pRequest->ThrowException( TAG_ERROR_HEADER, strErr ) ;
	}
}


// Convert a string representation of privileges to the 
// appropriate constant value
DWORD GetPrivileges( CCFXRequest* pRequest, CString strPrivileges )
{
	if ( !strPrivileges.CompareNoCase("GUEST") )
		return USER_PRIV_GUEST ;
	else if ( !strPrivileges.CompareNoCase("USER") )
		return USER_PRIV_USER ;
	else if ( !strPrivileges.CompareNoCase("ADMINISTRATOR") ) 
		return USER_PRIV_ADMIN ;
	else
	{
		CString strErr =
			"An invalid PrivilegeS attribute (" + strPrivileges + ") "
			"was specified. Valid attributes are GUEST, USER, and "
			"ADMINISTRATOR." ;
		pRequest->ThrowException( TAG_ERROR_HEADER, strErr ) ;
	}
	return (0) ; 
}


// Get the value for the passed attribute (throw an exception
// if the attribute was not passed to the tag)
LPCSTR GetRequiredAttribute( CCFXRequest* pRequest, LPCSTR lpszAttribName ) 
{
	// Verify that the attribute exists (throw an exception
	// if it does not)
	if ( !pRequest->AttributeExists(lpszAttribName) )
	{
		CString strErr = 
			"The required attribute " + CString(lpszAttribName) +
			" was not passed to the tag. " ;
		pRequest->ThrowException( TAG_ERROR_HEADER, strErr ) ;	
	}

	// Return the attribute
	return pRequest->GetAttribute( lpszAttribName ) ;	
}

