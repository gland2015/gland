import request from './request';
import getUid from './uid';

export { ossFileUpload };

function ossFileUpload(fileList, ossSignList, onSuccess?, onError?) {
    if (!Array.isArray(ossSignList)) {
        ossSignList = [ossSignList];
    }

    ossSignList.forEach(function(info, index) {
        const file = fileList[index];
        if (!file) return;
        file.uid = getUid();
        file.url = info.fullPath;

        const requestOption = {
            action: info.host,
            filename: 'file',
            file,
            withCredentials: false,
            method: 'post',
            headers: {},
            onSuccess: (ret, xhr) => {
                console.log('上传成功', ret, xhr)
                onSuccess && onSuccess(info, file,ret, xhr);
            },
            onError: (err, ret) => {
                onError && onError(info,  file,ret, err);
            },
            onProgress: () => {},
            data: {
                key: info.fullPath,
                OSSAccessKeyId: info.accessId,
                policy: info.policy,
                Signature: info.signature
            }
        };
        request(requestOption);
    });
}

// function post(file) {
//     const { action } = file;
//     const uid = getUid();
//     file.uid = uid;

//     const requestOption = {
//         action,
//         filename: file.name,
//         data,
//         file: file,
//         headers: props.headers,
//         withCredentials: props.withCredentials,
//         method: 'post'
//     };
//     this.reqs[uid] = request(requestOption);
// }
