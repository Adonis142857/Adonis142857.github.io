/**
 * 20190319@JAR:
 * 
 * 1.汉化字典'cnItems:obj',
 * 2.采集新词'cnItem:fun';
 * 
 */

//1.汉化杂项
var cnItems = {
    _STYLE_: [
        '符号', '待归类', '地图', '防具', '武器', '道具', '属性', '敌人'
    ],
    _OTHER_: [],

    //1.0.符号
    '': '',
    '---': '———',

    //1.1.待归类
//    'Bastard Lunatic': '',
//    'Battle-Felon': '',
//    'Battle-Finch': '',
//    'Birdrider': '',
//    'Crested Dwarf': '',
//    'Demicanadian': '',
//    'Double Hobbit': '',
//    'Double Wookiee': '',
//    'Dung Elf': '',
//    'Eel Man': '',
//    'Enchanted Motorcycle': '',
//    'Fighter/Organist': '',
//    'Gyrognome': '',
//    'Half Halfling': '',
//    'Half Man': '',
//    'Half Orc': '',
//    'Hob-Hobbit': '',
//    'Hunter Strangler': '',
//    'Inner Mason': '',
//    'Land Squid': '地行乌贼',
//    'Lesser Dwarf': '',
//    'Low Elf': '矮精灵',
//    'Lowling': '',
//    'Mage Illusioner': '',
//    'Mu-Fu Monk': '',
//    'Panda Man': '',
//    'Puma Burgular': '',
//    'Robot Monk': '',
//    'Runeloremaster': '',
//    'Shiv-Knight': '',
//    'Skraeling': '',
//    'Slow Poisoner': '',
//    'Talking Pony': '',
//    'Tickle-Mimic': '',
//    'Trans-Kobold': '',
//    'Ur-Paladin': '',
//    'Vermineer': '',
//    'Voodoo Princess': '',
//    'Will o\' the Wisp': '',
    'Progress Quest': '无尽的进度条',
    'Whubvied': '奴役',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',

    //1.2.地图
    '': '',
    '': '',

    //1.3.防具
    //1.4.武器
    //1.5.道具

    //1.6.属性（30）
    '': '',

    //1.7.敌人 

};
//2.采集新词
//20190320@JAR

var cnItem = function () {

    //传参是否非空字串
    if (!arguments[0]) return;

    //检验传参是否对象
    let text = arguments[0],
        s = '';
    if (typeof (text) != "string")
        return text;
    else
        s = arguments[0].charCodeAt();

    //检验传参是否英文
    if (
        s < 65 || (s > 90 && s < 97) || (s > 122)

    ) return text;
    //检验字典是否可存
    if (!cnItems._OTHER_) cnItems._OTHER_ = [];

    //遍历尝试匹配
    for (let i in cnItems) {
        //字典已有词汇或译文、且译文不为空，则返回译文
        if (
            text == i || text == cnItems[i] &&
            cnItems[i] != ''
        )
            return cnItems[i];
    }

    //遍历生词表是否收录
    for (
        let i = 0; i < cnItems._OTHER_.length; i++
    ) {
        //已收录则直接返回
        if (text == cnItems._OTHER_[i])
            return text;
    }

    //未收录则保存
    cnItems._OTHER_.push(text);
    cnItems._OTHER_.sort(
        function (a, b) {
            return a.localeCompare(b)
        }
    );

    /*
        //开启生词打印
        //console.log(
            '有需要汉化的英文：', text
        );
    */

    //返回生词字串
    return text;
};
