// 导出一颗树，传入数组，元素对象，parentId和_id之类字段形成树结构
export default Tree;

const reservedFields = [
  "_idKey",
  "_pidKey",
  "_addChild",
  "_removeChild",
  "_idMap",
  "children"
];

function Tree(initData, option: any = {}) {
  option = Object.assign(
    {},
    {
      rootId: null,
      idKey: "_id",
      pidKey: "parentId",
      addChild: (childs, c) => {
        childs.push(c);
        return childs;
      },
      removeChild: (childs, c) => {
        return childs.filter(function(child) {
          return child === c ? false : true;
        });
      }
    },
    option
  );

  this["_idKey"] = option.idKey;
  this["_pidKey"] = option.pidKey;
  this["_addChild"] = option.addChild;
  this["_removeChild"] = option.removeChild;

  this["_idMap"] = {};

  this.children = [];

  initData.forEach(value => {
    this["_idMap"][value[this["_idKey"]]] = new TreeNode(value, this["_idKey"]);
  });
  initData.forEach(item => {
    // 弱等于即可
    if (item[this["_pidKey"]] == option.rootId) {
      this["_idMap"][item[this["_idKey"]]].parent = this;
      this.children.push(this["_idMap"][item[this["_idKey"]]]);
      return;
    }
    let p = this["_idMap"][item[this["_pidKey"]]];
    let i = this["_idMap"][item[this["_idKey"]]];
    i.parent = p;
    p.children = this["_addChild"](p.children, i);
  });
}

function TreeNode(value, idKey) {
  this._id = value[idKey];
  this.value = value;
  this.children = [];
}

// 返回第一级所有子元素的节点
TreeNode.prototype.getSubNodes = function() {
  return this.children;
};

// 返回第一级所有子元素的值
TreeNode.prototype.getSubValues = function() {
  return this.children.map(function(item) {
    return item.value;
  });
};

// 返回父节点
TreeNode.prototype.getParentNode = function() {
  if (this.parent) return this.parent;
  return null;
};

// 返回父节点的值
TreeNode.prototype.getParentValue = function() {
  if (!this.parent) return null;
  return this.parent.value;
};

// 返回根节点
TreeNode.prototype.getRootNode = function() {
  let rootNode = this;
  while (rootNode.parent) {
    rootNode = rootNode.parent;
  }
  return rootNode;
};

// 返回是否是根节点
TreeNode.prototype.isRootNode = function() {
  return this.parent ? false : true;
};

// 得到其在树中的层级，树顶是0
TreeNode.prototype.getLevel = function() {
  let level = 0;
  let parent = this.parent;
  while (parent) {
    level += 1;
    parent.parent;
  }
  return level;
};

// 将它的所有子节点它的作为一个数组返回
TreeNode.prototype.getAllNode = function() {
  let result = [];
  this.children.forEach(node => {
    result.push(node);
    if (node.children.length !== 0) result.push(...node.getAllNode());
  });
  return result;
};

// 将它的的所有子节点的值作为一个数组返回
TreeNode.prototype.getAllNodeValue = function() {
  return this.getAllNode().map(function(node) {
    return node.value;
  });
};

// 返回其中的对应_id的node，可以返回自己
TreeNode.prototype.getNodeById = function(_id) {
  const result = this.getRootNode()["_idMap"][_id];
  if (!result) return null;
  if (result === this) return this;
  let parent = result.parent;
  while (parent) {
    if (parent === this) return result;
    parent = parent.parent;
  }
  return null;
};

// 设置属性值value
TreeNode.prototype.setAttribute = function(name, value) {
  if (this.parent) this.value.name = value;
};

// 得到属性值，其实就是value
TreeNode.prototype.getAttribute = function(name) {
  if (this.parent) return this.value.name;
};

// 添加子节点，若已存在，返回null
TreeNode.prototype.add = function(value) {
  let root = this.getRootNode();
  let node = new TreeNode(value, root["_idKey"]);
  if (root["_idMap"][value[root["_idKey"]]]) return null;
  root["_idMap"][value[root["_idKey"]]] = node;
  this.children = root["_addChild"](this.children, node);
  return node;
};

// 移除对应id的节点，可以移除自己（根节点除外），并返回所有被移除的元素
TreeNode.prototype.removeById = function(_id) {
  const root = this.getRootNode();
  const idKey = root["_idKey"];
  const idMap = root["_idMap"];
  const targetNode = this.getNodeById(_id);
  if (!targetNode) return null;
  const allNodeValue = targetNode.getAllNodeValue();
  allNodeValue.push(targetNode.value);
  if (targetNode.parent) {
    targetNode.parent.children = root["_removeChild"](
      targetNode.parent.children,
      targetNode
    );
  }
  allNodeValue.forEach(function(value) {
    idMap[value[idKey]] = null;
  });
  return allNodeValue;
};

// 移除自己的所有子元素
TreeNode.prototype.removeAllChild = function() {
  const root = this.getRootNode();
  const idKey = root["_idKey"];
  const idMap = root["_idMap"];

  const allNodeValue = this.getAllNodeValue();
  this.children = [];

  allNodeValue.forEach(function(value) {
    idMap[value[idKey]] = null;
  });
  return allNodeValue;
};

// 设置父节点
TreeNode.prototype.setParent = function(_id) {
  let root = this.getRootNode();
  let targetNode = root["_idMap"][_id];
  if (!targetNode) return null;
  if (!this.parent) return null;
  if (targetNode === this.parent) return true;
  this.parent.children = root["_removeChild"](this.parent.children, this);
  this.value[root["_pidKey"]] = _id;
  this.parent = targetNode;
  targetNode.children = root["_addChild"](targetNode.children, this);
  return true;
};

Tree.prototype = Object.create(TreeNode.prototype);

Tree.prototype.getNodeById = function(_id) {
  return this["_idMap"][_id] || null;
};
