'use strict';

module.exports = {
    exit: function (success, fail, args) {
        curWidget.setPreference('return', 'true');
    },
    launchApp: function (success, fail, args) {
        try {
            var paramAppId = args[0].appId;
            var paramData = args[0].data;
            var paramDataKeys = Object.keys(paramData);

            var webbrowserType = '3010'; // Common.API.EVENT_ENUM.RUN_WEBBROWSER
            var widgetType = '02'; // Common.API.EVENT_ENUM.RUN_SEARCH_WIDGET

            if(paramAppId == '29_fullbrowser') {
                var data = window.curWidget.id;
                if(paramData) {
                    data += '|?|' + paramData[paramDataKeys[0]];
                }
                var widgetEvent = new WidgetEvent(webbrowserType, data);
                sendWidgetEvent('', widgetEvent, false);
            }
            else {
                var data = window.curWidget.id + '?' + encodeURIComponent(paramAppId) + '?' + '&toast_data=' + encodeURIComponent(JSON.stringify(paramData));

                var widgetEvent = new WidgetEvent(widgetType, data);
                sendWidgetEvent('', widgetEvent, false);
            }
            setTimeout(function() {
                success();
            }, 0);
        }
        catch (e) {
            var error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(error);
            }, 0);
        }
    },
    getRequestedAppInfo: function (success, fail, args) {
        try {
            var originalData = window.location.search;
            var reqCallerAppId = parseAppData(originalData, '&callerid=');
            var reqData = parseAppData(originalData, '&toast_data=');

            var reqDataObj = JSON.parse((decodeURIComponent(reqData)));

            setTimeout(function() {
                success({callerAppId: decodeURIComponent(reqCallerAppId), data: reqDataObj});
            }, 0);
        }
        catch (e) {
            var error = new Error(e.message);
            error.name = e.name;
            setTimeout(function() {
                fail(error);
            }, 0);
        }

        function parseAppData(originalData, searchData) {
            var str = originalData.substring(originalData.indexOf(searchData) + 1);
            return str.substring(str.indexOf('=') + 1, str.indexOf('&'));
        }
    }
};

require('cordova/exec/proxy').add('toast.application',module.exports);
