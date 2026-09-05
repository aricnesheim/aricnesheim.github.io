/* analytics.js — visitor counts for aricnesheim.com, via GoatCounter.
   GoatCounter sets no cookies, stores no personal data, and needs no consent
   banner. The dashboard is private and shows up on the Admin page.

   To switch it on: create the account at goatcounter.com, then put the site
   code (the CODE in CODE.goatcounter.com) in the line below and push. Until
   then this file does nothing. Local previews are never counted, and any
   browser with localStorage.skipgc = "t" (the switch on the Admin page) is
   skipped by GoatCounter itself. */

(function () {
  var CODE = "";
  if (!CODE) return;
  if (location.hostname !== "aricnesheim.com") return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + CODE + ".goatcounter.com/count");
  document.head.appendChild(s);
})();
