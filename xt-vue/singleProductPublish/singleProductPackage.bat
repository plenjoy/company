@echo on
set product=newPrint
set cmd1= D:\workspace\h5\singleProductPublish\cmds\product.bat
set cmd2= D:\workspace\h5\singleProductPublish\cmds\singleModify.bat
set cmd3= D:\workspace\h5\singleProductPublish\cmds\copySingleFile.bat
set cmd4= D:\workspace\h5\singleProductPublish\cmds\pathBack.bat
call %cmd1% %product%
call %cmd2% %product%
call %cmd3% %product%
call %cmd4%
