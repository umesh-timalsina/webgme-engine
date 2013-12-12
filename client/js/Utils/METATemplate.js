/*
 * Copyright (C) 2013 Vanderbilt University, All rights reserved.
 * 
 * AUTO GENERATED CODE FOR PROJECT __PROJECT__
 */

"use strict";

define(['underscore',
        'js/Utils/METAAspectHelper'], function (_underscore,
                                                METAAspectHelper) {

    var _metaID = '__PROJECT__.META.js';

    var _metaTypes = __META_ASPECT_TYPES__;

    var _queryMetaTypes = function () {
        var nMetaTypes = METAAspectHelper.getMETAAspectTypes(),
            m;

        if (!_.isEqual(_metaTypes,nMetaTypes)) {
            var metaOutOfDateMsg = _metaID + " is not up to date with the latest META aspect. Please update your local copy!";
            if (console.error) {
                console.error(metaOutOfDateMsg);
            } else {
                console.log(metaOutOfDateMsg);
            }

            for (m in _metaTypes) {
                if (_metaTypes.hasOwnProperty(m)) {
                    delete _metaTypes[m];
                }
            }

            for (m in nMetaTypes) {
                if (nMetaTypes.hasOwnProperty(m)) {
                    _metaTypes[m] = nMetaTypes[m];
                }
            }
        }
    };

    //hook up to META ASPECT CHANGES
    METAAspectHelper.addEventListener(METAAspectHelper.events.META_ASPECT_CHANGED, function () {
        _queryMetaTypes();
    });

    //generate the META types on the first run
    _queryMetaTypes();

    //return utility functions
    return {
        META_TYPES: _metaTypes
    };
});