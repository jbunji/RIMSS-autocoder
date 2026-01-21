// NT_USERDB.cpp : Defines the initialization routines for the DLL.
//

#include "stdafx.h"
#include "NT_USERDB.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CNT_USERDBApp

BEGIN_MESSAGE_MAP(CNT_USERDBApp, CWinApp)
	//{{AFX_MSG_MAP(CNT_USERDBApp)
		// NOTE - the ClassWizard will add and remove mapping macros here.
		//    DO NOT EDIT what you see in these blocks of generated code!
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CNT_USERDBApp construction

CNT_USERDBApp::CNT_USERDBApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance
}

/////////////////////////////////////////////////////////////////////////////
// The one and only CNT_USERDBApp object

CNT_USERDBApp theApp;
