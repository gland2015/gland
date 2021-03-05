export function getTreeMaxLevel(list, children = "children") {
    let level = 1;

    list.forEach(function (item) {
        fn(item, level);
    });

    return level;

    function fn(item, curLevel) {
        if (item[children]) {
            curLevel++;
            if (curLevel > level) {
                level = curLevel;
            }

            item[children].forEach(function (item) {
                fn(item, curLevel);
            });
        }
    }
}
