
## 微前端
### 什么是微前端？
> Techniques, strategies and recipes for building a modern web app with multiple teams using different JavaScript frameworks.—— Micro Frontends
> 微前端是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用 -- 微前端
#### 技术栈无关 
- 主应用 与 子应用 技术无关

#### 开发、独立部署、自治：
- 每个应用可以只关注于自身的功能
- 只需要遵循统一的接口规范或者框架，以便于系统集成到一起，相互之间是不存在依赖关系的。


---

### 子应用注册机制

```



// qiankun.ts

import {
    registerMicroApps,
    initGlobalState,
    MicroAppStateActions,
    start,
    runAfterFirstMounted,
    setDefaultMountApp,
    addGlobalUncaughtErrorHandler
} from 'qiankun';
import render from './Render';
const actions: MicroAppStateActions = initGlobalState({});
const loader = (loading: boolean) => render({ loading, appContent: '' });
// 全局异常监控
addGlobalUncaughtErrorHandler(event => {
    console.log('全局异常监控：');
    console.error(event);
});

actions.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
});


// 在线应用公共域
 window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__HOST = {} 

// 应用列表
const config = [
    {
        name: 'cpp-main',
        entry: 'http://localhost.netease.com:8083/',
        activeRule: '/cpp'
    },
    {
        name: 'common-main',
        entry: 'http://talent-common-dev.netease.com/',
        activeRule: '/common'
    }
];

export default () => {
    registerMicroApps(
        config.map((item: any) => {
            return {
                ...item,
                container: '#subapp-viewport',
                loader,
                // 通信方式
                props: {
                    initData: '初始化数据'
                }
            };
        })
        // {
        //     beforeLoad: [
        //         app => {
        //             console.log('[LifeCycle] beforeLoad %c%s', 'color: green;', app.name);
        //         }
        //     ],
        //     beforeMount: [
        //         app => {
        //             console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
        //         }
        //     ],
        //     afterUnmount: [
        //         app => {
        //             console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
        //         }
        //     ]
        // }
    );

    /**
     * Step3 设置默认进入的子应用
     */
    setDefaultMountApp('/common');
    /**
     * Step4 启动应用
     */

    start({
        // getPublicPath: e => {
        //     console.log(e);
        //     return e;
        // }
        // sandbox: {
        //     experimentalStyleIsolation: true
        // }
    });

    runAfterFirstMounted(() => {
        console.log('[MainApp] first app mounted');
    });
};



// render.tsx

function Render(props: Props) {
    const { appContent, loading } = props;

    return (
        <>
            {loading && <h4 className="subapp-loading">Loading...</h4>}
            <div id="subapp-viewport" />
            <div dangerouslySetInnerHTML={{ __html: appContent }} />
        </>
    );
}

export default function render({ appContent, loading }: Props) {
    const container = document.getElementById('subapp-container');
    ReactDOM.render(<Render appContent={appContent} loading={loading} />, container);
}


```
### 生命周期

+ 微前端应用作为一个客户端应用，每个应用都拥有自己的生命周期：Load，决定加载哪个应用，并绑定生命周期 （start 模式）
1. bootstrap，获取静态资源
1. Mount，安装应用，如创建 DOM 节点
1. Unmount，卸载应用，如删除 DOM 节点、取消事件绑定

```

// 子应用正常 render
function render(props) {
    const { container } = props;
    ReactDOM.render(<Page />, container ? container.querySelector('#root') : document.querySelector('#root'));
}


if (!window.__POWERED_BY_QIANKUN__) {
    render({});
}

export async function bootstrap() {
    console.log('[react16] react app bootstraped');
}

export async function mount(props) {
    console.log('[react16] props from main framework', props);
    render(props);
}

export async function unmount(props) {
    const { container } = props;
    ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}

```

### 其他

#### PUBLIC HOST 生成方式
##### 基座生产

```
window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__HOST = {
    main: "http://localhost:8083"
}
```

##### 消费端

```
const PUBLIC_PATH_HOST = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__HOST?.['main'] || '';

const service: AxiosInstance = axios.create({
    baseURL: PUBLIC_PATH_HOST + rootURL, // api的base_url
    timeout: 200000, // 请求超时时间
    withCredentials: true // 允许携带cookie
});

```

#### nginx 配置

```
header :{
   Access-Control-Allow-Origin:'*' // 或者白名单
}
```


#### 路由管理

```
<Router basename={window.__POWERED_BY_QIANKUN__ ? '/cpp' : '/'}>
```

#### 路由跳转
```
应用内部：
    this.props.history.push （react）
    this.$route.push()
    
跨应用跳转：
    window.history.pushState({},title,href)
```

#### 父子应用样式隔离

+ 确保主应用 采用css module

#### 子应用打包

通用模块打包方式： umd

```
    const packageName = require('../package.json').name;
    
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${packageName}`
```



