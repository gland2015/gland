function isLeaf(item) {
    return Boolean(item.children);
}

export class TreeNestMap {
    map: Map<
        any,
        {
            _id: any;
            parentId: any;
            level: number;
            lft: number;
            rgt: number;
            data: any;
            lftKey: any;
            rgtKey: any;
        }
    >;

    constructor(tree: Array<any>, _idKey = "_id", childrenKey = "children", getIsLeaf = isLeaf) {
        const map = new Map();
        const that = this;

        let right = 1;
        tree.forEach(function (data, index) {
            right = buildNode(data, right, 1, null, tree[index - 1] && tree[index - 1][_idKey], tree[index + 1] && tree[index + 1][_idKey]);
            right = right + 1;
        });

        this.map = map;

        function buildNode(data, left, level, parentId, lftKey, rgtKey) {
            if (!that.firstKey && getIsLeaf(data)) {
                that.firstKey = data[_idKey];
            }

            const childList = data[childrenKey] || [];

            let nodeRight = left + 1;
            childList.forEach((item, index) => {
                nodeRight = buildNode(
                    item,
                    nodeRight,
                    level + 1,
                    data[_idKey],
                    childList[index - 1] && childList[index - 1][_idKey],
                    childList[index + 1] && childList[index + 1][_idKey]
                );
                nodeRight = nodeRight + 1;
            });

            const doc = {
                _id: data[_idKey],
                parentId,
                level,
                lft: left,
                rgt: nodeRight,
                data,
                lftKey,
                rgtKey,
            };

            map.set(data[_idKey], doc);

            return nodeRight;
        }
    }

    firstKey: any;

    get(_id) {
        let doc = this.map.get(_id);
        return doc && doc.data;
    }

    getLevel(_id) {
        let doc = this.map.get(_id);
        return doc?.level;
    }

    getParentId(_id) {
        let doc = this.map.get(_id);
        return doc?.parentId;
    }

    isAncestorOf(pId, sId) {
        let parent = this.map.get(pId);
        let son = this.map.get(sId);

        if (!son || !parent) return false;

        let bool = parent.lft < son.lft && parent.rgt > son.lft;
        return bool;
    }

    isDescendantOf(sId, pId) {
        let parent = this.map.get(pId);
        let son = this.map.get(sId);

        if (!son || !parent) return false;

        let bool = son.lft > parent.lft && son.rgt < parent.rgt;
        return bool;
    }

    isSibling(id1, id2) {
        if (id1 === id2) return false;
        let a = this.map.get(id1);
        let b = this.map.get(id2);
        if (!a || !b) return false;

        return a.parentId === b.parentId;
    }

    getLftSibling(_id) {
        let data = this.map.get(_id);
        return data?.lftKey;
    }

    getRgtSibling(_id) {
        let data = this.map.get(_id);
        return data?.rgtKey;
    }

    findDescendants(_id) {
        let parent = this.map.get(_id);
        if (!parent) return [];

        let l = Array.from(this.map.values()).filter((son) => {
            let bool = son.lft > parent.lft && son.rgt < parent.rgt;
            return bool;
        });
        return l;
    }

    findAncestors(_id) {
        let son = this.map.get(_id);
        if (!son) return [];

        let l = Array.from(this.map.values()).filter((parent) => {
            let bool = parent.lft < son.lft && parent.rgt > son.lft;
            return bool;
        });
        return l;
    }

    findSiblings(_id) {
        let doc = this.map.get(_id);
        if (!doc) return [];

        let l = Array.from(this.map.values()).filter((sib) => {
            let bool = sib.parentId === doc.parentId && sib._id !== _id;
            return bool;
        });
        return l;
    }
}

export function getTreeNestMap() {}
