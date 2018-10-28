// ==UserScript==
// @name         Export BBCODE mmorpg-stat
// @namespace    https://www.mmorpg-stat.eu/comparaison.php?*
// @version      1.0.2
// @description  Generate an export in BBOCDE from the table of comparison for forum.
// @author       Choubakawa (Ogame.fr uni Fornax)
// @match        https://www.mmorpg-stat.eu/comparaison.php?*
// @supportURL   https://github.com/Choubakawa/Export-BBCODE-mmorpg-stat/issues
// @updateURL    https://openuserjs.org/meta/Choubakawa/Export_BBCODE_mmorpg-stat.meta.js
// @downloadURL  https://openuserjs.org/install/Choubakawa/Export_BBCODE_mmorpg-stat.user.js
// @license MIT
// ==/UserScript==
var title = $.trim( $( document.getElementsByTagName('table')[12].getElementsByTagName('tbody')[0] ).text() );
var thead = $('#myTable > thead');
var colTheadLength = thead[0].rows[0].cells.length;
var tbody = $('#myTable > tbody');
var rowTbodyLength = tbody[0].rows.length;
var sameAlliance = true;
let titlePseudo = $.trim( $(thead[0].rows[0].cells[0]).text() );
titlePseudo = titlePseudo.substr(0,1).toUpperCase()+titlePseudo.substr(1);
let titleAlliance = $.trim( $(thead[0].rows[0].cells[1]).text() );
titleAlliance = titleAlliance.substr(0,1).toUpperCase()+titleAlliance.substr(1);
let titlePlace = $.trim( $(thead[0].rows[0].cells[2]).text() );
titlePlace = titlePlace.substr(0,1).toUpperCase()+titlePlace.substr(1);
let titleProgPlaceOfDay = "+/-";
let titlePoints = $.trim( $(thead[0].rows[0].cells[4]).text() );
titlePoints = titlePoints.substr(0,1).toUpperCase()+titlePoints.substr(1);
let titleProgPointsOfDay = "+/-";
let titlePeriode = $.trim( $(thead[0].rows[0].cells[6]).text() );
titlePeriode = titlePeriode.substr(0,1).toUpperCase()+titlePeriode.substr(1);
let titleProgPoint = $.trim( $(thead[0].rows[0].cells[7]).text() );
titleProgPoint = titleProgPoint.substr(0,1).toUpperCase()+titleProgPoint.substr(1);
let titlePourcentage = $.trim( $(thead[0].rows[0].cells[8]).text() );
titlePourcentage = titlePourcentage.substr(0,1).toUpperCase()+titlePourcentage.substr(1);
let titleProgPointPerDay = $.trim( $(thead[0].rows[0].cells[9]).text() );
titleProgPointPerDay = titleProgPointPerDay.substr(0,1).toUpperCase()+titleProgPointPerDay.substr(1);

let cookie = getValueInCookie( "checkedCols");
if( cookie.length !== 0 ) {
    cookie = JSON.parse( cookie );
}

//add checkboxes to table
var checkboxes = $('<tr></tr>');
for(var j=0; j<colTheadLength; j++){
    var col = thead[0].rows[0].cells[j];
    let id = 'colStat'+j;
    let checked = "";
    if( cookie.length !== 0 ) {
        checked = cookie[j];
    } else {
       checked = "checked";
    }
    if( j != 6 )
        $( checkboxes ).append( '<td><input type="checkbox" id="'+id+'" '+ checked +'/></td>' );
    else
        $( checkboxes ).append( '<td><input type="checkbox" id="colStat'+j+'" /></td>' );
}
thead.append( checkboxes );

$( '#myTable' ).append( '<tfoot><tr><td colspan="10"><input type="button" id="exportButton" value="Export" /></td></tr></tfoot>' );


function getPlayers() {
    let players = [];
    //get infos players
    for(let i=0; i<rowTbodyLength; i++){
        var row = tbody[0].rows[i];
        let player = {
            pseudo : $.trim($( row.cells[0] ).text() ),
            alliance : $.trim($( row.cells[1] ).text().replace('[','').replace(']','') ),
            place : $.trim($( row.cells[2] ).text() ),
            progPlaceOfDay : $.trim($( row.cells[3] ).text().replace('(','').replace(')','') ),
            point : $.trim($( row.cells[4] ).text() ),
            progPointOfDay : $.trim($( row.cells[5] ).text().replace('(','').replace(')','') ),
            periode : $.trim($( row.cells[6] ).text() ),
            progPoint : $.trim($( row.cells[7] ).text() ),
            pourcentage : $.trim($( row.cells[8] ).text().replace('(','').replace(')','') ),
            progPointPerDay : $.trim($( row.cells[9] ).text() ),
        };
        players.push( player );
    }
    for( let y = 1; y<players.length; y++ ) {
        if( players[y-1].alliance !== players[y].alliance ) {
            sameAlliance = false;
            break;
        }
    }
    if( sameAlliance ) {
        $('#colStat1').prop('checked', false);
    }
    return players;
}

function generate( players ) {
    let thPseudo = $('#colStat0').is(':checked') ? "[td]"+titlePseudo+"[/td]" : "";
    let thAlliance = "";
    let thPlace = $('#colStat2').is(':checked') ? "[td]"+titlePlace+"[/td]" : "";
    let thProgPlaceOfDay = $('#colStat3').is(':checked') ? "[td]"+titleProgPlaceOfDay+"[/td]" : "";
    let thPoints = $('#colStat4').is(':checked') ? "[td]"+titlePoints+"[/td]" : "";
    let thProgPointsOfDay = $('#colStat5').is(':checked') ? "[td]"+titleProgPointsOfDay+"[/td]" : "";
    let thPeriode = $('#colStat6').is(':checked') ? "[td]"+titlePeriode+"[/td]" : "";
    let thProgPoint = $('#colStat7').is(':checked') ? "[td]"+titleProgPoint+"[/td]" : "";
    let thPourcentage = $('#colStat8').is(':checked') ? "[td]"+titlePourcentage+"[/td]" : "";
    let thProgPointPerDay = $('#colStat9').is(':checked') ? "[td]"+titleProgPointPerDay+"[/td]" : "";
    let allianceTitle = "";
    if( !sameAlliance ) {
        thAlliance = $('#colStat1').is(':checked') ? "[td]"+titleAlliance+"[/td]" : "";
    } else {
        allianceTitle = " " + titleAlliance + ": [color=#8AD9FF][i]["+players[0].alliance+"][/i][/color] ";
    }
    let bbcode = "[center][b]" + title + "\n" + allianceTitle + "\n " + titlePeriode + " : " + players[0].periode + "[/b][table]" +
        "[tr]" +
        "[td] [/td]" +
        thPseudo +
        thAlliance +
        thPlace +
        thProgPlaceOfDay +
        thPoints +
        thProgPointsOfDay +
        thPeriode +
        thProgPoint +
        thPourcentage +
        thProgPointPerDay +
        "[/tr]";
    for( let i = 0; i<players.length; i++) {
        let index = i + 1;
        let colorProgPlaceOfDay = players[i].progPlaceOfDay.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        let colorPoint = players[i].progPointOfDay.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        let colorProgPoint = players[i].progPoint.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        let colorPourcentage = players[i].pourcentage.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        let colorProgPointPerDay = players[i].progPointPerDay.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        let pseudo = $('#colStat0').is(':checked') ? "[td][color=#17B4FF]" + players[i].pseudo + "[/color][/td]" : "";
        let alliance = "";
        if( !sameAlliance )
            alliance = $('#colStat1').is(':checked') ? "[td][color=#8AD9FF][i][" + players[i].alliance + "][/i][/color][/td]" : "";
        let place = $('#colStat2').is(':checked') ? "[td]" + players[i].place + "[/td]" : "";
        let progPlaceOfDay = $('#colStat3').is(':checked') ? "[td]" + colorProgPlaceOfDay + "(" + players[i].progPlaceOfDay + ")[/color][/td]" : "";
        let point = $('#colStat4').is(':checked') ? "[td]" + players[i].point + "[/td]"  : "";
        let progPointOfDay = $('#colStat5').is(':checked') ? "[td]" + colorPoint + "(" + players[i].progPointOfDay + ")[/color][/td]" : "";
        let periode = $('#colStat6').is(':checked') ? "[td]" + players[i].periode + "[/td]"  : "";
        let progPoint = $('#colStat7').is(':checked') ? "[td]" + colorProgPoint + players[i].progPoint + "[/color][/td]"  : "";
        let pourcentage = $('#colStat8').is(':checked') ? "[td]" + colorPourcentage + "(" + players[i].pourcentage + ")[/color][/td]"  : "";
        let progPointPerDay = $('#colStat9').is(':checked') ? "[td]" + colorProgPointPerDay + "(" + players[i].progPointPerDay + ")[/color][/td]"  : "";
        let rowBbcode = "[tr]\n" +
            "[td]" + index + "[/td]" +
            pseudo +
            alliance +
            place +
            progPlaceOfDay +
            point +
            progPointOfDay +
            periode +
            progPoint +
            pourcentage +
            progPointPerDay +
            "[/tr]\n";
        bbcode += rowBbcode;
    }
    bbcode += "[/table][/center][center][size=8]From www.mmorpg-stat.eu with [url=https://openuserjs.org/scripts/Choubakawa/Export_BBCODE_mmorpg-stat]Export BBCODE mmorpg-stat[/url] by [url=https://twitter.com/Choubakawa]Choubakawa[/url][/size][/center]";
    return bbcode;

}

function getValueInCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function saveInCookie() {
    let value = {
        0: $('#colStat0').is(':checked') ? "checked" : "",
        1: $('#colStat1').is(':checked') ? "checked" : "",
        2: $('#colStat2').is(':checked') ? "checked" : "",
        3: $('#colStat3').is(':checked') ? "checked" : "",
        4: $('#colStat4').is(':checked') ? "checked" : "",
        5: $('#colStat5').is(':checked') ? "checked" : "",
        6: $('#colStat6').is(':checked') ? "checked" : "",
        7: $('#colStat7').is(':checked') ? "checked" : "",
        8: $('#colStat8').is(':checked') ? "checked" : "",
        9: $('#colStat9').is(':checked') ? "checked" : ""
    };
    var d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();

    document.cookie = "checkedCols=" + JSON.stringify(value) + ";" + expires + ";path=/";
}

$("#exportButton").click(function () {
    let players = getPlayers();
    let bbcode = generate( players );
    saveInCookie();
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(bbcode).select();
    document.execCommand("copy");
    $temp.remove();
    $( '<p id=tempP>Copié !</p>' ).insertAfter( '#exportButton' );
    setTimeout(function () {
        $("#tempP").remove();
    }, 3000);
});