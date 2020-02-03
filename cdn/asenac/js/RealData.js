/**
 + 1. get, set
 + 2. getParent
 + 3. Proxy Create
 * 4. callOut
 * 5. callIn
 + 6. trigger
 + 7. on
 *
 */
var RealData;
(function (RealData_1) {
    RealData_1._DEBUG_MODE_ = false;
    RealData_1._REAL_DATA_ = Symbol("REAL_DATA");
    RealData_1._NONE_ = Symbol("NONE");
    const _SELF_ = Symbol("SELF");
    const _ARRAY_ = Symbol("ARRAY");
    const _OBJECT_ = Symbol("OBJECT");
    RealData_1._PATH_ = Symbol("PATH");
    class RealData {
        constructor(data) {
            this._data = {};
            this.hooks = [];
            this.hookId = 0;
            this.data = data;
        }
        static removeEvent(publicHookId) {
            if (publicHookId in RealData.triggers) {
                let trig = RealData.triggers[publicHookId];
                trig.realData.removeEvent(trig.hookId);
            }
            else {
            }
        }
        get data() {
            return this._data;
        }
        set data(v) {
            this.CreateProxy("", v);
        }
        /**
         * Return data at path, if not found return *def*
         * @param path path string
         * @param def Default _NONE_
         */
        get(path, def = RealData_1._NONE_) {
            path = path.replaceAll("//", "/");
            if (path == "/" || path == "")
                return this._data;
            let list = path.split("/");
            list.popAt(0);
            return cval(this._data, list, def);
        }
        getParent(path) {
            if (path == "/" || path == "")
                return { self: this, key: "_data" };
            let list = path.split("/");
            list.popAt(0);
            let ret = {};
            ret.key = list.popAt();
            ret.self = cval(this._data, list, RealData_1._NONE_);
            if (ret.self == RealData_1._NONE_)
                ret.key = RealData_1._NONE_;
            return ret;
        }
        CreateProxy(path, data = this.get(path)) {
            let parent_and_key = this.getParent(path);
            let that = this;
            //console.log("Create Proxy:",path,parent_and_key)
            if (!(data instanceof Node)) {
                if (data instanceof Array) {
                    // ### ARRAY ###
                    // If data is Proxy return
                    if (_SELF_ in data)
                        return data;
                    // If data is not proxy, create ARRAY proxy
                    let proxy = new Proxy(data, {
                        get: function (target, _key, rec) {
                            if (_key == _SELF_)
                                return target;
                            if (_key == _ARRAY_)
                                return true;
                            if (_key == RealData_1._PATH_) {
                                return path;
                            }
                            if (_key == RealData_1._REAL_DATA_) {
                                return that;
                            }
                            const val = target[_key];
                            if (typeof val === 'function') {
                                if (_key == "push") { // Add Last
                                    return function (el) {
                                        let len = target.length;
                                        let ret = Array.prototype[_key].apply(target, arguments);
                                        // ReCreateProxy
                                        for (let i = len; i < ret; i++) {
                                            that.CreateProxy(path + "/" + i);
                                        }
                                        that.callOut({
                                            type: "ArrayAdd",
                                            path: path,
                                            data: Array.from(arguments),
                                            start: len,
                                            count: arguments.length
                                        });
                                        return ret;
                                    };
                                }
                                if (_key == "unshift") { // Add Last
                                    return function (el) {
                                        let ret = Array.prototype[_key].apply(target, arguments);
                                        // ReCreateProxy
                                        for (let i = 0; i < arguments.length; i++) {
                                            that.CreateProxy(path + "/" + i);
                                        }
                                        that.callOut({
                                            type: "ArrayAdd",
                                            path: path,
                                            data: Array.from(arguments),
                                            start: 0,
                                            count: arguments.length
                                        });
                                        return ret;
                                    };
                                }
                                if ('pop' == _key) {
                                    return function () {
                                        const el = Array.prototype[_key].apply(target, arguments);
                                        if (RealData_1._DEBUG_MODE_)
                                            console.log("----", el);
                                        that.callOut({
                                            type: "ArrayRemove",
                                            path: path,
                                            data: [el],
                                            start: target.length,
                                            count: 1
                                        });
                                        return el;
                                    };
                                }
                                if ('splice' == _key) {
                                    return function (args) {
                                        let start = arguments[0];
                                        let deleteCount = arguments[1] ? arguments[1] : target.length - start;
                                        let items = Array.from(arguments).slice(2);
                                        const el = Array.prototype[_key].apply(target, arguments);
                                        if (deleteCount > 0)
                                            that.callOut({
                                                type: "ArrayRemove",
                                                path: path,
                                                start: start,
                                                count: deleteCount,
                                                data: target.slice(start, deleteCount)
                                            });
                                        if (items.length > 0)
                                            that.callOut({
                                                type: "ArrayAdd",
                                                path: path,
                                                start: start,
                                                data: items,
                                                count: items.length
                                            });
                                        return el;
                                    };
                                }
                                //return Array.prototype[_key].bind(target,arguments);
                                return val.bind(proxy);
                            }
                            return val;
                        },
                        set: function (target, _key, value, rec) {
                            /* Set Array */
                            that.CreateProxy(path + "/" + _key, value);
                            that.callOut({
                                type: "Define",
                                path: path + "/" + _key,
                                data: value
                            }, false);
                            return true;
                        },
                        has: function (target, p) {
                            if (p == _SELF_)
                                return true;
                            if (p == RealData_1._PATH_)
                                return true;
                            return p in target;
                        }
                    });
                    // on trigger Requirsive
                    var _oldArray = this.get(path, []);
                    //console.warn("old Array", _oldArray)
                    if (_oldArray != null) {
                        that.trigger({
                            type: "ArrayRemove",
                            path: path,
                            start: 0,
                            count: _oldArray.length,
                            data: _oldArray
                        });
                    }
                    //console.log("Atama Listeden", parent_and_key);
                    if (cval(parent_and_key.self, [_SELF_], null)) {
                        parent_and_key.self[_SELF_][parent_and_key.key] = proxy;
                    }
                    else {
                        parent_and_key.self[parent_and_key.key] = proxy;
                    }
                    // on trigger Requirsive
                    that.trigger({
                        type: "ArrayAdd",
                        path: path,
                        start: 0,
                        data: proxy[_SELF_],
                        count: proxy[_SELF_].length
                    });
                    that.trigger({
                        type: "Define",
                        path: path,
                        data: proxy
                    });
                    // Recreate Proxy for All Children
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const element = data[key];
                            this.CreateProxy(path + "/" + key, element);
                        }
                    }
                    return proxy;
                }
                else if (data instanceof Object) {
                    // OBJECT
                    // If data is Proxy return
                    if (_SELF_ in data) {
                        return data;
                    }
                    // If data is not proxy, create proxy
                    let proxy = new Proxy(data, {
                        get: function (target, _key, rec) {
                            if (_key == _SELF_)
                                return target;
                            if (_key == _OBJECT_)
                                return true;
                            if (_key == RealData_1._PATH_)
                                return path;
                            if (_key == RealData_1._REAL_DATA_) {
                                return that;
                            }
                            return target[_key];
                        },
                        set: function (target, _key, value, rec) {
                            /* Set Object */
                            that.CreateProxy(path + "/" + _key, value);
                            //console.log("Atama Object Proxy Set ten")
                            that.callOut({
                                type: "Define",
                                path: path + "/" + _key,
                                data: value
                            }, false);
                            return true;
                        },
                        has: function (target, p) {
                            if (p == _SELF_)
                                return true;
                            if (p == RealData_1._PATH_)
                                return true;
                            return p in target;
                        }
                    });
                    // Detect Old Value Change
                    var _oldObject = this.get(path);
                    //console.log("Atama Nesneden",parent_and_key);
                    if (cval(parent_and_key.self, [_SELF_], null)) {
                        parent_and_key.self[_SELF_][parent_and_key.key] = proxy;
                    }
                    else {
                        parent_and_key.self[parent_and_key.key] = proxy;
                    }
                    // Detect Old Value Change
                    if (_oldObject != RealData_1._NONE_) {
                        that.trigger({
                            type: "Define",
                            path: path,
                            data: proxy
                        });
                    }
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const element = data[key];
                            this.CreateProxy(path + "/" + key, element);
                        }
                    }
                    return proxy;
                }
            }
            // Detect Old Value Change
            var _oldValue = this.get(path);
            //console.log("Atama doğrudan");
            if (cval(parent_and_key.self, [_SELF_], null)) {
                parent_and_key.self[_SELF_][parent_and_key.key] = data;
            }
            else {
                parent_and_key.self[parent_and_key.key] = data;
            }
            // Detect Old Value Change
            if (_oldValue != RealData_1._NONE_) {
                that.trigger({
                    type: "Define",
                    path: path,
                    data: data
                });
            }
            return data;
        }
        /**
         * CallOut is detect change from proxy trigger, call to server change.
         */
        callOut(type, callTrigger = true) {
            // Goto Server
            if (callTrigger) {
                this.trigger(type);
            }
        }
        /**
         * Call queue from server
         */
        callIn(type) {
            // From Server Change
        }
        on(path, fn) {
            this.hookId++;
            this.hooks.push({ path: path.replaceAll(/\/+/, "/"), fn: fn, id: this.hookId });
            RealData.triggerIndex++;
            RealData.triggers[RealData.triggerIndex] = { realData: this, hookId: this.hookId };
            return this.hookId;
        }
        trigger(type) {
            if (RealData_1._DEBUG_MODE_)
                console.log("O::", type);
            // HOOKING FILTRELEME BÖLÜMÜ
            var path = type.path;
            if (type.type == "ArrayAdd")
                path += "/+";
            if (type.type == "ArrayRemove")
                path += "/-";
            if (type.type == "ArrayAdd" || type.type == "ArrayRemove") {
                this.trigger({
                    type: "Define",
                    path: type.path + "/length",
                    data: this.get(type.path + "/length")
                });
            }
            var hooks = this.hooks.filter((e) => e.path == path);
            for (let i = 0; i < hooks.length; i++) {
                const hook = hooks[i];
                if (type.type == "ArrayAdd") {
                    hook.fn(type.data, type.start, type.count);
                }
                if (type.type == "Define") {
                    hook.fn(type.data);
                }
                if (type.type == "ArrayRemove") {
                    hook.fn(type.data, type.start, type.count);
                }
            }
        }
        /**
         * removeEvent
         */
        removeEvent(eventId) {
            try {
                if (typeof (eventId) == "number") {
                    var _remId = this.hooks.findIndex(e => e.id == eventId);
                    if (_remId > -1)
                        this.hooks.popAt(_remId);
                }
                if (eventId instanceof Array) {
                    for (let i = 0; i < eventId.length; i++) {
                        const id = eventId[i];
                        var _remId = this.hooks.findIndex(e => e.id == id);
                        if (_remId > -1)
                            this.hooks.popAt(_remId);
                    }
                }
            }
            catch (e) {
                console.warn(eventId);
            }
        }
    }
    RealData.triggers = {};
    RealData.triggerIndex = 0;
    RealData_1.RealData = RealData;
    function GetRealData(param) {
        if (typeof param == "object" && RealData_1._REAL_DATA_ in param) {
            return param[RealData_1._REAL_DATA_];
        }
        return null;
    }
    RealData_1.GetRealData = GetRealData;
    function Self(params) {
        if (typeof params == "object" && _SELF_ in params) {
            return params[_SELF_];
        }
        return params;
    }
    RealData_1.Self = Self;
})(RealData || (RealData = {}));
