const request = require('request'),
    crypto = require('crypto'),
    libxmljs = require("libxmljs"),

    STATUS_INIT = 'initializing',
    STATUS_ON = 'on',
    STATUS_OFF = 'off',
    STATUS_DISABLED = 'disabled';

module.exports = {
    /**
     * Variables
     */
    triggerStopApplication: false,
    MongoHandler: null,
    progression: 0,
    progressionMax: 100,
    website: null,
    TABLE_NAME: 'crawl_urls',
    tableName: null,
    defaultDelay: 10,
    delay: null,
    isRunning: false,
    isRunningMulti: [],
    multiprocess: true,
    processNb: 10, // pour le multiprocess
    insertData: [{}],

    /**
     * Init. function
     *
     * @return void
     */
    init: function (child, MongoHandler) {

        if (this.MongoHandler === null && typeof MongoHandler != 'undefined') {
            this.MongoHandler = MongoHandler;
            this.MongoHandler.checkIndexes(this.TABLE_NAME, ["type_1"]);
            // console.log( this.MongoHandler);
        }
        console.log('Initializing Strategy: ' + child.name);
    },

    /**
     * Run function
     *
     * @return void
     */
    run: function (child, app, formData) {
        let _this = this;
        console.log('running ' + child.name);

        if (app !== false) {
            app.updateStatus('strategy_train', STATUS_DISABLED);
            app.updateStatus('strategy_run', STATUS_ON);
        }

        _this.tableName = _this.TABLE_NAME + '_' + formData['strategy'];

        if (_this.multiprocess) {
            let i = 0;
            do {
                _this.isRunningMulti['P' + i] = true;
                i++;
            } while (i < _this.processNb);
        } else {
            _this.isRunning = true;
        }

        if (formData['period-size']) {
            _this.delay = formData['period-size'];
        } else {
            _this.delay = _this.defaultDelay;
        }

        let order = parseInt(formData['order']),
            query = {response_code: {$ne: 404}}, // On ne crawl pas les pages en 404
            limit = 10000000,
            sort = {last_crawl: order}; // Date de la plus ancienne a la plus récente

        // console.log(query);
        // console.log(_this.tableName);
        _this.MongoHandler.findDocuments(query, _this.tableName, sort, limit, function (result) {
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
                let statusCode = '';
                if (response && response.statusCode) {
                    statusCode = response.statusCode;
                }

                let data = {},
                    id = crypto.createHash('md5').update(url).digest("hex");
                data['_id'] = crypto.createHash('md5').update(url).digest("hex");
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
                if (app !== false) {
                    app.updateStatus('strategy_train', STATUS_OFF);
                    app.updateStatus('strategy_run', STATUS_OFF);
                }

                console.log('App stopped');
            }
        } else {
            if (this.isRunning) {
                this.triggerStopApplication = true;
            } else {
                if (app !== false) {
                    app.updateStatus('strategy_train', STATUS_OFF);
                    app.updateStatus('strategy_run', STATUS_OFF);
                }
            }
            console.log('App stopped');
        }

        return this;
    },

    /**
     * @returns Perceptron
     */
    getSitemap: function (sitemapType, callback) {
        let _this = this,
            url = 'https://www.pharmacielafayette.com/pub/media/sitemap_enseigne_' + sitemapType + '.xml';

        request.get(url, function (error, response, body) {
            // console.log('get response');
            let statusCode = '';
            if (response && response.statusCode) {
                statusCode = response.statusCode;
            }

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
                                // console.log(url.text());
                                let httpUrl = url.text();

                                if (_this.website != 'enseigne'){
                                    httpUrl = httpUrl.replace('.com/enseigne', '.com/' + _this.website);
                                }

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
    saveData: function (app) {
        let _this = this;
        console.log('Save Datas');

        _this.MongoHandler.insertDocuments(_this.tableName, _this.insertData, function (result) {
            if (app !== false) {
                app.updateProgression('strategy_train', 100, 100);
                app.updateStatus('strategy_train', STATUS_OFF);
                app.updateStatus('strategy_run', STATUS_OFF);
            }
            console.log('END SITEMAP');
        });
    },

    /**
     * Start Training function
     * - Update app Status
     * - Run train() function
     *
     * @return void
     */
    startTraining: function (child, app, formData) {
        if (app !== false) {
            app.updateStatus('strategy_train', STATUS_ON);
            app.updateStatus('strategy_run', STATUS_DISABLED);
        }

        child.train(app, formData);
    },

    /**
     * Training function
     * @return void
     */
    train: function (child, formData) {
        this.setFields(formData, 'training');

        console.log('Training ' + child.name);
    },

    /**
     * Set basic info on model
     */
    setFields: function (formData, type) {
        let _this = this;
        if (typeof (_this.runningSince) == 'undefined') {
            _this.runningSince = this.getCurrentDate();
        }

        var period = parseInt(formData['period-size']),
            limit = formData['limit-amount'];

        _this.limit = limit;
        _this.period = period;
        _this.website = formData['strategy'];
        _this.tableName = _this.TABLE_NAME + '_' + formData['strategy'];

        _this.progressionMax = 0;
        _this.progression = 0;
    },

    /**
     * Return info for frontend
     */
    getInfo: function (child) {
        return {
            name: child.name,
            runningSince: this.runningSince,
            limit: this.limit
        };
    },

    /**
     * Returns current date
     *
     * @return {string}
     */
    getCurrentDate: function () {
        var currentdate = new Date(),
            datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

        return datetime;
    }
};
