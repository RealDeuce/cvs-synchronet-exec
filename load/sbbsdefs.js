/* sbbsdefs.js */

/* Synchronet Object Model constants definitions - (mostly bit-fields) */

/* $Id: sbbsdefs.js,v 1.5 2001/07/17 03:21:07 rswindell Exp $ */

/****************************************************************************
 * @format.tab-size 4		(Plain Text/Source Code File Header)			*
 * @format.use-tabs true	(see http://www.synchro.net/ptsc_hdr.html)		*
 *																			*
 * Copyright 2001 Rob Swindell - http://www.synchro.net/copyright.html		*
 *																			*
 * This program is free software; you can redistribute it and/or			*
 * modify it under the terms of the GNU General Public License				*
 * as published by the Free Software Foundation; either version 2			*
 * of the License, or (at your option) any later version.					*
 * See the GNU General Public License for more details: gpl.txt or			*
 * http://www.fsf.org/copyleft/gpl.html										*
 *																			*
 * Anonymous FTP access to the most recent released source is available at	*
 * ftp://vert.synchro.net, ftp://cvs.synchro.net and ftp://ftp.synchro.net	*
 *																			*
 * Anonymous CVS access to the development source and modification history	*
 * is available at cvs.synchro.net:/cvsroot/sbbs, example:					*
 * cvs -d :pserver:anonymous@cvs.synchro.net:/cvsroot/sbbs login			*
 *     (just hit return, no password is necessary)							*
 * cvs -d :pserver:anonymous@cvs.synchro.net:/cvsroot/sbbs checkout src		*
 *																			*
 * For Synchronet coding style and modification guidelines, see				*
 * http://www.synchro.net/source.html										*
 *																			*
 * You are encouraged to submit any modifications (preferably in Unix diff	*
 * format) via e-mail to mods@synchro.net									*
 *																			*
 * Note: If this box doesn't appear square, then you need to fix your tabs.	*
 ****************************************************************************/

load("nodedefs.js");

							/********************************************/
							/* system.settings							*/
							/********************************************/
SYS_CLOSED		=(1<<0) 	/* System is closed to New Users			*/
SYS_SYSSTAT		=(1<<1) 	/* Sysops activity included in statistics	*/
SYS_NOBEEP		=(1<<2) 	/* No beep sound locally					*/
SYS_PWEDIT		=(1<<3) 	/* Allow users to change their passwords	*/
SYS_RA_EMU		=(1<<4) 	/* Reverse R/A commands at msg read prompt	*/
SYS_ANON_EM		=(1<<5) 	/* Allow anonymous e-mail					*/
SYS_LISTLOC		=(1<<6) 	/* Use location of caller in user lists 	*/
SYS_WILDCAT		=(1<<7) 	/* Expand Wildcat color codes in messages	*/
SYS_PCBOARD		=(1<<8) 	/* Expand PCBoard color codes in messages	*/
SYS_WWIV 		=(1<<9) 	/* Expand WWIV color codes in messages		*/
SYS_CELERITY	=(1<<10)	/* Expand Celerity color codes in messages	*/
SYS_RENEGADE	=(1<<11)	/* Expand Renegade color codes in messages	*/
SYS_ECHO_PW		=(1<<12)	/* Echo passwords locally					*/
SYS_REQ_PW		=(1<<13)	/* Require passwords locally				*/
SYS_L_SYSOP		=(1<<14)	/* Allow local sysop logon/commands 		*/
SYS_R_SYSOP		=(1<<15)	/* Allow remote sysop logon/commands		*/
SYS_QUOTE_EM	=(1<<16)	/* Allow quoting of e-mail					*/
SYS_EURODATE	=(1<<17)	/* Europian date format (DD/MM/YY)			*/
SYS_MILITARY	=(1<<18)	/* Military time format 					*/
SYS_TIMEBANK	=(1<<19)	/* Allow time bank functions				*/
SYS_FILE_EM		=(1<<20)	/* Allow file attachments in E-mail 		*/
SYS_SHRTPAGE	=(1<<21)	/* Short sysop page 						*/
SYS_TIME_EXP	=(1<<22)	/* Set to expired values if out-of-time 	*/
SYS_FASTMAIL	=(1<<23)	/* Fast e-mail storage mode 				*/
SYS_QVALKEYS	=(1<<24)	/* Quick validation keys enabled			*/
SYS_ERRALARM	=(1<<25)	/* Error beeps on							*/
SYS_FWDTONET	=(1<<26)	/* Allow forwarding of e-mail to netmail	*/
SYS_DELREADM	=(1<<27)	/* Delete read mail automatically			*/
SYS_NOCDTCVT	=(1<<28)	/* No credit to minute conversions allowed	*/
SYS_DELEMAIL	=(1<<29)	/* Physically remove deleted e-mail immed.	*/
SYS_USRVDELM	=(1<<30)	/* Users can see deleted msgs				*/
SYS_SYSVDELM	=(1<<31)	/* Sysops can see deleted msgs				*/
							/********************************************/

							/********************************************/
							/* bbs.sys_status							*/
							/********************************************/
SS_UNUSED		=(1<<0)		/* Unused          							*/
SS_INITIAL		=(1<<1)		/* The bbs data has been initialized.       */
SS_TMPSYSOP		=(1<<2)		/* Temporary Sysop Status					*/
SS_USERON		=(1<<3)		/* A User is logged on to the BBS			*/
SS_LCHAT		=(1<<4)		/* Local chat in progress					*/
SS_CAP			=(1<<5)		/* Capture is on							*/
SS_ANSCAP		=(1<<6)		/* Capture ANSI codes too					*/
SS_FINPUT		=(1<<7)		/* Using file for input 					*/
SS_COMISR		=(1<<8)		/* Com port ISR is installed				*/
SS_DAILY		=(1<<9)		/* Execute System Daily Event on logoff 	*/
SS_INUEDIT		=(1<<10)	/* Inside Alt-Useredit section 				*/
SS_ABORT		=(1<<11)	/* Global abort input or output flag		*/
SS_SYSPAGE		=(1<<12)	/* Paging sysop								*/
SS_SYSALERT		=(1<<13)	/* Notify sysop when users hangs up			*/
SS_GURUCHAT		=(1<<14)	/* Guru chat in progress					*/
SS_UNUSED2		=(1<<15)	/* not used in v3 (used to be SS_NODEDAB)	*/
SS_EVENT		=(1<<16)	/* Time shortened due to upcoming event		*/
SS_PAUSEON		=(1<<17)	/* Pause on, overriding user default		*/
SS_PAUSEOFF		=(1<<18)	/* Pause off, overriding user default		*/
SS_IN_CTRLP		=(1<<19)	/* Inside ctrl-p send node message func		*/
SS_NEWUSER		=(1<<20)	/* New User online 							*/
SS_MDMDEBUG		=(1<<21)	/* Modem debug output						*/
SS_NEST_PF		=(1<<22)	/* Nested in printfile function				*/
SS_DCDHIGH		=(1<<23)	/* Assume DCD is high always				*/
SS_SPLITP		=(1<<24)	/* Split-screen private chat				*/
SS_NEWDAY		=(1<<25)	/* Date changed while online				*/
SS_RLOGIN		=(1<<26)	/* Current login via BSD RLogin				*/
SS_FILEXFER		=(1<<27)	/* File transfer in progress, halt spy		*/
							/********************************************/

							/********************************************/
							/* console.status							*/
							/********************************************/
CON_R_ECHO		=(1<<0)		/* Echo remotely							*/
CON_R_ECHOX	 	=(1<<1)		/* Echo X's to remote user					*/
CON_R_INPUT  	=(1<<2)		/* Accept input remotely					*/
CON_L_ECHO	 	=(1<<3)		/* Echo locally              				*/
CON_L_ECHOX	 	=(1<<4)		/* Echo X's locally							*/
CON_L_INPUT  	=(1<<5)		/* Accept input locally						*/
CON_RAW_IN   	=(1<<8)		/* Raw input mode - no editing capabilities */
CON_ECHO_OFF 	=(1<<10)	/* Remote & Local echo disabled for ML/MF	*/
CON_UPARROW  	=(1<<11)	/* Up arrow hit - move up one line			*/
CON_NO_INACT  	=(1<<13)	/* User inactivity detection disabled		*/
							/********************************************/

							/********************************************/
							/* console.attributes, also used for ansi()	*/
							/********************************************/
BLINK			=0x80		/* blink bit */
HIGH			=0x08		/* high intensity foreground bit */

							/* foreground colors */
BLACK			=0			/* dark colors (HIGH bit unset) */
BLUE			=1
GREEN			=2
CYAN			=3
RED				=4
MAGENTA			=5
BROWN			=6
LIGHTGRAY		=7
DARKGRAY		=8			/* light colors (HIGH bit set) */
LIGHTBLUE		=9
LIGHTGREEN		=10
LIGHTCYAN		=11
LIGHTRED		=12
LIGHTMAGENTA	=13
YELLOW			=14
WHITE			=15

							/* background colors */
ANSI_NORMAL		=0x100		/* special value for ansi() */
BG_BLACK		=0x200		/* special value for ansi() */
BG_BLUE			=(BLUE<<4)
BG_GREEN		=(GREEN<<4)
BG_CYAN			=(CYAN<<4)
BG_RED			=(RED<<4)
BG_MAGENTA		=(MAGENTA<<4)
BG_BROWN		=(BROWN<<4)
BG_LIGHTGRAY	=(LIGHTGRAY<<4)
						
							/********************************************/
							/* user.settings							*/
							/********************************************/
USER_DELETED 	=(1<<0) 	/* Deleted user slot						*/
USER_ANSI		=(1<<1) 	/* Supports ANSI terminal emulation			*/
USER_COLOR		=(1<<2) 	/* Send color codes 						*/
USER_RIP 		=(1<<3) 	/* Supports RIP terminal emulation			*/
USER_PAUSE		=(1<<4) 	/* Pause on every screen full				*/
USER_SPIN		=(1<<5) 	/* Spinning cursor - Same as K_SPIN			*/
USER_INACTIVE	=(1<<6) 	/* Inactive user slot						*/
USER_EXPERT		=(1<<7) 	/* Expert menu mode 						*/
USER_ANFSCAN 	=(1<<8) 	/* Auto New file scan						*/
USER_CLRSCRN 	=(1<<9) 	/* Clear screen before each message			*/
USER_QUIET		=(1<<10)	/* Quiet mode upon logon					*/
USER_BATCHFLAG	=(1<<11)	/* File list allow batch dl flags			*/
USER_NETMAIL 	=(1<<12)	/* Forward e-mail to fidonet addr			*/
USER_CURSUB		=(1<<13)	/* Remember current sub-board/dir			*/
USER_ASK_NSCAN	=(1<<14)	/* Ask for newscanning upon logon			*/
USER_NO_EXASCII	=(1<<15)	/* Don't send extended ASCII				*/
USER_ASK_SSCAN	=(1<<16)	/* Ask for messages to you at logon			*/
USER_AUTOTERM	=(1<<17)	/* Autodetect terminal type 				*/
USER_COLDKEYS	=(1<<18)	/* No hot-keys								*/
USER_EXTDESC 	=(1<<19)	/* Extended file descriptions				*/
USER_AUTOHANG	=(1<<20)	/* Auto-hang-up after transfer				*/
USER_WIP 		=(1<<21)	/* Supports WIP terminal emulation			*/
USER_AUTOLOGON	=(1<<22)	/* AutoLogon via IP							*/
							/********************************************/

/************************************************************************/
/* Valid flags for user.security.exempt/restrict/flags					*/
/************************************************************************/
UFLAG_A			=(1<<0)
UFLAG_B			=(1<<1)
UFLAG_C			=(1<<2)
UFLAG_D			=(1<<3)
UFLAG_E			=(1<<4)
UFLAG_F			=(1<<5)
UFLAG_G			=(1<<6)
UFLAG_H			=(1<<7)
UFLAG_I			=(1<<8)
UFLAG_J			=(1<<9)
UFLAG_K			=(1<<10)
UFLAG_L			=(1<<11)
UFLAG_M			=(1<<12)
UFLAG_N			=(1<<13)
UFLAG_O			=(1<<14)
UFLAG_P			=(1<<15)
UFLAG_Q			=(1<<16)
UFLAG_R			=(1<<17)
UFLAG_S			=(1<<18)
UFLAG_T			=(1<<19)
UFLAG_U			=(1<<20)
UFLAG_V			=(1<<21)
UFLAG_W			=(1<<22)
UFLAG_X			=(1<<23)
UFLAG_Y			=(1<<24)
UFLAG_Z			=(1<<25)

							/********************************************/
							/* Bits in 'mode' for getkey and getstr     */
							/********************************************/
K_UPPER 		=(1<<0)		/* Converts all letters to upper case		*/
K_UPRLWR		=(1<<1)		/* Upper/Lower case automatically			*/
K_NUMBER		=(1<<2)		/* Allow numbers only						*/
K_WRAP			=(1<<3)		/* Allows word wrap 						*/
K_MSG			=(1<<4)		/* Allows ANSI, ^N ^A ^G					*/
K_SPIN			=(1<<5)		/* Spinning cursor (same as SPIN)			*/
K_LINE			=(1<<6)		/* Input line (inverse color)				*/
K_EDIT			=(1<<7)		/* Edit string passed						*/
K_CHAT			=(1<<8)		/* In chat multi-chat						*/
K_NOCRLF		=(1<<9)		/* Don't print CRLF after string input      */
K_ALPHA 		=(1<<10)	/* Only allow alphabetic characters 		*/
K_GETSTR		=(1<<11)	/* getkey called from getstr()				*/
K_LOWPRIO		=(1<<12)	/* low priority input						*/
K_NOEXASC		=(1<<13)	/* No extended ASCII allowed				*/
K_E71DETECT		=(1<<14)	/* Detect E-7-1 terminal type				*/
K_AUTODEL		=(1<<15)	/* Auto-delete text (used with K_EDIT)		*/
K_COLD			=(1<<16)	/* Possible cold key mode					*/
K_NOECHO		=(1<<17)	/* Don't echo input                         */
K_TAB			=(1<<18)	/* Treat TAB key as CR						*/
							/********************************************/
						
							/********************************************/
							/* Bits in 'mode' for putmsg and printfile  */
							/********************************************/
P_NOABORT  		=(1<<0)		/* Disallows abortion of a message          */
P_SAVEATR		=(1<<1)		/* Save the new current attributres after	*/
							/* msg has printed */
P_NOATCODES		=(1<<2)		/* Don't allow @ codes                      */
P_OPENCLOSE		=(1<<3)		/* Open and close the file					*/
							/********************************************/

							/********************************************/
							/* system.new_user_questions				*/
							/********************************************/
UQ_ALIASES		=(1<<0) 	/* Ask for alias							*/
UQ_LOCATION		=(1<<1) 	/* Ask for location 						*/
UQ_ADDRESS		=(1<<2) 	/* Ask for address							*/
UQ_PHONE		=(1<<3) 	/* Ask for phone number 					*/
UQ_HANDLE		=(1<<4) 	/* Ask for chat handle						*/
UQ_DUPHAND		=(1<<5) 	/* Search for duplicate handles 			*/
UQ_SEX			=(1<<6) 	/* Ask for sex								*/
UQ_BIRTH		=(1<<7) 	/* Ask for birth date						*/
UQ_COMP 		=(1<<8) 	/* Ask for computer type					*/
UQ_MC_COMP		=(1<<9) 	/* Multiple choice computer type			*/
UQ_REALNAME		=(1<<10)	/* Ask for real name						*/
UQ_DUPREAL		=(1<<11)	/* Search for duplicate real names			*/
UQ_COMPANY		=(1<<12)	/* Ask for company name 					*/
UQ_NOEXASC		=(1<<13)	/* Don't allow ex-ASCII in user text		*/
UQ_CMDSHELL		=(1<<14)	/* Ask for command shell					*/
UQ_XEDIT		=(1<<15)	/* Ask for external editor					*/
UQ_NODEF		=(1<<16)	/* Don't ask for default settings			*/
UQ_NOCOMMAS		=(1<<17)	/* Do not require commas in location		*/
							/********************************************/
				
							/********************************************/
							/* node.settings							*/
							/********************************************/
NM_ANSALARM		=(1<<0)		/* Alarm locally on answer					*/
NM_WFCSCRN		=(1<<1)		/* Wait for call screen                     */
NM_WFCMSGS		=(1<<2)		/* Include total messages/files on WFC		*/
NM_LCL_EDIT		=(1<<3)		/* Use local editor to create messages		*/
NM_EMSOVL		=(1<<4)		/* Use expanded memory of overlays			*/
NM_WINOS2		=(1<<5)		/* Use Windows/OS2 time slice API call		*/
NM_INT28		=(1<<6)		/* Make int 28 DOS idle calls				*/
NM_NODV 		=(1<<7)		/* Don't detect and use DESQview API        */
NM_NO_NUM		=(1<<8)		/* Don't allow logons by user number        */
NM_LOGON_R		=(1<<9)		/* Allow logons by user real name			*/
NM_LOGON_P		=(1<<10)	/* Secure logons (always ask for password)	*/
NM_NO_LKBRD		=(1<<11)	/* No local keyboard (at all)				*/
NM_SYSPW		=(1<<12)	/* Protect WFC keys and Alt keys with SY:	*/
NM_NO_INACT		=(1<<13)	/* No local inactivity alert/logoff 		*/
NM_NOBEEP		=(1<<14)	/* Don't beep locally                       */
NM_LOWPRIO		=(1<<15)	/* Always use low priority input			*/
NM_7BITONLY		=(1<<16)	/* Except 7-bit input only (E71 terminals)	*/
NM_RESETVID		=(1<<17)	/* Reset video mode between callers?		*/
NM_NOPAUSESPIN	=(1<<18)	/* No spinning cursor at pause prompt		*/
							/********************************************/

							/********************************************/
							/* netmail_misc								*/
							/********************************************/
NMAIL_ALLOW 	=(1<<0)		/* Allow NetMail							*/
NMAIL_CRASH 	=(1<<1)		/* Default netmail to crash					*/
NMAIL_HOLD		=(1<<2)		/* Default netmail to hold					*/
NMAIL_KILL		=(1<<3)		/* Default netmail to kill after sent		*/
NMAIL_ALIAS 	=(1<<4)		/* Use Aliases in NetMail					*/
NMAIL_FILE		=(1<<5)		/* Allow file attachments					*/
NMAIL_DIRECT	=(1<<6)		/* Default netmail to direct				*/
							/********************************************/

							/********************************************/
							/* Bit values for sub[x].settings			*/
							/********************************************/
SUB_QNET		=(1<<3) 	/* Sub-board is netted via QWK network		*/
SUB_PNET		=(1<<4) 	/* Sub-board is netted via PostLink			*/
SUB_FIDO		=(1<<5) 	/* Sub-board is netted via FidoNet			*/
SUB_PRIV		=(1<<6) 	/* Allow private posts on sub				*/
SUB_PONLY		=(1<<7) 	/* Private posts only						*/
SUB_ANON		=(1<<8) 	/* Allow anonymous posts on sub				*/
SUB_AONLY		=(1<<9) 	/* Anonymous only							*/
SUB_NAME		=(1<<10)	/* Must use real names						*/
SUB_DEL 		=(1<<11)	/* Allow users to delete messages			*/
SUB_DELLAST		=(1<<12)	/* Allow users to delete last msg only		*/
SUB_FORCED		=(1<<13)	/* Sub-board is forced scanning				*/
SUB_NOTAG		=(1<<14)	/* Don't add tag or origin lines			*/
SUB_TOUSER		=(1<<15)	/* Prompt for to user on posts				*/
SUB_ASCII		=(1<<16)	/* ASCII characters only					*/
SUB_QUOTE		=(1<<17)	/* Allow online quoting						*/
SUB_NSDEF		=(1<<18)	/* New-Scan on by default					*/
SUB_INET		=(1<<19)	/* Sub-board is netted via Internet			*/
SUB_FAST		=(1<<20)	/* Fast storage mode						*/
SUB_KILL		=(1<<21)	/* Kill read messages automatically			*/
SUB_KILLP		=(1<<22)	/* Kill read pvt messages automatically		*/
SUB_SYSPERM		=(1<<23)	/* Sysop messages are permament				*/
SUB_GATE		=(1<<24)	/* Gateway between Network types			*/
SUB_LZH 		=(1<<25)	/* Use LZH compression for msgs				*/
SUB_SSDEF		=(1<<26)	/* Default ON for Scan for Your msgs		*/
SUB_HYPER		=(1<<27)	/* Hyper allocation							*/
							/********************************************/

							/********************************************/
                            /* Bit values for dir[x].settings			*/
							/********************************************/
DIR_FCHK		=(1<<0) 	/* Check for file existance					*/
DIR_RATE		=(1<<1) 	/* Force uploads to be rated G,R, or X		*/
DIR_MULT		=(1<<2) 	/* Ask for multi-disk numbering				*/
DIR_DUPES		=(1<<3) 	/* Search this dir for upload dupes			*/
DIR_FREE		=(1<<4) 	/* Free downloads							*/
DIR_TFREE		=(1<<5) 	/* Time to download is free					*/
DIR_CDTUL		=(1<<6) 	/* Credit Uploads							*/
DIR_CDTDL		=(1<<7) 	/* Credit Downloads							*/
DIR_ANON		=(1<<8) 	/* Anonymous uploads						*/
DIR_AONLY		=(1<<9) 	/* Anonymous only							*/
DIR_ULDATE		=(1<<10)	/* Include upload date in listing			*/
DIR_DIZ 		=(1<<11)	/* FILE_ID.DIZ and DESC.SDI support			*/
DIR_NOSCAN		=(1<<12)	/* Don't new-scan this directory			*/
DIR_NOAUTO		=(1<<13)	/* Don't auto-add this directory			*/
DIR_ULTIME		=(1<<14)	/* Deduct time during uploads				*/
DIR_CDTMIN		=(1<<15)	/* Give uploader minutes instead of cdt		*/
DIR_SINCEDL		=(1<<16)	/* Purge based on days since last dl		*/
DIR_MOVENEW		=(1<<17)	/* Files marked as new when moved			*/
							/********************************************/
				
							/********************************************/
				            /* Bit values for file.settings				*/
							/********************************************/
FILE_EXTDESC	=(1<<0)     /* Extended description exists				*/
FILE_ANON 		=(1<<1)		/* Anonymous upload							*/
							/********************************************/
