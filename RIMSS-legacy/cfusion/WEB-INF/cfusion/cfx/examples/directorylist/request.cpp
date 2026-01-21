/////////////////////////////////////////////////////////////////////
//
// CFX_DIRECTORYLIST - Cold Fusion custom tag which enumerates
//						   the contents of a specified directory.
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
// This tag enumerates the contents of the directory specified 
// in the DIRECTORY attribute and returns the information as 
// a query with the name specified in the NAME attribute. The
// columns in the query include: Type, Name, Date, and Size.
//
// Example Use:
//
//	<CFX_DIRECTORYLIST NAME="RootDir" DIRECTORY="C:\"> 
//
//  <CFOUTPUT QUERY="RootDir"> 	
//		(#Type#) #Name# - #Date# #Size# <BR>
//	</CFOUTPUT>
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
#include "cfx.h"		// CFX Custom Tag API


// Constants
#define TAG_ERROR_HEADER	"Error occurred in CFX_DIRECTORYLIST tag"

// Forward declarations for helper functions
HANDLE GetFirstFile( CCFXRequest* pRequest, CString strDir, WIN32_FIND_DATA& findData ) ;
BOOL GetNextFile( CCFXRequest* pRequest, HANDLE hFind, WIN32_FIND_DATA& findData ) ;
LPCSTR GetRequiredAttribute( CCFXRequest* pRequest, LPCSTR lpszAttribName ) ;


void ProcessTagRequest( CCFXRequest* pRequest ) 
{
	try
	{
		// Get the DIRECTORY attribute (determines which directory to query)
		CString strDirectory = GetRequiredAttribute( pRequest, "DIRECTORY" ) ;
		if ( strDirectory.Right(1) != "\\" )
			strDirectory += ( "\\" ) ;

		// Get the NAME attribute (determines what to name the query we return)
		CString strName = GetRequiredAttribute( pRequest, "NAME" ) ;
		
		// Create a query object to return to the client
		CCFXStringSet* pColumns = pRequest->CreateStringSet() ;
		int iType = pColumns->AddString("TYPE") ;
		int iName = pColumns->AddString("NAME") ;
		int iDate = pColumns->AddString("DATE") ;
		int iSize = pColumns->AddString("SIZE") ;
		CCFXQuery* pQuery = pRequest->AddQuery( strName, pColumns ) ;

		// Iterate over all of the files in the directory and create
		// a row in the query for each one
		WIN32_FIND_DATA findData ;
		HANDLE hFind = GetFirstFile( pRequest, strDirectory, findData ) ;
		if ( hFind == NULL )
			return ;

		while (TRUE)
		{
 			// Add a row to the query for this file
			int iRow = pQuery->AddRow() ;

			// Determine the type
			if ( (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) )
				pQuery->SetData( iRow, iType, "Directory" ) ;
			else
				pQuery->SetData( iRow, iType, "File" ) ;

			// Set the file name
			pQuery->SetData( iRow, iName, findData.cFileName ) ;

			// Set the file date
			CTime fileDate( findData.ftLastWriteTime ) ;
			CString strDate = fileDate.Format( "%m/%d/%y %I:%M %p" ) ;
			pQuery->SetData( iRow, iDate, strDate ) ;

			// Set the file size
			CString strSize ;
			strSize.Format( "%ld", findData.nFileSizeLow ) ;
			pQuery->SetData( iRow, iSize, strSize ) ;

			// Get the next file
			if ( !GetNextFile( pRequest, hFind, findData ) )
				break ;			
		}
		
		::FindClose( hFind ) ;
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


// Get the first available file in the directory
HANDLE GetFirstFile( CCFXRequest* pRequest, CString strDir, WIN32_FIND_DATA& findData )
{
	HANDLE hFind = ::FindFirstFile( strDir + "*.*", &findData ) ;
	if ( hFind == INVALID_HANDLE_VALUE )
	{
		DWORD dwError = ::GetLastError() ;
		if ( dwError == ERROR_NO_MORE_FILES )
			return NULL ;
		else
		{
			CString strErr ;
			strErr.Format( 
				"Win32 error number %ld occurred while attempting "
				"to find first file in directory '" + strDir + "'.", dwError ) ;
			pRequest->ThrowException( TAG_ERROR_HEADER, strErr ) ;
		}
	}
	return hFind ;
}


// Get the next available file in the directory
BOOL GetNextFile( CCFXRequest* pRequest, HANDLE hFind, WIN32_FIND_DATA& findData )
{
	if ( !::FindNextFile( hFind, &findData ) )
	{
		DWORD dwError = ::GetLastError() ;
		if ( dwError == ERROR_NO_MORE_FILES )
			return FALSE ;
		else
		{
			CString strErr ;
			strErr.Format( 
				"Win32 error number %ld occurred while attempting "
				"to enumerate the files in the directory.", dwError ) ;
			::FindClose( hFind ) ;
			pRequest->ThrowException( TAG_ERROR_HEADER, strErr ) ;
		}		
	}
	return TRUE ;
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