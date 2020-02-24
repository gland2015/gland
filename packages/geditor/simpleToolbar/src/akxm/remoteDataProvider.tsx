import React from 'react';
import { editorConfigContext } from '../../../core/model/context';

import { ossFileUpload } from './remote';

import { withMutation, registerFragment, withMulti } from '../../../../../../测试/reactTest/apollo';

registerFragment(`
fragment OSSFileSignInfoFragment on OSSFileSignInfo{
  dir
  expire
  host
  accessId
  policy
  signature
  fullPath
  fileName
  url
}

`);

registerFragment(`
	fragment ProdFileTypesFragmentEdit on ProdFileType {
     _id
     name
     path
     extname
   }
`);

class RemoteDataProvider extends React.Component<any, any> {
    static contextType = editorConfigContext;

    constructor(props) {
        super(props);
        props.onRef(this);
    }
    fileTypeId;

    render() {
        if (!this.fileTypeId && this.props.data) {
            try {
                this.fileTypeId = this.props.data.prodFileTypes.results[0]._id;
            } catch {}
        }
        return null;
    }

    pathCache = {};

    getContentAsset = (data, setState) => {
        if (!this.fileTypeId) return alert('可能没连上数据库');
        const { fullPath } = data;
        if (this.pathCache[fullPath]) {
            return this.pathCache[fullPath];
        }

        console.log('获取了一个url');
        this.props
            .getSignatureUrl({
                fullPath
            })
            .then(data => {
                const url = data.data.getSignatureUrl;
                this.pathCache[fullPath] = url;
                setState({});
            });

        return null;
    };

    addContentAsset = async file => {
        if (!this.fileTypeId) return alert('可能没连上数据库');
        const oSSFileUploadSign = (
            await this.props.getOSSFileUploadSign({
                fileTypeId: this.fileTypeId,
                extname: file.name,
                num: 1
            })
        ).data.getOSSFileUploadSign;

        const result = await new Promise(function(resolve, reject) {
            ossFileUpload(
                [file],
                oSSFileUploadSign,
                (sign, file) => {
                    const size = file.size;
                    const filename = file.name;
                    const type = file.type;
                    const lastModified = file.lastModified;

                    const storeData = {
                        fullPath: sign.fullPath,
                        type,
                        size,
                        filename,
                        lastModified,
                        isRemote: true
                    };
                    resolve(storeData);
                },
                () => {
                    alert('文件上传失败....');
                    reject(null);
                }
            );
        });
        return result;
    };
}

const RemoteDataProvider1 = withMutation({
    name: 'getOSSFileUploadSign',
    args: { fileTypeId: 'String', num: 'Int', extname: 'String' },
    fragmentName: 'OSSFileSignInfoFragment'
})(RemoteDataProvider);

const RemoteDataProvider2 = withMutation({
    name: 'getSignatureUrl',
    args: { fullPath: 'String', expires: 'Int' }
})(RemoteDataProvider1);

const RemoteDataProvider3 = withMulti({
    typeName: 'ProdFileType',
    fragmentName: 'ProdFileTypesFragmentEdit',
    terms: {
        view: 'custom',
        selector: {
            name: '通过聊天系统发送的各种文件'
        }
    }
})(RemoteDataProvider2);

export { RemoteDataProvider3 as RemoteDataProvider };
