// NT_USERDB.h : main header file for the NT_USERDB DLL
//

#ifndef __AFXWIN_H__
	#error include 'stdafx.h' before including this file for PCH
#endif

#include "resource.h"		// main symbols

/////////////////////////////////////////////////////////////////////////////
// CNT_USERDBApp
// See NT_USERDB.cpp for the implementation of this class
//

class CNT_USERDBApp : public CWinApp
{
public:
	CNT_USERDBApp();

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CNT_USERDBApp)
	//}}AFX_VIRTUAL

	//{{AFX_MSG(CNT_USERDBApp)
		// NOTE - the ClassWizard will add and remove member functions here.
		//    DO NOT EDIT what you see in these blocks of generated code !
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};


/////////////////////////////////////////////////////////////////////////////
