const _parent = require('./abstract.js');

/**
 * @type {{run: module.exports.run, getCellValue: module.exports.getCellValue}}
 */
module.exports = {
    /**
     * Varibales
     */
    app: null,
    name: 'Toutes les catégories',

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
            _this.getSitemap(_this.getWebsites(), 'category');
        });
    },

    /**
     * Return info for frontend
     */
    getSitemap: function (websites, sitemapType) {

        let _this = this;

        if (typeof websites[0] != 'undefined') {
            _parent.website = websites[0];
            websites.shift();
            _parent.getSitemap(sitemapType, function () {
                _this.getSitemap(websites, sitemapType);
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
            'abbeville',
            'agen',
            'ajaccio',
            'albi',
            'amiens',
            'amiens-dury',
            'angers',
            'annecy',
            'arras',
            'auch',
            'bailleul',
            'besancon',
            'blois',
            'bordeaux-ste-catherine',
            'bordes',
            'bourg-en-bresse',
            'brive-la-gaillarde',
            'caen',
            'cahors',
            'cannes-la-bocca',
            'castelnaudary',
            'castelsarrasin',
            'castres',
            'cavaillon',
            'cenon',
            'charleville',
            'chartres',
            'clermont-ferrand',
            'colmar',
            'compiegne',
            'cournon-auvergne',
            'digne-les-bains',
            'douai',
            'dunkerque',
            'elbeuf',
            'eysines',
            'gardanne',
            'givors',
            'hyeres',
            'le-puy-en-velay',
            'lens',
            'lievin',
            'limoges',
            'lourdes',
            'lyon-florit',
            'lyon-tassin',
            'macon',
            'enseigne',
            'metz',
            'mont-de-marsan',
            'montauban',
            'montlucon',
            'morhange',
            'morlaas',
            'mulhouse',
            'nancy',
            'narbonne',
            'nice',
            'nimes',
            'niort',
            'orleans',
            'orvault',
            'pamiers',
            'paris-barbes',
            'paris-les-halles',
            'paris-mexico',
            'paris-ranelagh',
            'pau-mermoz',
            'perigueux',
            'perpignan',
            'pessac',
            'ramonville-saint-agne',
            'reims',
            'rennes',
            'rillieux-la-pape',
            'roanne',
            'rodez',
            'roubaix',
            'rouen',
            'saint-die-des-vosges',
            'saint-etienne',
            'saint-girons',
            'saint-louis',
            'saint-malo',
            'saint-maximin',
            'saint-medard-en-jalles',
            'sainte-genevieve',
            'saintes',
            'salon-de-provence',
            'tarbes',
            'toulon',
            'toulouse-arnaud-bernard',
            'toulouse-centre',
            'tours',
            'troyes',
            'union-saint-caprais',
            'valence',
            'vesoul',
            'vichy',
            'villefranche-sur-saone',
            'villeneuve-sur-lot',
            'villeneuve-sur-lot-pole'
        ];
    }
};
