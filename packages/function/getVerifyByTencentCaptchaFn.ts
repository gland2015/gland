let hasAdd = false;
let TencentCaptcha = null;
let ele: HTMLScriptElement = null;

export function getVerifyByTencentCaptchaFn(appId) {
    return function getVerifyByTencentCaptcha(onError?): Promise<{ ticket; randstr }> {
        if (!hasAdd) {
            hasAdd = true;
            ele = document.createElement("script");
            ele.src = "https://ssl.captcha.qq.com/TCaptcha.js";
            document.body.appendChild(ele);
        }

        return new Promise(function (resolve, reject) {
            if (TencentCaptcha) {
                show();
            } else {
                function handleLoad() {
                    TencentCaptcha = window["TencentCaptcha"];
                    ele.removeEventListener("load", handleLoad);

                    show();
                }

                ele.addEventListener("load", handleLoad);
            }

            function show() {
                const instance = new TencentCaptcha(
                    appId,
                    (res) => {
                        if (res && res.ret === 0) {
                            resolve({
                                ticket: res.ticket,
                                randstr: res.randstr,
                            });
                        } else {
                            onError && onError();
                            reject(res);
                        }
                    },
                    {}
                );
                instance.show();
            }
        });
    };
}
