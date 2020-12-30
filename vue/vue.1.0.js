/**
 *
 * title:自制vue框架
 * author： 大圣
 * date：2020-12-30
 * main：1、数据双向绑定
 *       2、render方法
 *       3、检测数据类型
 *       4、观察者模式
 *       5、发布订阅模式
 *
 * content：
 *      1、数据双向绑定2.0之前defineProperty
 *      2、
 *      3、检测数据类型
 *          typepf  number/string/boolean/undefined/function
 *          instanceof  Array
 *          Array.isArray() Array
 *          Object.property.toString.call() 万能
 *      4、获取元素querySelector querySelectorAll
 *      5、创建元素 document.createElement()
 *      6、设置属性setAttribute
 *      7、遍历对象for in
 *      8、写入文本innerText
 *      9、插入dom节点 appendChild
 *      10、Object.keys(data)直接拿到对象上所有属性组成的数组
 *      11、递归 函数自己调用自己
 *      12、数据依赖采集
 *      13、中间件（高阶函数）再执行结果之前或者之后要做的事情
 * 
 *      a           aa()
 *      b           aa() bb()
 *      c           bb()
 * 
 * 
 * 
 * 
 * 
 * 
 *
 */
(function (win) {
  // 万能的检测数据类型的方法 '[object HTMLDivElement]'
  const type = (obj) => Object.prototype.toString.call(obj);


  class Dep{
      constructor(){
          this.subs = [];
      }
      addSubs(sub){
        this.subs.push(sub)
      }
      notify(){
          this.subs.map(sub=>{
              if(sub !== null) sub.update()
          })
      }
  }
  Dep.target = null;


  class Watcher{
      constructor(data, getter){
        this.getter = getter;
        this.value = this.get();
      }
      get(){
          Dep.target = this;
          let value = this.getter();
          Dep.target = null;
          return value;
      }
      update(){
          this.value = this.get();
      }
  }

  // 监听单一属性
  function defineReactive(obj, key, oldValue, callback) {
    Object.defineProperty(obj, key, {
      set(newValue) {
        if (oldValue === newValue) return;
        oldValue = newValue;
        callback && callback();
      },
      get() {
        return oldValue;
      },
    });
  }
  //   监听所有属性
  function walk(data, callback) {
    Object.keys(data).map((key) => {
      if (type(key) === "[object Object]" || type(key) === "[object Array]") {
        // 递归
        walk(data[key], callback);
      }
      defineReactive(data, key, data[key], callback);
    });
  }

  //   建立观察中心
  function obServe(data, callback) {
    if (type(data) !== "[object Object]") return;
    walk(data, callback);
  }

  win.Vue = class {
    constructor(options) {
      const { el, data, methods, render, ...other } = options;
      this.el = typeof el === "string" ? document.querySelector(el) : el;
      this.data = typeof data === "function" ? data() : data;
      this.methods = methods;
      this.render = render;
      this.mounted();

      obServe(this.data, () => this.mounted());
    }

    createElement(tagName, attrs = {}, children, methods = {}) {
      // 创建根节点
      const ele = document.createElement(tagName);
      // 添加属性
      for (let key in attrs) {
        ele.setAttribute(key, attrs[key]);
      }
      // 添加子节点
      if (typeof children === "string") {
        ele.innerText = children;
      } else if (type(children) === "[object Array]") {
        children.forEach((child) => {
          ele.appendChild(child);
        });
      }
      // 添加事件
      for (let key in methods) {
        // ele.setAttribute(key, methods[key]);
        ele[key] = methods[key];
      }
      return ele;
    }

    mounted() {
      this.el.innerHTML = "";
      const ele = this.render(this.createElement);
      this.el.appendChild(ele);
    }
  };
})(window);


function fn(fn){
    console.log(n);
}
fn(3)