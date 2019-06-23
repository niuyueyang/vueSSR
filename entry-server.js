import Vue from 'vue';
import App from './App.vue'
import createStore from './store/index.js';

export default function (context) {
    const store=createStore();
    let app=new Vue({
        store,
        render:h=>h(App)
    });
    let components = App.components;
    let asyncDataArr=[];//promise集合
    for(let key in components){
        if(!components.hasOwnProperty(key)) continue;
        let component=components[key];
        if(component.asyncData){
            asyncDataArr.push(component.asyncData({store}))
        }
    }
    // 所有请求并行执行
    return Promise.all(asyncDataArr).then(() => {
            // context.state 赋值成什么，window.__INITIAL_STATE__ 就是什么
            // 这下你应该明白entry-client.js中window.__INITIAL_STATE__是哪来的了，它是在服务端渲染期间被添加进上下文的
            context.state = store.state;
        return app;
    });
}
