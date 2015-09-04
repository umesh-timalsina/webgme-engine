/*jshint node:true*/

/**
 * @module Server.SimpleWorker
 * @author kecso / https://github.com/kecso
 */

'use strict';

var WEBGME = require(__dirname + '/../../../webgme'),

    CONSTANT = require('./constants'),
    Logger = require('../logger'),
    WorkerRequests = require('./workerrequests'),
    wr,
    AddOnManager = require('../../addon/addonmanager'),

    addOnManager,
    initialized = false,
    gmeConfig,
    logger;

function safeSend(msg) {
    if (initialized) {
        logger.debug('sending message', {metadata: msg});
    } else {
        //console.log('sending message', {metadata: msg});
    }
    try {
        process.send(msg);
    } catch (e) {
        if (initialized) {
            logger.error('sending message failed', {metadata: msg, e: e});
        } else {
            console.error('sending message failed', {metadata: msg, e: e});
        }
        //TODO check if we should separate some case
        process.exit(0);
    }
}

function initialize(parameters) {
    if (initialized !== true) {
        initialized = true;
        gmeConfig = parameters.gmeConfig;
        WEBGME.addToRequireJsPaths(gmeConfig);
        logger = Logger.create('gme:server:worker:simpleworker:pid_' + process.pid, gmeConfig.server.log, true);
        logger.debug('initializing');
        wr = new WorkerRequests(logger, gmeConfig);
        safeSend({pid: process.pid, type: CONSTANT.msgTypes.initialized});
    } else {
        safeSend({pid: process.pid, type: CONSTANT.msgTypes.initialized});
    }
}

//AddOn Functions
function initConnectedWorker(webGMESessionId, userId, addOnName, projectId, branchName, callback) {
    if (!addOnName || !projectId || !branchName) {
        callback(new Error('Required parameter was not provided'));
        return;
    }

    addOnManager = new AddOnManager(webGMESessionId, logger, gmeConfig);

    addOnManager.initialize(function (err) {
        if (err) {
            callback(err);
            return;
        }

        addOnManager.startNewAddOn(addOnName, projectId, branchName, userId, callback);
    });
}

function connectedWorkerQuery(parameters, callback) {
    if (addOnManager) {
        //TODO: Should query a specific addOn.
        addOnManager.queryAddOn(null, parameters)
            .then(function (message) {
                callback(null, message);
            })
            .catch(function (err) {
                callback(err);
            });
    } else {
        callback(new Error('No AddOn is running'));
    }
}

function connectedWorkerStop(callback) {
    if (addOnManager) {
        addOnManager.close()
            .then(function () {
                addOnManager = null;
                callback(null);
            })
            .catch(callback);
    } else {
        callback(null);
    }
}

//main message processing loop
process.on('message', function (parameters) {
    parameters = parameters || {};
    parameters.command = parameters.command;

    if (!initialized && parameters.command !== CONSTANT.workerCommands.initialize) {
        return safeSend({
            pid: process.pid,
            type: CONSTANT.msgTypes.request,
            error: 'worker has not been initialized yet',
            resid: null
        });
    }

    if (parameters.command === CONSTANT.workerCommands.initialize) {
        return initialize(parameters);
    }

    logger.debug('Incoming message:', {metadata: parameters});

    if (parameters.command === CONSTANT.workerCommands.executePlugin) {
        wr.executePlugin(parameters.webGMESessionId, parameters.name, parameters.context, function (err, result) {
                safeSend({
                    pid: process.pid,
                    type: CONSTANT.msgTypes.result,
                    error: err ? err.message : null,
                    result: result
                });
            }
        );
    } else if (parameters.command === CONSTANT.workerCommands.exportLibrary) {
        wr.exportLibrary(parameters.webGMESessionId, parameters.projectId, parameters.path, parameters,
            function (err, result) {
                safeSend({
                    pid: process.pid,
                    type: CONSTANT.msgTypes.result,
                    error: err ? err.message : null,
                    result: result
                });
            }
        );
    } else if (parameters.command === CONSTANT.workerCommands.seedProject) {
        parameters.type = parameters.type || 'db';
        wr.seedProject(parameters.webGMESessionId, parameters.projectName, parameters.ownerId, parameters,
            function (err, result) {
                safeSend({
                    pid: process.pid,
                    type: CONSTANT.msgTypes.result,
                    error: err ? err.message : null,
                    result: result
                });
            });
    } else if (parameters.command === CONSTANT.workerCommands.autoMerge) {
        wr.autoMerge(parameters.webGMESessionId, parameters.projectId, parameters.mine, parameters.theirs,
            function (err, result) {
                safeSend({
                    pid: process.pid,
                    type: CONSTANT.msgTypes.result,
                    error: err ? err.message : null,
                    result: result
                });
            });
    } else if (parameters.command === CONSTANT.workerCommands.resolve) {
        wr.resolve(parameters.webGMESessionId, parameters.partial, function (err, result) {
            safeSend({
                pid: process.pid,
                type: CONSTANT.msgTypes.result,
                error: err ? err.message : null,
                result: result
            });
        });
    } else if (parameters.command === CONSTANT.workerCommands.connectedWorkerStart) {
        if (gmeConfig.addOn.enable === true) {
            initConnectedWorker(parameters.webGMESessionId, parameters.userId, parameters.workerName,
                parameters.projectId, parameters.branch,
                function (err) {
                    if (err) {
                        safeSend({
                            pid: process.pid,
                            type: CONSTANT.msgTypes.result,
                            error: err.message,
                            resid: null
                        });
                    } else {
                        safeSend({
                            pid: process.pid,
                            type: CONSTANT.msgTypes.request,
                            error: null,
                            resid: process.pid
                        });
                    }
                }
            );
        } else {
            safeSend({
                pid: process.pid,
                type: CONSTANT.msgTypes.request,
                error: 'addOn functionality not enabled',
                resid: null
            });
        }
    } else if (parameters.command === CONSTANT.workerCommands.connectedWorkerQuery) {
        if (gmeConfig.addOn.enable === true) {
            connectedWorkerQuery(parameters, function (err, result) {
                safeSend({
                    pid: process.pid,
                    type: CONSTANT.msgTypes.query,
                    error: err ? err.message : null,
                    result: result
                });
            });
        } else {
            safeSend({
                pid: process.pid,
                type: CONSTANT.msgTypes.result,
                error: 'addOn functionality not enabled',
                resid: null
            });
        }
    } else if (parameters.command === CONSTANT.workerCommands.connectedWorkerStop) {
        if (gmeConfig.addOn.enable === true) {
            connectedWorkerStop(function (err) {
                safeSend({
                    pid: process.pid,
                    type: CONSTANT.msgTypes.result,
                    error: err ? err.message : null,
                    result: null
                });
            });
        } else {
            safeSend({
                pid: process.pid,
                type: CONSTANT.msgTypes.request,
                error: 'addOn functionality not enabled',
                resid: null
            });
        }
    } else {
        safeSend({
            pid: process.pid,
            type: CONSTANT.msgTypes.result,
            error: 'unknown command',
            resid: null
        });
    }
});

safeSend({pid: process.pid, type: CONSTANT.msgTypes.initialize});

// graceful ending of the child process
process.on('SIGINT', function () {
    if (logger) {
        logger.debug('stopping child process');
    } else {
        //console.error('child was killed without initialization');
        process.exit(1);
    }
});
