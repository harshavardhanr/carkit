

toyota = require './toyota/toyota'

webServer = new toyota.WebServer
webServer.start()

socketServer = new toyota.SocketServer(webServer: webServer)




