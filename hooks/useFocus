// use 
//  useFocus(dispatch); // 页面聚焦自动刷新

// 监听页面获取焦点事件
import { useEffect } from 'react';

const useFocus = (callback: Function) => {
    useEffect(() => {
        const fn = () => callback();
        window.addEventListener('focus', fn, false);

        return () => {
            window.removeEventListener('focus', fn);
        };
    }, [callback]);
};

export default useFocus;
