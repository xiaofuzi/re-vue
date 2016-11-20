## tiny-vue

rewrite vue.js.

包含一个比较完整的基本项目，webpack打包、mocha测试、eslint代码校验.

[online demo](http://yangxiaofu.com/re-vue/examples/tiny-vue.html)

[实现原理分析:https://github.com/xiaofuzi/deep-in-vue](https://github.com/xiaofuzi/deep-in-vue)

### 特性

* 双向绑定
* 计算属性
* 事件支持
* watch监测
* 生命周期函数
* 自定义指令

### Usage

example:

```html
<div id="app">
    <h2 v-text='hello' v-visible='isShow'></h2>
    <input type="text" v-model='counter'>
    <button v-on:click='add' type="button">add</button>        
    <button v-on:click='toggle' type="button">toggle</button>
    <p v-text='counter'></p>
    <p v-text='info.age'></p>
    <p v-text='wellcome.text'></p>
</div>
```

```js
var mvvm;
var opts = {
    el: '#app',
    data: {
        isShow: false,
        counter: 1,
        hello: 'ahahah!',
        info: {
            age: 18
        },
        person: {
            weight: 20,
            height: 170
        }
    },
    computed: {
        wellcome () {
            return {text: this.hello + '---' + this.info.age};
        }
    },
    methods: {
        add: function () {
            this.counter += 1;
            this.info.age += 1;
        },
        toggle: function () {
            this.isShow = !this.isShow;                    
        }
    },
    watch: {
        counter (val) {
            console.log('counter: ', val);
        },
        info (info) {
            console.log('info: ', info);
        },
        'info.age' () {

        },
        wellcome () {
            console.log('wellcome: ', this.wellcome);
        }
    },
    ready () {
        let self = this;
        self.hello = 'Ready, go!';
        
        setTimeout(function () {
            self.hello = 'Done!';
        }, 1000)
    }
}

TinyVue.$directive('visible', function (value) {
    this.el.style.visibility = value ? 'visible' : 'hidden';
})
mvvm = new TinyVue(opts);
```

* el

Type: `String | Node`

根节点选择器或是根节点dom元素。

* data

Type: `Object`

初始化响应式数据模型

* computed

Type: `Object`

计算属性，每一个元素对应一个函数

注：
    *  computed属性依赖于data中的响应式数据
    *  computed属性可依赖computed属性
    *  computed禁止赋值操作

* methods

Type: `Object`
每一个元素对应一个函数，支持响应式替换

* watch

Type: `Object`

监测对象，监测对应的响应式数据，当数据发生更改时执行回调.

* $watch

Type: `Function`
监测某一数据的响应式变化

如：
```js
var vm = new TinyVue({
    data: {
        info: {
            age: 18
        }
    }
});
vm.$watch('info', function (info) {
    
});

vm.$watch('info.age', function (age) {
    
})
```

* $directive

Type: `Function`

自定义指令

如：
```js
vm.$directive('text', function (text) {
    this.el.textContent = text;
});
```

* beforeCompiler

生命周期函数，编译前执行

* ready

生命周期函数，渲染完毕后执行

### Install

```js
npm install tiny-vue --save
```
