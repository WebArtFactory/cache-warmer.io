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
    socket: null,
    name: 'Crawler Web',
    current: 0,
    limitPerSitemap: 3,


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
    run: async function (config, socket, callback) {
        await fs.truncateSync('var/log/urls.txt', 0);
        this.socket = await socket;

        var pagesitemap = await config['url'];

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
    navigateSiteMap: async function (pagesitemap) {
        var _this = this;
        let result;

        try {
            let body = await requestPromise(pagesitemap);
            // console.log('body', body);
            result = await xml2js.parseStringPromise(body)
            console.log('result', result)
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
            await _this.navigateUrls(result.urlset.url)
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
            console.log('response', response.statusCode)
            let data = await url + "," + response.statusCode + "," + " " + date.format(now, 'YYYY/MM/DD HH:mm:ss');
            console.log('data', data)
            await _this.socket.emit('urlFromBack', data)
            await fs.appendFileSync('var/log/urls.txt', data);
            if (urlList.length > 0 && _this.current < _this.limitPerSitemap) {
                await _this.navigateUrls(urlList);
            }
        }
        catch (err) {
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
