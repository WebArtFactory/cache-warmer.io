const initSrv = require('./helper/initSrv.js'),
    io = initSrv.io,

    STATUS_INIT = 'initializing',
    STATUS_ON = 'on',
    STATUS_OFF = 'off',
    STATUS_DISABLED = 'disabled';

const fs = require('fs');

/**
 * Base Application Handler
 */
module.exports = {
    /**
     * Variables
     */
    serviceStatus: {
        strategy_train: STATUS_INIT,
        strategy_run: STATUS_INIT
    },
    strategy: [],
    services: {},

    runApplication: function (MongoHandler) {

        /*******************
         * Init variables  *
         ******************/
        var _this = this;

        /******************
         * Init services  *
         *****************/
        this.MongoHandler = MongoHandler;

        // Init Strategies
        var files = fs.readdirSync('./server/strategies/');
        for (var i in files) {
            var fileName = files[i],
                stratName = fileName.replace('.js', '');
            if (stratName != 'abstract') {
                _this.strategy[stratName] = require('./strategies/' + fileName);
                _this.strategy[stratName].init(MongoHandler);
            }
        }
        var stratTypes = ['strategy_train', 'strategy_run'];
        for (var i in stratTypes) {
            _this.updateStatus(stratTypes[i], STATUS_OFF);
        }

        /**************************************
         * Communication Serveur <=> App web  *
         **************************************/
        _this.services['strategy_train'] = {
            on: function (data, app) {
                // console.log(app.strategy);
                // console.log(data.form['strategy']);
                app.strategy[data.form['strategy']].startTraining(app, data.form);
            },
            off: function (data, app) {
                io.sockets.emit('status_info', {
                    service: 'strategy_train',
                    status: app.serviceStatus['strategy_train']
                });
            }
        };
        _this.services['strategy_run'] = {
            on: function (data, app) {
                app.strategy[data.form['strategy']].run(app, data.form);
                // _this.frontendAlert('@todo: service strategy_run');
            },
            off: function (data, app) {
                app.strategy[data.form['strategy']].stopApplication(app);
                // io.sockets.emit('status_info', {service: 'strategy_train', status: STATUS_OFF});
            }
        };


        io.sockets.on('connection', function (socket) {
            /**
             * À chaque fois qu'on  démarre le srv, ici c'est trigger
             */
            // Là on envoie le status de tous les services au frontend
            for (var serviceName in _this.services) {
                socket.emit('status_info', {service: serviceName, status: _this.serviceStatus[serviceName]});
            }

            /**
             * À chaque fois qu'on load une page de front, ici c'est trigger
             * Le socket "news" est appelé a chaque reload de page par le front
             */
            socket.on('ask_news', function () {
                // News est trigger depuis le front a chaque reload de page
                io.sockets.emit('news', {info: 'Node server is Active and waiting for you.'});

                // Là on envoie le status de tous les services au frontend
                for (var serviceName in _this.services) {
                    io.sockets.emit('status_info', {service: serviceName, status: _this.serviceStatus[serviceName]});
                }
            });

            /**
             * io listeners
             */
            socket.on('ask_padertrading_model_info', function (pair) {
                var strategies = {};
                for (var stratId in _this.strategy) {
                    strategies[stratId] = _this.strategy[stratId].getInfo();
                }
                io.sockets.emit('receive_padertrading_model_info', strategies);
            });
            socket.on('get_status', function (data) {
                if (_this.serviceStatus[data.service] === STATUS_ON) {
                    console.log("\x1b[33mReceived\x1b[0m:= \x1b[36mget_status\x1b[0m: for < \x1b[36m%s\x1b[0m > (status is < \x1b[32m%s\x1b[0m >)", data.service, _this.serviceStatus[data.service]);
                } else {
                    console.log("\x1b[33mReceived\x1b[0m:= \x1b[36mget_status\x1b[0m: for < \x1b[36m%s\x1b[0m > (status is < \x1b[31m%s\x1b[0m >)", data.service, _this.serviceStatus[data.service]);
                }
                // console.log('Received request get_status for ' + data.service + ' (status is ' + _this.serviceStatus[data.service] + ')');
                // sending notification
                io.sockets.emit('status_info', {'service': data.service, 'status': _this.serviceStatus[data.service]});
            });
            socket.on('set_status', function (data) {
                console.log('Received request set_status for ' + data.service + ' (status requested : ' + data.status + ')');
                // console.log(data);
                if (typeof (_this.services[data.service]) == 'undefined') {
                    console.log('Service < ' + data.service + ' > is unknown ¯\\_(ツ)_/¯');
                    return false;
                }
                switch (data.status) {
                    case STATUS_ON :
                        _this.services[data.service].on(data, _this);
                        break;
                    case STATUS_OFF :
                        _this.services[data.service].off(data, _this);
                        break;
                    default:
                        console.log('Status < ' + data.status + ' > appears to be invalid for ' + data.service + ' ¯\\_(ツ)_/¯');
                        return false;
                }
            });
        });
    },


    /**********************
     * Services Managment *
     *********************/
    /**
     * Update Service status and frontend's buttons
     *
     * @param serviceName string
     * @param status string
     */
    updateStatus: function (serviceName, status) {
        if (status === STATUS_ON) {
            console.log("\x1b[33mNotifying\x1b[0m:= \x1b[36mstatus_update\x1b[0m: service < \x1b[36m%s\x1b[0m > is now < \x1b[32m%s\x1b[0m >", serviceName, status);
        } else {
            console.log("\x1b[33mNotifying\x1b[0m:= \x1b[36mstatus_update\x1b[0m: service < \x1b[36m%s\x1b[0m > is now < \x1b[31m%s\x1b[0m >", serviceName, status);
        }

        this.serviceStatus[serviceName] = status;
        io.sockets.emit('status_info', {service: serviceName, status: status});
    },
    /**
     * Update Service frontend's progressbar
     *
     * @param serviceName string
     * @param progression int
     * @param progressionMax int
     */
    updateProgression: function (serviceName, progression, progressionMax) {
        io.sockets.emit('status_progression', {
            service: serviceName,
            progression: progression,
            progressionMax: progressionMax
        });
    },

    /**
     * Notice frontend with alert() method
     *
     * @param message string
     */
    frontendAlert: function (message) {
        io.sockets.emit('frontend_notification', {message: message});
    }
}
