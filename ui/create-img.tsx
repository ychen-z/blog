import React, { useState } from 'react';
import html2canvas from 'html2canvas';
// import { Upload } from '@netease-ehr/ui';
const config = {
    appkey: 'xx',
    responseEmail: 'xx', 
    subProductId: 'xx',
    channel: 'xxx'
};

const BASE_URL = 'https://overmind-project.netease.com';

export default function FeedBack() {
    // const uploadRef = useRef < any > null;
    const [loading, setLoading] = useState(false); // 是否加载
    const [url, setUrl] = useState(''); // 存储生成的链接

    // 将Blob文件上传到Nos服务器，发送POPO消息通知时图片必须是一张网络图片
    // const postHttpsImage = blob =>
    //     new Promise() <
    //     IObject >
    //     (resolve => {
    //         const file = new File([blob], `${new Date().getTime()}.png`);
    //         uploadRef.current?.nosUpload?.({ file, onSuccess: resolve });
    //     });

    const uploadImg = () => {
        setLoading(true);
        window.scroll(0, 0);
        const target = document.body;
        html2canvas(target, {
            useCORS: true,
            allowTaint: true,
            width: target.scrollWidth,
            height: target.scrollHeight,
            scale: 3
        }).then(canvas => {
            const jpgImgBase64 = canvas.toDataURL('image/jpeg');
            console.log(jpgImgBase64);
            const file = new File([jpgImgBase64], `${new Date().getTime()}.jpeg`);
            const formData = new FormData();
            formData.append('file', file);

            fetch(`${BASE_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    appkey: config.appkey,
                },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    // 处理返回的数据
                    setUrl(data.result.url);
                })
                .catch(error => {
                    // 处理错误
                });
            // postHttpsImage(blob).then(uploadData => {
            //     setLoading(false);
            //     setUrl(uploadData.url);
            //     console.log(uploadData.url);
            // });
        });
        // canvas.toBlob(blob => {
        //     if (!blob) return;
        //     const file = new File([blob], `${new Date().getTime()}.png`);
        //     const formData = new FormData();
        //     formData.append('file', file);

        //     fetch(`${BASE_URL}/api/upload`, {
        //         method: 'POST',
        //         headers: {
        //             appkey: config.appkey,
        //             email: 'hzchenyuting@corp.netease.com'
        //         },
        //         body: formData
        //     })
        //         .then(response => {
        //             if (response.ok) {
        //                 return response.json();
        //             }
        //             throw new Error('Network response was not ok.');
        //         })
        //         .then(data => {
        //             // 处理返回的数据
        //             setUrl(data.result.url);
        //         })
        //         .catch(error => {
        //             // 处理错误
        //         });
        //     // postHttpsImage(blob).then(uploadData => {
        //     //     setLoading(false);
        //     //     setUrl(uploadData.url);
        //     //     console.log(uploadData.url);
        //     // });
        // });
        // });
    };
    return (
        <div>
            <div onClick={uploadImg}>FeedBack</div>
            {/* <div style={{ display: 'none' }}>
                <Upload
                    getInstance={params => {
                        uploadRef.current = params;
                    }}
                />
            </div> */}
        </div>
    );
}
