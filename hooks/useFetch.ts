/**
 * 数据请求hooks
 * @author 施阳 2019-9-20
 * @return {data, loading, dispatch}
 * data： 请求结果
 * loading：true-请求中 false-请求结束
 * dispatch：手动触发请求
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { ResponseConfig } from '@/axios/interface';

interface UseFetchResult<R> {
    data: R | undefined;
    loading: boolean;
    dispatch: (params?: any) => Promise<R>;
}

interface OptionsProps {
    defaultParams: IObject;
    immediately: boolean;
    onSuccess: (data: any) => void;
    onError: (err: IObject) => void;
}

/**
 * @param {function} url 请求方法
 * @param {obj} options 请求配置项
 */
function useFetch<R>(url: IFetch<R>, options?: Partial<OptionsProps>): UseFetchResult<R> {
    const { defaultParams, immediately = true, onError, onSuccess } = options || {};
    const [data, setData] = useState<R | undefined>();
    const [loading, setLoading] = useState(false);

    const cacheParams = useRef(defaultParams);

    // 缓存参数
    useEffect(() => {
        cacheParams.current = defaultParams;
    }, [defaultParams]);

    // 缓存请求函数
    const urlRef = useRef(url);
    useEffect(() => {
        urlRef.current = url;
    }, [url]);

    // 接口请求
    const fetch = useCallback((url: IFetch<R>, params?: any): Promise<R> => {
        setLoading(true);
        return new Promise((resolve, reject) => {
            url?.(params)
                .then((data: R) => {
                    setData(data);
                    resolve(data);
                    onSuccess && onSuccess(data);
                })
                .catch((err: ResponseConfig<R>) => {
                    setData(undefined);
                    err && reject(err);
                    onError && onError(err);
                })
                .finally(() => setLoading(false));
        });
    }, []);

    /**
     * 手动触发接口请求
     * @param {obj} value 手动触发请求时可直接传入请求参数，不传参数则赋值默认参数
     */
    const dispatch = useCallback((value = cacheParams.current) => fetch(urlRef.current, value), [fetch]);

    useEffect(() => {
        immediately && fetch(urlRef.current, cacheParams.current);
    }, [fetch, immediately]);

    return { data, loading, dispatch };
}

export default useFetch;
