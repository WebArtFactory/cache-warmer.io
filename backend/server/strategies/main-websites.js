const _parent = require('./abstract.js');

/**
 * @type {{run: module.exports.run, getCellValue: module.exports.getCellValue}}
 */
module.exports = {
    /**
     * Varibales
     */
    app: null,
    name: 'Principaux websites',

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
    run: function (app, formData) {
        _parent.run(this, app, formData);
    },

    /**
     * Start Training function
     * - Update app Status
     * - Run train() function
     *
     * @return void
     */
    startTraining: function (app, formData) {
        _parent.startTraining(this, app, formData);
    },

    /**
     * Training function
     *
     * @return void
     */
    train: function (app, formData) {
        this.app = app;
        _parent.train(this, formData);

        let _this = this;
        _parent.website = 'enseigne';
        _parent.getSitemap('cms', function () {
            _this.getSitemapCategory(_this.getWebsites());
        });
    },

    /**
     * Return info for frontend
     */
    getSitemapCategory: function (websites) {

        let _this = this;

        if (typeof websites[0] != 'undefined') {
            _parent.website = websites[0];
            websites.shift();
            _parent.getSitemap('category', function () {
                _this.getSitemapCategory(websites);
            });
        } else {
            _this.getSitemapProducts(_this.getWebsites());
        }
    },

    /**
     * Return info for frontend
     */
    getSitemapProducts: function (websites) {

        let _this = this;

        if (typeof websites[0] != 'undefined') {
            _parent.website = websites[0];
            websites.shift();
            _parent.getSitemap('product', function () {
                _this.getSitemapProducts(websites);
            });
        } else {
            _parent.saveData(_this.app)
        }
    },

    /**
     * Return info for frontend
     */
    getInfo: function () {
        return _parent.getInfo(this);
    },

    /**
     * Return info for frontend
     */
    getWebsites: function () {
        return [
            'enseigne',
            'albi',
            'besancon',
            'lyon-florit', // problème d'URL ici
            'rodez', // problème d'URL ici
            'roubaix', // problème d'URL ici
            'toulouse-centre', // problème d'URL ici
            'rouen',
            'abbeville',
            'agen',
            'ajaccio',
            'amiens',
            'amiens-dury',
            'angers',
            'annecy',
            'arras',
            'auch',
            'bailleul',
            'blois',
            'bordeaux-ste-catherine',
            'bordes',
            'bourg-en-bresse',
            'brive-la-gaillarde',
            'caen',
            'cahors',
            'cannes-la-bocca',
            'castelnaudary'
        ];
    }
};
