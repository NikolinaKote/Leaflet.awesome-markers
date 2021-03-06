/*
  Leaflet.AwesomeMarkers, a plugin that adds colorful iconic markers for Leaflet, based on the Font Awesome icons
  (c) 2012-2013, Lennard Voogdt

  http://leafletjs.com
  https://github.com/lvoogdt
*/

/*global L*/

(function (window, document, undefined) {
    "use strict";
    /*
     * Leaflet.AwesomeMarkers assumes that you have already included the Leaflet library.
     */

    L.AwesomeMarkers = {};

    L.AwesomeMarkers.version = '2.0.1';

    L.AwesomeMarkers.Icon = L.Icon.extend({
        options: {
            iconSize: [35, 45],
            iconAnchor: [17, 42],
            popupAnchor: [1, -32],
            shadowAnchor: [10, 12],
            shadowSize: [36, 16],
            className: 'awesome-marker',
            prefix: 'glyphicon',
            spinClass: 'fa-spin',
            extraClasses: '',
            icon: 'home',
            markerColor: 'blue',
            iconColor: 'white',
            alarmIcon: '',
            iconType: 'font-awesome',
            hasDiagnosticIcon: false,
            diagnosticIcon: 'exclamation-triangle',
            diagnosticColor: 'yellow',
            alarmCount : 0,
            elementId: null
        },

        initialize: function (options) {
            options = L.Util.setOptions(this, options);
        },

        createIcon: function () {
            var div = document.createElement('div'),
                options = this.options;
            var markerColor = options.markerColor.replace('#', '%23');
            if (options.icon) {
                div.innerHTML += this._createInner();
            }
            if (options.alarmIcon) {
                div.innerHTML += this._createInnerAlarm();
            }
            if(options.alarmCount > 1) {
                div.innerHTML += this._createInnerAlarmCount();
            }
            if (options.bgPos) {
                div.style.backgroundPosition =
                    (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
            }
            if(options.hasDiagnosticIcon){
                div.innerHTML += this._createDiagnosticIcon();
            }


            div.style.background= `url('data:image/svg+xml;utf8,<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="36px" height="46px" viewBox="0 0 36 46"><g transform="translate(0.000000,46.000000) scale(0.100000,-0.100000)" fill="${markerColor}" stroke="none"><path d="M104 401 c-58 -35 -76 -69 -72 -132 3 -45 13 -70 51 -130 25 -41 57 -87 70 -103 l23 -29 51 69 c64 86 103 163 103 200 0 42 -40 104 -80 125 -45 24 -107 24 -146 0z"/></g></svg>') no-repeat -0.5px -2px`;
            this._setIconStyles(div, 'icon-' + options.markerColor);
            return div;
        },

        _createInner: function () {
            var options = this.options;
            if (options.prefix === 'icomoon') {
                return this._createIcommon();
            }
            else if(options.prefix === 'custom'){
                return this._createCustomIcon();
            }
            else if(options.prefix === 'external'){
                return this._createExternalIcon();
            }
            else {
                return this._createInnerFontAwesome();
            }
        },
        _createInnerFontAwesome: function () {
            var iconClass, iconSpinClass = "", iconColorClass = "", iconColorStyle = "", options = this.options;

            if (options.icon.slice(0, options.prefix.length + 1) === options.prefix + "-") {
                iconClass = options.icon;
            } else {
                iconClass = options.prefix + "-" + options.icon;
            }

            if (options.spin && typeof options.spinClass === "string") {
                iconSpinClass = options.spinClass;
            }

            if (options.iconColor) {
                if (options.iconColor === 'white' || options.iconColor === 'black') {
                    iconColorClass = "icon-" + options.iconColor;
                } else {
                    iconColorStyle = "style='color: " + options.iconColor + "' ";
                }
            }

            return "<i " + iconColorStyle + "class='" + options.extraClasses + " " + options.prefix + " " + iconClass + " " + iconSpinClass + " " + iconColorClass + "'></i>";
        },
        _createIcommon: function () {
            var options = this.options;
            return `<span class="${options.prefix}  ${options.icon}"></span>`;
        },

        _createInnerAlarm: function () {
            var options = this.options, iconAlarm, style, iconClass;
            iconClass = options.alarmIcon;

         //   return `<p id="marker-alarm-icon" data-elementId="${options.elementId}" class="marker-alarm"><i class="fa  ${iconClass}"></i></p>`;
            return `<p id="marker-alarm-icon" data-elementId="${options.elementId}" class="marker-alarm">
                    <img src="${iconClass}">
                    </p>`;

            },
        _createInnerAlarmCount: function (){
            var options = this.options;
            return `<p  id="marker-alarm-icon" data-elementId="${options.elementId}"  class="marker-alarm"> ${options.alarmCount}</p>`;
        },
        _createDiagnosticIcon: function(){
          var options = this.options, diagnosticIconClass, style;
            if (options.diagnosticIcon.slice(0, options.prefix.length + 1) === options.prefix + "-") {
                diagnosticIconClass = options.diagnosticIcon;
            } else {
                diagnosticIconClass = 'fa' + "-" + options.diagnosticIcon;
            }
            style = `style='color: ${options.diagnosticColor}; top: 18px; left:-2px; position:absolute; text-shadow: 2px 2px 2px black'`;
            return `<i ${style} class="fa  ${diagnosticIconClass}"></i>`
          //  return `<img src="https://visualpharm.com/assets/992/Invisible-595b40b75ba036ed117d7f96.svg">`

        },
        _createCustomIcon: function(){
            var options = this.options;
             return `<img src='${options.icon}'>`
          },
        _createExternalIcon: function(){
            var options = this.options;
            return `<img src='${options.icon}'>`
        },
        _setIconStyles: function (img, name) {
            var options = this.options,
                size = L.point(options[name === 'shadow' ? 'shadowSize' : 'iconSize']),
                anchor;

            if (name === 'shadow') {
                anchor = L.point(options.shadowAnchor || options.iconAnchor);
            } else {
                anchor = L.point(options.iconAnchor);
            }

            if (!anchor && size) {
                anchor = size.divideBy(2, true);
            }
            if (options.sizeClass) {
                img.className = options.sizeClass + ' ';
            }

            img.className += 'awesome-marker-' + name + ' ' + options.className;


            if (anchor) {
                img.style.marginLeft = (-anchor.x) + 'px';
                img.style.marginTop = (-anchor.y) + 'px';
            }

            if (size) {
                img.style.width = size.x + 'px';
                img.style.height = size.y + 'px';
            }
        },

        createShadow: function () {
            var div = document.createElement('div');

            this._setIconStyles(div, 'shadow');
            return div;
        }
    });

    L.AwesomeMarkers.icon = function (options) {
        return new L.AwesomeMarkers.Icon(options);
    };

}(this, document));
