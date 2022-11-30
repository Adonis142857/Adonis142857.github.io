/* copyright (c)2002-2010 Eric Fredricksen all rights reserved */


function Roll(stat) {
  stats[stat] = 3 + Random(6) + Random(6) + Random(6);
  if (document)
    $("#"+stat).text(stats[stat]);
  return stats[stat];
}

function Choose(n, k) {
  var result = n;
  var d = 1;
  for (var i = 2; i <= k; ++i) {
    result *= (1+n-i);
    d = d * i;
  }
  return result / d;
}

var stats = {};
var traits = {};
var total = 0;
var seedHistory = [];

function RollEm() {
  stats.seed = randseed();
  total = 0;
  var best = -1;
  $.each(K.PrimeStats, function () {
    total += Roll(this);
    if (best < stats[this]) {
      best = stats[this];
      stats.best = this;
    }
  });
  stats['HP Max'] = Random(8) + stats.CON.div(6);
  stats['MP Max'] = Random(8) + stats.INT.div(6);

  var color =
    (total >= (63+18)) ? 'red'    :
    (total > (4 * 18)) ? 'yellow' :
    (total <= (63-18)) ? 'grey'   :
    (total < (3 * 18)) ? 'silver' :
    'white';

  if (document) {
    var Total = $("#Total");
    Total.text(total);
    Total.css("background-color", color);

    $("#Unroll").attr("disabled", !seedHistory.length);
  }
}

function RerollClick() {
  seedHistory.push(stats.seed);
  RollEm();
}


function UnrollClick() {
  randseed(seedHistory.pop());
  RollEm();
}

function fill(e, a, n) {
  var def = Random(a.length);
  for (var i = 0; i < a.length; ++i) {
    var v = a[i].split("|")[0];
    var check = (def == i) ? " checked " : " ";
    if (def == i) traits[n] = v;
    if (document) {
      $("<div><input type=radio id='" + v + "' name=\"" + n + "\" value=\"" + v + "\" " +
        check  +"><label for='" + v + "'>" + cnItem(v) + "</label></div>").appendTo(e);
    }
  }
}

function NewGuyFormLoad() {
  seed = new Alea();
  RollEm();
  GenClick();

  fill("#races", K.Races, "Race");
  fill("#classes", K.Klasses, "Class");

  if (document) {
    $("#Reroll").click(RerollClick);
    $("#Unroll").click(UnrollClick);
    $("#RandomName").click(GenClick);
    $('#Sold').click(sold);
    $('#quit').click(cancel);

    //var caption = 'Progress Quest - New Character';
    //if (MainForm.GetHostName != '')
      //  caption = caption + ' [' + MainForm.GetHostName + ']';

    $("#Name").focus();
    $("#Name").select();
  }

  if (window.location.href.indexOf("?sold") > 0)
    sold();  // TODO: cheesy
}


if (document)
  $(document).ready(NewGuyFormLoad);


function sold() {
  var newguy = {
    Traits: traits,
    dna: stats.seed,
    seed: stats.seed,
    birthday: ''+new Date(),
    birthstamp: +new Date(),
    Stats: stats,
    beststat: stats.best + " " + stats[stats.best],
    task: "",
    tasks: 0,
    elapsed: 0,
    bestequip: "Sharp Rock",
    Equips: {},
    Inventory: [['Gold', 0]],
    Spells: [],
    act: 0,
    bestplot: "Prologue",
    Quests: [],
    questmonster: "",
    kill: "Loading....",
    ExpBar: { position: 0, max: LevelUpTime(1) },
    EncumBar: { position: 0, max: stats.STR + 10 },
    PlotBar: { position: 0, max: 26 },
    QuestBar: { position: 0, max: 1 },
    TaskBar: { position: 0, max: 2000 },
    queue: [
      'task|10|Experiencing an enigmatic and foreboding night vision',
      "task|6|Much is revealed about that wise old bastard you'd underestimated",
      'task|6|A shocking series of events leaves you alone and bewildered, but resolute',
      'task|4|Drawing upon an unrealized reserve of determination, you set out on a long and dangerous journey',
      'plot|2|Loading'
    ]
  };

  if (document) {
    newguy.Traits.Name = $("#Name").val();
    newguy.Traits.Race = $("input:radio[name=Race]:checked").val();
    newguy.Traits.Class = $("input:radio[name=Class]:checked").val();
  }
  newguy.Traits.Level = 1;

  newguy.date = newguy.birthday;
  newguy.stamp = newguy.birthstamp;

  $.each(K.Equips, function (i,equip) { newguy.Equips[equip] = ''; });
  newguy.Equips.Weapon = newguy.bestequip;
  newguy.Equips.Hauberk = "-3 Burlap";


  if ($("#multiplayer:checked").length > 0) {
    newguy.online = {
      realm: "Alpaquil",
      host: "http://progressquest.com/alpaquil.php?",
      // host: "http://localhost:9001/alpaquil.php?",
    }

    $("#sold").prop("disabled", true);
    $("body").css("cursor", "progress");

    let url = newguy.online.host;
    url += 'cmd=create' +
           '&name=' + UrlEncode(newguy.Traits.Name) +
           '&realm=' + UrlEncode(newguy.online.realm) +
           RevString;
    $.ajax(url)
    .done(body => {
      if (body.split('|')[0].toLowerCase() == 'ok') {
         newguy.online.passkey = parseInt(body.split('|')[1]);
         charIsBorn(newguy);
      } else {
        $("#sold").prop("disabled", false);
        $("body").css("cursor", "default");
        alert(body);
      }
    });
  } else {
    charIsBorn(newguy);
  }
}


function charIsBorn(newguy) {
  storage.addToRoster(newguy, function () {
    window.location.href = "main.html#" + escape(newguy.Traits.Name);
  });
}

function cancel() {
  window.location.href = "roster.html";
}

function GenClick() {
  traits.Name = GenerateName();
  if (document)
    $("#Name").attr("value", traits.Name);
}

