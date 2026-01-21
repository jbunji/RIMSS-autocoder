========================================================================
            COLD FUSION CUSTOM TAG PROJECT : NT_USERDB
========================================================================


This file contains a summary of what you will find in each of the files that
make up your Cold Fusion custom tag DLL.


/////////////////////////////////////////////////////////////////////////////
Custom Tag Implementation:

request.cpp
	This file contains the implementation of the tag request function
	(ProcessTagRequest). This is the function you should modify in
	order to implement your custom tag's behavior.

NT_USERDB.def
    This file contains information about the DLL that must be
    provided to run with Microsoft Windows.  It defines parameters
    such as the name and description of the DLL.  It also exports
	functions from the DLL (note that all tag request functions must
	be listed in the EXPORTS section of this file).


/////////////////////////////////////////////////////////////////////////////
MFC DLL Implementation:

NT_USERDB.h
	This is the main header file for the DLL.  It declares the
	CNT_USERDBApp class.

NT_USERDB.cpp
	This is the main DLL source file.  It contains the class CNT_USERDBApp.

StdAfx.h, StdAfx.cpp
    These files are used to build a precompiled header (PCH) file
    named NT_USERDB.pch and a precompiled types file named StdAfx.obj.


/////////////////////////////////////////////////////////////////////////////
Resources:

Resource.h
    This is the standard header file, which defines new resource IDs.
    Microsoft Developer Studio reads and updates this file.

NT_USERDB.rc
    This is a listing of all of the Microsoft Windows resources that the
    program uses.  It includes the icons, bitmaps, and cursors that are stored
    in the RES subdirectory.  This file can be directly edited in Microsoft
	Developer Studio.

res\NT_USERDB.rc2
    This file contains resources that are not edited by Microsoft 
	Developer Studio.  You should place all resources not
	editable by the resource editor in this file.

