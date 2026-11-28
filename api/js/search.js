@js:
let localSets = 'hiker://files/rules/home/searchSet.json';
if (!fetch(localSets)) {
    let def_set = [
        { name: '空白', rule: '' },
        { name: '香情影视', rule: '香情影视' },
        { name: '香资', rule: '资源网采集.xyq' },
        { name: '道资', rule: '资源网采集.dz' },
        { name: '香app', rule: 'APP影视(P)' },
        { name: '道app', rule: 'app影视.dz' },
        { name: '聚搜君', rule: '聚搜君Lite' },
    ];
    writeFile(localSets, JSON.stringify(def_set));
}
let localSetInfo = JSON.parse(fetch(localSets));
localSetInfo = localSetInfo.concat([{ name: '新增' }]);
let sel_title = localSetInfo.map((item) => {
    let seach_api = getItem('home.search_api', '空白');
    if (item.name === seach_api) {
        return '👉' + item.name;
    } else {
        return item.name;
    }
});
$(sel_title, 2).select((localSetInfo, localSets) => {
    function compare(name) {
        return function (it) {
            return it.name === name;
        }
    }
    input = input.replace(/👉/g, '');
    if (input !== '空白' && input !== '新增') {
        let ret = localSetInfo.filter(compare(input));
        setItem('home.search_api', input);
        setItem('home.search_rule', ret[0].rule);
    } else if (input === '空白') {
        clearItem("home.search_api");
        clearItem("home.search_rule");
    } else {
        return $().rule((localSets) => {
            let localSetInfo = JSON.parse(fetch(localSets));
            // let loset = localSetInfo.filter(function (item){return !/空白|新增/.test(item.name)});
            let loset = localSetInfo.filter(function (item) { return !/新增/.test(item.name) });
            let d = [];
            d.push({
                title: '引擎添加说明',
                desc: '格式为:引擎名@规则名,例如道资@app影视.dz\n点击可更新本地设置插件',
                url: $().lazyRule(() => {
                    var ruleJs = '';
                    try {
                        // ruleJs = fetch('http://hiker.nokia.press/hikerule/rulelist.json?id=1676')
                        ruleJs = fetch('http://199685.xyz/api/js/search.js');
                    } catch {
                        log("搜索引擎更新失败")
                    }
                    if (ruleJs && ruleJs.length > 1) {
                        writeFile('hiker://files/rules/dzHouse/js/搜索引擎切换.js', ruleJs);
                        refreshPage(true);
                        back(true);
                        return 'toast://更新成功'
                    }
                }),
                col_type: 'text_center_1'
            });
            d.push({
                title: '添加引擎',
                desc: "道资@app影视.dz",
                extra: {
                    onChange: "putVar('new_search_api',input)",
                    titleVisible: true
                },
                url: $.toString((localSets) => {
                    if (getVar('new_search_api') && getVar('new_search_api').includes('@')) {
                        let new_name = getVar('new_search_api').split('@')[0];
                        let new_rule = getVar('new_search_api').split('@')[1];
                        let localSetInfo = JSON.parse(fetch(localSets));
                        localSetInfo.push({
                            name: new_name,
                            rule: new_rule
                        });
                        writeFile(localSets, JSON.stringify(localSetInfo));
                        refreshPage(true);
                        return 'toast://成功新增:\n' + getVar('new_search_api');
                    } else {
                        return 'toast://你个憨批，本道不陪你玩了';
                    }
                }, localSets),
                col_type: "input"
            });
            let search_api_option = getItem('home.search_api_option', '修改');

            d.push({
                title: search_api_option === '修改' ? '👉修改' : '修改',
                url: $().lazyRule(() => {
                    setItem('home.search_api_option', '修改');
                    refreshPage(true);
                    return 'hiker://操作模式切换为:' + getItem('home.search_api_option');
                }),
                col_type: 'scroll_button'
            });
            d.push({
                title: search_api_option === '删除' ? '👉删除' : '删除',
                url: $().lazyRule(() => {
                    setItem('home.search_api_option', '删除');
                    refreshPage(true);
                    return 'hiker://操作模式切换为:' + getItem('home.search_api_option');
                }),
                col_type: 'scroll_button'
            });
            d.push({
                title: search_api_option === '跳转' ? '👉跳转' : '跳转',
                url: $().lazyRule(() => {
                    setItem('home.search_api_option', '跳转');
                    refreshPage(true);
                    return 'hiker://操作模式切换为:' + getItem('home.search_api_option');
                }),
                col_type: 'scroll_button'
            });
            for (let i in loset) {
                let los = loset[i];
                let url = 'hiker://empty';
                if (los.name === '空白') {
                    url = "toast://空白选项不允许修改!";
                }
                else if (search_api_option === '修改') {
                    url = $(los.name + '@' + los.rule, "输入修改后的搜索引擎").input((localSets, los, i) => {
                        return $("确认将" + los.name + "修改为:" + input + ' ?').confirm((localSets, input, los, i) => {
                            if (los.name === '空白') {
                                return "toast://空白选项不允许修改!";
                            }
                            let new_name = input.split('@')[0];
                            let new_rule = input.split('@')[1];
                            let localSetInfo = JSON.parse(fetch(localSets));
                            localSetInfo[i] = {
                                name: new_name,
                                rule: new_rule,
                            };
                            log(localSetInfo);
                            writeFile(localSets, JSON.stringify(localSetInfo));
                            let result = '修改成功';
                            refreshPage(true);
                            return "toast://" + result;
                        }, localSets, input, los, i);
                    }, localSets, los, i);
                } else if (search_api_option === '删除') {
                    url = $("确认将" + los.name + "删除吗?").confirm((localSets, los, i) => {
                        let localSetInfo = JSON.parse(fetch(localSets));
                        localSetInfo.pop(i);
                        writeFile(localSets, JSON.stringify(localSetInfo));
                        refreshPage(true);
                        return "toast://已删除" + los.name;
                    }, localSets, los, i);
                } else {
                    url = 'hiker://home@' + los.rule;
                }
                d.push({
                    title: los.name,
                    col_type: 'flex_button',
                    url: url
                });
            }
            setPageTitle('添加搜索引擎');
            setResult(d);
        }, localSets);
    }
    refreshPage(true);
    return "toast://你选择了" + input
}, localSetInfo, localSets);