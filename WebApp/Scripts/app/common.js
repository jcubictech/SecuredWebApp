"use strict";
var AppWeb = AppWeb || {};

AppWeb.Busy = function () {
    var
        show = function () {
            $('#waitAnimation').show();
        },

        hide = function () {
            $('#waitAnimation').hide();
        }

    return {
        show: show,
        hide: hide
    }
}();

AppWeb.Cookie = function () {
    var _cookieLifeSpan = 7,
        _cookiePath = '/',
        cookieParamName = 'name',
        lifespanName = 'life',
        dataName = 'data',

        exist = function (options) {
            var cookieName = (options && options[cookieParamName]) ? options[cookieParamName] : undefined;
            return cookieName == undefined ? false : $.cookie(cookiename);
        },

        set = function (options) {
            var cookieName = (options && options[cookieParamName]) ? options[cookieParamName] : undefined;
            var lifespan = (options && options[lifespanName]) ? options[lifespanName] : _cookieLifeSpan;
            var data = (options && options[dataName]) ? options[dataName] : null;
            if (cookieName != undefined && data != null) {
                $.cookie(cookieName, data, { expires: lifespan, path: _cookiePath });
                return true;
            }
            return false;
        },

        get = function (cookieName) {
            if (cookieName != undefined && $.cookie(cookieName) != undefined) {
                return $.cookie(cookieName);
            }
            return null;
        },

        remove = function (cookieName) {
            return cookieName == undefined ? false : $.removeCookie(cookieName, { path: _cookiePath });
        },

        reset = function (options) {
            var cookieName = (options && options[cookieParamName]) ? options[cookieParamName] : undefined;
            var lifespan = (options && options[lifespanName]) ? options[lifespanName] : _cookieLifeSpan;
            if (cookieName != undefined) {
                $.cookie(cookieName, '', { expires: lifespan, path: _cookiePath })
            }
        }

    return {
        exist: exist,
        set: set,
        get: get,
        remove: remove,
        reset: reset
    }
}();

AppWeb.Helpers = function () {
    var
        getQueryString = function (name, qstring) {
            var qs = qstring;
            if (qstring == undefined) qs = window.location.search.substring(1);
            var kvps = qs.split('&');
            for (var i = 0; i < kvps.length; i++) {
                var kv = kvps[i].split('=');
                if (kv[0] == name) {
                    return kv[1];
                }
            }
            return null;
        },

        setupBackToTop = function () {
            if (($(window).height() + 100) < $(document).height()) {
                $('#top-link-block').removeClass('hidden').affix({
                    // how far to scroll down before link "slides" into view
                    offset: { top: 100 }
                });
            }
        },

        resizeGrid = function (gridName) {
            var gridElement = $(gridName),
                dataArea = gridElement.find(".k-grid-content"),
                gridHeight = gridElement.innerHeight(),
                otherElements = gridElement.children().not(".k-grid-content"),
                otherElementsHeight = 0;

            otherElements.each(function () {
                otherElementsHeight += $(this).outerHeight();
            });

            dataArea.height(gridHeight - (otherElementsHeight));
        },

        scrollToTarget = function (id, speed) {
            var $id = $('#' + id);
            if ($id.offset()) {
                var eTop = $id.offset().top; //get the offset top of the element
                var wTop = $(window).scrollTop(); //position of the element w.r.t window
                var height = $(window).height();
                if (eTop - wTop > height) {
                    $('html,body').animate({ scrollTop: eTop - height/2 + 50 }, speed);
                }
                else {
                    $('html,body').animate({ scrollTop: eTop - 240 }, speed);
                }
            }
        },

        // kendo grid with verrtical scrollbar squeeze the grid width; this is a hack to add an artifical grid column
        // to compensate for it
        injectDummyHeaderColumn = function (gridId, width) {
            if (!$(gridId + ' table thead tr th:last').hasClass('k-scrollbar-header')) {
                width = width == undefined ? 16 : width;
                $(gridId + ' table thead tr').append('<th class="k-header k-scrollbar-header" role="columnheader" rowspan="1" style="padding:0;width:' + width + 'px;"> </th>');
            }
        }

    return {
        getQueryString: getQueryString,
        setupBackToTop: setupBackToTop,
        resizeGrid: resizeGrid,
        scrollToTarget: scrollToTarget,
        injectDummyHeaderColumn: injectDummyHeaderColumn
    }

}();

AppWeb.Alert = function () {
    var _alertTypes = {
            success: 'alert-success',
            warn: 'alert-warning',
            error: 'alert-danger'
        },

        alertTypes = function () {
            return _alertTypes;
        }

    return {
        alertTypes: alertTypes
    }
}();

AppWeb.SearchableMultiSelect = function () {
    var install = function (options) {
        var url = options && options.url ? options.url : undefined;
        var convert = options && options.convert ? options.convert : undefined;

        // if a url is given, we do a ajax call to get the select items before creating the multiselect control
        if (url != undefined) {
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (result) {
                    // searchable multiselect take {name, value, checked} json array.
                    // convert function is a mapping between result and json object supplied by caller 
                    if (convert != undefined) {
                        options.selectList = convert(result);
                    }
                    else {
                        options.selectList = result;
                    }

                    create(options);
                }
            });
        }
        else {
            if (options.selectList != undefined && convert != undefined) {
                options.selectList = convert(options.selectList);
            }
            create(options);
        }
    },

        create = function (options) {
            var id = options && options.id ? options.id : undefiend;
            var watermark = options && options.watermark ? options.watermark : 'Select one or more option...';
            var searchable = options && options.searchable != undefined ? options.searchable : true;
            var searchHint = options && options.searchHint ? options.searchHint : 'Search...';
            var matchMethod = options && options.matchMethod ? options.matchMethod : 'startWith';
            var minHeight = options && options.minHeight ? options.minHeight : 160;
            var height = options && options.height ? options.height : 200;
            var autoOpen = options && options.autoOpen != undefined ? options.autoOpen : false;
            var autoClose = options && options.autoClose != undefined ? options.autoClose : true;
            var field = options && options.field ? options.field : '';
            var change = options && options.change ? options && options.change : undefined;
            var selectList = options && options.selectList ? options.selectList : [];

            if (id == undefined) return;

            $("#" + id).searchableMultiselect({
                columns: 1,
                placeholder: watermark,
                search: searchable,
                minHeight: minHeight,
                maxHeight: height,
                autoOpen: autoOpen,
                autoClose: autoClose,
                field: field,
                searchOptions: { 'default': searchHint, method: matchMethod },
                onOptionClick: change
            });

            if (selectList.length > 0) $("#" + id).searchableMultiselect('loadOptions', selectList);
        },

        // make filter menu go away if clicked outside of it; make multiselect dropdown goes away while click outside of it       
        smartClick = function () {
            // toggle filter screen
            $('.dropdown.keep-open').bind('click', function (e) {
                if ($('.dropdown > div.dropdown-menu').css('display') == 'block') {
                    $('.dropdown > div.dropdown-menu').hide();
                }
                else {
                    $('.dropdown > div.dropdown-menu').show();
                    $('.ms-options-wrap > div.ms-options').hide();
                }
            });

            // make filer screen stay on while hide multiselect dropdown
            $('.dropdown > div.dropdown-menu').bind('click', function (e) {
                $('.dropdown > div.dropdown-menu').show();
                $('.ms-options-wrap > div.ms-options').hide();
                e.stopPropagation();
            });

            // make filer screen go away
            $(document).bind('click', function (e) {
                $('.dropdown > div.dropdown-menu').hide();
                $('.ms-options-wrap > div.ms-options').hide();
            });
        }

    return {
        install: install,
        smartClick: smartClick
    }
}();

AppWeb.ActionAlert = function () {
    var success = function (id, message) {
        window.alerts.showAlert(
            {
                message: message,
                alertClass: 'alert-success'
            },
            {
                id: id,
                delay: 5000
            }
        );
    },

    fail = function (id, message, delay) {
        window.alerts.showAlert(
            {
                message: message,
                alertClass: 'alert-danger'
            },
            {
                id: id,
                delay: (delay == undefined ? null : delay)
            }
        );
    }

    return {
        success: success,
        fail: fail
    }
}();

AppWeb.SessionMonitor = function () {
    var _now = Date.now,
        _immediate = false,

        // sliding timer to reload page after inactive for preset time
        install = function (timeout, url) {
            $('html, body').on(
                'click mousemove keyup', 
                _.debounce(function () {
                    $(window).scrollTop(0); // so that we can see the timeout message

                    $('.container')
                        .css('opacity', 0.3)  // blur it
                        .css('pointer-events', 'none'); // make page not clickable

                    $(':checkbox, :radio, select').prop("disabled", true);

                    var alertId = 'postback-alert';
                    $('#' + alertId).html(''); // clear the existing timeout alert

                    // display the timeout messsage on top of the page
                    window.alerts.error(
                        'Your session has expired. Please dismiss this message to reload the page.',
                        {
                            id: alertId,
                            callback: function() {
                                window.location.href = url;
                            }
                        });
                }, timeout, _immediate)
            )
        }

    return {
        install: install
    }
}();

AppWeb.Plugin = function () {
    var _okEvent = undefined,
        _cancelEvent = undefined,
        _$formDialog = undefined,

        initDatePicker = function (selector) {
            if (selector == undefined) {
                $('.datepicker').kendoDatePicker({ value: '' });
            }
            else {
                $(selector).kendoDatePicker({ value: '' });
            }
        },

        initSearchableList = function (selector, focusId) {
            if (selector == undefined) selector = '.kendo-autoselect';
            $(selector).kendoComboBox({
                filter: 'contains',
                suggest: true
            });
        },

        initDialog = function (selector, url, header, isForm) {
            if (selector == undefined || url == undefined) return;
            $(selector).click(function (e) {
                header ? ($('.modal-header').show(), $('modal-title').html(header)) : $('.modal-header').hide();
                isForm == true ? $('.modal-footer').hide() : $('.modal-footer').show();
                e.preventDefault();
                $.ajax({
                    url: url,
                    data: { 'Id': $(this).data('id') },
                    success: function (data) {
                        $('.modal').find('.modal-body').html(data);
                        $('.modal').modal();
                    }
                });
            });
        },

        initFormDialog = function (options) {
            var selector = (options && options.selector) || undefined;
            var caption = (options && options.caption) || 'Form Dialog';
            var url = (options && options.url) || undefined;
            var formId = (options && options.formId) || undefined;
            var width = (options && options.width) || '600px';
            var initEvent = (options && options.initEvent) || undefined;
            var closeEvent = (options && options.closeEvent) || undefined;

            if (selector == undefined || url == undefined) return;

            $(selector).click(function (e) {
                e.preventDefault();
                if (url != undefined) {
                    AppWeb.Busy.show();
                    $.ajax({
                        url: url,
                        data: { 'Id': $(this).data('id') },
                        success: function (data) {
                            AppWeb.Busy.hide();
                            _$formDialog = $('#formDialog');
                            if (_$formDialog.length > 0) {
                                $('.dialog-body').html(data);
                                if (!_$formDialog.data('kendoWindow')) {
                                    _$formDialog.kendoWindow({
                                        modal: true,
                                        width: width,
                                        title: caption,
                                        actions: ["Close"],
                                        visible: false,
                                        resizable: false,
                                        close: closeEvent ? closeEvent : null,
                                        position: {
                                            top: '15%',
                                            left: '35%'
                                        }
                                    });
                                }
                                _$formDialog.data('kendoWindow').title(caption);
                                _$formDialog.data('kendoWindow').setOptions({ width: width });
                                _$formDialog.data('kendoWindow').center().open();

                                ///because the page is loaded with ajax, the validation rules are lost, we have to rebind them:
                                var $form = $('#' + formId);
                                $form.removeData('validator');
                                $form.removeData('unobtrusiveValidation');
                                $form.each(function () { $.data($(this)[0], 'validator', false); }); //enable to display the error messages
                                $.validator.unobtrusive.parse('#' + formId);

                                if (initEvent != undefined) initEvent(formId);
                            }
                        },
                        error: function (jqXHR, status, errorThrown) {
                            AppWeb.Busy.hide();
                            if (status == 'error') {
                                //displayServerError();
                            }
                        }
                    })
                }
            });
        },

        closeFormDialog = function () {
            if (_$formDialog) _$formDialog.data('kendoWindow').close();
        },

        noHorizontalScroll = function () {
            if (_$formDialog) _$formDialog.css('overflow', 'hidden');
        }

    return {
        initDatePicker: initDatePicker,
        initSearchableList: initSearchableList,
        initDialog: initDialog,
        initFormDialog: initFormDialog,
        closeFormDialog: closeFormDialog,
        noHorizontalScroll: noHorizontalScroll
    }
}();

AppWeb.MenuActions = function () {
    var 
        install = function (id, url) {
            // set search box position
            $(window).unbind('resize').on('resize', function () {
                var position = $(window).width() - $('.actionBar-inquiry-search').width() - 300;
                if (position > 550) {
                    $('.actionBar-inquiry-search').css('left', position + 'px');
                    $('.actionBar-inquiry-search').show();
                }
                else {
                    $('.actionBar-inquiry-search').hide();
                    //$('.app-page-container div.navbar-fixed-top').removeClass('navbar-fixed-top');
                }
            });

            $(window).trigger('resize');

            $('.actionBar-inquiry-search span').on('click', function (e) {
                var id = $('#inquiryId').val();
                window.location.href = '/Inquiry/index/?id=' + id;
            });

            $('li.dropdown a').on('click', function (e) {
                $('.app-page-container div.navbar-fixed-top').css('top', '-113px');
            });

            $(window).click(function () {
                $('.app-page-container div.navbar-fixed-top').css('top', '113px');
            });

            $('li.dropdown .dropdown-menu').on('click', function (e) {
                event.stopPropagation();
            });
        }

    return {
        install: install
    }
}();

AppWeb.File = function () {
    var
        // options example: { browseId:'attachFile', removeId: 'removeFile' } or { browseId:'attachFile', removeId: 'removeFile', filenameId:'UploadFile', uploadId:'fileToUpload' }
        initUpload = function (options) { 
            var browseId = options && options.browseId ? options.browseId : undefined;
            if (browseId == undefined) return;

            var $browseSelector = $('#' + browseId);

            var filenameId = options && options.filenameId ? options.filenameId : $browseSelector.attr('data-field');
            var uploadId = options && options.uploadId ? options.uploadId : $browseSelector.attr('data-upload');

            if (!filenameId || !uploadId) return;

            var $removeSelector = options && options.removeId ? $('#' + options.removeId) : undefined;

            var $filenameSelector = $('#' + filenameId);
            var $uploadSelector = $('#' + uploadId);

            $browseSelector.on('click', function () {
                $uploadSelector.click(); // delegate to file select control
                $uploadSelector.change(); // force the change in case the file is the same
            });

            if ($removeSelector != undefined) {
                $removeSelector.on('click', function () {
                    $filenameSelector.val('');
                });
            }

            $uploadSelector.on('change', function () {
                var filename = $(this).val();
                if (filename != null) {
                    $filenameSelector.val(filename);
                    $filenameSelector.blur(); // allow validation to kick in wihout user interaction
                }
                else {
                    $filenameSelector.val('');
                }
            });
        },

        download = function (url) {
            //iOS devices do not support downloading. We have to inform user about this.
            if (/(iP)/g.test(navigator.userAgent)) {
                alert('Your device does not support files downloading. Please try again in desktop browser.');
                return false;
            }

            //If in Chrome or Safari - download via virtual link click
            if (isChrome || isSafari) {
                var link = document.createElement('a'); // Creating new link node.
                link.href = sUrl;

                if (link.download !== undefined) {
                    //Set HTML5 download attribute. This will prevent file from opening if supported.
                    var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
                    link.download = fileName;
                }

                //Dispatching click event.
                if (document.createEvent) {
                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    link.dispatchEvent(e);
                    return true;
                }
            }

            // Force file download (whether supported by server) for all other browsers
            if (sUrl.indexOf('?') === -1) {
                sUrl += '?download';
            }

            window.open(sUrl, '_self');
            return true;
        },

        isChrome = function () {
            return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        },

        isSafari = function () {
            return navigator.userAgent.toLowerCase().indexOf('safari') > -1;
        }

    return {
        initUpload: initUpload,
        download: download
    }
}();

AppWeb.Download = function () {
    var _cookieName = 'AppDownload',
        _downloadToken = 'done',
        _downloadMonitor = undefined,
        _callback = undefined,

        // TODO: this logic does not work for removing busy icon
        monitor = function (id, callback) {
            if (_downloadMonitor != undefined) clearInterval(_downloadMonitor);
            _downloadMonitor = undefined;
            _callback = callback;
            //var token = new Date().getTime(); //use the current timestamp as the token value
            //$('#' + id).val(token);
            $.blockUI.defaults.message = null;
            $.blockUI();

            _downloadMonitor = window.setInterval(function () {
                var cookieValue = $.cookie(_cookieName);
                if (cookieValue == _downloadToken) finish();
            }, 1000);
        },

        finish = function () {
            if (_downloadMonitor != undefined) clearInterval(_downloadMonitor);
            _downloadMonitor = undefined;
            $.cookie(_cookieName, null); //clears this cookie value
            if (_callback != undefined) _callback();
            $.unblockUI();
        }

    return {
        monitor: monitor
    }
}();

AppWeb.Confirmation = function () {
    var _dialogId = null,
        _okEvent = undefined,
        _cancelEvent = undefined,
        _width = "480px",

        init = function (options) {
            var id = (options && options.id) || '';
            var caption = (options && options.caption) || 'Confirmation';
            _width = (options && options.width) || '480px';
            _okEvent = (options && options.ok) || undefined;
            _cancelEvent = (options && options.cancel) || undefined;

            _dialogId = id;
            var $dialog = $('#' + id);
            if ($dialog != undefined) {
                if (!$dialog.data('kendoWindow')) {
                    $dialog.kendoWindow({
                        modal: true,
                        width: _width,
                        title: caption,
                        actions: ["Close"],
                        visible: false,
                        resizable: false,
                        position: {
                            top: '15%',
                            left: '35%'
                        }
                    });

                    if ($('#' + _dialogId + ' .dialog-ok') != undefined) {
                        $('#' + _dialogId + ' .dialog-ok').unbind('click').on('click', function () {
                            if (_okEvent != undefined) {
                                _okEvent();
                            }
                            else {
                                window.location.href = '/';
                            }
                            if ($dialog.data('kendoWindow')) $dialog.data('kendoWindow').close();
                        });
                    }

                    if ($('#' + _dialogId + ' .dialog-cancel') != undefined) {
                        $('#' + _dialogId + ' .dialog-cancel').unbind('click').on('click', function () {
                            if (_cancelEvent != undefined) _cancelEvent();
                            $dialog.data('kendoWindow').close();
                        });
                    }
                }
                else {
                    $dialog.data('kendoWindow').title(caption);
                }
            }

            $dialog.data('kendoWindow').setOptions({ width: _width });
        },

        show = function (msg) {
            if (_dialogId != null) {
                var $dialog = $('#' + _dialogId);
                $dialog.removeClass('hide');
                $dialog.data('kendoWindow').setOptions({ width: _width });
                $dialog.show();
                if ($dialog.data('kendoWindow')) {
                    $dialog.data('kendoWindow').center().open();
                }
                $('#' + _dialogId + ' .dialog-instruction').html(msg);
            }
        },

        confirmClose = function (options) {
            var message = (options && options.message) || '';
            init(options);
            show(message);
        },

        confirmDiscard = function (options) {
            var message = (options && options.message) || 'You have unsaved changes. Discard them?';
            init(options);
            show(message);
        }

    return {
        init: init,
        show: show,
        confirmClose: confirmClose,
        confirmDiscard: confirmDiscard
    }
}();

AppWeb.ActionBar = function () {
    var _beginDate = undefined,
        _endDate = undefined,

        install = function (beginDate, endDate) {
            _beginDate = beginDate;
            _endDate = endDate;
            if (_beginDate == undefined) {
                _endDate = new Date();
                _beginDate = (3).months().ago();
            }

            $('#beginDatePicker').kendoDatePicker({
                value: _beginDate,
                change: function () {
                    _beginDate = this.value();
                }
            });

            $('#endDatePicker').kendoDatePicker({
                value: _endDate,
                change: function () {
                    _endDate = this.value();
                }
            });

            $('#actionBarDateRange').kendoValidator({
                validateOnBlur: false,
                rules: {
                    greaterdate: function (input) {
                        if (input.is('[data-greaterdate-msg]') && input.val() != "") {
                            var endDateVal = kendo.parseDate(input.val()),
                                beginDateVal = kendo.parseDate($("[name='" + input.data("greaterdateField") + "']").val());
                            return beginDateVal <= endDateVal;
                        }
                        return true;
                    }
                }
            });
        },

        attachEvent = function (goEvent, customEvent1, customEvent2, customEvent3) {
            if (customEvent1 != undefined) {
                $('.actionBar-custom-group').unbind('click').on('click', function (e) {
                    // unselect to remove the filter
                    var unselect = $('#' + e.target.id).hasClass('custom-filter-selected');
                    $('.actionBar-custom-group').removeClass('custom-filter-selected');
                    if (!unselect) $('#' + e.target.id).addClass('custom-filter-selected');
                    customEvent1(_beginDate, _endDate, e);
                });
            }

            if (customEvent2 != undefined) {
                if ($('.actionBar-status-group').length > 0) {
                    $('.actionBar-status-group').unbind('click').on('click', function (e) {
                        customEvent2(_beginDate, _endDate, e);
                    });
                }
                else if ($('.actionBar-channel-group').length > 0) {
                    $('.actionBar-channel-group').unbind('click').on('click', function (e) {
                        customEvent2(_beginDate, _endDate, e);
                    });
                }
            }

            if (customEvent3 != undefined) {
                if ($('.actionBar-vertical-group').length > 0) {
                    $('.actionBar-vertical-group').unbind('click').on('click', function (e) {
                        customEvent3(_beginDate, _endDate, e);
                    });
                } else if ($('.actionBar-approval-group').length > 0) {
                    $('.actionBar-approval-group').unbind('click').on('click', function (e) {
                        customEvent3(_beginDate, _endDate, e);
                    });
                }
            }

            if (goEvent != undefined) {
                $('#actionBarGo').unbind('click').on('click', function (e) {
                    // keep filters around for new query
                    //$('.actionBar-custom-group').removeClass('custom-filter-selected');
                    //$('.actionBar-status-group').prop('checked', false)
                    //$('.actionBar-vertical-group').prop('checked', false)
                    goEvent(_beginDate, _endDate);
                });
            }
        },

        getDateRange = function () {
            return { beginDate: _beginDate, endDate: _endDate }
        },

        setDateRange = function (beginDate, endDate) {
            _beginDate = beginDate;
            _endDate = endDate;
            $('#beginDatePicker').val(kendo.toString(_beginDate, 'MM/dd/yyyy'));
            $('#endDatePicker').val(kendo.toString(_endDate, 'MM/dd/yyyy'));
        },

        validateDateRange = function () {
            var rangeValidator = $("#actionBarDateRange").data("kendoValidator");
            return rangeValidator != undefined && rangeValidator.validate();
        }

    return {
        install: install,
        attachEvent: attachEvent,
        getDateRange: getDateRange,
        setDateRange: setDateRange,
        validateDateRange: validateDateRange
    }
}();

AppWeb.Template = function () {
    var
        nullable = function (data) {
            if (data)
                return data;
            else
                return '';
        },

        center = function (data) {
            return '<div style="text-align:center">' + data + '</div>';
        },

        spacing = function (data) {
            return data; //'<div class="app-cell-spacing">' + data + '</div>';
        },

        link = function (data, label) {
            if (data)
                return '<div style="text-align:center;"><a href="' + data + '">' + label + '</a></div>';
            else
                return '';
        },

        boolean = function (data) {
            return data == true ? '<div style="text-align:center"><i class="fa fa-check red"></i></div>' : '';
        },

        active = function (data) {
            if (!data) return '';
            data = data.toLowerCase();
            if (data == 'active')
                return '<div style="text-align:center"><i class="fa fa-flag green"></i></div>';
            else if (data == 'inactive')
                return '<div style="text-align:center"><i class="fa fa-flag lightgray"></i></div>';
            else
                return '<div style="text-align:center"><i class="fa fa-flag red"></i></div>';
        },

        belt = function (data) {
            if (!data) return '';
            data = data.toLowerCase();
            if (data.indexOf('yellow') >= 0)
                return '<div style="text-align:center"><i class="fa fa-bookmark yellow"></i></div>';
            else if (data.indexOf('black') >= 0)
                return '<div style="text-align:center"><i class="fa fa-bookmark black"></i></div>';
            else
                return '<div style="text-align:center"><i class="fa fa-bookmark-o"></i></div>';
        },

        textSearch = function () {
            return {
                extra: true,
                operators: {
                    string: {
                        contains: "Contains", // this is the default
                        doesNotContain: "Does not contain",
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        startswith: "Starts with",
                        endswith: "Ends with"
                    }
                }
            }
        },

        numberSearch = function () {
            return {
                extra: true,
                operators: {
                    number: {
                        gt: "Greater Than",
                        lt: "Less Than",
                        eq: "Equal to",
                        neq: "Not equal to",
                    }
                }
            }
        },

        dateSearch = function () {
            return {
                extra: true,
                operators: {
                    date: {
                        gt: "After",
                        lt: "Before",
                        eq: "Equal to",
                        neq: "Not equal to",
                    }
                }
            }
        }

    return {
        nullable: nullable,
        center: center,
        spacing: spacing,
        link: link,
        boolean: boolean,
        active: active,
        belt: belt,
        textSearch: textSearch,
        numberSearch: numberSearch,
        dateSearch: dateSearch
    }
}();

AppWeb.GridHelper = function () {
    var
	    // data.set will actually refresh the entire grid and send a databound event in some cases. This is very slow and unnecessary. 
        // It will also collapse any expanded detail templates which is not ideal.
        // I would recommend you to use this function that I wrote to update a single row in a kendo grid.

        // Updates a single row in a kendo grid without firing a databound event.
        // This is needed since otherwise the entire grid will be redrawn.

        selectRow = function ($gridId, rowId, needScroll) { // $gridId is jquery object of the grid. i.e. $('#your-grid-id'); rowId is the key of the row
            var ds = $gridId.data('kendoGrid').dataSource;
            var model = ds.get(rowId); // get the model
            if (model != undefined) {
                var index = ds.indexOf(model); // get the index of the item into the DataSource
                //ds.page(index / ds.pageSize() + 1);  // page to the item  
                var row = $gridId.find("tbody > tr[data-uid=" + model.uid + "]");
                $gridId.data('kendoGrid').select(row);
                AppWeb.Helpers.scrollToTarget('edit-id-' + rowId, 1000);
            }
        },

        udpateRowSample = function ($gridId, newData) {
            var dataGrid = $gridId.data('kendoGrid'); // Get a reference to the grid data
            var selectedRow = dataGrid.select(); // Access the row that is selected
            var rowData = dataGrid.dataItem(selectedRow); // and now the data
            // set data here
            //rowData.set(field-name, newData.field-name);
            redrawRow(dataGrid, selectedRow); // Redraw only the single row in question which needs updating
            //myDataBoundEvent.apply(grid); if you want to call your own databound event for post processing  
        },

        redrawRow = function (grid, row) {
            var dataItem = grid.dataItem(row);
            var rowChildren = $(row).children('td[role="gridcell"]');
            for (var i = 0; i < grid.columns.length; i++) {
                var column = grid.columns[i];
                var template = column.template;
                var cell = rowChildren.eq(i);

                if (template !== undefined) {
                    var kendoTemplate = kendo.template(template);
                    cell.html(kendoTemplate(dataItem)); // Render using template
                } else {
                    var fieldValue = dataItem[column.field];

                    var format = column.format;
                    var values = column.values;

                    if (values !== undefined && values != null) {
                        // use the text value mappings (for enums)
                        for (var j = 0; j < values.length; j++) {
                            var value = values[j];
                            if (value.value == fieldValue) {
                                cell.html(value.text);
                                break;
                            }
                        }
                    } else if (format !== undefined) {
                        cell.html(kendo.format(format, fieldValue)); // use the format
                    } else {
                        cell.html(fieldValue); // Just dump the plain old value
                    }
                }
            }
        }

    return {
        selectRow: selectRow,
        redrawRow: redrawRow
    }
}();

AppWeb.Validation = function () {
    var validateDropdown = function (id, msg) {
            if (showDropdownError(id, msg) == true) return 1;
            return 0;
        },

        validateSearchableDropdown = function (id, msg) {
            var value = $(id).val();
            var hasError = (value == '') ? true : false;
            if (showStandardParentError(hasError, id, msg) == true) return 1;
            return 0;
        },

        validateDropdownMultiSelect = function (id, msg) {
            if (showDropdownMultiSelectError(id, msg) == true) return 1;
            return 0;
        },

        validateDate = function (id, msg) {
            if (showDateError(id, msg) == true) return 1;
            return 0;
        },

        validateDateRange = function (startDateId, endDateId, msg) {
            var startDate = $(startDateId).data('kendoDatePicker').value();
            var endDate = $(endDateId).data('kendoDatePicker').value();
            var hasError = endDate < startDate;
            showDateRangeError(hasError, startDateId, msg);
            return hasError ? 1 : 0;
        },

        validateInputGroup = function (id, msg) {
            var value = $(id).val();
            var hasError = (value == '') ? true : false;
            if (showStandardParentError(hasError, id, msg) == true) return 1;
            return 0;
        },

        validateTextBox = function (id, msg) {
            if (showTexBoxError(id, msg) == true) return 1;
            return 0;
        },

        validateTextEditor = function (containerId, editorId, msg) {
            return RDTWeb.CKEditor.validate(containerId, editorId, msg) == true ? 0 : 1;
        },

        validateListView = function (id, msg) {
            if (showListViewError(id, msg) == true) return 1;
            return 0;
        },

        validateUrl = function (url) {
            var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
            return urlregex.test(url);
        },

        clearMessage = function (id) {
            $('#' + id).removeClass('input-validation-error').addClass('valid');
            var $span = $('#' + id).siblings('span');
            if ($span != undefined) {
                $span.addClass('field-validation-valid').removeClass('field-validation-error');
                $span.html('');
            }
        },

        clearParentMessage = function (id) {
            var $span = $('#' + id).parent().siblings('span');
            if ($span != undefined) {
                $span.addClass('field-validation-valid').removeClass('field-validation-error');
                $span.html('');
            }
        },

        clearDateMessage = function (id) {
            var $span = $('#' + id).parent().parent().siblings('span');
            if ($span != undefined) {
                $span.addClass('field-validation-valid').removeClass('field-validation-error');
                $span.html('');
            }
        },

        clearTextEditorMessage = function (containerId, editorId) {
            RDTWeb.CKEditor.clearMessage(containerId, editorId);
        },

        showDateError = function (id, msg) {
            // arrange error to sync up with MVC error style
            var datepicker = $(id).data("kendoDatePicker");
            var dateEntered = datepicker.value();
            if (dateEntered != '') {
                if (dateEntered == null) {
                    dateEntered = $(id).val();
                    if (!kendo.parseDate(dateEntered)) {
                        if (msg == undefined) msg = "Valid DATE is required";
                        var $span = $(id).parent().parent().siblings('span');
                        if ($span != undefined) {
                            $span.addClass('field-validation-error').removeClass('field-validation-valid');
                            $span.html('<span id="' + id.substring(1) + '-error">' + msg + '</span>');
                            return true;
                        }
                    }
                }
                var $span = $(id).parent().parent().siblings('span');
                if ($span != undefined) {
                    $span.addClass('field-validation-valid').removeClass('field-validation-error');
                    $span.html('');
                    return false;
                }
            }
            else {
                if (msg == undefined) msg = "DATE is required.";
                var $span = $(id).parent().parent().siblings('span');
                if ($span != undefined) {
                    $span.addClass('field-validation-error').removeClass('field-validation-valid');
                    $span.html('<span id="' + id.substring(1) + '-error">' + msg + '</span>');
                    return true;
                }
            }
            return false;
        },

        showDateRangeError = function (hasError, id, msg) {
            if (hasError) {
                if (msg == undefined) msg = "Date Range is invalid.";
                var $span = $(id).parent().parent().siblings('span');
                if ($span != undefined) {
                    $span.addClass('field-validation-error').removeClass('field-validation-valid');
                    $span.html('<span id="' + id.substring(1) + '-error">' + msg + '</span>');
                    return true;
                }
            }
            else {
                var $span = $(id).parent().parent().siblings('span');
                if ($span != undefined) {
                    $span.addClass('field-validation-valid').removeClass('field-validation-error');
                    $span.html('');
                    return false;
                }
            }
            return false;
        },

        showDropdownError = function (id, msg) {
            var value = $(id + ' option:selected').val();
            var hasError = (value == '') ? true : false;
            return showStandardError(hasError, id, msg);
        },

        showDropdownMultiSelectError = function (id, msg) {
            var count = $("select[id='" + id.substring(1) + "'] option:selected").length;
            var hasError = count <= 0 ? true : false;
            return showStandardError(hasError, id, msg);
        },

        showTexBoxError = function (id, msg) {
            var hasError = $(id).val() != '' ? false : true;
            return showStandardError(hasError, id, msg);
        },

        showListViewError = function (id, msg) {
            // arrange error to sync up with MVC error style
            // Kendo list view uses <ul> tag; so we need to use Kendo API call to get data
            var listView = $(id).kendoListView().data("kendoListView");
            var hasError = listView.dataItems() != '' ? false : true;
            return showStandardError(hasError, id, msg);
        },

        showStandardParentError = function (hasError, id, msg) {
            if (!hasError) {
                var $span = $(id).parent().siblings('span');
                if ($span != undefined) {
                    $span.addClass('field-validation-valid').removeClass('field-validation-error');
                    $span.html('');
                    return false;
            }
            }
            else {
                if (msg == undefined) msg = "Field data is required.";
                var $span = $(id).parent().siblings('span'); // hack: navigate to kenod editor tag hierarchy
                if ($span != undefined) {
                    $span.addClass('field-validation-error').removeClass('field-validation-valid');
                    $span.html('<span id="' + id.substring(1) + '-error">' +msg + '</span>');
                    return true;
                }
            }
            return false;
        },

        showStandardError = function (hasError, id, msg) {
            // arrange error to sync up with MVC error style
            if (!hasError) {
                var $span = $(id).siblings('span');
                if ($span != undefined) {
                    $span.addClass('field-validation-valid').removeClass('field-validation-error');
                    $span.html('');
                    return false;
                }
            }
            else {
                if (msg == undefined) msg = "Field data is required.";
                var $span = $(id).siblings('span'); // hack: navigate to kenod editor tag hierarchy
                if ($span != undefined) {
                    $span.addClass('field-validation-error').removeClass('field-validation-valid');
                    $span.html('<span id="' + id.substring(1) + '-error">' + msg + '</span>');
                    return true;
                }
            }
            return false;
        }

    return {
        validateDropdown: validateDropdown,
        validateSearchableDropdown: validateSearchableDropdown,
        validateDropdownMultiSelect: validateDropdownMultiSelect,
        validateDate: validateDate,
        validateDateRange: validateDateRange,
        validateInputGroup: validateInputGroup,
        validateTextBox: validateTextBox,
        validateTextEditor: validateTextEditor,
        validateListView: validateListView,
        validateUrl: validateUrl,
        clearMessage: clearMessage,
        clearParentMessage: clearParentMessage,
        clearDateMessage: clearDateMessage,
        clearTextEditorMessage: clearTextEditorMessage,
        showStandardError: showStandardError,
        showStandardParentError: showStandardParentError
    }
}();
