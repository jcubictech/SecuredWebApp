"use strict";
var AppWeb = AppWeb || {};

AppWeb.UserManagementEditor = function () {
    var _gridId = undefined,
        _dataSource = undefined,
        _height = 480,

        init = function (id) {
            _gridId = '#' + id;
            setupDataSource();
            setupGrid();
        },

        setupGrid = function () {
            $(_gridId).kendoGrid({
                dataSource: _dataSource,
                pageable: false,
                height: _height,
                //toolbar: [{ name: 'create', text: 'Add New Role' }],
                edit: function (e) {
                },
                columns: [
                            { field: 'UserId', hidden: true },
                            { field: 'UserName', title: 'User Name', width: '200px' },
                            { field: 'Email', title: 'Email', width: '250px' },
                            {
                                command: ['destroy'],
                                title: 'Action',
                                width: '100px'
                            }
                ],
                editable: 'inline',
                filterable: true,
                sortable: true
            });

            // for some reason, Kendo 2016/June version has 'filter' text in the background of default filter icon.
            // we remove the 'filter' text ad-hoc here
            $(_gridId + ' span.k-filter').text('');
        },

        setupDataSource = function () {
            _dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: '/UserManager/Retrieve',
                        type: 'get',
                        dataType: 'json'
                    },
                    update: {
                        url: '/UserManager/Update',
                        type: 'post',
                        dataType: 'json'
                    },
                    destroy: {
                        url: '/UserManager/Delete',
                        type: 'post',
                        dataType: 'json'
                    },
                    create: {
                        url: '/UserManager/Create',
                        type: 'post',
                        dataType: 'json'
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== 'read' && options.models) { // batch = true goes here
                            if (operation === 'create') options.models[0].UserId = '';
                            return { models: kendo.stringify(options.models) };
                        }
                        else if (operation !== 'read' && options.models == undefined) { // batch = false goes here
                            if (operation === 'create') options.UserId = '';
                            return { model: kendo.stringify(options) };
                        }
                    }
                },
                batch: false, // enable options.models above if this is set to true; need to change controller code to support IEnumerable<CustomEventDate>
                schema: {
                    model: {
                        id: 'UserId',
                        fields: {
                            UserId: { type: 'string', editable: false, nullable: false },
                            Email: { type: 'string', editable: false, nullable: false },
                        }
                    }
                },
                error: function (e) {
                    AppWeb.ActionAlert.fail('ss-user-alert', e.xhr.responseJSON);
                    var grid = $(_gridId).data('kendoGrid');
                    if (grid != undefined) grid.cancelChanges();
                }
            });
        }

    return {
        init: init
    }
}();

AppWeb.RoleManagementEditor = function () {
    var _gridId = undefined,
        _dataSource = undefined,
        _height = 480,

        init = function (id) {
            _gridId = '#' + id;
            setupDataSource();
            setupGrid();
        },

        setupGrid = function () {
            $(_gridId).kendoGrid({
                dataSource: _dataSource,
                pageable: false,
                height: _height,
                toolbar: [{ name: 'create', text: 'Add New Role' }],
                edit: function (e) {
                },
                columns: [
                            { field: 'RoleId', hidden: true },
                            { field: 'RoleName', title: 'Role Name', width: '100px' },
                            {
                                command: [{ name: 'edit', text: { edit: 'Edit', update: 'Save', cancel: 'Cancel' } }, 'destroy'],
                                title: 'Action',
                                width: '150px'
                            }
                ],
                editable: 'inline',
                filterable: true,
                sortable: true
            });

            // for some reason, Kendo 2016/June version has 'filter' text in the background of default filter icon.
            // we remove the 'filter' text ad-hoc here
            $(_gridId + ' span.k-filter').text('');
        },

        setupDataSource = function () {
            _dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: '/RoleManager/Retrieve',
                        type: 'get',
                        dataType: 'json'
                    },
                    update: {
                        url: '/RoleManager/Update',
                        type: 'post',
                        dataType: 'json'
                    },
                    destroy: {
                        url: '/RoleManager/Delete',
                        type: 'post',
                        dataType: 'json'
                    },
                    create: {
                        url: '/RoleManager/Create',
                        type: 'post',
                        dataType: 'json'
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== 'read' && options.models) { // batch = true goes here
                            if (operation === 'create') options.models[0].RoleId = '';
                            return { model: kendo.stringify(options.models) };
                        }
                        else if (operation !== 'read' && options.models == undefined) { // batch = false goes here
                            if (operation === 'create') options.RoleId = '';
                            return { model: kendo.stringify(options) };
                        }
                    }
                },
                batch: false, // enable options.models above if this is set to true; need to change controller code to support IEnumerable<CustomEventDate>
                schema: {
                    model: {
                        id: 'RoleId',
                        fields: {
                            RoleId: { type: 'string', editable: false, nullable: false },
                            RoleName: { type: 'string', nullable: false }
                        }
                    }
                },
                error: function (e) {
                    if (e.xhr.responseJSON == undefined)
                        AppWeb.ActionAlert.fail('ss-user-alert', e.xhr.responseText);
                    else
                        AppWeb.ActionAlert.fail('ss-user-alert', e.xhr.responseJSON);
                    var grid = $(_gridId).data('kendoGrid');
                    if (grid != undefined) grid.cancelChanges();
                }
            });
        }

    return {
        init: init,
    }
}();

AppWeb.UserRoleManagerEditor = function () {
    var _gridId = undefined,
        _dataSource = undefined,
        _height = 480,
        _availableRoles = [],

        init = function (id) {
            _gridId = '#' + id;
            getAvailableRoles();
            setupDataSource();
            setupGrid();
        },

        setupGrid = function () {
            $(_gridId).kendoGrid({
                dataSource: _dataSource,
                pageable: false,
                height: _height,
                columns: [
                            { field: 'UserId', hidden: true },
                            { field: 'UserName', title: 'User Name', width: '200px' },
                            {
                                field: 'UserRoles',
                                title: 'Roles',
                                editor: roleEditor,
                                template: roleDisplay,
                                width: '400px'
                            },
                            {
                                command: [{ name: 'edit', text: { edit: 'Edit', update: 'Save', cancel: 'Cancel' } }],
                                title: 'Action',
                                width: '200px'
                            }
                ],
                editable: 'inline',
                filterable: true,
                sortable: true
            });

            // for some reason, Kendo 2016/June version has 'filter' text in the background of default filter icon.
            // we remove the 'filter' text ad-hoc here
            $(_gridId + ' span.k-filter').text('');
        },

        setupDataSource = function () {
            _dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: '/UserRoleManager/Retrieve',
                        type: 'get',
                        dataType: 'json'
                    },
                    update: {
                        url: '/UserRoleManager/Update',
                        type: 'post',
                        dataType: 'json'
                    },
                    destroy: {
                        url: '/UserRoleManager/Delete',
                        type: 'post',
                        dataType: 'json'
                    },
                    create: {
                        url: '/UserRoleManager/Insert',
                        type: 'post',
                        dataType: 'json'
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== 'read' && options.models) { // batch = true goes here
                            if (operation === 'create') options.models[0].UserId = 0;
                            return { model: kendo.stringify(options.models) };
                        }
                        else if (operation !== 'read' && options.models == undefined) { // batch = false goes here
                            if (operation === 'create') options.UserId = 0;
                            return { model: kendo.stringify(options) };
                        }
                        //else if (operation !== "read" && options.models) { // batch = true goes here
                        //    return { model: kendo.stringify(options.models) };
                        //}
                    }
                },
                batch: false, // enable options.models above if this is set to true; need to change controller code to support IEnumerable<CustomEventDate>
                schema: {
                    model: {
                        id: 'UserId',
                        fields: {
                            UserId: { type: 'string', editable: false, nullable: false },
                            UserName: { type: 'string', editable: false, nullable: false },
                            UserRoles: { }
                        }
                    }
                },
                error: function (e) {
                    if (e.xhr.responseJSON == undefined)
                        AppWeb.ActionAlert.fail('ss-user-alert', e.xhr.responseText);
                    else
                        AppWeb.ActionAlert.fail('ss-user-alert', e.xhr.responseJSON);
                    var grid = $(_gridId).data('kendoGrid');
                    if (grid != undefined) grid.cancelChanges();
                }
            });
        },

        getAvailableRoles = function () {
            $.ajax({
                url: '/UserRoleManager/AvailableRoles',
                dataType: 'json',
                success: function (result) {
                    _availableRoles = result;
                }
            });
        },

        roleEditor = function(container, options) {
            $('<select multiple="multiple" data-bind="value:UserRoles"/>')
                .appendTo(container)
                .kendoMultiSelect({
                    dataTextField: 'Text',
                    dataValueField: 'Id',
                    dataSource: _availableRoles
                });
        },

        roleDisplay = function (data) {
            var result = [];
            $.each(data.UserRoles, function (i, item) {
                result.push(item.Text);
            });
            return result.join(', ');
        }

    return {
        init: init
    }
}();

AppWeb.MultiSelect = function () {
    var install = function (options) {

        if (typeof (options) != 'object') return;

        var callback = options['callback'] ? options['callback'] : undefined;
        var urlAction = options['url'] ? options['url'] : undefined;
        var id = options['id'] ? options['id'] : undefined;
        var buttonClass = options['buttonClass'] ? options['buttonClass'] : undefined;
        var defaultValue = options['default'] ? options['default'] : undefined;
        var rightCaret = options['rightCaret'] ? options['rightCaret'] : undefined; // custom property for this app
        var includeAll = options['includeAll'] ? options['includeAll'] : false; // not implemented
        var selectAllText = options['selectAllText'] ? options['selectAllText'] : undefined;  // not implemented
        var includeMarker = options['includeMarker'] ? options['includeMarker'] : undefined;
        var markerName = options['markerName'] ? options['markerName'] : undefined;
        var defaultMarker = options['defaultMarker'] ? options['defaultMarker'] : '';
        var markerHeader = options['markerHeader'] ? options['markerHeader'] : undefined;
        var markerCallback = options['markerCallback'] ? options['markerCallback'] : undefined;
        var viewOnly = options['viewOnly'] ? options['viewOnly'] : false;

        if (urlAction === undefined || id === undefined) return;

        var containerId = '#' + id;

        $.ajax({
            url: urlAction,
            dataType: 'json',
            success: function (result) {
                if (selectAllText == undefined) selectAllText = "Select All";
                var data = [];
                var selectAllValue = '';
                $.each(result, function (index, source) {
                    data.push({
                        'label': source.name,
                        'value': source.id
                    });
                });

                var multiSelect = $(containerId).multiselect({
                    buttonWidth: '100%',
                    numberDisplayed: 1,
                    selectedClass: null,
                    buttonClass: buttonClass == undefined ? 'form-control product-dropdown input-sm' : buttonClass,
                    dropRight: true,
                    includeMarker: includeMarker != undefined ? includeMarker : false,
                    markerName: markerName != undefined ? markerName : '',
                    defaultMarker: defaultMarker,
                    markerHeader: markerHeader,
                    markerCallback: markerCallback
                    //includeSelectAllOption: includeAll, // not implemented
                    //enableFiltering: enableFilter, // not implemented
                    //selectAllText: selectAllText  // not implemented
                });

                $(containerId).multiselect('dataprovider', data);

                if (defaultValue !== undefined) {
                    if (defaultValue instanceof Array) {
                        for (var i = 0; i < defaultValue.length; i++) {
                            $(containerId).multiselect('select', defaultValue[i], true);
                        }
                    }
                    else {
                        $(containerId).multiselect('select', defaultValue, true);
                    }
                }

                // not implemented
                //if (selectAllValue == defaultValue) {
                //    multiselect_selectAll($(containerId));
                //}

                $(containerId).change();

                if (rightCaret == true) {
                    $('button.multiselect b').css('float', 'right').css('margin-top', '8px');
                }

                if (callback != undefined) callback(multiSelect);

                if (viewOnly) $('.multiselect-container input').attr("disabled", true);

            }
        });
    },

    destroy = function (id) {
        if ($('#' + id).multiselect) $('#' + id).multiselect('destroy');
    }

    return {
        install: install,
        destroy: destroy
    }
}();
