const _parent = require('./abstract.js');

/**
 * @type {{run: module.exports.run, getCellValue: module.exports.getCellValue}}
 */
module.exports = {
    /**
     * Varibales
     */
    name: 'Site Enseigne',

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
        app.updateProgression('strategy_train', 0, 100);
        _parent.train(this, formData);

        _parent.getSitemap('cms', function () {
            app.updateProgression('strategy_train', 20, 100);
            _parent.getSitemap('category', function () {
                app.updateProgression('strategy_train', 40, 100);
                _parent.getSitemap('product', function () {
                    app.updateProgression('strategy_train', 60, 100);
                    _parent.saveData(app)
                });
            });
        });
    },

    /**
     * Return info for frontend
     */
    getInfo: function () {
        return _parent.getInfo(this);
    }
};
