const _parent = require('./abstract.js'),
    crypto = require('crypto'),
    request = require('request'),
    libxmljs = require("libxmljs"),

    STATUS_INIT = 'initializing',
    STATUS_ON = 'on',
    STATUS_OFF = 'off',
    STATUS_DISABLED = 'disabled';

/**
 * @type {{run: module.exports.run, getCellValue: module.exports.getCellValue}}
 */
module.exports = {
    /**
     * Varibales
     */
    name: 'Test Crawler 5',
    website: null,
    TABLE_NAME: 'crawl_urls',
    tableName: null,
    MongoHandler: null,
    progression: 0,
    progressionMax: 100,
    defaultDelay: 2,
    delay: null,
    isRunning: false,
    isRunningMulti: [],
    triggerStopApplication: false,
    multiprocess: true,
    processNb: 20, // juste pour le multiprocess (100x le nombre de processeurs de la VM ?)
    insertData: [{}],

    /**
     * Init. function
     *
     * @return void
     */
    init: function (MongoHandler) {
        this.MongoHandler = MongoHandler;
        console.log('Initializing Strategy: ' + this.name);
    },

    /**
     * Run function
     *
     * @return void
     */
    run: function (app, formData) {
        this.tableName = this.TABLE_NAME + '_' + formData['strategy'];

        console.log('running ' + this.name);
        app.updateStatus('strategy_train', STATUS_DISABLED);
        app.updateStatus('strategy_run', STATUS_ON);

        if (this.multiprocess) {
            let i = 0;
            do {
                this.isRunningMulti['P' + i] = true;
                i++;
            } while (i < this.processNb);
        } else {
            this.isRunning = true;
        }

        if (formData['period-size']) {
            this.delay = formData['period-size'];
        } else {
            this.delay = this.defaultDelay;
        }

        let order = parseInt(formData['order']);

        // let query = {pair: pair, date: {$gt: startDate, $lt: endDate}},
        let _this = this,
            query = {},
            limit,
            sort = {last_crawl: order}; // Date de la plus ancienne a la plus récente

        this.MongoHandler.findDocuments(query, _this.tableName, sort, limit, function (result) {
            let urls = [],
                i = 0,
                map = 0;
            result.forEach(function (urlset) {

                if (_this.multiprocess) {

                    if (!urls[map]) {
                        urls[map] = [];
                    }
                    urls[map][i] = urlset.url;

                    map++;
                    if (map === _this.processNb) {
                        i++;
                        map=0;
                    }
                } else {
                    urls[i] = urlset.url;
                    i++;
                }
            });

            console.log('Crawler started');
            if (_this.multiprocess) {
                let i = 0;
                for (i = 0; i < _this.processNb; i++) { // for.. pour paraléliser
                    // console.log('Crawler multiproc ' + i);
                    _this.crawlUrl(urls[i], app, function (){
                        let index = i;
                        console.log('END CRAWL #' + index);
                        _this.isRunningMulti['P' + index] = false;
                        _this.stopApplication(app);
                    });
                }
            } else {
                _this.crawlUrl(urls, app, function (){
                    console.log('END CRAWL');
                    _this.isRunning = false;
                    _this.stopApplication(app);
                });
            }
        });
    },

    /**
     *
     * @param url
     */
    crawlUrl: function (urls, app, callback) {
        if (this.triggerStopApplication) {
            callback();
        } else if (urls.length > 0) {
            let _this = this,
                url = urls[0];

            urls.splice(0, 1);

            let timeStart = new Date().getTime();
            request.get(url, function (error, response, body) {
                let timeEnd = new Date().getTime();
                let time = (timeEnd - timeStart);
                if (time > 1000) {
                    time = time / 1000;
                    time = time + 's';
                } else {
                    time = time + 'ms';
                }
                console.log(url + ' a été crawlée en ' + time);
                // console.log(body);
                // console.log(error);
                // console.log(response.toString());

                let statusCode = '';
                if (response && response.statusCode) {
                    statusCode = response.statusCode;
                }

                // console.log(body);

                let data = {},
                    id = crypto.createHash('md5').update(url).digest("hex");
                data['_id'] = id;
                data['response_code'] = statusCode;
                data['last_crawl'] = new Date().getTime();
                _this.MongoHandler.updateDocument({ _id: id }, { $set: data }, _this.tableName, function (result) {
                    setTimeout(function (){_this.crawlUrl(urls, app, callback);}, _this.delay);
                });

            });
        } else {
            callback();
        }
    },

    /**
     * Start Training function
     * - Update app Status
     * - Run train() function
     *
     * @return void
     */
    startTraining: function (app, formData) {
        app.updateStatus('strategy_train', STATUS_ON);
        app.updateStatus('strategy_run', STATUS_DISABLED);
        this.train(app, formData);
    },

    /**
     * Training function
     *
     * @return void
     */
    train: function (app, formData) {
        let i = 0,
            _this = this;

        app.updateProgression('strategy_train', 0, 100);

        console.log('Training ' + _this.name);
        if (typeof (_this.runningSince) == 'undefined') {
            _this.runningSince = _parent.getCurrentDate();
        }
        var period = parseInt(formData['period-size']),
            limit = formData['limit-amount'];

        _this.website = formData['strategy'];
        _this.tableName = _this.TABLE_NAME + '_' + formData['strategy'];
        _this.progressionMax = 0;
        _this.progression = 0;

        app.updateProgression('strategy_train', 20, 100);
        _this.getSitemap('fr', function () {
            app.updateProgression('strategy_train', 40, 100);
            _this.getSitemap('pro_fr', function () {
                app.updateProgression('strategy_train', 60, 100);
                _this.saveData(_this, app)
            });
        });
    },


    /**
     * @returns Perceptron
     */
    getSitemap: function (sitemapType, callback) {
        let _this = this,
            url = 'https://www.visseriefixations.fr/sitemap/sitemap_' + sitemapType + '.xml';

        request.get(url, function (error, response, body) {
            // console.log('get response');
            let statusCode = '';
            if (response && response.statusCode) {
                statusCode = response.statusCode;
            }
            // console.log(body);

            if (error === null && statusCode == '200') {
                // console.log('no error');
                if (response.headers['content-type'].includes("text/xml")) {
                    // console.log('is xml : ' + url);
                    var xmlDoc = libxmljs.parseXml(body);
                    // console.log('parsed');

                    xmlDoc.root().childNodes().forEach(function (urlset) {
                        // console.log(urlset.text());
                        urlset.childNodes().forEach(function (url, test) {
                            // console.log(test);
                            if (test === 0) {
                                let httpUrl = url.text();

                                _this.insertData[_this.progression] = {};
                                _this.insertData[_this.progression]['_id'] = crypto.createHash('md5').update(httpUrl).digest("hex");
                                _this.insertData[_this.progression]['url'] = httpUrl;
                                _this.insertData[_this.progression]['type'] = sitemapType;
                                _this.insertData[_this.progression]['response_code'] = '';
                                _this.insertData[_this.progression]['last_crawl'] = 0;

                                _this.progression++;
                                console.log(_this.progression);
                            }
                        });
                    });

                    // console.log(data);
                    console.log('END : ' + sitemapType + ' - ' + _this.progression);
                    callback();
                } else {
                    console.log("L'URL de sitemap n'est pas un XML valide" + url);
                }
            } else {
                console.log("Une erreur " + statusCode + " est survenue lors de la requête http du sitemap : " + url);
                console.log(error);
            }
        });
        return this;
    },

    /**
     * @param el
     * @param app
     */
    saveData: function (el, app) {
        let _this = el;

        console.log('Save Datas');
        this.MongoHandler.insertDocuments(_this.tableName, this.insertData, function (result) {
            app.updateProgression('strategy_train', 100, 100);
            app.updateStatus('strategy_train', STATUS_OFF);
            app.updateStatus('strategy_run', STATUS_OFF);
            console.log('END SITEMAP');
        });
    },

    /**
     * Return info for frontend
     */
    stopApplication: function (app) {

        if (this.multiprocess) {

            let run = false;
            this.isRunningMulti.forEach(function (processRunning) {
                if (processRunning === true) {
                    run = true;
                }
            });
            if (!run) {
                app.updateStatus('strategy_train', STATUS_OFF);
                app.updateStatus('strategy_run', STATUS_OFF);
                console.log('App stopped');
            }
        } else {
            if (this.isRunning) {
                this.triggerStopApplication = true;
            } else {
                app.updateStatus('strategy_train', STATUS_OFF);
                app.updateStatus('strategy_run', STATUS_OFF);
            }
            console.log('App stopped');
        }

        return this;
    },

    /**
     * Return info for frontend
     */
    getInfo: function () {
        return {
            name: this.name,
            runningSince: this.runningSince,
            limit: this.limit
        };
    }
};
