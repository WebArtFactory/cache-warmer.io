const MongoClient = require('mongodb').MongoClient;
const ConfigHandler = require('../server/config.js');

/**
 * MongoDB Handler
 */
module.exports = {
    /**
     * Variables
     */
    debugLogs: false,
    db: false,
    url: ConfigHandler.getMongoDbUrl(),
    dbName: ConfigHandler.getMongoDbName(),
    client: null,

    /**
     * Connect DB
     */
    connect: function (callback) {
        var _this = this;
        MongoClient.connect(_this.url, function (err, client) {
            let db = client.db(_this.dbName);
            if (err) {
                _this.log("An Webart error occured when connecting database " + _this.dbName);
                _this.log(err);
            }
            _this.client = client;
            _this.db = client.db(_this.dbName);

            if (callback !== undefined) {
                callback(_this);
            }
        });
    },

    /**
     * Close DB connexion
     */
    close: function () {
        if (this.client !== null)
            this.client.close();
    },

    /**
     * Insert a Document
     *
     * @param table string table name
     * @param data array|Json
     * @param callback
     */
    insertDocuments: function (table, insertData, callback) {
        var _this = this;
        let collection = _this.db.collection(table);
        collection.insertMany(insertData, {ordered: false}, function (err, result) {
            if (err) {
                _this.log("An Webart error occurred when inserting documents : ");
                _this.log(err);
            }
            if (callback !== undefined) {
                callback(result);
            }
        });
    },

    /**
     * Find Documents with a Query Filter
     *
     * @param db
     * @param callback
     */
    findDocuments: function (query, table, sort, limit, callback) {
        var _this = this;
        let collection = _this.db.collection(table);

        collection = collection.find(query);
        // db.collection.find().sort({age:-1}).limit(1) // for MAX
        // db.collection.find().sort({age:+1}).limit(1) // for MIN
        if (typeof(sort) != 'undefined') {
            collection = collection.sort(sort)
        }
        if (typeof(limit) != 'undefined') {
            collection = collection.limit(limit)
        }

        collection.toArray(function (err, docs) {
            if (err) {
                console.log("An Webart error occured when finding documents : ");
                console.log(err);
            }
            if (callback !== undefined) {
                callback(docs);
            }
        });
    },

    /**
     * Update a document
     *
     * @param db
     * @param callback
     */
    updateDocument: function (insertKey, insertData, table, callback) {
        var _this = this;
        let collection = _this.db.collection(table);
        collection.updateOne(
            insertKey,
            insertData,
            {upsert: true},
            function (err, result) {
                if (err) {
                    console.log("An Webart error occured when updating documents : ");
                    console.log(err);
                }
                if (callback !== undefined)
                    callback(result);
            });
    },

    /**
     * Count a collection
     *
     * @param db
     * @param callback
     */
    countCollection: function (query, table, callback) {
        let collection = this.db.collection(table);
        collection = collection.find(query);
        collection.count(function (err, docs) {
            if (err) {
                console.log("An Webart error occured when counting documents : ");
                console.log(err);
            }
            if (callback !== undefined) {
                callback(docs);
            }
        });
    },

    /**
     * Remove a document
     * @todo
     *
     * @param db
     * @param callback
     */
    removeDocument: function (table, callback) {
        console.log("@todo removeDocument function");
        // let collection = this.db.collection(table);
        // // Delete document where a is 3
        // collection.deleteOne({a: 3}, function (err, result) {
        //     console.log("Removed the document with the field a equal to 3");
        //     if (callback !== undefined) {
        //         callback(docs);
        //     }
        // });
    },

    /**
     * Clear a collection
     * /!\ use with caution
     *
     * @param db
     * @param callback
     */
    clearCollection: function (table, callback) {
        var _this = this;
        let collection = _this.db.collection(table);

        collection.deleteMany({}, function (err, result) {
            if (err) {
                console.log("An Webart error occured when clearing database " + table + " : ");
                console.log(err);
            } else {
                _this.log("Database cleared: " + table);
            }
            if (callback !== undefined) {
                callback(result);
            }
        });
    },

    /**
     * Check Indexes on node startup
     */
    checkIndexes: function (table, requiredIndexes) {
        var _this = this,
            visiblesIndexes = {};

        _this.log('Mongo: check Indexes');

        let collection = _this.db.collection(table);
        collection.indexInformation(function (err, result) {
            _this.log(result);
            for (var key in result) {
                visiblesIndexes[key] = key;
            }
            _this.log(visiblesIndexes);
            _this.log(requiredIndexes);

            _this.setDefaultIndexes(table, visiblesIndexes, requiredIndexes, 0);
        });
    },

    setDefaultIndexes: function(table, visiblesIndexes, requiredIndexes, mk){
        if (typeof(requiredIndexes[mk]) == 'undefined') {
            // END
        } else {
            var _this = this;
            let missingIndex = requiredIndexes[mk];
            if (typeof(visiblesIndexes[missingIndex]) != 'undefined') {
                _this.log('Index ' + missingIndex + ' présent.');
                _this.setDefaultIndexes(table, visiblesIndexes, requiredIndexes, mk + 1);
            } else {
                console.log('Index ' + missingIndex + ' manquant. Merci de patienter.');
                _this.indexElement(table, missingIndex, function (results) {
                    console.log('Index ' + missingIndex + ' ajouté.');
                    _this.setDefaultIndexes(table, visiblesIndexes, requiredIndexes, mk + 1);
                });
            }
        }
    },

    /**
     * Index a Collection
     *
     * Indexes can improve your application’s performance.
     * The following function creates an index on the a field in the documents collection.
     * @link https://docs.mongodb.org/manual/indexes/
     *
     * @param db
     * @param callback
     */
    indexElement: function (table, index, callback) {

        var keys = {},
            _this = this,
            myArr = index.split("_"),
            fieldKey = 0,
            sortOrderKey = 1,
            collationType = null;
            // collationType = {locale: "fr"};

        while (typeof(myArr[sortOrderKey]) != 'undefined') {
            keys[myArr[fieldKey]] = parseInt(myArr[sortOrderKey]);
            fieldKey = fieldKey + 2;
            sortOrderKey = sortOrderKey + 2;
        }

        if (index == 'date_-1') {
            collationType = {numericOrdering: true};
        }

        var params = {};
        if (collationType != null) {
            params['collation'] = collationType;
        }
        if (index == 'pair_1_tradeID_1') {
            params['unique'] = true;
        }

        _this.log(keys);

        let collection = _this.db.collection(table);
        collection.createIndex(
            keys,
            params,
            function (err, results) {
                if (err) {
                    console.log("An Webart error occured when adding index to database " + table + " : ");
                    console.log(err);
                }
                if (callback !== undefined) {
                    callback(results);
                }
            }
        );
    },

    /**
     * Log if enable
     *
     * @param msg string
     */
    log: function (msg) {
        if (this.debugLogs) {
            console.log(msg);
        }
    }
};
