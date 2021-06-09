const _parent = require('./abstract.js');
const request = require('request');
const date = require('date-and-time');
const fs = require('fs');
/**
 * @type {{run: module.exports.run, getCellValue: module.exports.getCellValue}}
 */
module.exports = {
    /**
     * Varibales
     */
    app: null,
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
    run: function (config, callback) {
        fs.truncateSync('var/log/urls.txt', 0);

        var pagesitemap = config['sitemap_url'];
        this.navigateSiteMap(pagesitemap, callback);
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
                    console.log(error);
                    process.exit(1);
                }

                console.log('Page ouverte.');
                // console.log(body);
                // @todo : parcourire une fois chaque URL récupérée dans le sitemap

                var parseString = require('xml2js').parseString;
                var xml = body
                parseString(xml, function (err, result) {
                    if (typeof result == 'undefined' || err) {
                        console.log(err);
                        process.exit(1);
                    }

                    if (typeof result.urlset == 'undefined') {
                        result.sitemapindex.sitemap.forEach(element => {
                            // console.log(element);
                            _this.navigateSiteMap(element.loc[0], callback);
                        });
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
                console.log(data);
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
