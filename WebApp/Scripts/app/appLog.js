﻿"use strict";
var AppWeb = AppWeb || {};

AppWeb.AppLog = function () {
    var _gridId = undefined,
        _dataSource = undefined,
        _height = '100%',

        init = function (id) {
            _gridId = '#' + id;
            setupDataSource();
            setupGrid();
        },

        setupGrid = function () {
            $(_gridId).kendoGrid({
                dataSource: _dataSource,
                //height: _height,
                columns: [
                            { 
                                field: 'EventDateTime', 
                                title: 'Event Time', 
                                filterable: false,
                                width: '200px',
                                template: "#= kendo.toString(kendo.parseDate(EventDateTime, 'yyyy-MM-dd'), 'MM/dd/yyyy hh:mm:ss tt') #"
                            },
                            {
                                field: 'EventLevel',
                                title: 'Event Level',
                                filterable: { multi: true },
                                width: '100px'
                            },
                            {
                                field: 'UserName',
                                title: 'User Name',
                                filterable: { multi: true },
                                width: '150px'
                            },
                            {
                                field: 'MachineName',
                                title: 'Machine Name',
                                filterable: false,
                                sortable: false,
                                width: '100px',
                                hidden: true
                            },
                            {
                                field: 'EventMessage',
                                title: 'Event Message',
                                filterable: false,
                                sortable: false,
                                width: '600px'
                            }
                ],
                editable: false,
                resizable: false,
                filterable: true,
                scrollable: false,
                sortable: true,
                groupable: false
            });

            // for some reason, Kendo 2016/June version has 'filter' text in the background of default filter icon.
            // we remove the 'filter' text ad-hoc here
            $(_gridId + ' span.k-filter').text('');
        },

        setupDataSource = function () {
            _dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: '/AppLog/Retrieve',
                        type: 'post',
                        dataType: 'json'
                    },
                },
                schema: {
                    model: {
                        fields: {
                            EventDateTime: { type: 'datetime' },
                            EventLevel: { type: 'string' },
                            UserName: { type: 'string' },
                            MachineName: { type: 'string' },
                            EventMessage: { type: 'string' }
                        }
                    }
                },
                error: function (e) {
                    AppWeb.ActionAlert.fail('ss-user-alert', e.xhr.responseJSON);
                    var grid = $(_gridId).data('kendoGrid');
                }
            });
        }

    return {
        init: init
    }
}();
