// const assert = require('assert');
const fs = require('fs');

const confFileRelPath = '/../app/etc/config.json';

// let conf = require(__dirname + confFileRelPath);

let conf = JSON.parse(fs.readFileSync(__dirname + confFileRelPath, 'utf8'));

/**
 * MongoDB Handler
 */
module.exports = {
    /**
     * Returns BASE_URL configuration value
     *
     */
    getBaseUrl: function()
    {
        return conf['BASE_URL'];
    },

    /**
     * Returns WEBSITE_TITLE configuration value
     *
     */
    getWebsiteTitle: function()
    {
        return conf['WEBSITE_TITLE'];
    },

    /**
     * Returns NODE_BACKEND_PORT configuration value
     *
     */
    getNodeBackendPort: function()
    {
        return conf['NODE_BACKEND_PORT'];
    },

    /**
     * Returns MONGO_DB_URL configuration value
     *
     */
    getMongoDbUrl: function()
    {
        return conf['MONGO_DB_URL'];
    },

    /**
     * Returns MONGO_DB_NAME configuration value
     *
     */
    getMongoDbName: function()
    {
        return conf['MONGO_DB_NAME'];
    },

    /**
     * Returns POLONIEX_KEY configuration value
     *
     */
    getPoloniexKey: function()
    {
        return conf['POLONIEX_KEY'];
    },

    /**
     * Returns POLONIEX_SECRET configuration value
     *
     */
    getPoloniexSecret: function()
    {
        return conf['POLONIEX_SECRET'];
    },

    /**
     * Returns NODE_BACKEND_PORT configuration value
     *
     */
    getNodeBackendPort: function()
    {
        return conf['NODE_BACKEND_PORT'];
    },

};
