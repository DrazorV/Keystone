"use strict";

(function() {
    // Prototype Modification
    String.prototype.replaceAll = function (str1, str2, ignore) {
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), ignore ? "gi" : "g"), typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2);
    };
    String.prototype.replaceWhile = function (str1, str2, condition, ignoreCase) {
        var result = this.replaceAll(str1, str2, ignoreCase);
        var limit = 10000;
        while (condition(result) && limit--) {
            result = result.replaceAll(str1, str2, ignoreCase);
        }return result;
    };
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return __.is.set(args[number]) ? args[number] : match;
        });
    };
    String.prototype.contains = function (value, ignoreCase) {
        if(__.is.string(value)) {
            if (ignoreCase) return this.toLowerCase().indexOf(value.toLowerCase()) > -1;
            return this.indexOf(value) > -1;
        } else if(__.is.regex(value)) {
            return __.is.set(value.match(value));
        }
        return false;
    };
    String.prototype.whiteout = function (items) {
        var self = this;
        if (items) {
            var temp = self.slice(0);
            if (__.is.array(items)) __.all(items, function (v) {
                temp = temp.replace(v, '');
            });else if (__.is.string(items)) temp = temp.replace(items, '');
            return temp.trim();
        }
        return this;
    };
    String.prototype.capitalize = function () {
        return this.replace(/[^\s]+/g, function (word) {
            return word.replace(/^./, function (first) {
                return first.toUpperCase();
            });
        });
    };
    String.prototype.firstWord = function () {
        var index = this.indexOf(' ');
        if (index > -1) return this.substring(0, index);
        return this;
    };
    String.prototype.truncate = function(amount, ind) {
        var length = parseInt(amount || 50);
        var indicator = ind || '...';
        if(length < this.length)
            return this.substring(0, length - indicator.length) + indicator;
        else
            return this;
    };

    const iteratejs = function () {
        var me = this;
        // Constant Containers
        me.i = {
            obj: {},
            array: [],
            function: function() {},
            string: 'ABC',
            integer: 1,
            bool: true,
            date: new Date(),
            args: arguments,
            null: null,
            undefined: undefined,
            nan: NaN,
            regex: /xyz/,
            setConditions: function (object) {
                return object != null && object != undefined && object != NaN;
            },
            defaultConditions: function (object) {
                return Boolean(object);
            },
            formatOptions: function () {
                return { value: 0, decimal: 2, digits: -1, dynamic: false, form: '{0}', delim: '', type: '' };
            }
        };
        me.types = {
            obj: 'Object',
            array: 'Array',
            function: 'Function',
            string: 'String',
            integer: 'Number',
            bool: 'Boolean',
            date: 'Date',
            args: 'Arguments',
            null: 'Null',
            undefined: 'Undefined',
            nan: 'Number',
            regex: 'RegExp'
        };

        // Base Functions
        me.all = function (obj, func, all) {
            /// <summary>Iterates over any interable object, arrays, objects, arguments and more.</summary>
            /// <param type="Iterable" name="obj">The item to iterate over, works on objects, arrays, argumates and anything that can iterate.</param>
            /// <param type="Function" name="func">The function called each iteration, passed (value, key, event).</param>
            /// <param type="Bool(Optional)" name="all">The optional bool to toggle off the hasOwnProperty check, note that it will still work on arrays and arguments regardless.</param>
            var event = { stop: false };

            if(me.is.array(obj)) {
                var length = obj.length;
                for(var i = 0; i < length; i++) {
                    func(obj[i], i, event);
                    if(event.stop) 
                        break;
                }
            } else if(me.is.number(obj)) {
                var count = 0,
                    target = Math.abs(obj);
                while(count < target) {
                    count++;
                    func(count, target, event);
                    if(event.stop) 
                        break;
                }
            } else {
                for (var val in obj) {
                    if (all || obj.hasOwnProperty(val)) 
                        func(obj[val], val, event);
                    if(event.stop) 
                        break;
                }
            }
        };
        me.class = function (construct, methods, inherit) {
            var customFuse = function customFuse(target, properties) {
                me.all(properties, function (x, y) {
                    if (me.is.function(x)) 
                        target[y] = x;
                    else if (me.is.object(x)) {
                        // Allows user to set getters/setters
                        Object.defineProperty(target, y, me.fuse({
                            enumerable: false,
                            configurable: true
                        }, x));
                    }
                }, true);
                return target;
            };
            var proto = methods || {};
            if (inherit) {
                if (me.is.array(inherit)) 
                    me.all(inherit, function (x) {
                        proto = customFuse(Object.create(x.prototype), proto);
                    });
                else 
                    proto = customFuse(Object.create(inherit.prototype), proto);
            } 
            else 
                proto = customFuse({}, proto);
            construct.prototype = proto;
            construct.prototype.constructor = construct;
            return construct;
        };
        me.contains = function (obj, func) {
            /// <summary>Attempts to search the first param for the result in the most optimized fashion as the following pairs show:
            /// (string, string), (string, function), (array, function), (array, value), (object, function), (object, value).</summary>
            /// <param type="Value" name="obj">Item to search based on the second params conditions.</param>
            /// <param type="String/Function/Value" name="func">String fragment, Function passed (value, key) need to return true/false, or raw value to search for.</param>
            /// <returns type="Bool">If the resulting conditions are met it will return true, otherwise false.</returns>
            var retVal = false;
            if (me.is.string(obj))
                retval = obj.contains((me.is.function(func)) ? func(obj) : func);
            else 
                retVal = me.is.set(me.search(obj, func));
            return retVal;
        };
        me.count = function (obj, func) {
            /// <summary>Iterates over an iterable attempting to count the objects based on the returned value.</summary>
            /// <param type="Iterable" name="obj">The item to iterate over, works on objects, arrays, argumates and anything that can iterate.</param>
            /// <param type="Function(Optional)" name="func">Function to get you to the value you want to count, must return that value, if it is null, undefined or NaN it will not count the value.</param>
            /// <returns type="Integer">The total count of the values searched.</returns>
            var count = 0,
                key = me.is.function(func) ? func : function (v, k) {
                    return v;
                };
            me.all(obj, function (v, k) {
                if (me.is.set(key(v, k))) 
                    count++;
            });
            return count;
        };
        me.debounce = function (func, time) {
            time || (time = 250);
            var timer = null;
            return function () {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    func.apply(context, args);
                }, time);
            };
        };
        me.deepall = function(obj, func, all) {
            me.all(obj, function(x, y, z) {
                func(x, y, z);
                if(!z.stop && (me.is.array(x) || me.is.object(x)))
                    me.deepall(x, func, all);
            }, all);
        };
        me.distinct = function(obj, func) {
            var index = [],
                isArray = me.is.array(obj),
                key = (func) ? func : function(x) { return x; };
            return me.map(obj, function(x, y, z) {
                var item = key(x);
                if(index.indexOf(item) == -1) {
                    index.push(item);
                    return (isArray) ? x : { key: y, value: x };
                } else
                    z.skip = true;
            }, { build: (isArray) ? [] : {} });
        };
        me.enum = function(obj) {
            var retval = {};
            me.all(obj, function(value, key) {
                Object.defineProperty(retval, key, {
                    get: function() { return value; },
                    enumerable: true,
                    configurable: false
                });
            });
            if(Object.seal)
                retval = Object.seal(retval);
            return retval;
        };
        me.first = function (obj, options) {
            /// <summary>Attempts to iterate over the iterable object and get the first object, if key is true then it will return the first objects key,
            /// if n greater than 1 or defined it will return that number of objects.</summary>
            /// <param type="Iterable" name="obj">The item to iterate over, works on objects, arrays, argumates and anything that can iterate.</param>
            /// <param type="Bool(Optional)" name="key">If true returns the key of the first iteration, if not defined it will return the value.</param>
            /// <param type="Integer(Optional)" name="n">If set, will return n number of items from the front of the iterable.</param>
            /// <returns type="Value">First n number of objects found, if many it will return an array, if one than it will return the first item.</returns>
            var retVal = null,
                count = 1,
                opt = me.options({ keys: false, limit: 1 }, options);

            if (me.is.set(opt.limit)) {
                retVal = me.is.array(obj) ? [] : {};
                me.all(obj, function (v, k, e) {
                    count++;
                    if (count > opt.limit) 
                        e.stop = true;
                    me.is.array(obj) ? retVal.push((opt.keys) ? k : v) : retVal[k] = v;
                });
            }
            return retVal;
        };
        me.filter = function (obj, func) {
            /// <summary>Iterates over an object or array and will filter it down and return the respective filtered object or array.</summary>
            /// <param type="Iterable" name="obj">The item to iterate over, works on objects, arrays, argumates and anything that can iterate.</param>
            /// <param type="Function" name="func">Function passed (value, key, event) needs to return true or falsed, if true the the item is accepted, if false excluded.
            /// If you set event.stop = true; at any time it will cancel the loop and return whatever it has generated thus far.</param>
            /// <returns type="Object/Array">The respective object or array generated.</returns>
            var event = { stop: false };
            var ret = null;
            if (me.is.function(func)) {
                if (me.is.array(obj)) {
                    ret = [];
                    me.all(obj, function (x, y, e) {
                        if (func(x, y, event)) 
                            ret.push(x);
                        if (event.stop) 
                            e.stop = true;
                    });
                } else if (me.is.object(obj)) {
                    ret = {};
                    me.all(obj, function (x, y, e) {
                        if (func(x, y, event)) 
                            ret[y] = x;
                        if (event.stop) 
                            e.stop = true;
                    });
                }
            } else if (me.is.object(func)) {
                var flag = null;
                ret = me.filter(obj, function (v) {
                    flag = true;
                    me.all(func, function (value, prop) {
                        if (v[prop] != value) 
                            flag = false;
                    });
                    return flag;
                });
            }
            return ret;
        };
        me.format = function (options) {
            /// <summary>Attempts to format the params passed in given a type property within params.</summary>
            /// <param type="Object" name="params">Object parameters passed in, see i.formatOptions for full view of replaceable params.</param>
            /// <returns type="String">Formatted value.</returns>
            var options = me.options(me.i.formatOptions(), options),
                temp = me.formats[options.type.toLowerCase()];
            return (me.is.function(temp)) ? temp(options) : '';
        };
        me.fuse = function (obj1, obj2, options) {
            /// <summary>Fuses the second parameter object into the first overriding its properties and creating new ones where necessary.
            /// Has detection for Config and Override Objects, allowing layering.</summary>
            /// <param type="Object" name="obj1">Base Object to be overwritten.</param>
            /// <param type="Object" name="obj2">Object that will overwrite.</param>
            /// <param type="Object(Optional)" name="opt">Object with optional options for the fuse.</param>
            /// <returns type="Object">Returns obj1 after the resulting merge with obj2.</returns>
            var opt = {
                    deep: me.prop(options, 'deep') || false,
                    all: me.prop(options, 'all') || false,
                    handler: me.prop(options, 'handler')
                },
                target;

            me.all(obj2, function (object, key, e) {
                target = object;
                if(me.is.function(opt.handler))
                    target = opt.handler({ obj1: obj1, obj2: obj2, value: object, key: key }, e);
                if(e.stop || e.skip)
                    return;

                if (me.is.object(target) && me.prop(obj1[key], '_identifier') == 'Config Object') 
                    obj1[key].update(target, true);
                else if (me.is.object(target) && target._identifier == 'Replace Object') 
                    obj1[key] = target.content();
                else {
                    if (opt.deep && (me.is.object(target) || me.is.array(target))) {
                        if (!me.is.set(obj1[key])) {
                            if (me.is.object(target)) 
                                obj1[key] = {};
                            else if (me.is.array(target)) 
                                obj1[key] = [];
                        }
                        me.fuse(obj1[key], target, opt);
                    } 
                    else 
                        obj1[key] = target;
                }

            }, opt.all);
            return obj1;
        };
        me.getType = function (obj) {
            /// <summary>Gets the type of object in string form.</summary>
            /// <param type="Value" name="obj">Object to get the type of.</param>
            /// <returns type="String">Returns the string portion containing the object identifier. Ex: 'object', 'array', 'string', 'boolean'...</returns>
            return me.i.obj.toString.call(obj).match(/\s([a-zA-Z]+)/)[1];
        };
        me.group = function (obj, func) {
            /// <summary>Groups up values given a function or string to get to the respective property, if nothing it will group by raw values.</summary>
            /// <param type="Iterable" name="obj">The item to iterate over, works on objects, arrays, argumates and anything that can iterate.</param>
            /// <param type="Function/String(Optional)" name="func">Function or string property chain that will attempt to get to the value of the object,
            /// if undefined it will just return the iterated object.</param>
            /// <returns type="Object">Returns an object with properties defining the groups and objects that match in arrays within those groups.</returns>
            var key = me.is.function(func) ? func : function (v) { return me.prop(v, func); },
                retVal = {},
                value = null;
            me.all(obj, function (v) {
                value = key(v);
                if(me.is.string(value) || me.is.number(value)) {
                    if(me.is.set(retVal[value]))
                        retVal[value].push(v);
                    else
                        retVal[value] = [v];
                }
            });
            return retVal;
        };
        me.index = function(obj, key, value) {
            key = me.is.function(key) ? key : function(x, y) { return y; };
            value = me.is.function(value) ? value : function(x, y) { return x; };
            return me.map(obj, function(x, y) { return { key: key(x, y), value: value(x, y) }; }, { build: {} });
        };
        me.intersect = function(obj1, obj2, func) {
            var build = [];
            var index1 = me.map(obj1, function(x, y) { return { value: y, key: (func) ? func(x) : x }; }, { build: {} });
            var index2 = me.map(obj2, function(x, y) { return { value: y, key: (func) ? func(x) : x }; }, { build: {} });
            me.all(index1, function(x, y) {
                if(index2[y] != undefined)
                    build.push(obj1[x]);
            });
            return build;
        };
        me.last = function (obj, options) {
            /// <summary>Attempts to iterate over the iterable object and get the last object, if key is true then it will return the last objects key,
            /// if n greater than 1 or defined it will return that number of objects or an object with that number of properties.</summary>
            /// <param type="Iterable" name="obj">The item to iterate over, works on objects, arrays, argumates and anything that can iterate.</param>
            /// <param type="Bool(Optional)" name="key">If true returns the key of the last iteration, if not defined it will return the value.</param>
            /// <param type="Integer(Optional)" name="n">If set, will return n number of items from the front of the iterable.</param>
            /// <returns type="Value">Last n number of objects found, if many it will return an array, if one than it will return the last item.</returns>
            var retVal = null,
                count = 1,
                target = (me.is.array(obj)) ? obj.reverse() : me.map(obj, function(x, y) { return { key: y, value: x }; }).reverse(),
                opt = me.options({ keys: false, limit: 1 }, options);

            if (me.is.set(opt.limit)) {
                retVal = me.is.array(obj) ? [] : {};
                me.all(target, function (v, k, e) {
                    count++;
                    if (count > opt.limit) 
                        e.stop = true;
                    me.is.array(obj) ? retVal.push((opt.keys) ? k : v) : retVal[v.key] = v.value;
                });
            }
            return retVal;
        };
        me.map = function (obj, func, options) {
            /// <summary>Attempts to map the respective array or object to an array or object given the event parameter you can change the build object to an object, default is building an array.
            /// Ex: __.map([...], (v, k) => ({ value: v, key: k }), { build: {} }); will map an array to an object.</summary>
            /// <param type="Iterable" name="obj">The item to iterate over, works on objects, arrays, argumates and anything that can iterate.</param>
            /// <param type="Function" name="func">Function passed (value, key, event) needs to return something to be shoved into the map.
            /// If it returns nothing than the map fills with undefined.</param>
            /// <param type="Object(Optional)" name="e">Event param for loop customization like pushing multiple into the return object at once or skipping the current iteration or stopping the loop.</param>
            /// <returns type="Array/Object">Returns the mapped array or object.</returns>
            var event = me.options({ stop: false, skip: false, manual: false, pushMultiple: false, build: [] }, options),
                parsedvalue = null,
                isArray = me.is.array(event.build),
                isObject = me.is.object(event.build),
                key = me.is.function(func) ? func : function (v) { return v; },
                add = function(value) {
                    if (isArray) 
                        event.build.push(value);
                    else if (isObject) 
                        event.build[value.key] = value.value;
                };

            me.all(obj, function (x, y, e) {
                parsedvalue = key(x, y, event);
                if (event.skip || event.manual) 
                    event.skip = false;
                else {
                    if (event.pushMultiple) {
                        me.all(parsedvalue, function (v) { add(v); });
                        event.pushMultiple = false;
                    } else 
                        add(parsedvalue);
                }
                if (event.stop) 
                    e.stop = true;
            });
            return event.build;
        };
        me.match = function(obj1, obj2, options) {
            var event = me.options({ checkType: false, recursive: true, explicit: false }, options),
                flag = true;

            if(event.checkType)
                if(!me.is.sameType(obj1, obj2))
                    return false;
            if((!me.is.set(obj1) && me.is.set(obj2)) || (me.is.set(obj1) && !me.is.set(obj2)))
                return false;

            me.all(obj1, function(x, y, z) {
                if(event.recursive && (me.is.object(x) || me.is.array(x))) {
                    if(!me.match(x, obj2[y], event)) {
                        z.stop = true;
                        flag = false;
                    }
                } else if((event.explicit) ? obj2[y] !== x : obj2[y] != x) {
                    z.stop = true;
                    flag = false;
                }
            });
            return flag;
        };
        me.move = function (obj, key1, key2) {
            /// <summary>Attempts to move key value pair to target key value pair, uses internal methods on array objects.</summary>
            /// <param type="Array/Object" name="obj">The Object/Array which contains the key1 to be moved to key2.</param>
            /// <param type="String/Int" name="key1">The source key of the property to be moved.</param>
            /// <param type="String/Int" name="key2">The target key of the property to be moved.</param>
            /// <returns type="Array/Object">Returns the array or object passed in.</returns>
            if(key1 != key2) {
                if (me.is.array(obj)) 
                    obj.splice(key2, 0, obj.splice(key1, 1)[0]);
                else {
                    obj[key2] = obj[key1];
                    delete obj[key1];
                }
            }
            return obj;
        };
        me.options = function(base, params) {
            if(params)
                me.fuse(base, params);
            return base;
        };
        me.prop = function (obj, path, value) {
            /// <summary>Searches an object using a property path and returns the resulting value.</summary>
            /// <param type="Object" name="obj">The item to be searched along the path chain.</param>
            /// <param type="String(Optional)" name="path">String based path to the object property. Ex: { item: { type: 1 } } with 'item' it will find { type: 1 } with 'item.type' it will find 1.</param>
            /// <returns type="Value">Value of the resulting property chain, will be undefined if the value at the end isn't there, or if the chain is cut short.</returns>
            if(me.is.set(path) && me.is.set(obj) && path != '') {
                if (me.is.set(value)) {
                    var paths = path.split('.');
                    if (paths.length > 0) {
                        var fragment = paths.pop();
                        me.all(paths, function (x) {
                            if (!me.is.set(obj[x]))
                                obj[x] = {};
                            obj = obj[x];
                        });
                        obj[fragment] = value;
                    }
                } else {
                    var current = obj,
                        paths = path.split('.');
                    me.all(paths, function (p, i, e) {
                        current = current[p];
                        if (!me.is.set(current)) 
                            e.stop = true;
                    });
                    return current;
                } 
            }
            else 
                return obj;
        };
        me.rank = function (obj, func) {
            /// <summary>Requires sorted array and will use a key in an attempt to rank the values.</summary>
            /// <param type="Array" name="obj">Array of sorted objects to be ranked.</param>
            /// <param type="Function(Optional)" name="options">Map function, default is to return the raw value.</param>
            /// <returns type="Array">Array of rankings by index.</returns>
            var sorted = [],
                key = func ? func : function (v) {
                    return v;
                };
            sorted = me.map(obj, key);
            return me.map(obj.slice(), function (v) {
                var idx = sorted.indexOf(v);
                return idx == 0 ? idx + 1 : idx;
            });
        };
        me.remove = function (obj, item) {
            /// <summary>Attempts to remove the item from the object using which ever methods are most suited towards the object.</summary>
            /// <param type="Array/Object" name="obj">Object/Array from which to remove the item.</param>
            /// <param type="Object" name="item">Item to be removed, not the property name but the item itself.</param>
            /// <returns type="Array/Object">Returns the modified object.</returns>
            if (me.is.array(obj)) {
                var idx = obj.indexOf(item);
                if (idx > -1) 
                    obj.splice(idx, 1);
            } else if (me.is.object(obj)) {
                var key = me.search(obj, item, { getKey: true });
                delete obj[key];
            }
            return obj;
        };
        me.removeAt = function(obj, key) {
            if (me.is.array(obj)) {
                if (key > -1) 
                    obj.splice(key, 1);
            } else if (me.is.object(obj))
                delete obj[key];
            return obj;
        };
        me.scope = function(init) {
            return init();
        }
        me.search = function (obj, func, options) {
            /// <summary>Attempts to search the first param for the result in the most optimized fashion as the following pairs show:
            /// (array, function), (array, value), (object, function), (object, value).</summary>
            /// <param type="Value" name="obj">Item to search based on the second params conditions.</param>
            /// <param type="Function/Value" name="func">Function passed (value, key) need to return true/false, or raw value to search for.</param>
            /// <returns type="Value">If the resulting conditions are met it will return the value, otherwise null.</returns>
            var ret = null,
                state = false,
                key = me.is.function(func) ? func : function(x) { return x == func; },
                opt = me.options({ default: null, all: false, getKey: false }, options);

            if(me.is.set(obj)) {
                if(me.is.array(obj) && !me.is.function(func)) {
                    ret = obj.indexOf(func);
                } else {
                    me.all(obj, function(x, y, e) {
                        state = key(x, y, e);
                        if(state) {
                            e.stop = true;
                            ret = (opt.getKey) ? y : x;
                        }
                    }, opt.all);
                }
            }
            return !me.is.set(ret) ? opt.default : ret;
        };
        me.sort = function (array, options) {
            /// <summary>Sort an array of values given options { dir: 'asc', key: v => v } both are optional, with the first giving direction and the second getting
            /// you to the value you are sorting upon.</summary>
            /// <param type="Array" name="array">The array of items to be sorted.</param>
            /// <param type="Object/Array(Optional)" name="options">The options shaping the sorting method. If it is an array it will sort on multiple options.</param>
            /// <returns type="Array"></returns>
            if (me.is.array(options)) {
                var o = me.map(options, function (x) {
                    return me.options({ dir: 'asc', key: function key(v) { return v; } }, x);
                });
                var rev, result, A, B;
                return array.slice().sort(function (a, b) {
                    me.all(o, function (x, y, z) {
                        rev = x.dir == 'asc' ? true : false;
                        result = 0;
                        A = x.key(a);
                        B = x.key(b);

                        result = (A < B ? -1 : A > B ? 1 : 0) * [-1, 1][+!!rev];

                        if (result != 0) 
                            z.stop = true;
                    });
                    return result;
                });
            } else {
                var o = me.options({ dir: 'asc', key: function key(v) { return v; } }, options),
                    rev = o.dir == 'asc' ? true : false;
                return array.slice().sort(function (a, b) {
                    var A = o.key(a),
                        B = o.key(b);
                    return (A < B ? -1 : A > B ? 1 : 0) * [-1, 1][+!!rev];
                });
            }
        };
        me.switch = function (value, hash, def) {
            /// <summary>A simplified switch statement for returning values. Ex: __.switch(1, { 1: 'Hello', 2: 'World' }, 'Fail') == 'Hello'</summary>
            /// <param type="Value" name="value">Preferably a string or integer, it's compared with the keys of the hash to find a matching value.</param>
            /// <param type="Object" name="hash">Object hash where the keys are compared to the input value, if a match is found the keys corresponding value is returned.</param>
            /// <param type="Value" name="def">The default value returned if nothing else matches.</param>
            /// <returns type="Value">The value returned from the hash, or if no match is found the default is returned.</returns>
            var retval = hash[value];
            if(!me.is.set(retval))
                retval = def;
            if (me.is.function(retval)) 
                retval = retval(value, hash, def);
            return retval;
        };
        me.throttle = function (func, time) {
            time || (time = 250);
            var last, timer;
            return function () {
                var context = this,
                    now = +new Date(),
                    args = arguments;

                if (last && now < last + time) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        last = now;
                        func.apply(context, args);
                    }, time);
                } else {
                    last = now;
                    func.apply(context, args);
                }
            };
        };

        // Function Containers
        me.formats = {
            padleft: function(params) {
                var temp = params.value.toString();
                if (temp.length < params.places) {
                    temp += params.delim.toString();
                    params.value = temp;
                    return me.formats.padleft(params);
                } else 
                    return temp;
            },
            padright: function(params) {
                var temp = params.value.toString();
                if (temp.length < params.places) {
                    temp += params.delim.toString();
                    params.value = temp;
                    return me.formats.padright(params);
                } else 
                    return temp;
            }
        };
        me.is = {
            def: function (value) {
                /// <summary>Checks the value against the defined conditions which converts it to a boolean with result = Boolean(value); which means it will fail on empty strings, zeros and more.</summary>
                /// <param type="Value" name="value">Value to be checked.</param>
                /// <returns type="ConditionChain">A chain object, which contains many different functions, to get the boolean result simply call [chain].result. For more see the ConditionChain class.</returns>
                var ret = me.i.defaultConditions(value);
                return ret;
            },
            set: function (value) {
                /// <summary>Checks the value against the set conditions which checks it against undefined, null and NaN.</summary>
                /// <param type="Value" name="value">Value to be checked.</param>
                /// <returns type="ConditionChain">A chain object, which contains many different functions, to get the boolean result simply call [chain].result. For more see the ConditionChain class.</returns>
                var ret = me.i.setConditions(value);
                return ret;
            },
            sameType: function (var1, var2) {
                return me.getType(var1) == me.getType(var2);
            },
            function: function (object) {
                return me.getType(object) == me.types.function;
            },
            object: function (object) {
                return me.getType(object) == me.types.obj;
            },
            array: function (object) {
                return me.getType(object) == me.types.array;
            },
            args: function (object) {
                return me.getType(object) == me.types.args;
            },
            bool: function (object) {
                return me.getType(object) == me.types.bool;
            },
            string: function (object) {
                return me.getType(object) == me.types.string;
            },
            number: function (object) {
                return (me.getType(object) == me.types.integer) && !isNaN(object);
            },
            date: function(object) {
                return me.getType(object) == me.types.date;
            },
            null: function(object) {
                return me.getType(object) == me.types.null;
            },
            undefined: function(object) {
                return me.getType(object) == me.types.undefined;
            },
            nan: function(object) {
                return (me.getType(object) == me.types.integer) && isNaN(object);
            },
            regex: function(object) {
                return me.getType(object) == me.types.regex;
            }
        };
        me.math = {
            r16: function () {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            },
            roundTo: function (value, step) {
                return Math.round(value / step) * step;
            },
            roundDownTo: function (value, step) {
                return Math.floor(value / step) * step;
            },
            roundUpTo: function (value, step) {
                return Math.ceil(value / step) * step;
            },
            median: function (values, func) {
                var obj = values;
                if (func) 
                    obj = me.map(values, func);
                obj = me.sort(obj);
                var half = Math.floor(obj.length / 2);
                if (obj.length % 2) 
                    return obj[half];
                else 
                    return (obj[half - 1] + obj[half]) / 2.0;
            },
            sum: function (values, func) {
                var sum = 0;
                me.all(values, function (x) { 
                    sum += (func) ? func(x) : x; 
                });
                return sum;
            },
            average: function (values, func) {
                var sum = me.math.sum(values, func);
                if (sum > 0 || sum < 0) 
                    return sum / values.length;
                return 0;
            },
            max: function (values, func) {
                var ret = null;
                me.all(values, function(x) {
                    if(ret == null)
                        ret = x;
                    if(func) {
                        var temp = func(x);
                        if (temp > ret) 
                            ret = temp;
                    } else {
                        if (x > ret) 
                            ret = x;
                    }
                });
                return ret;
            },
            min: function (values, func) {
                var ret = null;
                me.all(values, function(x) {
                    if(ret == null)
                        ret = x;
                    if(func) {
                        var temp = func(x);
                        if (temp < ret) 
                            ret = temp;
                    } else {
                        if (x < ret) 
                            ret = x;
                    }
                });
                return ret;
            },
            between: function(value, min, max) {
                var top = max || 0,
                    bottom = min || 0;
                return Math.max(Math.min(parseFloat(value), top), bottom);
            },
            percentages: function (values, func) {
                var total = me.math.sum(values, func);
                return me.map(values, function(x, y) {
                    return (total != 0) ? (((func) ? func(x) : x) / total) : 0;
                });
            }
        };
        me.gen = {
            guid: me.scope(function() {
                var template = '{1}{2}{0}{3}{0}{4}{0}{5}{0}{6}{7}{8}';

                return function(options) {
                    var opt = {
                        separator: '-',
                        map: null
                    };
                    if(options)
                        me.fuse(opt, options);

                    var guid = template.format(opt.separator, me.math.r16(), me.math.r16(), me.math.r16(), me.math.r16(), me.math.r16(), me.math.r16(), me.math.r16(), me.math.r16());

                    if(me.is.object(opt.map)) {
                        if(opt.map[guid])
                            return me.gen.guid(opt);
                        else
                            opt.map[guid] = true;
                    }
                    return guid;
                };
            }),
            password: function(options) {
                var opt = me.options({
                    length: 16,
                    alpha: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYXZ",
                    ints: "0123456789",
                    special: "!@#$%^&*()+~|}{[]\:;?></="
                }, options);

                var temp = '',
                    len = (opt.length / 2) - 1,
                    lenspec = opt.length - len - len;

                for (var i = 0; i < len; i++)
                    temp += opt.alpha.charAt(Math.floor(Math.random() * opt.alpha.length));

                for (var i = 0; i < lenspec; i++)
                    temp += opt.special.charAt(Math.floor(Math.random() * opt.special.length));

                for (var i = 0; i < len; i++)
                    temp += opt.ints.charAt(Math.floor(Math.random() * opt.ints.length));

                return temp.split('').sort(function() { return 0.5 - Math.random(); }).join('');
            },
            number: function(max, min, noround) {
                max = __.is.set(max) ? max : 100;
                min = __.is.set(min) ? min : 0;
                if(!noround) {
                    max = Math.ceil(max);
                    min = Math.floor(min);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                return Math.random() * (max - min + 1) + min;
            },
            color: function(colors) {
                if(me.is.array(colors)) {
                    return colors[me.gen.number(colors.length) - 1];
                } else {
                    var letters = '0123456789ABCDEF';
                    var color = '#';
                    for (var i = 0; i < 6; i++ ) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }
            },
            date: function(start, end) {
                return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            }
        };
    };

    const __ = new iteratejs();

    // Overwrite Payload for __.fuse() deep updates, will overwrite target object/array instead of looping through it to deep copy it
    var Overwrite = __.class(function(payload) {
        this.i = payload;
        this._identifier = 'Replace Object';
    }, {
        content: function() {
            return this.i;
        }
    });

    // Base for __.fuse object.update() classes
    var Updatable = __.class(function() {}, {
        _identifier: {
            get: function() {
                return 'Config Object';
            }
        },
        update: function() {}
    });

    __.lib = {
        Overwrite: Overwrite,
        Updatable: Updatable
    };

    if( typeof module !== 'undefined' )
        module.exports = __;
    else if(typeof window !== 'undefined')
        window.__ = window.iterate = __;
})();