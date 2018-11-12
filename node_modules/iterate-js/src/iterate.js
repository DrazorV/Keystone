"use strict";

(function() {
    var __ = require('iterate-js-lite');

    __.chain = function () {
        return new Chain();
    };
    __.render = {
        blend: function (c0, c1, p) {
            /// <summary>Blends the second hex color into the first by a percentage</summary>
            /// <param type="String" name="c0">Primary Hex string to be blended. Ex: '#FFFFFF'</param>
            /// <param type="String" name="c1">Secondary Hex string to be blended into the first. Ex: '#000000'</param>
            /// <param type="Decimal" name="p">Percentage of the second hex to be blended into the first</param>
            /// <returns type="Hex String">Resulting hex string of the blend.</returns>
            var f = parseInt(c0.slice(1), 16),
                t = parseInt(c1.slice(1), 16),
                R1 = f >> 16,
                G1 = f >> 8 & 0x00FF,
                B1 = f & 0x0000FF,
                R2 = t >> 16,
                G2 = t >> 8 & 0x00FF,
                B2 = t & 0x0000FF;
            return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
        },
        hexToRGBL: function(hex) {
            var color = { red: 0, green: 0, blue: 0, luminosity: 0 },
                base = hex.toString().replace('#', ''),
                rgb = parseInt(base, 16);

            color.red = (rgb >> 16) & 0xff;
            color.green = (rgb >> 8) & 0xff;
            color.blue = (rgb >> 0) & 0xff;
            color.luminosity = 0.2126 * color.red + 0.7152 * color.green + 0.0722 * color.blue;

            return color;
        },
        bytesToImageSrc: function (bytes, type) {
            // el.src = __.render.bytesToImage( [ byteArrayFromServer ].join('') );
            return "data:image/{0};base64,{1}".format(type ? type : 'png', bytes);
        },
        bytesToCanvas: function (bytes, type, canvas, coords) {
            //var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");

            var uInt8Array = bytes;
            var i = uInt8Array.length;
            var binaryString = [i];
            while (i--) {
                binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');

            var base64 = window.btoa(data);

            var img = new Image();
            img.src = "data:image/{0};base64,{1}".format(type ? type : 'png', base64);
            img.onload = function () {
                console.log("Image Onload");
                ctx.drawImage(img, coords[0], coords[1], canvas.width, canvas.height);
            };
            img.onerror = function (stuff) {
                console.log("Img Onerror:", stuff);
            };
        }
    };

    // Wrapper for weakmap for simplistic private variable management
    var PrivateStore = __.class(function() {
        this.map = new WeakMap();
    },{
        context: function(context, func) {
            return func(this.map.get(context));
        },
        bind: function(context, data) {
            this.map.set(context, (__.is.object(data)) ? data : {});
        },
        get: function(context, path) {
            return __.prop(this.map.get(context), path);
        },
        set: function(context, path, value) {
            var paths = path.split('.');
            if(paths.length > 0) {
                var fragment = paths.pop(),
                    obj = this.map.get(context);
                __.all(paths, function(x) {
                    if(!__.is.set(obj[x]))
                        obj[x] = {};
                    obj = obj[x];
                });
                obj[fragment] = value;
            }
        }
    });

    // Object type description
    var Describe = __.class(function(value) {
        this.isObject = false;
        this.isArray = false;
        this.isFunction = false;
        this.isString = false;
        this.isNumber = false;
        this.isBoolean = false;
        this.isDate = false;
        this.isArguments = false;
        this.isNull = false;
        this.isUndefined = false;
        this.isNaN = false;
        this.isRegExp = false;
        this.read(value);
    }, {
        isIterable: { get: function() { return this.isArray || this.isObject || this.isNumber || this.isString || this.isArguments } },
        isSameType: function(target) { return __.is.sameType(this.value, target); },
        read: function(value) {
            this.initial = value;
            this.value = value;
        },
        value: {
            get: function() {
                return this._value;
            },
            set: function(value) {
                var self = this,
                    status = false,
                    phrase = '';
                self._value = value;
                __.all(__.types, function(typeString, key) {
                    status = false;
                    phrase = typeString;
                    if(key == 'nan') {
                        phrase = 'NaN';
                        status = __.is.nan(value);
                    } else if(key == 'obj') {
                        status = __.is.object(value);
                    } else if(key == 'integer') {
                        status = __.is.number(value);
                    } else {
                        status = __.is[key](value);
                    }
                    self['is' + phrase] = status;
                });
            }
        }
    });

    // Chain of function actions all executed on a value with myChain.execute('some value');
    var Chain = __.class(function() {
        this.actions = [];
        this.data = new Describe();
    }, {
        action: function(func) {
            this.actions.push(func.bind(this));
            return this;
        },
        all: function(func) {
            return this.action(function(data) {
                if(data.isIterable)
                    __.all(data.value, func); 
            });
        },
        append: function(value) {
            return this.action(function(data) {
                if(data.isArray)
                    data.value.push(value);
                else if(data.isString)
                    data.value += value;
            });
        },
        average: function(func) {
            return this.action(function(data) {
                if(data.isIterable)
                    data.value = __.math.average(data.value, func);
            });
        },
        contains: function(func) {
            return this.action(function(data) {
                if(data.isIterable)
                    data.value = __.contains(data.value, func);
            });
        },
        count: function(func) {
            return this.action(function(data) {
                if(data.isIterable)
                    data.value = __.count(data.value, func);
            });
        },
        default: function(def) {
            return this.action(function(data) {
                if(!data.isSet)
                    data.value = def;
            });
        },
        distinct: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.distinct(data.value, func);
            });
        },
        else: function(condition, action) {
            return this.action(function(data) {
                if(!condition)
                    action(data);
            });
        },
        equals: function(value) {
            return this.action(function(data) {
                data.value = data.value == value;
            });
        },
        execute: function(value) {
            var self = this;
            self.data.read(value);
            __.all(self.actions, function(action, idx, event) {
                action(self.data, idx, event);
            });
            return self.data;
        },
        filter: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.filter(data.value, func);
            });
        },
        first: function(options) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.first(data.value, options);
            });
        },
        group: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.group(data.value, func);
            });
        },
        last: function(options) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.last(data.value, options);
            });
        },
        if: function(condition, action) {
            return this.action(function(data) {
                if(condition)
                    action(data);
            });
        },
        intersect: function(obj, func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.intersect(data.value, obj, func);
            });
        },
        is: function(value) {
            return this.action(function(data) {
                data.value = data.value === value;
            });
        },
        map: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.map(data.value, func);
            });
        },
        max: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.math.max(data.value, func);
            });
        },
        median: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.math.median(data.value, func);
            });
        },
        min: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.math.min(data.value, func);
            });
        },
        preappend: function(value) {
            return this.action(function(data) {
                if(data.isArray)
                    data.value.unshift(value);
                else if(data.isString)
                    data.value = value + data.value;
            });
        },
        prop: function(path, value) {
            return this.action(function(data) {
                if(data.isSet) {
                    if(__.is.set(value))
                        __.prop(data.value, path, value);
                    else
                        data.value = __.prop(data.value, path);
                }
            });
        },
        search: function(func) {
            return this.action(function(data) {
                if(data.isIterable)
                    data.value = __.search(data.value, func);
            });
        },
        sort: function(options) {
            return this.action(function(data) {
                if(data.isArray)
                    data.value = __.sort(data.value, options);
            });
        },
        sum: function(func) {
            return this.action(function(data) {
                if(data.isArray || data.isObject)
                    data.value = __.math.sum(data.value, func);
            });
        },
    });

    // Base for creating a string parser
    var StringParser = __.class(function(keywords, options) {
        var keyChars = {},
            keyWords = {};

        __.all(keywords, function (x, y) {
            if (y.length > 1) 
                keyWords[y] = x;
            else 
                keyChars[y] = x;
        });

        this.keyChars = keyChars;
        this.keyWords = keyWords;
        this.options = options ? options : {};
    }, {
        parse: function(str) {
            var self = this,
                options = __.options({ skip: 0, bubble: true, ignoreCase: true, defaultAction: function() {  } }),
                char = '',
                idx = 0,
                func = function() { },
                called = false;

            __.all(str, function(a, b) {
                if (options.skip > 0)
                    return options.skip--;
                options.bubble = true;
                called = false;
                char = a;
                idx = parseInt(b);

                func = self.keyChars[char];
                if (__.is.function(func)) {
                    func(char, idx, str, options);
                    called = true;
                }
                __.all(self.keyWords, function(x, y) {
                    if (options.bubble || !called) {
                        if (((y[0] && options.ignoreCase) ? y[0].toLowerCase() : y[0]) == ((char && options.ignoreCase) ? char.toLowerCase() : char)) {
                            var pass = true;
                            var comp = '';
                            __.all(y, function(c, d) {
                                comp = str[idx + parseInt(d)];
                                if (((c && options.ignoreCase) ? c.toLowerCase() : c) != ((comp && options.ignoreCase) ? comp.toLowerCase() : comp))
                                    pass = false;
                            });
                            if (pass) {
                                func = x;
                                if (func != undefined) {
                                    options.skip = y.length - 1;
                                    func(y, idx, str, options);
                                    called = true;
                                }
                            }
                        }
                    }
                });
                if (!called)
                    options.defaultAction(char, idx, str, options);
            });
        }
    });

    // Parsing element style params from json to string and vise versa
    var StyleParser = __.class(function(options) {
        __.lib.Updatable.call(this);
        this.update(options);
    }, {
        asObject: {
            get: function() {
                return __.map(this, function(x, y, z) {
                    if(y == '_identifier')
                        z.skip = true;
                    return { key: y, value: x };
                }, { build: {} });
            }
        },
        asString: {
            get: function() {
                var retVal = '';
                __.all(this, function (p, k) {
                    if (p && k != '_identifier') 
                        retVal += '{0}:{1};'.format(k, p);
                });
                return retVal;
            }
        },
        clear: function() {
            var self = this;
            __.all(self, function(x, y) {
                if(y != '_identifier')
                    self.remove(y);
            });
        },
        remove: function(property) {
            delete this[property];
        },
        update: function(options) {
            var self = this;
            if(__.is.string(options)) {
                var values = options.split(';');
                __.all(values, function (p) {
                    if (p != "") {
                        var a = p.split(/:(.+)/);
                        self[a[0].trim()] = a[1].trim();
                    }
                });
            } else if(__.is.object(options))
                __.fuse(self, options);
        }
    }, __.lib.Updatable);

    // Parsing attribute params from json to string and vise versa
    var AttrParser = __.class(function(options) {
        __.lib.Updatable.call(this);
        this.update(options);
    }, {
        asObject: {
            get: function() {
                return __.map(this, function(x, y, z) {
                    if(y == '_identifier')
                        z.skip = true;
                    return { key: y, value: x };
                }, { build: {} });
            }
        },
        asString: {
            get: function() {
                var retVal = '';
                __.all(this, function (p, k) {
                    if (p && k != '_identifier') 
                        retVal += '{0}="{1}" '.format(k, p);
                });
                return retVal;
            }
        },
        clear: function() {
            var self = this;
            __.all(self, function(x, y) {
                if(y != '_identifier')
                    self.remove(y);
            });
        },
        remove: function(property) {
            delete this[property];
        },
        update: function(options) {
            var self = this;
            if(__.is.string(options)) {
                var values = style.split(' ');
                __.all(values, function (p) {
                    if (p != "") {
                        var a = p.split('=');
                        self[a[0].trim()] = a[1].replace('"', '').trim();
                    }
                });
            } else if(__.is.object(options))
                __.fuse(self, options);
        }
    }, __.lib.Updatable);

    // Configuration object with layering abilities that make extensive configs easy
    var Config = __.class(function(options) {
        __.lib.Updatable.call(this);
        this._registry = {};
        this.update(options);
    }, {
        update: function(options, deep) {
            var self = this;
            if (__.is.object(options)) {
                __.fuse(self, options, { deep: Boolean(deep) });
                __.all(self._registry, function (func, key, event) {
                    if (__.is.function(func)) 
                        func(self, options);
                });
            }
        },
        clear: function() {
            var self = this;
            __.all(self, function(x, y) {
                if(y != '_registry' && y != '_identifier')
                    delete self[y];
            });
        },
        handler: function(key, func) {
            if(func)
                this._registry[key] = func;
            else
                delete this._registry[key];
        }
    }, __.lib.Updatable);

    // Simple little event manager
    var EventManager = __.class(function(events) {
        __.lib.Updatable.call(this);
        this.hooks = {};
        this.update(events);
    }, {
        add: function(name, func) {
            var eventName = name.toLowerCase();
            if(!__.is.set(this.hooks[eventName]))
                this.hooks[eventName] = [];
            if(__.is.array(func))
                this.hooks[eventName] = this.hooks[eventName].concat(func);
            else
                this.hooks[eventName].push(func);
        },
        delegate: function(name, data, timeout) {
            var eventName = name.toLowerCase();
            var events = this.hooks[eventName];
            if(__.is.array(events)) {
                var data = { event: eventName, before: true, after: false, isCancelled: false, data: data };
                __.all(events, function(func) { setTimeout(function() { func(data); }, (timeout) ? timeout : 10); });
                return function() {
                    data.before = false;
                    data.after = true;
                    if(!data.isCancelled)
                        __.all(events, function(func) { setTimeout(function() { func(data); }, (timeout) ? timeout : 10); });
                };
            }
        },
        on: function(name, func) {
            this.add(name, func);
        },
        off: function(name, func) {
            this.remove(name, func);
        },
        read: function(obj) {
            var str = '',
                self = this;

            __.all(obj, (func, key) => {
                str = key.toLowerCase();

                if(str.substring(0, 2) == 'on' && str != 'on' && __.is.function(func))
                    self.add(str.replace('on', ''), func.bind(obj));
            }, true);
        },
        remove: function(name, func) {
            if(name) {
                var eventName = name.toLowerCase();
                if(!__.is.set(func))
                    delete this.hooks[eventName];
                else
                    this.hooks[eventName] = __.remove(this.hooks[eventName], func);
            } else {
                var self = this;
                __.all(self.hooks, function(func, key) { delete self.hooks[key]; });
            }
        },
        trigger: function(name, data) {
            var eventName = name.toLowerCase();
            var events = this.hooks[eventName];
            if(__.is.array(events)) {
                var data = { event: eventName, before: true, after: false, isCancelled: false, data: data };
                __.all(events, function(func) { func(data); });
                return function() {
                    data.before = false;
                    data.after = true;
                    if(!data.isCancelled)
                        __.all(events, function(func) { func(data); });
                };
            }
            return function() {};
        },
        update: function(options) {
            var self = this;
            if(__.is.object(options))
                __.all(options, function(x, y) { self.add(y, x); });
        }
    }, __.lib.Updatable);

    // Simple little view manager, great for Aurelia tabbed nav/dropdown control management
    var ViewManager = __.class(function(options) {
        __.lib.Updatable.call(this);
        this._active = null;
        this.views = [];
        this.onViewChange = function(view) {};
        this.update(options);
        var def = this.defaultView;
        if(def)
            this.activeView = def;
    }, {
        activeView: {
            get: function() {
                return this._active;
            },
            set: function(view) {
                if(view) {
                    __.all(this.views, function(x) { x.active = (x.name == view.name); });
                    this._active = view;
                    this.onViewChange(view);
                }
            }
        },
        defaultView: {
            get: function() {
                return __.search(this.views, function(x) { return x.default; });
            }
        },
        getView: function(name) {
            return __.search(this.views, function(x) { return x.name == name; });
        },
        setView: function(name) {
            this.activeView = this.getView(name);
        },
        update: function(options) {
            if(__.is.object(options))
                __.fuse(this, options);
        }
    }, __.lib.Updatable);

    // Simple object template engine, ties any object functions this context to the templated object as well
    var Model = __.class(function(defaults) {
        this.defaults = defaults;
    }, {
        all: function(obj) {
            var self = this;
            return __.map(obj, function(x) { return self.create(x); });
        },
        create: function(options) {
            var model = __.fuse(this.cloneDefaults(), options);
            __.all(model, function(value, key) {
                if(__.is.function(value))
                    model[key] = value.bind(model); // Configure this context
            });
            return model;
        },
        cloneDefaults: function() {
            return __.fuse({}, this.defaults, { deep: true });
        }
    });

    // Managed Model Collection
    var Collection = __.class(function(options) {
        __.lib.Updatable.call(this);
        var self = this;
        self.array = [];
        self.config = new Config({
            array: [],
            model: null,
            multiselect: false,
            selection: null,
            eval: undefined,
            map: undefined,
            filter: undefined,
            sort: undefined,
            onRefresh: () => { }
        });
        self.maps = {
            range: (start, end) => {
                var idxStart = start,
                    idxEnd = end;
                return function (x, y, z) {
                    if (y < idxStart)
                        z.skip = true;
                    if (y >= idxEnd)
                        z.skip = z.stop = true;
                    return x;
                };
            },
            limit: (limit) => {
                var target = limit;
                return function (x, y, z) {
                    if (y >= target)
                        z.skip = z.stop = true;
                    return x;
                };
            },
            selected: () => {
                return function (x, y, z) {
                    if (!x.selected)
                        z.skip = true;
                    return x;
                }
            },
            hidden: () => {
                return function (x, y, z) {
                    if (x.hidden)
                        z.skip = true;
                    return x;
                }
            }
        };

        self.refresh = __.debounce(() => {
            var base = self.config.array;
            if (__.is.set(self.config.filter))
                base = __.filter(base, self.config.filter);
            if (__.is.set(self.config.sort))
                base = __.sort(base, self.config.sort);
            if (__.is.set(self.config.map))
                base = __.map(base, self.config.map);
            if (__.is.set(self.config.eval))
                base = __.all(base, self.config.eval);
            self.array = base;
            self.config.onRefresh(self);
            return self;
        }, 50);

        self.update(options);
    }, {
        add: function(item) {
            if (__.is.array(item))
                this.config.array = this.config.array.slice().concat(item);
            else
                this.config.array.push(item);
            this.refresh();
            return this;
        },
        addAt: function(item, index) {
            if (__.is.array(item))
                Array.prototype.splice.apply(this.config.array, [index, 0].concat(item));
            else
                this.config.array.splice(index, 0, item);
            this.refresh();
            return this;
        },
        addNew: function(options) {
            var self = this;
            if (__.is.array(options))
                __.all(options, x => self.addNew(x));
            else {
                if (__.is.object(self.config.model))
                    self.add(self.config.model.create(options));
                else if (__.is.function(self.config.model))
                    self.add(new self.config.model(options));
            }
            return this;
        },
        at: function(index) {
            return this.config.array[index];
        },
        chain: {
            get: function() {
                return __.chain(this.config.array);
            }
        },
        clear: function() {
            this.array = [];
            this.config.array = [];
            this.refresh();
            return this;
        },
        contains: function(func) {
            return __.contains(this.config.array, func);
        },
        count: {
            get: function() {
                return this.config.array.length;
            }
        },
        each: function(func) {
            __.all(this.config.array);
        },
        eval: function(func) {
            if (__.is.function(func))
                this.config.eval = func;
            else
                this.config.eval = undefined;
            this.refresh();
            return this;
        },
        filter: function(func) {
            if (__.is.function(func))
                this.config.filter = func;
            else
                this.config.filter = undefined;
            this.refresh();
            return this;
        },
        first: {
            get: function() {
                return this.array[0];
            }
        },
        index: function(key, value) {
            return __.index(this.config.array, key, value);
        },
        indexOf: function(item) {
            return this.config.array.indexOf(item);
        },
        last: {
            get: function() {
                return this.array[this.array.length - 1];
            }
        },
        map: function(func) {
            if (__.is.function(func))
                this.config.map = func;
            else
                this.config.map = undefined;
            this.refresh();
            return this;
        },
        move: function(index1, index2) {
            this.config.array.splice(index2, 0, this.config.array.splice(index1, 1)[0]);
            this.refresh();
            return this;
        },
        remove: function(item) {
            var idx = this.indexOf(item);
            if (idx > -1)
                this.removeAt(idx);
            return this;
        },
        removeAt: function(index) {
            this.config.array.splice(index, 1);
            this.refresh();
            return this;
        },
        search: function(func) {
            return __.search(this.config.array, func);
        },
        sort: function(options) {
            if (__.is.set(options))
                this.config.sort = options;
            else
                this.config.sort = undefined;
            this.refresh();
            return this;
        },
        select: function(items) {
            if (!this.multiselect)
                this.toggle(this.config.array, 'selected', false);

            this.toggle(items, 'selected', true);

            this.config.selection = __[this.multiselect ? 'filter' : 'search'](this.config.array, x => x.selected);
            return this;
        },
        unselect: function(items) {
            if (!this.multiselect)
                this.toggle(this.config.array, 'selected', false);

            this.toggle(items, 'selected', false);

            this.config.selection = __[this.multiselect ? 'filter' : 'search'](this.config.array, x => x.selected);
            return this;
        },
        toggle: function(items, property, state) {
            var prop = property ? property : 'hidden';
            if (__.is.array(items))
                __.all(items, x => x[prop] = (state != undefined ? state : !x[prop]));
            else if (__.is.object(items))
                items[prop] = (state != undefined ? state : !items[prop]);
        },
        update: function(options) {
            if(__.is.array(options))
                this.config.array = options;
            else if(__.is.object(options))
                this.config.update(options);
            this.refresh();
            return this;
        }
    }, __.lib.Updatable);

    // Event Based Stop Watch with stop, start and reset abilities along with an on tick event
    var StopWatch = __.class(function(options) {
        var self = this;
        self.lastStarted = 0;
        self.lapsedTime = 0;
        self.clock = null;
        self.settings = __.options({
            onTick: function onTick(time) {},
            tickRate: 500
        }, options);

        self.update = function () {
            self.settings.onTick(self.getTime());
        };
        self.start = function () {
            self.clock = setInterval(self.update, self.settings.tickRate);
            self.lastStarted = self.lastStarted ? self.lastStarted : self.now();
        };
        self.stop = function () {
            self.lapsedTime = self.lastStarted ? self.lapsedTime + self.now() - self.lastStarted : self.lapsedTime;
            self.lastStarted = 0;
            clearInterval(self.clock);
        };
        self.reset = function () {
            self.stop();
            self.lapsedTime = self.lastStarted = 0;
            self.update();
        };
        self.getRawTime = function () {
            return self.lapsedTime + (self.lastStarted ? self.now() - self.lastStarted : 0);
        };
        self.getTime = function () {
            var h = 0,
                m = 0,
                s = 0,
                ms = 0;
            var time = self.getRawTime();

            h = Math.floor(time / (60 * 60 * 1000));
            time = time % (60 * 60 * 1000);
            m = Math.floor(time / (60 * 1000));
            time = time % (60 * 1000);
            s = Math.floor(time / 1000);
            ms = time % 1000;

            return { Hours: self.pad(h, 2), Minutes: self.pad(m, 2), Seconds: self.pad(s, 2), MilliSeconds: self.pad(ms, 3), Raw: time };
        };
        self.pad = function (num, size) {
            var s = "0000" + num;
            return s.substr(s.length - size);
        };
        self.now = function () {
            return new Date().getTime();
        };
    });

    // Extendable array base
    var arrayStore = new PrivateStore();
    var ArrayExt = __.class(function() {
        arrayStore.bind(this);
        arrayStore.context(this, function(store) {
            store.length = 0;
        });
        Array.call(this);
        var self = this,
            process = arguments;
        if(__.is.array(arguments[0]))
            process = arguments[0];
        __.all(process, function(x) { self.push(x); });
    }, {
        length: { 
            get: function() { 
                return arrayStore.get(this, 'length'); 
            },
            set: function(value) {
                arrayStore.set(this, 'length', value); 
            }
        }
    }, Array);

    // Ended up being a polyfill for missing object functions .keys() .values() etc but helpful
    var Enumerable = __.class(function() {}, {
        count: { 
            get: function() {
                return this.getKeys.length;
            } 
        },
        getKeys: { 
            get: function() {
                if (Object.keys) 
                    return Object.keys(this);
                return __.map(this, function (x, y) {
                    return y;
                });
            } 
        },
        getValues: { 
            get: function() {
                if (Object.values) 
                    return Object.values(this);
                return __.map(this, function (x, y) {
                    return x;
                });
            } 
        },
        each: function(func) {
            __.all(this, func);
        },
        toArray: function(value) {
            var ret = [],
                value = value ? value : function(x, y) { return x; };
            __.all(this, function (x, y) {
                ret.push(value(x, y));
            });
            return ret;
        },
        toDictionary: function(key, value) {
            var dict = new Dictionary(),
                key = key ? key : function(x, y) { return y; },
                value = value ? value : function(x, y) { return x; };
            this.each(function(x, y) {
                dict.add(key(x, y), value(x, y));
            });
            return dict;
        },
        toHashSet: function(value) {
            var ret = new HashSet(),
                value = value ? value : function(x, y) { return x; };
            __.all(this, function(x, y) {
                ret.add(value(x, y));
            });
            return ret;
        }
    });

    // Basic object hash table with syntactic sugar
    var Dictionary = __.class(function() {
        Enumerable.call(this);
    }, {
        add: function(key, value) {
            this[key] = value;
        },
        clear: function() {
            var self = this;
            __.all(self, function (x, y) {
                return self.remove(y);
            });
        },
        containsKey: function(key) {
            return __.is.contains(this.getKeys, function(x) { return x == key; });
        },
        containsValue: function(value) {
            return __.contains(this, function (x) { return x == value; });
        },
        remove: function(key) {
            delete this[key];
        }
    }, Enumerable);

    var HashSet = __.class(function() {
        Enumerable.call(this);
    }, {
        add: function(value) {
            this[value] = true;
        },
        clear: function() {
            var self = this;
            __.all(self, function (x, y) {
                return self.remove(y);
            });
        },
        contains: function(value) {
            return Boolean(this[value]);
        },
        remove: function(value) {
            delete this[value];
        }
    }, Enumerable);
    
    __.fuse(__.lib, {
        Describe: Describe,
        Chain: Chain,
        StringParser: StringParser,
        StyleParser: StyleParser,
        AttrParser: AttrParser,
        PrivateStore: PrivateStore,
        Config: Config,
        Model: Model,
        Collection: Collection,
        EventManager: EventManager,
        ViewManager: ViewManager,
        StopWatch: StopWatch,
        ArrayExt: ArrayExt,
        Enumerable: Enumerable,
        Dictionary: Dictionary,
        HashSet: HashSet
    });

    if( typeof module !== 'undefined' )
        module.exports = __;
    else if(typeof window !== 'undefined')
        window.__ = window.iterate = __;
})();