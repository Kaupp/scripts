// ==UserScript==
// @name         New Userscript
// @namespace    https://github.com/Kaupp/scripts
// @version      1
// @description  try to take over the world!
// @author       You
// @match        https://www.csgodouble.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CFG - Final
var initialBetAmount = 5; //baştaki bet parası

var betColor = 'black'; // başlangıç rengi

var betLimit = 21; //bet parası bunu geçince kurtarmaya oynuyor, kurtardığı zaman bet miktarını düşürüyor

var betReduction = 64; //betlimit geçildiğinde ne kadarda birine indirileceği, şu an işlevsiz


// CFG SONU

function tick() { //server kontrol
    var a = getStatus();
    if (a !== lastStatus && "unknown" !== a) {
        switch (a) {
            case "waiting": //beklemedeyse beti oyna
                bet();
                break;
            case "rolled": //çevrildiyse rolleda devam et
                rolled()
        } 
        lastStatus = a, printInfo() //son durumu yazdır
    }
}

function checkBalance() { //balance o anki bet parasından azsa mesajı yaz ve çık
    return getBalance() < currentBetAmount ? (console.warn("SIÇTIN! SONRAKI BETE PARAN YOK"), clearInterval(refreshIntervalId), !1) : !0
}

function printInfo() { //anlık durum bas
    var a = " \nDurum: " + lastStatus + "\nOynanan Bet: " + currentRollNumber + "\nBaşlangıçtaki bet parası: " + initialBetAmount + "\nŞu anki bet parası: " + currentBetAmount + "\nSon bet sonucu: " + (null === wonLastRoll() ? "-" : wonLastRoll() ? "kazandı" : "kaybetti");
    console.log(a)
}
function rolled() {
    return betControl(), void currentRollNumber++
}

function betControl() { 
    if(wonLastRoll() && currentBetAmount >= betLimit){
    currentBetAmount = initialBetAmount // sınırı geçince başa dön
    }
    else currentBetAmount = wonLastRoll() ? currentBetAmount : 2 * currentBetAmount // kaybettiyse 2ye katla kazandıysa aynen devam
}

function bet() { //balance'ı kontrol et iyiyse oyna
    checkBalance() && (setBetAmount(currentBetAmount), setTimeout(placeBet, 50))
}

function setBetAmount(a) { //bet inputunu siteye yolla
    $betAmountInput.val(a)
}

function placeBet() { //beti son kazanan renge çevir oyna
    betColor = lastRollColor
    return "red" === betColor ? ($redButton.click(), void(lastBetColor = "red")) : ($blackButton.click(), void(lastBetColor = "black"))
}

function getStatus() { //texte göre durumu yaz
    var a = $statusBar.text();
    if (hasSubString(a, "Rolling in")) return "waiting";
    if (hasSubString(a, "***ROLLING***")) return "rolling";
    if (hasSubString(a, "rolled")) {
        var b = parseInt(a.split("rolled")[1]);
        return lastRollColor = getColor(b), "rolled"
    }
    return "unknown"
}

function getBalance() { //balance'ı çek
    return parseInt($balance.text())
}

function hasSubString(a, b) { //substring kontrolü
    return a.indexOf(b) > -1
}

function getColor(a) { //rengi çek
    return 0 == a ? "green" : a >= 1 && 7 >= a ? "red" : "black"
}

function wonLastRoll() { //son bet durumu kontrol
    return lastBetColor ? lastRollColor === lastBetColor : null
}
var currentBetAmount = initialBetAmount, //variableları çek, gerekenleri tanımla
    currentRollNumber = 1,
    lastStatus, lastBetColor, lastRollColor, $balance = $("#balance"),
    $betAmountInput = $("#betAmount"),
    $statusBar = $(".progress #banner"),
    $redButton = $("#panel1-7 .betButton"),
    $blackButton = $("#panel8-14 .betButton"),
    refreshIntervalId = setInterval(tick, 500);
})();