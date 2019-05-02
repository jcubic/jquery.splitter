/*!
 * JQuery Spliter Plugin version 0.28.0
 * Copyright (C) 2010-2019 Jakub T. Jankiewicz <https://jcubic.pl/me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/* global module, define, global, require, setTimeout */
// UMD taken from https://github.com/umdjs/umd
(function(factory, undefined) {
    var root = typeof window !== 'undefined' ? window : global;
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        // istanbul ignore next
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (window !== undefined) {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser
        // istanbul ignore next
        factory(root.jQuery);
    }
})(function($, undefined) {
    var count = 0;
    var splitter_id = null;
    var splitters = [];
    var current_splitter = null;
    var current_splitter_index = null;
    $.fn.split = function(options) {
        var data = this.data('splitter');
        if (data) {
            return data;
        }
        var panels = [];
        var $splitters = [];
        var panel_1;
        var panel_2;
        var settings = $.extend({
            limit: 100,
            orientation: 'horizontal',
            position: '50%',
            invisible: false,
            onDragStart: $.noop,
            onDragEnd: $.noop,
            onDrag: $.noop,
            percent: false
        }, options || {});
        this.settings = settings;
        var cls;
        var children = this.children();
        if (children.length === 2) {
            if (settings.orientation == 'vertical') {
                panel_1 = children.first().addClass('left_panel');
                panel_2 = panel_1.next().addClass('right_panel');
                cls = 'vsplitter';
            } else if (settings.orientation == 'horizontal') {
                panel_1 = children.first().addClass('top_panel');
                panel_2 = panel_1.next().addClass('bottom_panel');
                cls = 'hsplitter';
            }
            panels = [panel_1, panel_2];
        } else {
            children.each(function() {
                var panel = $(this);
                if (settings.orientation == 'vertical') {
                    panel.addClass('vertical_panel');
                    cls = 'vsplitter';
                } else {
                    panel.addClass('horizontal_panel');
                    cls = 'hsplitter';
                }
                panels.push(panel);
            });
        }
        if (settings.invisible) {
            cls += ' splitter-invisible';
        }
        var width = this.width();
        var height = this.height();
        this.addClass('splitter_panel');
        var id = count++;
        panels.slice(0, -1).forEach(function(panel, i) {
            var splitter = $('<div/>').addClass(cls).bind('mouseenter touchstart', function() {
                splitter_id = id;
                current_splitter_index = splitter.index() - i - 1;
            }).bind('mouseleave touchend', function() {
                splitter_id = null;
                current_splitter_index = null;
            }).insertAfter(panel);
            $splitters.push(splitter);
        });
        var position;

        function get_position(position) {
            if (position instanceof Array) {
                return position.map(get_position);
            }
            if (typeof position === 'number') {
                return position;
            }
            if (typeof position === 'string') {
                var match = position.match(/^([0-9\.]+)(px|%)$/);
                if (match) {
                    if (match[2] == 'px') {
                        return +match[1];
                    } else {
                        if (settings.orientation == 'vertical') {
                            return (width * +match[1]) / 100;
                        } else if (settings.orientation == 'horizontal') {
                            return (height * +match[1]) / 100;
                        }
                    }
                } else {
                    //throw position + ' is invalid value';
                }
            } else {
                //throw 'position have invalid type';
            }
        }

        function set_limit(limit) {
            if(!isNaN(parseFloat(limit)) && isFinite(limit)){
                return {
                    leftUpper: limit,
                    rightBottom: limit
                };
            }
            return limit;
        }

        var self = $.extend(this, {
            refresh: function() {
                var new_width = this.width();
                var new_height = this.height();
                if (width != new_width || height != new_height) {
                    width = this.width();
                    height = this.height();
                    self.position(position);
                }
            },
            option: function(name, value) {
                if (name === 'position') {
                    return self.position(value);
                } else if (typeof value === 'undefined') {
                    return settings[name];
                } else {
                    settings[name] = value;
                }
                return self;
            },
            position: (function() {
                if (settings.orientation == 'vertical') {
                    return function(n, silent) {
                        if (n === undefined) {
                            return position;
                        } else {
                            position = get_position(n);
                            if (!(position instanceof Array)) {
                                position = [position];
                            }
                            if (position.length !== panels.length - 1) {
                                throw new Error('position array need to equal splitters length');
                            }
                            var width = self.css('visiblity', 'hidden').width();
                            var pw = 0;
                            var sw_sum = 0;
                            for (var i = 0; i < position.length; ++i) {
                                var splitter = $splitters[i];
                                var panel = panels[i];
                                var pos = position[i];
                                var splitter_width = splitter.width();
                                var sw2 = splitter_width/2;
                                if (settings.invisible) {
                                    pw += panel.width(pos).outerWidth();
                                    splitter.css('left', pw - (sw2 * (i + 1)));
                                } else if (settings.percent) {
                                    var w1 = (pos - sw2) / width * 100;
                                    var l1 = (pw + sw_sum) / width * 100;
                                    panel.css('left', l1 + '%');
                                    pw += panel.css('width', w1 + '%').outerWidth();
                                    splitter.css('left', (pw + sw_sum) / width * 100 + '%');
                                } else {
                                    panel.css('left', pw + sw_sum);
                                    pw += panel.css('width', pos - sw2).outerWidth();
                                    splitter.css('left', pw + sw_sum);
                                }
                                sw_sum += splitter_width;
                            }
                            var panel_last = panels[i];
                            if (settings.invisible) {
                                panel_last.width(width - pw);
                            } else {
                                if (settings.percent) {
                                    panel_last.css({
                                        width: (width - pw - sw_sum) / width * 100 + '%',
                                        left: (pw + sw_sum) / width * 100 + '%'
                                    });
                                } else {
                                    panel_last.css({
                                        width: width - pw - sw_sum,
                                        left: pw + sw_sum
                                    });
                                }
                            }
                            self.css('visiblity', '');
                        }
                        if (!silent) {
                            self.trigger('splitter.resize');
                            self.find('.splitter_panel').trigger('splitter.resize');
                        }
                        return self;
                    };
                } else if (settings.orientation == 'horizontal') {
                    return function(n, silent) {
                        if (n === undefined) {
                            return position;
                        } else {
                            position = get_position(n);
                            if (!(position instanceof Array)) {
                                position = [position];
                            }
                            if (position.length !== panels.length - 1) {
                                throw new Error('position array need to equal splitters length');
                            }
                            var height = self.css('visiblity', 'hidden').height();
                            var pw = 0;
                            for (var i = 0; i < position.length; ++i) {
                                var splitter = $splitters[i];
                                var panel = panels[i];
                                var pos = position[i];
                                var splitter_height = splitter.height();
                                var sw2 = splitter_height/2;
                                if (settings.invisible) {
                                    pw += panel.height(pos).outerHeight();
                                    splitter.css('top', pw - (sw2 * (i + 1)));
                                } else if (settings.percent) {
                                    var w1 = (pos - sw2) / height * 100;
                                    pw += panel.css('height', w1 + '%').outerHeight();
                                    splitter.css('top', (pw / height * 100) + '%');
                                } else {
                                    pw += panel.css('height', pos - sw2).outerHeight();
                                    splitter.css('top', pw);
                                }
                            }
                            var panel_last = panels[i];
                            if (settings.invisible) {
                                panel_last.height(height - pw);
                            } else {
                                var s_sum = splitter_height * i;
                                if (settings.percent) {
                                    var percent = (height - pw - s_sum) / height * 100 + '%';
                                    panel_last.css('height', percent);
                                } else {
                                    panel_last.height(height - pw - s_sum);
                                }
                            }
                            self.css('visiblity', '');
                        }
                        if (!silent) {
                            self.trigger('splitter.resize');
                            self.find('.splitter_panel').trigger('splitter.resize');
                        }
                        return self;
                    };
                } else {
                    return $.noop;
                }
            })(),
            _splitters: $splitters,
            _panels: panels,
            orientation: settings.orientation,
            limit: set_limit(settings.limit),
            isActive: function() {
                return splitter_id === id;
            },
            destroy: function() {
                self.removeClass('splitter_panel');
                if (settings.orientation == 'vertical') {
                    panel_1.removeClass('left_panel');
                    panel_2.removeClass('right_panel');
                } else if (settings.orientation == 'horizontal') {
                    panel_1.removeClass('top_panel');
                    panel_2.removeClass('bottom_panel');
                }
                self.unbind('splitter.resize');
                self.trigger('splitter.resize');
                self.find('.splitter_panel').trigger('splitter.resize');
                splitters[id] = null;
                count--;
                $splitters.each(function() {
                    var splitter = $(this);
                    splitter.unbind('mouseenter');
                    splitter.unbind('mouseleave');
                    splitter.unbind('touchstart');
                    splitter.unbind('touchmove');
                    splitter.unbind('touchend');
                    splitter.unbind('touchleave');
                    splitter.unbind('touchcancel');
                    splitter.remove();
                });
                self.removeData('splitter');
                var not_null = false;
                for (var i=splitters.length; i--;) {
                    if (splitters[i] !== null) {
                        not_null = true;
                        break;
                    }
                }
                //remove document events when no splitters
                if (!not_null) {
                    $(document.documentElement).unbind('.splitter');
                    $(window).unbind('resize.splitter');
                    splitters = [];
                    count = 0;
                }
            }
        });
        self.bind('splitter.resize', function(e) {
            var pos = self.position();
            if (self.orientation == 'vertical' &&
                pos > self.width()) {
                pos = self.width() - self.limit.rightBottom-1;
            } else if (self.orientation == 'horizontal' &&
                       pos > self.height()) {
                pos = self.height() - self.limit.rightBottom-1;
            }
            if (pos < self.limit.leftUpper) {
                pos = self.limit.leftUpper + 1;
            }
            e.stopPropagation();
            self.position(pos, true);
        });
        //inital position of splitter
        var pos;
        if (settings.orientation == 'vertical') {
            if (pos > width-settings.limit.rightBottom) {
                pos = width-settings.limit.rightBottom;
            } else {
                pos = get_position(settings.position);
            }
        } else if (settings.orientation == 'horizontal') {
            //position = height/2;
            if (pos > height-settings.limit.rightBottom) {
                pos = height-settings.limit.rightBottom;
            } else {
                pos = get_position(settings.position);
            }
        }
        if (pos < settings.limit.leftUpper) {
            pos = settings.limit.leftUpper;
        }
        if (panels.length > 2 && !(pos instanceof Array && pos.length == $splitters.length)) {
            throw new Error('position need to be array equal to $splitters length');
        }
        self.position(pos, true);
        var parent = this.closest('.splitter_panel');
        if (parent.length) {
            this.height(parent.height());
        }
        // bind events to document if no splitters
        if (splitters.filter(Boolean).length === 0) {
            $(window).bind('resize.splitter', function() {
                $.each(splitters, function(i, splitter) {
                    if (splitter) {
                        splitter.refresh();
                    }
                });
            });
            $(document.documentElement).on('mousedown.splitter touchstart.splitter', function(e) {
                if (splitter_id !== null) {
                    e.preventDefault();
                    current_splitter = {
                        node: splitters[splitter_id],
                        index: current_splitter_index
                    };
                    setTimeout(function() {
                        $('<div class="splitterMask"></div>').
                            css('cursor', current_splitter.node.children().eq(1).css('cursor')).
                            insertAfter(current_splitter.node);
                    });
                    current_splitter.node.settings.onDragStart(e);
                }
            }).bind('mouseup.splitter touchend.splitter touchleave.splitter touchcancel.splitter', function(e) {
                if (current_splitter) {
                    setTimeout(function() {
                        $('.splitterMask').remove();
                    });
                    current_splitter.node.settings.onDragEnd(e);
                    current_splitter = null;
                }
            }).bind('mousemove.splitter touchmove.splitter', function(e) {
                if (current_splitter !== null) {
                    var node = current_splitter.node;
                    var leftUpperLimit = node.limit.leftUpper;
                    var rightBottomLimit = node.limit.rightBottom;
                    var offset = node.offset();
                    if (node.orientation == 'vertical') {
                        var pageX = e.pageX;
                        if(e.originalEvent && e.originalEvent.changedTouches){
                          pageX = e.originalEvent.changedTouches[0].pageX;
                        }
                        var x = pageX - offset.left;
                        if (x <= node.limit.leftUpper) {
                            x = node.limit.leftUpper + 1;
                        } else if (x >= node.width() - rightBottomLimit) {
                            x = node.width() - rightBottomLimit - 1;
                        }
                        var pos = node.position();
                        if (pos.length > 1) {
                            var new_pos = pos.slice(0, current_splitter.index);
                            var p;
                            if (new_pos.length) {
                                p = x - new_pos.reduce(function(a, b) {
                                    return a + b;
                                });
                            } else {
                                p = x;
                            }
                            var diff = pos[current_splitter.index] - p;
                            new_pos.push(p);
                            if (current_splitter.index < pos.length - 1) {
                                var rest = pos.slice(current_splitter.index + 1);
                                rest[0] += diff;
                                new_pos = new_pos.concat(rest);
                            }
                            node.position(new_pos, true);
                        } else if (x > node.limit.leftUpper &&
                            x < node.width()-rightBottomLimit) {
                            node.trigger('splitter.resize');
                            node.find('.splitter_panel').
                                trigger('splitter.resize');
                            //e.preventDefault();
                        }
                    } else if (node.orientation == 'horizontal') {
                        var pageY = e.pageY;
                        if(e.originalEvent && e.originalEvent.changedTouches){
                          pageY = e.originalEvent.changedTouches[0].pageY;
                        }
                        var y = pageY-offset.top;
                        if (y <= node.limit.leftUpper) {
                            y = node.limit.leftUpper + 1;
                        } else if (y >= node.height() - rightBottomLimit) {
                            y = node.height() - rightBottomLimit - 1;
                        }
                        if (y > node.limit.leftUpper &&
                            y < node.height()-rightBottomLimit) {
                            node.position(y, true);
                            node.trigger('splitter.resize');
                            node.find('.splitter_panel').
                                trigger('splitter.resize');
                            //e.preventDefault();
                        }
                    }
                    node.settings.onDrag(e);
                }
            });//*/
        }
        splitters[id] = self;
        self.data('splitter', self);
        return self;
    };
});
