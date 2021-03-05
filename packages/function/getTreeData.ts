export function getTreeData({
    _idKey = "_id",
    list,
    parentIdKey = "parentId",
    getNode = (doc, children, level) => {
        // sort root
        if (!doc) return children;
        // sort children
        return {
            ...doc,
            children,
        };
    },
    getLog = null,
    isRoot = (doc, dataMap) => {
        return !doc[parentIdKey];
    },
}) {
    // set data map
    const dataMap = new Map();
    list.forEach(function (doc) {
        if (!doc) return;
        const _id = doc[_idKey];
        dataMap.set(_id, { doc, children: [], added: false });
    });

    let tree = [];
    const rootList = [];

    dataMap.forEach(function (item) {
        const doc = item.doc;
        if (isRoot(doc, dataMap)) {
            rootList.push(doc);
        }

        const _id = doc[_idKey];
        const parentId = doc[parentIdKey];

        if (parentId && parentId !== _id) {
            const parent = dataMap.get(parentId);
            if (parent) {
                parent.children.push(doc);
            }
        }
    });

    rootList.forEach(function (doc) {
        const children = getChildren(doc, 2);
        const node = getNode(doc, children, 1);
        if (node) {
            tree.push(node);
        }
    });

    tree = getNode(null, tree, 0);

    if (getLog) {
        let noAddedTree = [];

        const noAddedRootList = [];
        dataMap.forEach(function (item) {
            if (!item.added && !dataMap.get(item.doc[parentIdKey])) {
                noAddedRootList.push(item.doc);
            }
        });

        if (noAddedRootList.length) {
            noAddedRootList.forEach(function (doc) {
                const children = getChildren(doc, 2);
                const node = getNode(doc, children, 1);
                if (node) {
                    noAddedTree.push(node);
                }
            });
            noAddedTree = getNode(null, noAddedTree, 0);
        }

        getLog({ noAddedTree });
    }

    return tree;

    function getChildren(doc, level) {
        const _id = doc[_idKey];
        const data = dataMap.get(_id);

        data.added = true;

        const childList = [];
        data.children.forEach(function (subDoc) {
            const subChildList = getChildren(subDoc, level + 1);
            const node = getNode(subDoc, subChildList, level);
            if (node) {
                childList.push(node);
            }
        });

        return childList;
    }
}
