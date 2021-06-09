const MongoHandler = require('../mongo/handler.js'),
    CronJob = require('cron').CronJob,
    crawlerFull = require('./strategies/main-websites.js'),
    crawlerCategories = require('./strategies/all-categories.js'),
    timezone = 'Europe/Paris'
;

MongoHandler.connect(function (MongoHandler) {

    crawlerFull.init(MongoHandler);
    crawlerCategories.init(MongoHandler);

    let jobs = [
        // Toutes les minutes : Cron HeartBeat
        // new CronJob('0 * * * * *', function() {
        //     console.log('Crontab heartbeat');
        // }, null, true, timezone),

        /**
         * À 1h00, on lance le script qui crawl tout
         */
        new CronJob('0 23 0 * * *', function() {
            let timeStart = new Date().getTime();
            spider.crawlMatchs(ligues, function(){
                let time = spider.getTime(new Date().getTime() - timeStart);
                console.log('Fin du Crawl des ligues en ' + time);
            });
        }, null, true, timezone),
    ];

    // On exécute les cron au lancement du script cron.js via node / nodemon
    for(let job of jobs) {
        job.start();
    }
});
