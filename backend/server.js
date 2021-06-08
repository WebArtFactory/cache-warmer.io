const baseApp = require('./server/app.js'),
    MongoHandler = require('./mongo/handler.js');

MongoHandler.connect(function (dbHandler) {
    baseApp.runApplication(dbHandler);
});
