@ECHO OFF

REM DaniBot.bat
REM dani_lionn, 2023

TITLE DaniBot Server

ECHO Launching DaniBot Server..
ECHO Press [CTRL] + [C] to close

CD C:/DaniBot/Server

node app.js


REM Instructions after this point only run if DaniBot crashed or was shut down using a command

ECHO DaniBot crashed or was shut down...
ECHO Press any key to open up the Error Log
PAUSE 

ErrorLog.txt