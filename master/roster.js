
function b64_decode(value) {
  return JSON.parse(decodeURIComponent(escape(atob(value))));
}

function b64_stringify(value) {
   return btoa(unescape(encodeURIComponent(JSON.stringify(value))));
}


function load() {

  if (!window.localStorage) {
    roster.html("<b>Hrumph:</b> This browser does not support local storage. You can still play fast and loose: your character will live only as long as the game stays running in your browser.");
    return;
  }

  storage.loadRoster(loadGames);

  window.addEventListener("dragover", e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });
  window.addEventListener("drop", e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    let files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      files[i].text().then(sheet => {
        try {
          sheet = sheet.replace(/\s/g, "");
          sheet = b64_decode(sheet);
          storage.loadRoster(games => {
            if (!games[sheet.Traits.Name] ||
                confirm(`A character named ${sheet.Traits.Name} already exists. Overwrite it?`)) {
              storage.addToRoster(sheet, () => storage.loadRoster(loadGames));
            }
          });
        } catch(err) {
          console.log(err);
          setTimeout(() => alert("Invalid character data", 1));
        }

      });
    }

  });

}

function loadGames(games) {
  var roster = $("#roster");
  roster.empty();

  var newone = window.location.href.split('#')[1];

  var count = 0;

  $.each(games, function (key, c) {
    var name = c.Traits.Name;

    var br = brag(c);
    roster.append(br);
    br.find("a.go").attr("href", "main.html#" + escape(name));

    br.find("a.x").click(function () {
      if (confirm("Terminate " + Pick(["faithful","noble","loyal","brave"])+
                  " " + name + "?")) {
        delete games[name];
        storage.storeRoster(games);
        load();
      }
    });

    br.find("a.sheet").click(function () {
      alert(template($("#sheet").html(), games[name]));
      // TODO: put in a window or whatev
    });

    br.find("a.save").attr("href",
      `data:text/plain;name=${name}.pqw,${b64_stringify(c)}`);
    br.find("a.save").attr("download", `${name}.pqw`);

    if (name === newone)
      br.addClass("lit");

    br.click(e => {
      if (e.altKey) {
        let text = b64_stringify(c);
        text = text.match(/.{1,80}/g).join('\n');
        $("dialog#copy pre").text(text);
        $("dialog#copy span").text(name);
         sel = window.getSelection();
         window.setTimeout(() => {
          let range = document.createRange();
          range.selectNodeContents($("dialog#copy pre")[0]);
          sel.removeAllRanges();
          sel.addRange(range);
        }, 1);
        $("dialog#copy")[0].showModal();
        // window.prompt("Copy to clipboard", text);
      }
    });
    br.find("a.go").attr("data-downloadurl", `text/plain:${name}.pqw:data:text/plain,${b64_stringify(c)}`);

    ++count;
  });
  if (!count)
    roster.html("<i>Games you start can be loaded from this page, but no saved games were found. Roll up a new character to get started.</i>");
}


function brag(sheet) {
  var brag = $(template($("#badge").html(), sheet));
  if (sheet.motto) {
    brag.find(".bs").text('"' + sheet.motto + '"');
  }
  if (sheet.online) {
    brag.addClass("online");
    brag.find(".bs").text("Realm of " + sheet.online.realm);
    brag.find(".icon.go").html("&#x273F;");
  }
  return brag;
}

function clearRoster() {
  storage.storeRoster({}, load);
}

$(document).ready(function () {

  load();

  $("#roll").click(function () {
    window.location = "newguy.html";
  });

  $("#test").click(function () {
    window.location = "newguy.html?sold";
  });

  $("#clear").click(clearRoster);
});
