^+c::  ; Ctrl + Shift + C Hotkey
    Send, ^c  ; Copy selected text to clipboard
    Sleep, 100  ; Small delay for clipboard to update
    selectedText := Clipboard  ; Store clipboard text in variable

    ; Define temp file path
    tempFile := A_Temp . "\selected_text.txt"

    ; Save text (including newlines) to the temp file
    FileDelete, %tempFile%  ; Remove old file if exists
    FileAppend, %selectedText%, %tempFile%

    ; Change working directory
    SetWorkingDir, C:\Users\Kochanowskik\Desktop\Projects\KK.TranslatorUI  

    ; Run Electron app with the temp file path as argument
    Run, %ComSpec% /c npx electron . --file "%tempFile%", , Hide
return