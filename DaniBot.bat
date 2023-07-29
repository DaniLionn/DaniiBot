@ECHO OFF

REM DaniBot.bat
REM dani_lionn, 2023

TITLE DaniBot Console

ECHO Launching DaniBot..
ECHO Press [CTRL] + [C] to close

REM CD C:/DaniBot

node bot.js

REM Instructions after this point only run if DaniBot crashed or was shut down using a command

ECHO DaniBot crashed! Press any key to open error log and restart.

PAUSE

ErrorLog.txt

REM Restart danibot

CALL DaniBot.bat

