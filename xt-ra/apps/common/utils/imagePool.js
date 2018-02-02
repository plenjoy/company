(function(exports){
     //单例
     var instance = null;
     var emptyFn = function(){};
     //初始默认配置
     var config_default = {
         //线程池"线程"数量
         thread: 5,
         //图片加载失败重试次数
         //重试2次，加上原有的一次，总共是3次
         "try": 2
     };
     //工具
     var _helpers = {
         //设置dom属性
         setAttr: (function(){
             var img = new Image();
             //判断浏览器是否支持HTML5 dataset
             if(img.dataset){
                 return function(dom, name, value){
                     dom.dataset[name] = value;
                     return value;
                 };
             }else{
                 return function(dom, name, value){
                     dom.setAttribute("data-"+name, value);
                     return value;
                 };
             }
         }()),
         //获取dom属性
         getAttr: (function(){
             var img = new Image();
             //判断浏览器是否支持HTML5 dataset
             if(img.dataset){
                 return function(dom, name){
                     return dom.dataset[name];
                 };
             }else{
                 return function(dom, name){
                     return dom.getAttribute("data-"+name);
                 };
             }
         }())
     };
     /**
      * 构造方法
      * @param max 最大连接数。数值。
      */
     function ImagePool(max){
         //最大并发数量
         this.max = max || config_default.thread;
         this.linkHead = null;
         this.linkNode = null;
         //加载池
         //[{img: dom,free: true, node: node}]
         //node
         //{src: "", options: {success: "fn",error: "fn", once: true}, try: 0}
         this.pool = [];
     }
     /**
      * 初始化
      */
     ImagePool.prototype.initPool = function(){
         var i,img,obj,_s;
         _s = this;
         for(i = 0;i < this.max; i++){
             obj = {};
             img = new Image();
             _helpers.setAttr(img, "id", i);
             img.onload = function(){
                 var id,src;
                 //回调
                 //_s.getNode(this).options.success.call(null, this.src);
                 _s.notice(_s.getNode(this), "success", this.src);
                 //处理任务
                 _s.executeLink(this);
             };
             img.onerror = function(e){
                 var node = _s.getNode(this);
                 //判断尝试次数
                 if(node.try < config_default.try){
                     node.try = node.try + 1;
                     //再次追加到任务链表末尾
                     _s.appendNode(_s.createNode(node.src, node.options, node.notice, node.group, node.try));
                 }else{
                     //error回调
                     //node.options.error.call(null, this.src);
                     _s.notice(node, "error", this.src);
                 }
                 //处理任务
                 _s.executeLink(this);
             };
             obj.img = img;
             obj.free = true;
             this.pool.push(obj);
         }
     };
     /**
      * 回调封装
      * @param node 节点。对象。
      * @param status 状态。字符串。可选值：success(成功)|error(失败)
      * @param src 图片路径。字符串。
      */
     ImagePool.prototype.notice = function(node, status, src){
         node.notice(status, src);
     };
     /**
      * 处理链表任务
      * @param dom 图像dom对象。对象。
      */
     ImagePool.prototype.executeLink = function(dom){
         //判断链表是否存在节点
         if(this.linkHead){
             //加载下一个图片
             this.setSrc(dom, this.linkHead);
             //去除链表头
             this.shiftNode();
         }else{
             //设置自身状态为空闲
             this.status(dom, true);
         }
     };
     /**
      * 获取空闲"线程"
      */
     ImagePool.prototype.getFree = function(){
         var length,i;
         for(i = 0, length = this.pool.length; i < length; i++){
             if(this.pool[i].free){
                 return this.pool[i];
             }
         }
         return null;
     };
     /**
      * 封装src属性设置
      * 因为改变src属性相当于加载图片，所以把操作封装起来
      * @param dom 图像dom对象。对象。
      * @param node 节点。对象。
      */
     ImagePool.prototype.setSrc = function(dom, node){
         //设置池中的"线程"为非空闲状态
         this.status(dom, false);
         //关联节点
         this.setNode(dom, node);
         //加载图片
         dom.src = node.src;
     };
     /**
      * 更新池中的"线程"状态
      * @param dom 图像dom对象。对象。
      * @param status 状态。布尔。可选值：true(空闲)|false(非空闲)
      */
     ImagePool.prototype.status = function(dom, status){
         var id = _helpers.getAttr(dom, "id");
         this.pool[id].free = status;
         //空闲状态，清除关联的节点
         if(status){
             this.pool[id].node = null;
         }
     };
     /**
      * 更新池中的"线程"的关联节点
      * @param dom 图像dom对象。对象。
      * @param node 节点。对象。
      */
     ImagePool.prototype.setNode = function(dom, node){
         var id = _helpers.getAttr(dom, "id");
         this.pool[id].node = node;
         return this.pool[id].node === node;
     };
     /**
      * 获取池中的"线程"的关联节点
      * @param dom 图像dom对象。对象。
      */
     ImagePool.prototype.getNode = function(dom){
         var id = _helpers.getAttr(dom, "id");
         return this.pool[id].node;
     };
     /**
      * 对外接口，加载图片
      * @param src 可以是src字符串，也可以是src字符串数组。
      * @param options 用户自定义参数。包含：success回调、error回调、once标识。
      */
     ImagePool.prototype.load = function(src, options){
         var srcs = [],
             free = null,
             length = 0,
             i = 0,
             //只初始化一次回调策略
             notice = (function(){
                 if(options.once){
                     return function(status, src){
                         var g = this.group,
                             o = this.options;
                         //记录
                         g[status].push(src);
                         //判断改组是否全部处理完成
                         if(g.success.length + g.error.length === g.count){
                             //异步
                             //实际上是作为另一个任务单独执行，防止回调函数执行时间过长影响图片加载速度
                             setTimeout(function(){
                                 o.success.call(null, g.success, g.error, g.count);
                             },1);
                         }
                     };
                 }else{
                     return function(status, src){
                         var o = this.options;
                         //直接回调
                         setTimeout(function(){
                             o[status].call(null, src);
                         },1);
                     };
                 }
             }()),
             group = {
                 count: 0,
                 success: [],
                 error: []
             },
             node = null;
         options = options || {};
         options.success = options.success || emptyFn;
         options.error = options.error || emptyFn;
         srcs = srcs.concat(src);
         //设置组元素个数
         group.count = srcs.length;
         //遍历需要加载的图片
         for(i = 0, length = srcs.length; i < length; i++){
             //创建节点
             node = this.createNode(srcs[i], options, notice, group);
             //判断线程池是否有空闲
             free = this.getFree();
             if(free){
                 //有空闲，则立即加载图片
                 this.setSrc(free.img, node);
             }else{
                 //没有空闲，将任务添加到链表
                 this.appendNode(node);
             }
         }
     };
     /**
      * 获取内部状态信息
      * @returns {{}}
      */
     ImagePool.prototype.info = function(){
         var info = {},
             length = 0,
             i = 0,
             node = null;
         //线程
         info.thread = {};
         //线程总数量
         info.thread.count = this.pool.length;
         //空闲线程数量
         info.thread.free = 0;
         //任务
         info.task = {};
         //待处理任务数量
         info.task.count = 0;
         //获取空闲"线程"数量
         for(i = 0, length = this.pool.length; i < length; i++){
             if(this.pool[i].free){
                 info.thread.free = info.thread.free + 1;
             }
         }
         //获取任务数量(任务链长度)
         node = this.linkHead;
         if(node){
             info.task.count = info.task.count + 1;
             while(node.next){
                 info.task.count = info.task.count + 1;
                 node = node.next;
             }
         }
         return info;
     };
     /**
      * 创建节点
      * @param src 图片路径。字符串。
      * @param options 用户自定义参数。包含：success回调、error回调、once标识。
      * @param notice 回调策略。 函数。
      * @param group 组信息。对象。{count: 0, success: [], error: []}
      * @param tr 出错重试次数。数值。默认为0。
      * @returns {{}}
      */
     ImagePool.prototype.createNode = function(src, options, notice, group, tr){
         var node = {};
         node.src = src;
         node.options = options;
         node.notice = notice;
         node.group = group;
         node.try = tr || 0;
         return node;
     };
     /**
      * 向任务链表末尾追加节点
      * @param node 节点。对象。
      */
     ImagePool.prototype.appendNode = function(node){
         //判断链表是否为空
         if(!this.linkHead){
             this.linkHead = node;
             this.linkNode = node;
         }else{
             this.linkNode.next = node;
             this.linkNode = node;
         }
     };
     /**
      * 删除链表头
      */
     ImagePool.prototype.shiftNode = function(){
         //判断链表是否存在节点
         if(this.linkHead){
             //修改链表头
             this.linkHead = this.linkHead.next || null;
         }
     };
     /**
      * 导出对外接口
      * @param max 最大连接数。数值。
      * @returns {{load: Function, info: Function}}
      */
     exports.initImagePool = function(max){
         if(!instance){
             instance = new ImagePool(max);
             instance.initPool();
         }
         return {
             /**
              * 加载图片
              */
             load: function(){
                 instance.load.apply(instance, arguments);
             },
             /**
              * 内部信息
              * @returns {*|any|void}
              */
             info: function(){
                 return instance.info.call(instance);
             }
         };
     };
 }(window));

export {}
