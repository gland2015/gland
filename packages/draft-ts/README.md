由于[draft-js](https://github.com/facebook/draft-js)是主要是flow文件，不便维护，而且很久没有更新了。本项目主要将之转换为typescript并加入一些改进。目前对typescript和非typescript的支持都非常良好，且有映射到源代码中的source-map，非常便于调试（在webpack中获取node_modules中source-map需配置source-map-loader）。

本项目的地址在[https://github.com/gland2015/gland](https://github.com/gland2015/gland)，欢迎一起改进。

主要改进：将immutable和fbjs分离为独立依赖，需另外安装，改进实体，使之对非文本节点支持更好。

安装: npm install @gland/draft-ts immutable@3.8.2  fbjs

附：不可以安装immutable@4.0.0-rc*，由于Map的api变化，会报block.getKey not function，待其版本稳定再升级上去