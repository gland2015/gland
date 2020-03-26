
/**
 数据示例：
const list = [
{ _id: '1',  },
{ _id: '2' }
]

const relation = [
{ parentId: '1', childId: '2' }
]

==> result [
{ value: {_id: '1'}, children: [{_id: '2'}] },
{value: {_id: '2'}, children: []}
]
 */

/**
 * 将数据和数据关系转换为一个树结构
 * @param list 
 * @param relation 
 * @param param2 
 */
export function sortTree(list: Array<any>, relation: Array<any>, {
    parentId = 'parentId',
    childId = 'childId',
    _id = '_id',
    filter = null
}): Tree {
    const results = [];

    const map = {};
    list.forEach(function (doc) {
        map[doc[_id]] = {
            value: doc,
            children: []
        }
    })

    relation.forEach(function (doc) {
        const pId = doc[parentId]
        const cId = doc[childId];
        if (map[pId] && map[cId]) {
            map[pId]['children'].push(map[cId])
        }
    })
    for (let key in map) {
        const ele = map[key];
        if (filter) {
            if (!filter(ele['value'])) continue;
        }
        results.push(ele);
    }
    return results;
}

type Tree = Array<{
    value: any,
    children: Tree
}>