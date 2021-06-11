const _parent = require('./abstract.js');
const request = require('request');
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
    run: function (config, socket, callback) {
        fs.truncateSync('var/log/urls.txt', 0);
        this.socket = socket;

        var pagesitemap = config['url'];

            this.navigateSiteMap(pagesitemap, callback);


        return '@todo'
    },

    /**
     *
     * @param pagesitemap
     * @param callback
     *
     * Make the difference with the Urlset and sitemapindex
     */
    navigateSiteMap: function (pagesitemap, callback) {
        var _this = this;
        console.log('On ouvre la page : ' + pagesitemap);

        // @todo : lire le fichier XML "pagesitemap" et récupérer les URLs qu'il contient
        console.log(pagesitemap);
        request.get(
            pagesitemap,
            function (error, response, body) {
                if (typeof body == 'undefined' || error) {
                    console.log('error while opening sitemap');
                    // console.log(error);
                    process.exit(1);
                }

                // console.log('Page ouverte.');
                // console.log(body);

                xml2js.parseString(body, async function (err, result) {
                    if (typeof result == 'undefined' || err) {
                        console.log(err);
                        process.exit(1);
                    }

                    if (typeof result.urlset == 'undefined') {
                            for (element of result.sitemapindex.sitemap) {

                                console.log('sitemap', element.loc);
                                _this.navigateSiteMap(element.loc[0], callback)
                            }
                            // result.sitemapindex.sitemap.forEach(element => {

                            // });
                    } else {
                        _this.navigateUrls(result.urlset.url, callback)
                    }
                });

            }
        );
    },

    /**
     * Allow the crawler to navigate
     */
    navigateUrls: function (urlList, callback) {

        var url = urlList.shift();
        var _this = this;
        var now = new Date();

        url = url.loc[0];

        request.get(
            url,
            function (error, response, body) {
                var data = url + "," + response.statusCode + "," + " " + date.format(now, 'YYYY/MM/DD HH:mm:ss') + '\n';
                // console.log(error);
                // console.log(response);
                console.log('data', data);
                _this.socket.emit('urlFromBack', data)
                // console.log('emission ok');

                fs.appendFileSync('var/log/urls.txt', data);
                if (urlList.length > 0) {
                    _this.navigateUrls(urlList, callback);
                } else if (callback) {
                    callback();
                }
            }
        );

    },

    /**
     * Return info for frontend
     */
    getInfo: function () {
        return _parent.getInfo(this);
    }
};
