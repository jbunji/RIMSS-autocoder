# Microsoft Developer Studio Generated NMAKE File, Format Version 4.10
# ** DO NOT EDIT **

# TARGTYPE "Win32 (x86) Dynamic-Link Library" 0x0102

!IF "$(CFG)" == ""
CFG=NT_USERDB - Win32 Debug
!MESSAGE No configuration specified.  Defaulting to NT_USERDB - Win32 Debug.
!ENDIF 

!IF "$(CFG)" != "NT_USERDB - Win32 Release" && "$(CFG)" !=\
 "NT_USERDB - Win32 Debug"
!MESSAGE Invalid configuration "$(CFG)" specified.
!MESSAGE You can specify a configuration when running NMAKE on this makefile
!MESSAGE by defining the macro CFG on the command line.  For example:
!MESSAGE 
!MESSAGE NMAKE /f "NT_USERDB.MAK" CFG="NT_USERDB - Win32 Debug"
!MESSAGE 
!MESSAGE Possible choices for configuration are:
!MESSAGE 
!MESSAGE "NT_USERDB - Win32 Release" (based on\
 "Win32 (x86) Dynamic-Link Library")
!MESSAGE "NT_USERDB - Win32 Debug" (based on\
 "Win32 (x86) Dynamic-Link Library")
!MESSAGE 
!ERROR An invalid configuration is specified.
!ENDIF 

!IF "$(OS)" == "Windows_NT"
NULL=
!ELSE 
NULL=nul
!ENDIF 
################################################################################
# Begin Project
MTL=mktyplib.exe
CPP=cl.exe
RSC=rc.exe

!IF  "$(CFG)" == "NT_USERDB - Win32 Release"

# PROP BASE Use_MFC 1
# PROP BASE Use_Debug_Libraries 0
# PROP BASE Output_Dir "Release"
# PROP BASE Intermediate_Dir "Release"
# PROP BASE Target_Dir ""
# PROP Use_MFC 1
# PROP Use_Debug_Libraries 0
# PROP Output_Dir "Release"
# PROP Intermediate_Dir "Release"
# PROP Target_Dir ""
OUTDIR=.\Release
INTDIR=.\Release

ALL : "$(OUTDIR)\NT_USERDB.dll"

CLEAN : 
	-@erase "$(INTDIR)\NT_USERDB.obj"
	-@erase "$(INTDIR)\NT_USERDB.pch"
	-@erase "$(INTDIR)\NT_USERDB.res"
	-@erase "$(INTDIR)\Request.obj"
	-@erase "$(INTDIR)\StdAfx.obj"
	-@erase "$(OUTDIR)\NT_USERDB.dll"
	-@erase "$(OUTDIR)\NT_USERDB.exp"
	-@erase "$(OUTDIR)\NT_USERDB.lib"

"$(OUTDIR)" :
    if not exist "$(OUTDIR)/$(NULL)" mkdir "$(OUTDIR)"

# ADD BASE CPP /nologo /MT /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_WINDOWS" /D "_WINDLL" /D "_MBCS" /Yu"stdafx.h" /c
# ADD CPP /nologo /MT /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_WINDOWS" /D "_WINDLL" /D "_MBCS" /D "_USRDLL" /Yu"stdafx.h" /c
CPP_PROJ=/nologo /MT /W3 /GX /O2 /I "../../include" /D "WIN32" /D "NDEBUG" /D "_WINDOWS" /D\
 "_WINDLL" /D "_MBCS" /D "_USRDLL" /Fp"$(INTDIR)/NT_USERDB.pch" /Yu"stdafx.h"\
 /Fo"$(INTDIR)/" /c 
CPP_OBJS=.\Release/
CPP_SBRS=.\.
# ADD BASE MTL /nologo /D "NDEBUG" /win32
# ADD MTL /nologo /D "NDEBUG" /win32
MTL_PROJ=/nologo /D "NDEBUG" /win32 
# ADD BASE RSC /l 0x409 /d "NDEBUG"
# ADD RSC /l 0x409 /d "NDEBUG"
RSC_PROJ=/l 0x409 /fo"$(INTDIR)/NT_USERDB.res" /d "NDEBUG" 
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
BSC32_FLAGS=/nologo /o"$(OUTDIR)/NT_USERDB.bsc" 
BSC32_SBRS= \
	
LINK32=link.exe
# ADD BASE LINK32 /nologo /subsystem:windows /dll /machine:I386
# ADD LINK32 netapi32.lib /nologo /subsystem:windows /dll /machine:I386
LINK32_FLAGS=netapi32.lib /nologo /subsystem:windows /dll /incremental:no\
 /pdb:"$(OUTDIR)/NT_USERDB.pdb" /machine:I386 /def:".\NT_USERDB.def"\
 /out:"$(OUTDIR)/NT_USERDB.dll" /implib:"$(OUTDIR)/NT_USERDB.lib" 
DEF_FILE= \
	".\NT_USERDB.def"
LINK32_OBJS= \
	"$(INTDIR)\NT_USERDB.obj" \
	"$(INTDIR)\NT_USERDB.res" \
	"$(INTDIR)\Request.obj" \
	"$(INTDIR)\StdAfx.obj"

"$(OUTDIR)\NT_USERDB.dll" : "$(OUTDIR)" $(DEF_FILE) $(LINK32_OBJS)
    $(LINK32) @<<
  $(LINK32_FLAGS) $(LINK32_OBJS)
<<

!ELSEIF  "$(CFG)" == "NT_USERDB - Win32 Debug"

# PROP BASE Use_MFC 1
# PROP BASE Use_Debug_Libraries 1
# PROP BASE Output_Dir "Debug"
# PROP BASE Intermediate_Dir "Debug"
# PROP BASE Target_Dir ""
# PROP Use_MFC 1
# PROP Use_Debug_Libraries 1
# PROP Output_Dir "Debug"
# PROP Intermediate_Dir "Debug"
# PROP Target_Dir ""
OUTDIR=.\Debug
INTDIR=.\Debug

ALL : "$(OUTDIR)\NT_USERDB.dll"

CLEAN : 
	-@erase "$(INTDIR)\NT_USERDB.obj"
	-@erase "$(INTDIR)\NT_USERDB.pch"
	-@erase "$(INTDIR)\NT_USERDB.res"
	-@erase "$(INTDIR)\Request.obj"
	-@erase "$(INTDIR)\StdAfx.obj"
	-@erase "$(INTDIR)\vc40.idb"
	-@erase "$(INTDIR)\vc40.pdb"
	-@erase "$(OUTDIR)\NT_USERDB.dll"
	-@erase "$(OUTDIR)\NT_USERDB.exp"
	-@erase "$(OUTDIR)\NT_USERDB.ilk"
	-@erase "$(OUTDIR)\NT_USERDB.lib"
	-@erase "$(OUTDIR)\NT_USERDB.pdb"

"$(OUTDIR)" :
    if not exist "$(OUTDIR)/$(NULL)" mkdir "$(OUTDIR)"

# ADD BASE CPP /nologo /MTd /W3 /Gm /GX /Zi /Od /D "WIN32" /D "_DEBUG" /D "_WINDOWS" /D "_WINDLL" /D "_MBCS" /Yu"stdafx.h" /c
# ADD CPP /nologo /MTd /W3 /Gm /GX /Zi /Od /D "WIN32" /D "_DEBUG" /D "_WINDOWS" /D "_WINDLL" /D "_MBCS" /D "_USRDLL" /Yu"stdafx.h" /c
CPP_PROJ=/nologo /MTd /W3 /Gm /GX /Zi /Od /D "WIN32" /I "../../include" /D "_DEBUG" /D "_WINDOWS"\
 /D "_WINDLL" /D "_MBCS" /D "_USRDLL" /Fp"$(INTDIR)/NT_USERDB.pch" /Yu"stdafx.h"\
 /Fo"$(INTDIR)/" /Fd"$(INTDIR)/" /c 
CPP_OBJS=.\Debug/
CPP_SBRS=.\.
# ADD BASE MTL /nologo /D "_DEBUG" /win32
# ADD MTL /nologo /D "_DEBUG" /win32
MTL_PROJ=/nologo /D "_DEBUG" /win32 
# ADD BASE RSC /l 0x409 /d "_DEBUG"
# ADD RSC /l 0x409 /d "_DEBUG"
RSC_PROJ=/l 0x409 /fo"$(INTDIR)/NT_USERDB.res" /d "_DEBUG" 
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
BSC32_FLAGS=/nologo /o"$(OUTDIR)/NT_USERDB.bsc" 
BSC32_SBRS= \
	
LINK32=link.exe
# ADD BASE LINK32 /nologo /subsystem:windows /dll /debug /machine:I386
# ADD LINK32 netapi32.lib /nologo /subsystem:windows /dll /debug /machine:I386
LINK32_FLAGS=netapi32.lib /nologo /subsystem:windows /dll /incremental:yes\
 /pdb:"$(OUTDIR)/NT_USERDB.pdb" /debug /machine:I386 /def:".\NT_USERDB.def"\
 /out:"$(OUTDIR)/NT_USERDB.dll" /implib:"$(OUTDIR)/NT_USERDB.lib" 
DEF_FILE= \
	".\NT_USERDB.def"
LINK32_OBJS= \
	"$(INTDIR)\NT_USERDB.obj" \
	"$(INTDIR)\NT_USERDB.res" \
	"$(INTDIR)\Request.obj" \
	"$(INTDIR)\StdAfx.obj"

"$(OUTDIR)\NT_USERDB.dll" : "$(OUTDIR)" $(DEF_FILE) $(LINK32_OBJS)
    $(LINK32) @<<
  $(LINK32_FLAGS) $(LINK32_OBJS)
<<

!ENDIF 

.c{$(CPP_OBJS)}.obj:
   $(CPP) $(CPP_PROJ) $<  

.cpp{$(CPP_OBJS)}.obj:
   $(CPP) $(CPP_PROJ) $<  

.cxx{$(CPP_OBJS)}.obj:
   $(CPP) $(CPP_PROJ) $<  

.c{$(CPP_SBRS)}.sbr:
   $(CPP) $(CPP_PROJ) $<  

.cpp{$(CPP_SBRS)}.sbr:
   $(CPP) $(CPP_PROJ) $<  

.cxx{$(CPP_SBRS)}.sbr:
   $(CPP) $(CPP_PROJ) $<  

################################################################################
# Begin Target

# Name "NT_USERDB - Win32 Release"
# Name "NT_USERDB - Win32 Debug"

!IF  "$(CFG)" == "NT_USERDB - Win32 Release"

!ELSEIF  "$(CFG)" == "NT_USERDB - Win32 Debug"

!ENDIF 

################################################################################
# Begin Source File

SOURCE=.\Request.cpp
DEP_CPP_REQUE=\
	".\StdAfx.h"\
	"..\..\include\cfx.h"\
	

"$(INTDIR)\Request.obj" : $(SOURCE) $(DEP_CPP_REQUE) "$(INTDIR)"\
 "$(INTDIR)\NT_USERDB.pch"


# End Source File
################################################################################
# Begin Source File

SOURCE=.\StdAfx.cpp
DEP_CPP_STDAF=\
	".\StdAfx.h"\
	

!IF  "$(CFG)" == "NT_USERDB - Win32 Release"

# ADD CPP /Yc"stdafx.h"

BuildCmds= \
	$(CPP) /nologo /MT /W3 /GX /O2 /I "../../include" /D "WIN32" /D "NDEBUG" /D "_WINDOWS" /D\
 "_WINDLL" /D "_MBCS" /D "_USRDLL" /Fp"$(INTDIR)/NT_USERDB.pch" /Yc"stdafx.h"\
 /Fo"$(INTDIR)/" /c $(SOURCE) \
	

"$(INTDIR)\StdAfx.obj" : $(SOURCE) $(DEP_CPP_STDAF) "$(INTDIR)"
   $(BuildCmds)

"$(INTDIR)\NT_USERDB.pch" : $(SOURCE) $(DEP_CPP_STDAF) "$(INTDIR)"
   $(BuildCmds)

!ELSEIF  "$(CFG)" == "NT_USERDB - Win32 Debug"

# ADD CPP /Yc"stdafx.h"

BuildCmds= \
	$(CPP) /nologo /MTd /W3 /Gm /GX /Zi /Od /I "../../include" /D "WIN32" /D "_DEBUG" /D "_WINDOWS"\
 /D "_WINDLL" /D "_MBCS" /D "_USRDLL" /Fp"$(INTDIR)/NT_USERDB.pch" /Yc"stdafx.h"\
 /Fo"$(INTDIR)/" /Fd"$(INTDIR)/" /c $(SOURCE) \
	

"$(INTDIR)\StdAfx.obj" : $(SOURCE) $(DEP_CPP_STDAF) "$(INTDIR)"
   $(BuildCmds)

"$(INTDIR)\NT_USERDB.pch" : $(SOURCE) $(DEP_CPP_STDAF) "$(INTDIR)"
   $(BuildCmds)

!ENDIF 

# End Source File
################################################################################
# Begin Source File

SOURCE=.\NT_USERDB.cpp
DEP_CPP_NT_US=\
	".\NT_USERDB.h"\
	".\StdAfx.h"\
	

"$(INTDIR)\NT_USERDB.obj" : $(SOURCE) $(DEP_CPP_NT_US) "$(INTDIR)"\
 "$(INTDIR)\NT_USERDB.pch"


# End Source File
################################################################################
# Begin Source File

SOURCE=.\NT_USERDB.def

!IF  "$(CFG)" == "NT_USERDB - Win32 Release"

!ELSEIF  "$(CFG)" == "NT_USERDB - Win32 Debug"

!ENDIF 

# End Source File
################################################################################
# Begin Source File

SOURCE=.\NT_USERDB.rc
DEP_RSC_NT_USE=\
	".\res\NT_USERDB.rc2"\
	

"$(INTDIR)\NT_USERDB.res" : $(SOURCE) $(DEP_RSC_NT_USE) "$(INTDIR)"
   $(RSC) $(RSC_PROJ) $(SOURCE)


# End Source File
# End Target
# End Project
################################################################################
