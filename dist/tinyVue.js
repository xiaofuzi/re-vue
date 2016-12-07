/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _main = __webpack_require__(3);
	
	var _main2 = _interopRequireDefault(_main);
	
	var _index = __webpack_require__(7);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TinyVue = function (_Main) {
	    _inherits(TinyVue, _Main);
	
	    function TinyVue(opts) {
	        _classCallCheck(this, TinyVue);
	
	        return _possibleConstructorReturn(this, (TinyVue.__proto__ || Object.getPrototypeOf(TinyVue)).call(this, opts));
	    }
	
	    /**
	     * 自定义指令
	     */
	
	
	    _createClass(TinyVue, null, [{
	        key: '$directive',
	        value: function $directive(name, fn) {
	            if (!fn) {
	                return _index2.default[name];
	            } else {
	                _index2.default[name] = fn;
	            }
	        }
	    }]);
	
	    return TinyVue;
	}(_main2.default);
	
	exports.default = TinyVue;
	
	
	window.TinyVue = TinyVue;

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _binding2 = __webpack_require__(4);
	
	var _binding3 = _interopRequireDefault(_binding2);
	
	var _watcher = __webpack_require__(14);
	
	var _watcher2 = _interopRequireDefault(_watcher);
	
	var _parser = __webpack_require__(5);
	
	var _observer = __webpack_require__(12);
	
	var _config = __webpack_require__(10);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _utils = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var prefix = _config2.default.prefix;
	
	
	/**
	 * Main class 
	 */
	var vmId = 0;
	
	var Main = function () {
	    function Main() {
	        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	        var parent = arguments[1];
	
	        _classCallCheck(this, Main);
	
	        /**
	         * this.$el:  根节点
	         * _bindings: 指令与data关联的桥梁
	         */
	        this.$el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
	        this.$parent = parent;
	        this.$children = [];
	        this.$id = vmId++;
	        /**
	         * @private
	         */
	        this._bindings = {};
	        this._opts = opts;
	        this._bindingData = {};
	
	        this.beforeCompiler();
	        this.init();
	
	        this.ready();
	    }
	
	    /**
	     * 初始化函数
	     */
	
	
	    _createClass(Main, [{
	        key: 'init',
	        value: function init() {
	            var _this = this;
	
	            var self = this;
	            var _data = this._bindingData = (0, _utils.extend)(this._opts.data, this._opts.methods, true);
	            (0, _utils.objectEach)(_data, function (path, item) {
	                _this._initReactive(path, item);
	            });
	
	            this._initComputed();
	            /**
	             * 指令处理
	             */
	            this._compileNode(this.$el);
	
	            /**
	             * vm响应式数据的初始化
	             */
	            for (var key in this._bindings) {
	                this.$set(key, (0, _utils.objectGet)(_data, key));
	            }
	
	            /**
	             * watch 函数注册
	             */
	            var _watches = this._opts.watch || {};
	            (0, _utils.objectEach)(_watches, function (key, cb) {
	                if (_this._bindings[key]) {
	                    _this.$watch(key, cb);
	                }
	            });
	        }
	
	        //public api
	
	    }, {
	        key: '$watch',
	        value: function $watch(key, cb) {
	            var _binding = this._bindings[key];
	            _binding.watches.push(cb);
	        }
	
	        /**
	         * turn an normal object to reactive obeject
	         */
	
	    }, {
	        key: '$reactive',
	        value: function $reactive() {
	            var _this2 = this;
	
	            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	            (0, _utils.objectEach)(_data, function (path, item) {
	                _this2._initReactive(path, item);
	            });
	        }
	    }, {
	        key: '$destroy',
	        value: function $destroy() {
	            this.remove();
	            (0, _utils.forEach)(this._bindings, function (binding) {
	                binding.destroy();
	            });
	            this.$parent = null;
	            this.$el.parentNode.removeChild(this.$el);
	        }
	
	        /**
	         * 生命周期函数
	         */
	
	    }, {
	        key: 'beforeCompiler',
	        value: function beforeCompiler() {
	            if (this._opts.beforeCompiler && typeof this._opts.beforeCompiler == 'function') {
	                this._opts.beforeCompiler.call(this);
	            }
	        }
	    }, {
	        key: 'ready',
	        value: function ready() {
	            if (this._opts.ready && typeof this._opts.ready == 'function') {
	                this._opts.ready.call(this);
	            }
	        }
	
	        /**
	         * @private
	         */
	
	    }, {
	        key: 'appendTo',
	        value: function appendTo(vm) {
	            this.$parent = vm;
	            vm.$children.push(this);
	        }
	    }, {
	        key: 'remove',
	        value: function remove() {
	            var _this3 = this;
	
	            this.$parent.$children = this.$parent.$children.filter(function (child) {
	                return child.$id != _this3.$id;
	            });
	        }
	    }, {
	        key: '_initComputed',
	        value: function _initComputed() {
	            var _this4 = this;
	
	            /**
	             * computed 属性预处理
	             */
	            var _computed = this._opts.computed || {},
	                self = this;
	
	            var _loop = function _loop(key) {
	                var computedGetter = _computed[key];
	                if (!(0, _utils.isFunc)(computedGetter)) {
	                    return 'continue';
	                }
	                var binding = void 0;
	                if (_this4._bindings[key]) {
	                    console.warn('Can not redefine ' + key + ' property.');
	                } else {
	                    var isComputed = true;
	                    binding = new _binding3.default(_this4, key, isComputed);
	                    _this4._bindings[key] = binding;
	                }
	
	                /**
	                 * 计算属性依赖监测
	                 */
	                var watcher = new _watcher2.default(binding);
	                _observer.observer.isObserving = true;
	                watcher.getDeps();
	                computedGetter.call(_this4);
	                _observer.observer.isObserving = false;
	                watcher.watch();
	
	                /**
	                 * 初始化,等待值初始化完毕后在获取计算computed的值
	                 */
	                setTimeout(function () {
	                    binding.update(binding.value);
	                }, 0);
	            };
	
	            for (var key in _computed) {
	                var _ret = _loop(key);
	
	                if (_ret === 'continue') continue;
	            }
	        }
	    }, {
	        key: '_compileNode',
	        value: function _compileNode(el) {
	            var self = this;
	            var isCompiler = true;
	
	            /**
	             * 过滤注释节点
	             */
	            if (el.nodeType === 8) {
	                return;
	            }
	
	            if (el.nodeType === 3) {
	                self._compileTextNode(el);
	            } else if (el.attributes && el.attributes.length) {
	                getAttributes(el.attributes).forEach(function (attr) {
	                    var directive = _parser.DirectiveParser.parse(attr.name, attr.value);
	
	                    if (directive) {
	                        if (_parser.DirectiveParser.directives[directive.name].isBlock) {
	                            isCompiler = false;
	                        }
	
	                        directive.vm = self;
	                        self._bind(el, directive);
	                    }
	                });
	            }
	
	            var len = el.childNodes.length;
	            if (isCompiler && len) {
	                el.index = 0;
	                for (; el.index < el.childNodes.length; el.index++) {
	                    /**
	                     * el.index 表示当前第几个子元素,在_compileNode函数中可能会更改el的子元素结构，
	                     * 所以需要el.index来标识编译的节点索引
	                     */
	                    var child = el.childNodes[el.index];
	                    self._compileNode(child);
	                }
	            }
	        }
	    }, {
	        key: '_compileTextNode',
	        value: function _compileTextNode(el) {
	            return el;
	        }
	
	        /**
	         * bind directive
	         */
	
	    }, {
	        key: '_bind',
	        value: function _bind(el, directive) {
	            var self = this,
	                isParentVm = false;
	            el.removeAttribute(prefix + '-' + directive.name);
	            directive.el = el;
	            //console.log('directive: ', this, directive);
	            var key = directive.key,
	                binding = this._getBinding(this, key);
	
	            processBinding(key);
	            /**
	             * directive hook
	             */
	            if (directive.bind) {
	                directive.bind();
	            }
	
	            if (!binding) {
	                /**
	                 * computed property binding hack
	                 * 针对计算属性子属性
	                 */
	
	                //get computed property key
	                var computedKey = key.split('.')[0];
	                binding = this._getBinding(this, computedKey);
	                processBinding(computedKey);
	                if (binding.isComputed) {
	                    binding.directives.push(directive);
	                } else {
	                    console.log('directive: ', this, directive);
	                    console.error(key + ' is not defined.');
	                }
	            } else {
	                binding.directives.push(directive);
	            }
	
	            /**
	             * 子 vm bingding时更新DOM
	             */
	            if (isParentVm) {
	                binding.update();
	            }
	
	            function processBinding(key) {
	                /**
	                 * 根据model值是否在当前viewModel从而做不同的处理
	                 */
	                if (binding === true) {
	                    binding = self._bindings[key];
	                } else if ((0, _utils.isObject)(binding)) {
	                    isParentVm = true;
	                    var parentBinding = binding.binding;
	                    binding = self._createBinding(key);
	                    binding.appendTo(parentBinding);
	                }
	            }
	        }
	    }, {
	        key: '_createBinding',
	        value: function _createBinding(key, ctx) {
	            this._bindings[key] = new _binding3.default(ctx || this, key);
	            return this._bindings[key];
	        }
	
	        /**
	         * init reactive data
	         */
	
	    }, {
	        key: '_initReactive',
	        value: function _initReactive(path, value) {
	            var _this5 = this;
	
	            var binding = void 0;
	            if (this._bindings[path]) {
	                return;
	            }
	
	            if ((0, _utils.isObject)(value)) {
	                binding = this._createBinding(path);
	
	                var bindings = (0, _utils.objectMap)(value, function (key, item) {
	                    var childBinding = _this5._initReactive(path + '.' + key, item);
	                    childBinding.parent = binding;
	                    return childBinding;
	                });
	                binding.children = bindings;
	            } else {
	                binding = this._createBinding(path);
	            }
	
	            return binding;
	        }
	
	        /**
	         * vm binding 获取，支持继承
	        */
	
	    }, {
	        key: '_getBinding',
	        value: function _getBinding(vm, key) {
	            if (this._bindings[key]) {
	                return true;
	            }
	
	            if (!vm) {
	                return false;
	            }
	
	            var binding = vm._bindings[key];
	            if (binding) {
	                return {
	                    binding: binding,
	                    vm: vm,
	                    key: key
	                };
	            } else {
	                return this._getBinding(vm.$parent, key);
	            }
	        }
	    }, {
	        key: '$get',
	        value: function $get(path) {
	            return (0, _utils.objectGet)(this, path);
	        }
	    }, {
	        key: '$set',
	        value: function $set(path, value) {
	            return (0, _utils.objectSet)(this, path, value);
	        }
	    }]);
	
	    return Main;
	}();
	
	/**************************************************************
	 * @privete
	 * helper methods
	 */
	
	/**
	 * 获取节点属性
	 * 'v-text'='counter' => {name: v-text, value: 'counter'}
	 */
	
	
	exports.default = Main;
	function getAttributes(attributes) {
	    return (0, _utils.map)(attributes, function (attr) {
	        return {
	            name: attr.name,
	            value: attr.value
	        };
	    });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _parser = __webpack_require__(5);
	
	var _utils = __webpack_require__(11);
	
	var _observer = __webpack_require__(12);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var def = Object.defineProperty;
	
	var bindingId = 0;
	
	var Binding = function () {
	    function Binding(vm, key) {
	        var isComputed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        _classCallCheck(this, Binding);
	
	        this.vm = vm;
	        this.key = key;
	        this.isComputed = isComputed;
	        this.watches = [];
	
	        this.directives = [];
	        this.parent = null;
	        this.children = [];
	
	        /**
	         * for computed property
	         */
	        this.watcher = null;
	        /**
	         * init 
	         */
	        /**
	         * vm不存在的Binding可watch其它Binding从而触发更新
	         */
	        if (this.vm) {
	            this.defineReactive();
	        }
	
	        this.id = bindingId++;
	    }
	
	    _createClass(Binding, [{
	        key: 'defineReactive',
	        value: function defineReactive() {
	            if (this.isComputed) {
	                this.defineComputedProperty();
	                return;
	            }
	
	            var self = this;
	            var path = this.key.split('.');
	            var len = path.length;
	
	            var obj = void 0,
	                key = void 0,
	                currentBindingData = (0, _utils.objectGet)(this.vm._bindingData, this.key),
	                isObj = (0, _utils.isObject)(currentBindingData),
	                isArray = Array.isArray(currentBindingData);
	
	            if (len === 1) {
	                obj = this.vm;
	                key = this.key;
	                self.value = isObj ? (0, _utils.objectGet)(this.vm, key) : '';
	            } else {
	                var lastKey = path.splice(path.length - 1);
	                obj = (0, _utils.objectGet)(this.vm, path.join('.'));
	                key = lastKey[0];
	
	                self.value = isObj ? (0, _utils.objectGet)(this.vm, key) : '';
	            }
	
	            def(obj, key, {
	                get: function get() {
	                    _observer.observer.isObserving && _observer.observer.emit('get', self);
	                    return self.value;
	                },
	                set: function set(value) {
	                    if (value !== self.value) {
	                        self.oldValue = self.value;
	                        if (isArray) {
	                            self.value = value;
	                            self.update(value);
	                        } else if (isObj) {
	                            for (var prop in value) {
	                                self.value[prop] = value[prop];
	                            }
	                        } else {
	                            self.value = value;
	                            self.update(value);
	                        }
	                        _observer.observer.emit(self.key, self);
	                        self.refresh();
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'defineComputedProperty',
	        value: function defineComputedProperty() {
	            var key = this.key,
	                obj = this.vm,
	                self = this;
	
	            def(obj, key, {
	                get: function get() {
	                    var getter = self.vm._opts.computed[key];
	                    if ((0, _utils.isFunc)(getter)) {
	                        self.value = getter.call(self.vm);
	
	                        return self.value;
	                    }
	                },
	                set: function set() {
	                    //console.warn('computed property is readonly.');
	                }
	            });
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	
	            if (value === null) {
	                value = this.value;
	            }
	
	            var self = this;
	            this.directives.forEach(function (directive) {
	                /**
	                 * 计算属性绑定对应于多个不同key的指令，所以值需要动态获取
	                 */
	                if (self.isComputed) {
	                    directive.update((0, _utils.objectGet)(self.vm, directive.key));
	                } else {
	                    directive.update(value);
	                }
	            });
	
	            this._updateChildren();
	        }
	    }, {
	        key: 'refresh',
	        value: function refresh() {
	            var _this = this;
	
	            if (this.isComputed) {
	                this.update(this.vm[this.key]);
	            }
	            /**
	             * notify parent
	             */
	            if (this.parent) {
	                this.parent.refresh();
	            }
	
	            this.watches.forEach(function (cb) {
	                cb.call(_this.vm, _this.value, _this.oldValue);
	            });
	        }
	    }, {
	        key: 'add',
	        value: function add(childBinding) {
	            this.children.push(childBinding);
	            childBinding.parent = this;
	            childBinding.value = this.value;
	        }
	    }, {
	        key: 'appendTo',
	        value: function appendTo(parentBinding) {
	            parentBinding.children.push(this);
	            this.parent = parentBinding;
	            this.value = parentBinding.value;
	        }
	    }, {
	        key: 'remove',
	        value: function remove(childBinding) {
	            this.children = this.children.filter(function (child) {
	                return child.id != childBinding.id;
	            });
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.parent.remove(this);
	            this.parent = null;
	        }
	    }, {
	        key: '_updateChildren',
	        value: function _updateChildren() {
	            var _this2 = this;
	
	            this.children.forEach(function (child) {
	                child.update(_this2.value);
	            });
	        }
	    }]);
	
	    return Binding;
	}();
	
	exports.default = Binding;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DirectiveParser = undefined;
	
	var _directiveParser = __webpack_require__(6);
	
	var _directiveParser2 = _interopRequireDefault(_directiveParser);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.DirectiveParser = _directiveParser2.default;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _index = __webpack_require__(7);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _config = __webpack_require__(10);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var prefix = _config2.default.prefix;
	
	var DirectiveParser = function () {
	    function DirectiveParser(directiveName, arg, expression) {
	        _classCallCheck(this, DirectiveParser);
	
	        /**
	         * v-on:click="onChange"
	           directiveName = 'v-on:click'
	           expression = 'onChange'
	         */
	
	        this.key = expression.trim();
	        this.name = directiveName;
	        this.arg = arg;
	
	        var directive = _index2.default[directiveName];
	
	        if (typeof directive === 'function') {
	            this.update = directive;
	        } else {
	            for (var prop in directive) {
	                if (prop === 'update') {
	                    this.update = directive.update;
	                }
	                this[prop] = directive[prop];
	            }
	        }
	
	        /**
	         * directive expression process
	         */
	        if (this.name == 'for') {
	            this.rawKey = this.key;
	            var keyArray = this.rawKey.split(' ');
	
	            if (keyArray.length != 3) {
	                console.log('Invalid expression of v-for');
	            }
	            this.key = keyArray[2];
	            this.subKey = keyArray[0];
	        }
	    }
	
	    _createClass(DirectiveParser, null, [{
	        key: 'parse',
	        value: function parse(directiveName, expression) {
	            if (directiveName.indexOf(prefix + '-') === -1) {
	                return null;
	            }
	
	            /**
	             * 指令解析
	               v-on:click='onClick'
	               这里的指令名称为 'on', 'click'为指令的参数，onClick 为key
	             */
	
	            //移除 'v-' 前缀, 提取指令名称、指令参数
	            var directiveInfo = directiveName.slice(prefix.length + 1).split(':');
	            directiveName = directiveInfo[0];
	            var directiveArg = directiveInfo[1] ? directiveInfo[1] : null;
	            var directive = _index2.default[directiveName];
	
	            /**
	             * 指令校验
	             */
	            if (!directive) {
	                console.warn('unknown directive: ' + directiveName);
	            }
	
	            return directive ? new DirectiveParser(directiveName, directiveArg, expression) : null;
	        }
	    }]);
	
	    return DirectiveParser;
	}();
	
	DirectiveParser.directives = _index2.default;
	exports.default = DirectiveParser;
	;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _vIf = __webpack_require__(8);
	
	var _vIf2 = _interopRequireDefault(_vIf);
	
	var _vFor = __webpack_require__(9);
	
	var _vFor2 = _interopRequireDefault(_vFor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Directives
	 */
	
	exports.default = {
	    /**
	     * 对应于 v-text 指令
	     */
	    text: function text(value) {
	        this.el.textContent = value || '';
	    },
	    /**
	     * 对应于 v-model 指令
	     */
	    model: function model(value) {
	        var eventName = 'keyup',
	            el = this.el,
	            self = this;
	        el.value = value || '';
	
	        /**
	         * 事件绑定控制
	         */
	        if (el.handlers && el.handlers[eventName]) {
	            el.removeEventListener(eventName, el.handlers[eventName]);
	        } else {
	            el.handlers = {};
	        }
	
	        el.handlers[eventName] = function (e) {
	            self[key] = e.target.value;
	        };
	
	        el.addEventListener(eventName, el.handlers[eventName]);
	    },
	    on: {
	        update: function update(handler) {
	            var eventName = this.arg,
	                el = this.el;
	
	            if (!this.handlers) {
	                this.handlers = {};
	            }
	
	            var handlers = this.handlers;
	
	            if (handlers[eventName]) {
	                //绑定新的事件前移除原绑定的事件函数
	                el.removeEventListener(eventName, handlers[eventName]);
	            }
	            //绑定新的事件函数
	            if (handler) {
	                handler = handler.bind(this.vm);
	                el.addEventListener(eventName, handler);
	                handlers[eventName] = handler;
	            }
	        }
	    },
	    if: _vIf2.default,
	    for: _vFor2.default,
	    each: {
	        update: function update(arr) {}
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _main = __webpack_require__(3);
	
	var _main2 = _interopRequireDefault(_main);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * if directive
	 */
	exports.default = {
	    isBlock: true,
	    bind: function bind() {
	        this.parent = this.el.parentNode;
	        this.startRef = document.createComment('Start of v-if-directive');
	        this.endRef = document.createComment('End of v-if-directive');
	
	        var next = this.el.nextSibling;
	        if (next) {
	            this.parent.insertBefore(this.startRef, next);
	            this.parent.insertBefore(this.endRef, next);
	        } else {
	            this.parent.appendChild(this.startRef);
	            this.parent.appendChild(this.endRef);
	        }
	    },
	    update: function update(value) {
	        if (value) {
	            this.createDirectiveInstance();
	        } else {
	            this.parent.removeChild(this.el);
	            this.childVm && this.childVm.remove();
	        }
	    },
	    createDirectiveInstance: function createDirectiveInstance() {
	        if (this.childVm) {
	            this.childVm = null;
	        }
	
	        var node = this.el,
	            parentVm = this.vm;
	        this.parent.insertBefore(node, this.endRef);
	
	        var childVm = new _main2.default({
	            el: node
	        }, this.vm);
	        /**
	         * 给 if 指令新建一个vm实例，该实例与父实例共享同一个上下文
	         */
	        childVm.__proto__ = parentVm;
	        childVm.appendTo(parentVm);
	        console.log('childVm: ', childVm);
	        this.childVm = childVm;
	    }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _main = __webpack_require__(3);
	
	var _main2 = _interopRequireDefault(_main);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * v-for directive
	 */
	exports.default = {
	    /**
	     * 单独进行编译
	     */
	    isBlock: true,
	    bind: function bind() {
	        this.parent = this.el.parentNode;
	        this.startRef = document.createComment('Start of v-for-directive');
	        this.endRef = document.createComment('End of v-for-directive');
	
	        var next = this.el.nextSibling;
	        if (next) {
	            this.parent.insertBefore(this.startRef, next);
	            this.parent.insertBefore(this.endRef, next);
	        } else {
	            this.parent.appendChild(this.startRef);
	            this.parent.appendChild(this.endRef);
	        }
	
	        this.parent.removeChild(this.el);
	        this.parent.index++;
	
	        this.childElements = [];
	        this.childVms = [];
	    },
	    update: function update() {
	        var _this = this;
	
	        var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	
	        this.unbind();
	        arr.forEach(function (item, index) {
	            _this.createChildInstance(item, index);
	        });
	    },
	    createChildInstance: function createChildInstance(item, index) {
	        var vm = void 0,
	            node = this.el.cloneNode(true);
	
	        this.parent.insertBefore(node, this.endRef);
	        this.parent.index++;
	
	        /**
	         * array item data process
	         */
	        var data = {};
	        data[this.subKey] = item;
	        console.log('child vm: ', this);
	        vm = new _main2.default({
	            el: node,
	            data: data
	        }, this.vm);
	        vm.__proto__ = this.$vm;
	
	        vm.appendTo(this.vm);
	        this.childElements[index] = node;
	        this.childVms[index] = vm;
	    },
	    unbind: function unbind() {
	        if (this.childVms.length != 0) {
	            this.childVms.forEach(function (child) {
	                child.$destroy();
	            });
	        }
	    }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    prefix: 'v'
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.typeOf = typeOf;
	exports.isObject = isObject;
	exports.isFunc = isFunc;
	exports.forEach = forEach;
	exports.map = map;
	exports.extend = extend;
	exports.objectEach = objectEach;
	exports.objectMap = objectMap;
	exports.objectGet = objectGet;
	exports.objectSet = objectSet;
	exports.defer = defer;
	/**
	 * type
	 */
	var toString = Object.prototype.toString;
	function typeOf(obj) {
	    return toString.call(obj).slice(8, -1);
	}
	
	function isObject(obj) {
	    return typeOf(obj) === 'Object' ? true : false;
	}
	
	function isFunc(obj) {
	    return typeOf(obj) === 'Function' ? true : false;
	}
	
	/*******************************************************
	 * 数组相关
	 */
	function forEach() {
	    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var cb = arguments[1];
	
	    [].forEach.call(arr, cb);
	}
	
	function map() {
	    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var cb = arguments[1];
	
	    return [].map.call(arr, cb);
	}
	
	/*******************************************************
	 * 对象相关
	 */
	
	/**
	 * 对象继承
	 */
	function extend(child, parent) {
	    var isNew = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	    parent = parent || {};
	    child = child || {};
	
	    if (isNew) {
	        var _ret = function () {
	            var ret = {};
	            objectEach(child, function (key, value) {
	                ret[key] = value;
	            });
	
	            objectEach(parent, function (key, value) {
	                ret[key] = value;
	            });
	
	            return {
	                v: ret
	            };
	        }();
	
	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    } else {
	        objectEach(parent, function (key, value) {
	            child[key] = value;
	        });
	        return child;
	    }
	}
	
	/**
	 * 对象遍历
	 */
	function objectEach() {
	    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
	
	    Object.keys(obj).forEach(function (key) {
	        cb(key, obj[key]);
	    });
	}
	
	function objectMap() {
	    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
	
	    return Object.keys(obj).map(function (key) {
	        return cb(key, obj[key]);
	    });
	}
	
	/**
	 * Object extend
	 */
	function objectGet(obj) {
	    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	    path = path.split('.');
	
	    if (obj[path[0]] == undefined) {
	        obj[path[0]] = {};
	    }
	
	    if (path.length == 1) {
	        return obj[path[0]];
	    } else {
	        return objectGet(obj[path[0]], path.slice(1).join('.'));
	    }
	};
	
	function objectSet(obj) {
	    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	    var value = arguments[2];
	
	    path = path.split('.');
	    if (path.length == 1) {
	        obj[path[0]] = value;
	    } else {
	        obj[path[0]] = obj[path[0]] || {};
	        objectSet(obj[path[0]], path.slice(1).join('.'), value);
	    }
	};
	
	function defer(fn) {
	    var Timer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	    setTimeout(function () {
	        fn();
	    }, Timer);
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.arrayObserver = exports.observer = undefined;
	
	var _event = __webpack_require__(13);
	
	var _event2 = _interopRequireDefault(_event);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var observer = new _event2.default();
	
	/**
	 * Array observer
	 */
	var arrProto = Array.prototype,
	    mutationMethods = ['pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort'];
	
	function arrayObserver(arr, cb) {
	    mutationMethods.forEach(function (method) {
	        arr[method] = function () {
	            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
	                rest[_key] = arguments[_key];
	            }
	
	            arrProto[method].apply(this, rest);
	
	            cb && cb({
	                event: method,
	                args: rest,
	                array: arr
	            });
	        };
	    });
	}
	
	exports.observer = observer;
	exports.arrayObserver = arrayObserver;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var slice = [].slice;
	
	/*
	* event control class
	* @param {context}
	*/
	
	function Event(ctx) {
	    this._ctx = ctx || this;
	    this._events = {};
	}
	
	var EventProto = Event.prototype;
	
	/*
	* bind a event
	* @param {event} eventType
	* @param {fn} function
	*/
	EventProto.on = function (event, fn) {
	    this._events[event] = this._events[event] || [];
	    this._events[event].push(fn);
	
	    return this;
	};
	
	/*
	* bind an event but only called one time
	* @param {event} eventType
	* @param {fn} function
	*/
	EventProto.once = function (event, fn) {
	    var self = this;
	
	    //when fn is called, remove all event listener
	    function fnWrap() {
	        self.off(event, fnWrap);
	        fn.apply(this, arguments);
	    }
	
	    //to specifiy remove method
	    fnWrap.fn = fn;
	    this.on(event, fnWrap);
	    return this;
	};
	
	/*
	* unbind an event  
	* @param {event} eventType
	* @param {fn} function
	*/
	
	EventProto.off = function (event, fn) {
	    //remove all events
	    if (!arguments) {
	        this._events = {};
	        return this;
	    }
	
	    //there are not fn binded
	    var events = this._events[event];
	    if (!events) return this;
	
	    //remove an type events
	    if (arguments.length === 1 && typeof event === 'string') {
	        delete this._events[event];
	        return this;
	    }
	
	    //remove fn
	    var handler;
	    for (var i = 0; i < events.length; i++) {
	        handler = events[i];
	        if (handler === fn || handler.fn === fn) {
	            events.splice(i, 1);
	            break;
	        }
	    }
	    return this;
	};
	
	/*
	* emit
	* @param {event}
	* @param {fn param}
	*/
	EventProto.emit = function (event) {
	    var _this = this;
	
	    var events = this._events[event],
	        args;
	    if (events) {
	        events = events.slice(0);
	        args = slice.call(arguments, 1);
	        events.forEach(function (event) {
	            event.apply(_this._ctx, args);
	        });
	    }
	    return this;
	};
	
	exports.default = Event;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _observer = __webpack_require__(12);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * watcher a key
	 */
	
	var Watcher = function () {
	    function Watcher(binding) {
	        _classCallCheck(this, Watcher);
	
	        binding.watcher = this;
	
	        this.binding = binding;
	        this.dependencies = [];
	    }
	
	    _createClass(Watcher, [{
	        key: 'getDeps',
	        value: function getDeps() {
	            var _this = this;
	
	            _observer.observer.on('get', function (dep) {
	                _this.dependencies.push(dep);
	            });
	        }
	    }, {
	        key: 'off',
	        value: function off() {
	            _observer.observer.off('get');
	        }
	    }, {
	        key: 'watch',
	        value: function watch() {
	            var self = this;
	            this.dependencies.forEach(function (dep) {
	                _observer.observer.on(dep.key, function () {
	                    self.binding.refresh();
	                });
	            });
	        }
	    }]);
	
	    return Watcher;
	}();
	
	exports.default = Watcher;

/***/ }
/******/ ]);
//# sourceMappingURL=tinyVue.js.map