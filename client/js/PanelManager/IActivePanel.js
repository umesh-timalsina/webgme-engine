/*
 * Copyright (C) 2013 Vanderbilt University, All rights reserved.
 * 
 * Author: Robert Kereskenyi
 */

"use strict";

define([], function () {

    var IActivePanel,
        ACTIVE_CLASS = 'active-panel';

    IActivePanel = function () {
    };

    IActivePanel.prototype.setActive = function (isActive) {
        if (isActive === true) {
            this.$pEl.addClass(ACTIVE_CLASS);
            this.onActivate();
        } else {
            this.$pEl.removeClass(ACTIVE_CLASS);
            this.onDeactivate();
        }
    };

    IActivePanel.prototype.onActivate = function () {
        this.logger.warning('IActivePanel.prototype.onActivate IS NOT IMPLEMENTED!!!');
    };

    IActivePanel.prototype.onDeactivate = function () {
        this.logger.warning('IActivePanel.prototype.onDeactivate IS NOT IMPLEMENTED!!!');
    };

    return IActivePanel;
});