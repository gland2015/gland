export function parseOfficeOpenXml(str) {
    let t = new Date().getTime()
    let body = str.match(/\<body[^\>]*\>[\s\S]+\<\/body\>/);
    if (body) body = body[0];
    else body = str;
    body = body.replace(/\<\!--[\s\S]*?--\>/g, '');
    //body = body.replace(/\<\!\[if[\s\S]+?\<\!\[endif\]\>/g, '');

    console.log(body);
    const parser = new DOMParser()
    body = parser.parseFromString(body, 'text/html');
    console.log({ body });
    console.log(body);
    let r = new parseDom(body);
    console.log(r);

    console.log(new Date().getTime() - t);
}


class parseDom {
    constructor(dom: Document) {
        this.nodeList = dom.body.childNodes;
        this.parse();
    }
    nodeList;
    parseResult = [];

    elementStyleMap = {
        'U': {
            'text-decoration': 'underline',
        },
        'B': {
            'font-weight': 'bold'
        },
    };

    parse() {
        for (let i = 0; i < this.nodeList.length; i++) {
            const nodeName = this.nodeList[i].nodeName;
            let parser = this.defaultParser;
            if (this['parse' + nodeName]) {
                parser = this['parse' + nodeName]
            }
            const result = parser(this.nodeList[i])
            this.parseResult.push(result);
        }
    }


    defaultParser = (block: HTMLElement) => {
        const elementStyleMap = this.elementStyleMap;

        return {
            type: block.nodeName.toLocaleLowerCase(),
            style: getStyle(block),
            children: findNode(block), //  { type, style, data }
        };

        // only find it's text and img
        function findEntity(theNode: HTMLElement, addStyle = {}) {
            let result: any = handleNode(theNode, addStyle);
            if (result) return result;
            result = [];

            if (theNode.childNodes.length === 0) return result;
            for (let i = 0; i < theNode.childNodes.length; i++) {
                let theStyle = elementStyleMap[theNode.nodeName.toLocaleUpperCase()] || {};
                result = result.concat(findEntity(theNode.childNodes[i] as any, { ...addStyle, ...theStyle }))
            }
            return result;
        }

        function handleNode(theNode: HTMLElement, addStyle = {}) {
            const nodeName = theNode.nodeName;
            if (nodeName === '#text') {
                const style = { ...addStyle, ...getStyle(theNode.parentElement) };
                return [
                    {
                        type: 'text',
                        style,
                        data: theNode.nodeValue,
                    }
                ]
            }
            if (nodeName === 'IMG') {
                const style: any = { ...addStyle, ...getStyle(theNode.parentElement) };
                style.width = (theNode as any).width;
                style.height = (theNode as any).height;
                return [
                    {
                        type: 'img',
                        style,
                        data: {
                            src: (theNode as any).src
                        }
                    }
                ]
            }
        }

        function findNode(theNode: HTMLElement, addStyle = {}) {
            let result: any = handleNode(theNode, addStyle);
            if (result) return result;
            result = [];

            if (theNode.nodeName === 'A') {
                return [
                    {
                        type: 'a',
                        style: getStyle(theNode),
                        data: {
                            href: (theNode as any).href,
                            children: findEntity(theNode, addStyle),
                        }
                    }
                ]
            }

            for (let i = 0; i < theNode.childNodes.length; i++) {
                let theStyle = elementStyleMap[theNode.nodeName] || {};
                result = result.concat(findNode(theNode.childNodes[i] as any, { ...addStyle, ...theStyle }));
            }
            return result;
        }

        function getStyle(element: HTMLElement) {
            const result = {};
            const style = element.style;
            if (!style) return result;
            for (let i = 0; i < style.length; i++) {
                result[style[i]] = style[style[i]];
            }
            return result;
        }

    }

    parseTABLE(tableElement) {
        return [];
    }
}
