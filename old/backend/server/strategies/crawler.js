const _parent = require('./abstract.js'),
    request = require('request');
const requestPromise = require('request-promise');

const date = require('date-and-time');
const fs = require('fs');
const xml2js = require('xml2js');
/**
 * @type {{run: module.exports.run, getCellValue: module.exports.getCellValue}}
 */
return module.exports = {
    /**
     * Varibales
     */
    app: null,
    io: null,
    socket: null,
    socketId: null,
    name: 'Crawler Web',
    current: 0,
    limitPerSitemap: 200000000000000000000,
    totalEntries: 0,
    totalEntriesTest: null,
    robotNumber: null,


    /**
     * Init. function
     *
     * @return void
     */
    init: function (MongoHandler) {
        _parent.init(this, MongoHandler);
    },

    /**
     * Run function
     *
     * @return void
     */
    run: async function (config, robot, io, socketId, callback) {
        await fs.truncateSync('var/log/urls.txt', 0);

        this.io = io;
        this.socketId = socketId;
        var pagesitemap = await config['url']
        this.robotNumber = await robot['robot']
        // totalCount;

        await this.countUrls(pagesitemap);

        console.log('total entries', this.totalEntries)

        await this.navigateSiteMap(pagesitemap);

        return '@todo'
    },

    /**
     *
     * @param pagesitemap
     * @param callback
     *
     //  * Make the difference with the Urlset and sitemapindex
     //  */
    countUrls: async function (pagesitemap) {
        var _this = this;
        let result;

        try {
            let body = await requestPromise(pagesitemap);
            // console.log('body', body);
            result = await xml2js.parseStringPromise(body)
            // console.log('result', result)
        } catch (err) {
            console.log('err', err);
            process.exit(1);
        }

        let el1;
        if (typeof result.urlset == 'undefined') {
            for (let element of result.sitemapindex.sitemap) {
                console.log('On commence à parcourir le sitemap : ' + element.loc[0])
                await _this.countUrls(element.loc[0])
                // console.log('el1', el1)
            }
        } else {

            if (_this.totalEntriesTest !== null) {
                await _this.io.to(_this.socketId).emit('countFromBack', _this.totalEntriesTest);
            } else {
                _this.totalEntries += result.urlset.url.length;
                console.log('totalentreies', _this.totalEntries)
                console.log('count de 1 sitemap : ' + result.urlset.url.length)

                await _this.io.to(_this.socketId).emit('countFromBack', _this.totalEntries);
            }

        }
    },

    /**
     *
     * @param pagesitemap
     * @param callback
     *
     //  * Make the difference with the Urlset and sitemapindex
     //  */
    navigateSiteMap: async function (pagesitemap) {
        var _this = this;
        let result;
        // let numbOfRobot = robotNumber;
        console.log('______________________________________robot', this.robotNumber)
        let resultNavigateUrlLength = [];
        let urls = []

        try {
            let body = await requestPromise(pagesitemap);
            // console.log('body', body);
            result = await xml2js.parseStringPromise(body)
            // console.log('result', result)
        } catch (err) {
            console.log('err', err);
            process.exit(1);
        }

        let el1;
        if (typeof result.urlset == 'undefined') {
            for (let element of result.sitemapindex.sitemap) {
                console.log('On commence à parcourir le sitemap : ' + element.loc[0])
                await _this.navigateSiteMap(element.loc[0])
                // console.log('el1', el1)
            }
        } else {
            console.log('On commence à parcourir les URLs du sitemap.')
            _this.current = 0;
            // console.log('--------------------------------------------------------------', result)
            let resultNavigateUrl = await result.urlset.url
            console.log('nombre de robot', _this.robotNumber)
            for (let i = 0; i < _this.robotNumber; i++) {
                urls[i] = []
                resultNavigateUrlLength.push(Math.ceil(resultNavigateUrl.length / _this.robotNumber) * (i + 1))

                let j = 0; 
                if (typeof resultNavigateUrlLength[i - 1] != 'undefined') {
                    j = resultNavigateUrlLength[i - 1]
                }

                for (j;j < resultNavigateUrlLength[i]; j++) {
                    urls[i].push(resultNavigateUrl[j])
                }
                // console.log('i', i);
                _this.navigateUrls(urls[i])
            }
            // console.log('url', urls)
            // console.log('ROBOT', resultNavigateUrlLength)
        }

    },

    navigateUrls: async function (urlList, response) {


        var url = urlList.shift();
        var _this = this;
        var now = new Date();
        _this.current++;

        url = url.loc[0];



        try {
            let response = await requestPromise({
                uri: url,
                resolveWithFullResponse: true
            });
            // console.log('response', response.statusCode)
            let code = response.statusCode;
            let data = await url + "," + code + "," + " " + date.format(now, 'YYYY/MM/DD HH:mm:ss');
            console.log('data', data)
            _this.io.to(_this.socketId).emit('urlFromBack', data);
            // fs.appendFileSync('var/log/urls.txt', data + "\n");
            if (urlList.length > 0 && _this.current < _this.limitPerSitemap) {
                await _this.navigateUrls(urlList);
            }
        } catch (err) {
            console.log('err', err);

        }
    },

    /**
     * Return info for frontend
     */
    getInfo: function () {
        return _parent.getInfo(this);
    }
};
