import type { TScene, TAction, TActionList, TActionLimit } from "@/types";
import { getRandomName } from "@/utils";

const action = (data: TActionList, timeout?: number): TAction => {
  return {
    action: "select",
    data,
    timeout,
  };
};

const endAction: TAction = {
  action: "end",
  data: [["你挂了 - 回到存档点", "end"]],
};

const finishAction: TAction = {
  action: "finish",
};

const fullPower: TActionLimit[] = [
  { type: "power", minValue: 9 },
  { type: "speed", minValue: 9 },
  { type: "wise", minValue: 9 },
  { type: "luck", minValue: 9 },
];

export const screenplay: { [key: string]: TScene } = {
  "game-open": [
    "某天，你睁开眼，发现自己在一个陌生的地方",
    "你回顾四周，发现自己在一间病房里",
    "你想不起来自己是如何来到这儿的，你怀疑自己在做梦，狠狠抽了自己一巴掌",
    "说不上疼，但又不疼的感觉很奇妙",
    `你回想自己的名字，你叫${getRandomName()}`,
    "你回顾四周，发现有病房里只有凳子和一些小别针",
    "月光透过朦胧的窗户勉强能把房间照得看得清",
    "你试着打开窗户，但是窗户紧闭着，看不到外面",
    action([
      [
        "砸开窗户",
        "smash-window-success",
        [{ type: "power", minValue: 4 }],
        "smash-window-fail",
      ],
      ["去打开病房门", "open-door-save"],
    ]),
  ],
  "smash-window-success": [
    "你拿凳子砸开了窗户，发现自己身处高楼",
    "外面一片模糊，仿佛罩了一层布",
    "但神奇的是，月亮却清晰可见",
    "看起来你可以沿着窗户外的边缘爬行，但风险很高，不过可以值得尝试",
    action([
      ["爬墙", "climb-success", fullPower, "climb-fail"],
      ["还是去开门", "open-door-save"],
    ]),
  ],
  "smash-window-fail": [
    "你的力量实在是太小了，拿凳子都没能把窗户砸破",
    "还是另寻他路吧",
    action([["去打开病房门", "open-door-save"]]),
  ],
  "climb-success": [
    "你如同超人一般，爬墙对你来说如同小儿科",
    "你甚至可以选择往上或者往下",
    action([
      ["往上去天台", "rooftop-save"],
      ["回到病房开门", "open-door-save"],
      ["爬下去逃离", "bad-end"],
    ]),
  ],
  "climb-fail": [
    "你的力量、技巧、智慧和幸运似乎不足以支持你爬上墙",
    "你不小心失手脱落",
    "从高楼摔了下去",
    endAction,
  ],
  "open-door-save": [
    "你转了转门把手，门把手因为年久失修就脱落了，你打开房门",
    "外面一片寂静，开门声充斥着走廊",
    "你顺着走廊走着，走廊的尽头是个安全通道，或许能从这儿出去？",
    "但是安全通道的锁非常坚固，你手上并没有钥匙",
    action([
      ["一拳干碎门锁", "one-punch-door", [{ type: "power", minValue: 7 }]],
      [
        "撬锁",
        "unlock-door-success",
        [{ type: "speed", minValue: 6 }],
        "unlock-door-fail",
      ],
      ["去探索周边", "explore-save"],
    ]),
  ],
  "one-punch-door": [
    "你力量超群，一拳干碎了门锁，超强的冲击波甚至击倒了大门",
    "你轻蔑一笑",
    action([
      ["进入通道", "corridor-save"],
      ["回去探索周边", "explore-save"],
    ]),
  ],
  "unlock-door-success": [
    "你技巧异常熟练，通过小别针就能轻易打开门锁",
    "在现实中你可能就是江洋大盗吧",
    action([
      ["进入通道", "corridor-save"],
      ["回去探索周边", "explore-save"],
    ]),
  ],
  "unlock-door-fail": [
    "你的技巧并不熟练，门锁对你来说还是太难了",
    "还是另寻他路吧",
    action([["去探索周边", "explore-save"]]),
  ],
  "corridor-save": [
    "你来到安全通道",
    "往上是通往天台，往下是通往大厅，你要选择？",
    action([
      ["往上", "corridor-up"],
      ["往下", "corridor-down"],
    ]),
  ],
  "corridor-up": [
    "你在上楼途中，突然背后听到了脚步声",
    "你回头发现是一只怪物正在楼梯上追着你",
    action(
      [
        [
          "跑！",
          "up-run-success",
          [{ type: "speed", minValue: 7 }],
          "run-fail",
        ],
        [
          "一脚踢飞",
          "up-kick-success",
          [
            { type: "power", minValue: 6 },
            { type: "speed", minValue: 6 },
          ],
          "kick-fail",
        ],
      ],
      5
    ),
  ],
  "corridor-down": [
    "你在下楼途中，突然背后听到了脚步声",
    "你回头发现是一只怪物正在楼梯上追着你",
    action(
      [
        ["跑！", "down-run-success"],
        [
          "一脚踢飞",
          "down-kick-success",
          [
            { type: "power", minValue: 6 },
            { type: "speed", minValue: 6 },
          ],
          "kick-fail",
        ],
      ],
      5
    ),
  ],
  "up-run-success": [
    "你练过技巧，上楼飞快，怪物根本追不上你的斯比得",
    "...",
    "...",
    "没一会儿怪物就被甩在后头没了动静",
    action([["继续", "rooftop-save"]]),
  ],
  "down-run-success": [
    "你下楼跑得飞快，怪物下楼速度反而异常缓慢",
    "...",
    "...",
    "没一会儿怪物就被甩在后头没了动静",
    action([["继续", "hall-save"]]),
  ],
  "run-fail": [
    "因为你是上楼，想要跑得比怪物快需要技巧",
    "但你的缺乏技巧的锻炼，被怪物追上了",
    endAction,
  ],
  "up-kick-success": [
    "你虚晃一脚，怪物没抓住，你又是一脚",
    "怪物被一脚踹下楼梯，挣扎了几下，就没法动弹了",
    action([
      ["继续上楼", "rooftop-save"],
      ["去楼下", "hall-save"],
    ]),
  ],
  "down-kick-success": [
    "你虚晃一脚，怪物没抓住，你又是一脚",
    "怪物被一脚踹下楼梯，挣扎了几下，就没法动弹了",
    action([
      ["还是上楼看看", "rooftop-save"],
      ["继续下楼", "hall-save"],
    ]),
  ],
  "kick-fail": [
    "你一脚朝怪物踢去",
    "没想到被怪物抓住了脚",
    "你的力量和技巧不足以让你挣脱怪物",
    "你被怪物从楼上扔了下去",
    endAction,
  ],

  "explore-save": [
    "你探索了周边",
    "这边的房间并不是很多",
    action([
      ["去管理室", "find-trap", [{ type: "luck", minValue: 7 }], "enter-trap"],
      ["去消毒间", "clean-room-with-lock"],
      ["去厕所", "toilet-room"],
      ["去药品室", "pill-room-with-lock"],
    ]),
  ],
  "find-trap": [
    "你运气很好，无意间瞄到了管理室门口的陷阱",
    "你绕了过去，“谁想害我！他妈的！”你大骂道",
    action([["进入管理室", "manager-room"]]),
  ],
  "enter-trap": [
    "你刚踏进门，就感觉踩到了一根线",
    "突然周边的机关四起",
    "眼看就要朝你袭来",
    action(
      [
        ["朝左 - 桌子后", "avoid-fail"],
        ["朝右 - 门后", "avoid-success"],
      ],
      5
    ),
  ],
  "avoid-fail": [
    "你朝着桌子后面躲去",
    "没想到桌子后还有一个机关",
    "你被击中",
    endAction,
  ],
  "avoid-success": [
    "你朝门后躲去",
    "机关全都打空了",
    "“是谁！到底是谁会在办公室里放机关！！！他妈的！”",
    action([["继续", "manager-room"]]),
  ],
  "manager-room": [
    "你来到了管理室",
    "这里都是抽屉",
    "你一个个翻着，终于在一个抽屉里找到了一串钥匙",
    "这串钥匙应该可以打开这个走廊的不同房间",
    action([
      ["去安全通道", "corridor-save"],
      ["查看抽屉内侧", "find-msg-1", [{ type: "wise", minValue: 6 }]],
      ["去消毒间", "clean-room"],
      ["去厕所", "toilet-room"],
      ["去药品室", "pill-room"],
    ]),
  ],
  "clean-room": [
    "你来到消毒间，这儿啥也没有",
    "但你在储物柜发现了一张纸条",
    "是否查看？",
    action([
      ["查看纸条", "find-msg-3"],
      ["去安全通道", "corridor-save"],
      ["去厕所", "toilet-room"],
      ["去药品室", "pill-room"],
    ]),
  ],
  "clean-room-with-lock": [
    "房门被锁住了，或许某处能拿到钥匙",
    action([
      ["去管理室", "find-trap", [{ type: "luck", minValue: 6 }], "enter-trap"],
      ["去厕所", "toilet-room"],
      ["去药品室", "pill-room-with-lock"],
    ]),
  ],
  "toilet-room": [
    "你来到厕所，大概想着能在这儿找到什么吧",
    "毕竟好多游戏喜欢把钥匙道具藏马桶里",
    "或许掏一掏能发现什么",
    "你发现墙上的镜子有些诡异：竟然一片漆黑，仿佛黑洞一般",
    "突然厕所门关上了",
    action([
      ["打碎镜子", "find-void", fullPower],
      ["什么也做不了", "wait-to-death"],
    ]),
  ],
  "wait-to-death": [
    "镜子中的黑暗逐渐扩大，你没法动弹",
    "你看见镜子中有一个人正在盯着你",
    "“虚空...”你嘴里说着，马上就失去了意识",
    endAction,
  ],
  "find-void": [
    "你目中不屑，充满了神力，一拳干碎了“镜子”",
    "或者称之为“虚空之门”更贴切",
    "虚空的通道打开更大了，你能看清虚空之内有个人正在监视",
    action([["进入虚空", "enter-void"]]),
  ],
  "enter-void": [
    "你来到虚空，虚空中的人对你的到来感到惊讶",
    "他知道你的力量凌驾于他之上，他开口：",
    "“你已经获得神之力，为何不接替我掌管此处？你能获得你想要的一切，现实和梦境，都归你控制。”",
    "你询问他为什么把他拉到这里，对方说：",
    "“制造一处噩梦，观察他们怎么逃脱而已，纯属是乐子罢了。我见过很多逃出去的，但你是第一个来到这里的，怎么样？接替我吧”",
    action([
      ["我拒绝！", "best-ending"],
      ["我接受！", "evil-ending"],
    ]),
  ],
  "pill-room": [
    "你来到药品室，这儿啥也没有",
    "但你在储物柜发现了一张纸条",
    "是否查看？",
    action([
      ["查看纸条", "find-msg-2"],
      ["去安全通道", "corridor-save"],
      ["去消毒间", "clean-room"],
      ["去厕所", "toilet-room"],
    ]),
  ],
  "pill-room-with-lock": [
    "房门被锁住了，或许某处能拿到钥匙",
    action([
      ["去管理室", "find-trap", [{ type: "luck", minValue: 5 }], "enter-trap"],
      ["去消毒间", "clean-room-with-lock"],
      ["去厕所", "toilet-room"],
    ]),
  ],
  "find-msg-1": [
    "你翻看抽屉内侧，发现了一张纸条，上面写着：",
    "“梦境世界死去，现实世界魂飞魄散；如不抵达虚空，受害者源源不断，你不是第一个，也不是最后一个”",
    "你毛骨悚然，显然这里是梦境，但按照纸条所说，这里死去，现实也就死了",
    "虚空？虚空又是哪儿？",
    action([
      ["去安全通道", "corridor-save"],
      ["去消毒间", "clean-room"],
      ["去厕所", "toilet-room"],
      ["去药品室", "pill-room"],
    ]),
  ],
  "find-msg-2": [
    "你找到了一张纸条，上面写着：",
    "“梦境消除装置可破除此梦境，第一步需要设**频**4**3”",
    "后面就被撕碎了，或许能在其他地方找到另一半",
    action([
      ["去安全通道", "corridor-save"],
      ["去消毒间", "clean-room"],
      ["去厕所", "toilet-room"],
    ]),
  ],
  "find-msg-3": [
    "你找到了一张纸条，上面写着：",
    "“第**步设置图**：**方**”",
    "“恶搞是吧！就喜欢这种谜语人是吧！”你生气着骂道",
    action([
      ["去安全通道", "corridor-save"],
      ["去厕所", "toilet-room"],
      ["去药品室", "pill-room"],
    ]),
  ],
  "hall-save": [
    "你来到楼下大厅，发现这儿有只怪物在大门口徘徊",
    "而钥匙就挂在附近的墙上",
    "得想办法吸引它的注意力",
    action([
      [
        "蛮王冲撞！",
        "rush-success",
        [
          { type: "power", minValue: 8 },
          { type: "speed", minValue: 7 },
        ],
        "rush-fail",
      ],
      ["潜行", "sneak-success"],
    ]),
  ],
  "rush-success": [
    "你充满力量，宛如火车，任何靠近你的东西都会被你装得粉碎",
    "怪物也朝你撞来",
    "“不自量力”，你轻蔑一笑，怪物瞬间被撞飞",
    "你的冲击力顺便撞破了大门",
    action([["继续", "bad-end"]]),
  ],
  "rush-fail": [
    "你过于自大，你力量和技巧不够",
    "导致你的冲撞威力极小，怪物将你撞倒在地",
    endAction,
  ],
  "sneak-success": [
    "你偷偷潜伏到怪物附近，得想个办法吸引它的注意力",
    "你附近有个玻璃瓶，或许能有用",
    action([
      [
        "直接潜行去偷钥匙",
        "take-key-success",
        [
          { type: "speed", minValue: 6 },
          { type: "luck", minValue: 4 },
        ],
        "take-key-fail",
      ],
      ["丢到怪物前面吸引", "drop-bottle"],
    ]),
  ],
  "drop-bottle": [
    "你丢了玻璃瓶到怪物前面",
    "怪物果然被吸引了",
    action(
      [
        ["现在去拿钥匙", "get-key-now"],
        ["再等一会儿", "get-key-later"],
      ],
      7
    ),
  ],
  "get-key-now": [
    "你当机立断，趁着怪物刚被吸引就出去拿钥匙",
    "果然，怪物没一会儿就朝你原来的位置过去了",
    "你拿着钥匙赶紧开门",
    action([["继续", "bad-end"]]),
  ],
  "get-key-later": [
    "你保险起见又等了一会儿，没想到怪物就朝你走来",
    "你的位置被暴露了",
    action(
      [
        [
          "胡乱一拳",
          "punch-whatever-success",
          [{ type: "power", minValue: 8 }],
          "punch-whatever-fail",
        ],
      ],
      5
    ),
  ],
  "punch-whatever-success": [
    "你慌乱中胡乱打出了一拳",
    "你拥有无穷的力量，一拳就把怪物揍飞了",
    "你顺利拿到了钥匙",
    action([["继续", "bad-end"]]),
  ],
  "punch-whatever-fail": [
    "你胡乱打出一圈，因为力量不够",
    "怪物一点感觉也没有，你被怪物抓住",
    endAction,
  ],
  "take-key-success": [
    "你灵活的身形，以及强大的幸运力让你轻松偷到钥匙",
    "怪物还没发现你，你就已经到达门口开门了",
    action([["继续", "bad-end"]]),
  ],
  "take-key-fail": [
    "你打算直接去偷钥匙",
    "但是你发出的声响吸引了怪物",
    "你没能来得及跑掉",
    endAction,
  ],
  "rooftop-save": [
    "你来到了天台，发现上面有一台装置",
    "装置上写着“梦境消除装置”",
    "上面有几个选项，你要选择哪一个？",
    action([
      ["打开开关", "switch-on-fail"],
      ["设置频率", "settings-frequency", [{ type: "wise", minValue: 3 }]],
      ["设置图形", "settings-image-first"],
      ["去楼下", "hall-save"],
    ]),
  ],
  "settings-frequency": [
    "你充满智慧，发现除了开关和图形，还能选择设置频率",
    "下面的频率有很多，如果设置错误，也不知道会发生什么",
    action(
      [
        ["频率 - 491", "settings-fail"],
        ["频率 - 453", "settings-fail"],
        ["频率 - 413", "settings-image"],
        ["频率 - 404", "settings-fail"],
        ["频率 - 478", "settings-fail"],
      ],
      15
    ),
  ],
  "settings-image": [
    "貌似频率设置成功了，你来到了下一步",
    "下面需要选择图形才能解锁开关",
    action(
      [
        ["三角形", "settings-fail"],
        ["正方形", "settings-fail"],
        ["梯形", "settings-fail"],
        ["长方形", "settings-success"],
        ["圆形", "settings-fail"],
      ],
      15
    ),
  ],
  "settings-image-first": [
    "你选择设置图形，如果设置错误，可能会发生可怕的事情",
    action(
      [
        ["三角形", "settings-fail"],
        ["正方形", "settings-fail"],
        ["梯形", "settings-fail"],
        ["长方形", "settings-fail"],
        ["圆形", "settings-fail"],
      ],
      15
    ),
  ],
  "settings-fail": [
    "你选择了错误的设置，装置突然自己启动了",
    "周围世界开始消失，仿佛被吞噬了",
    "最后，你和这个装置也被吞噬了",
    endAction,
  ],
  "settings-success": [
    "你选择了正确的图形",
    "装置好像已经准备就绪",
    "只要打开开关，说不定就能逃出去了？",
    action([["打开开关", "good-end"]]),
  ],

  "switch-on-fail": [
    "你打开了梦境消除装置的开关",
    "周围世界开始消失，仿佛被吞噬了",
    "最后，你和这个装置也被吞噬了",
    endAction,
  ],

  "bad-end": [
    "你终于逃离了这个医院",
    "但外面的世界你无所知，面对一片荒芜模糊的世界",
    "你真的逃离出去了吗？",
    "还是进入另一片噩梦之地",
    "你不得而知，只能前进",
    "达成结局：坏",
    finishAction,
  ],
  "good-end": [
    "你成功打开了梦境消除装置",
    "原本朦胧模糊的世界开始变得清晰可见",
    "月亮的光芒同时也越来越强烈",
    "你被光芒刺得睁不开眼",
    "再次睁眼时，你发现自己躺在家里的床上",
    "真的是场梦，但这场梦如此真实",
    "你欣慰的笑了，还好回到现实了",
    "但与此同时，世界上另一个人进入了这个噩梦...",
    "达成结局：好",
    finishAction,
  ],
  "best-ending": [
    "“说得很好啊，但是！我拒绝！”你一拳打在对方的脑壳上",
    "他痛苦倒下，你如同核弹爆炸般的力量，让对方的脑壳炸裂了",
    "他化为灰烬被虚空吞噬，最后虚空逐渐消散",
    "一阵光芒闪过，你已经在自己的床上了",
    "“原来是场梦啊”你微微一笑",
    "因为虚空之神的死去，世上不会再有人被拉入噩梦中了",
    "达成完美结局",
    finishAction,
  ],
  "evil-ending": [
    "“不错的提议”你欣然接受了",
    "对方狂笑，变成了一束紫黑色的光芒，飞入了你的身体",
    "你接受了这股力量，再原本他之上更加强大",
    "你把这个医院改造的更加恐怖可怕，每晚被拉入此处的人越来越多...",
    "多年后，你的面孔仿佛当初那个人...",
    "达成邪恶结局",
    finishAction,
  ],
  "end-noselect": ["你愣住了，什么也没做", "被作者制裁了", endAction],
};
