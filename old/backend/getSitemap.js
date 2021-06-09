const app = require('./server/app.js'),
    allFullWebsites = require('./server/strategies/main-websites.js'),
    allCategories = require('./server/strategies/all-categories.js'),
    MongoHandler = require('./mongo/handler.js');

MongoHandler.connect(function (dbHandler) {
    allFullWebsites.init(dbHandler);
    allCategories.init(dbHandler);

    console.log('Start registering sitemap')
    let formData = [];
    formData['strategy'] = 'main-websites';
    formData['order'] = '+1';
    formData['limit-amount'] = false;
    formData['period-size'] = false;
    allFullWebsites.startTraining(false, formData);

    console.log('Full crawled websites complete')

    formData['strategy'] = 'all-categories';
    allCategories.startTraining(false, formData);

    console.log('Full crawled category only complete');

    return process.exit(0);
});
