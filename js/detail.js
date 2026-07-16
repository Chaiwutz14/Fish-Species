/* =======================================================================
   detail.js — สร้างหน้ารายละเอียดสายพันธุ์แบบไดนามิกจาก data.js
   อ่านรหัสจาก species-detail.html?id=xxx
   ======================================================================= */
(function () {
  "use strict";

  var hero = document.getElementById("detailHero");
  var main = document.getElementById("detailMain");
  if (!hero || !main || !window.FISH_DATA) return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var fish = FISH_DATA.filter(function (f) { return f.id === id; })[0];

  /* หากไม่พบรหัสปลา */
  if (!fish) {
    hero.innerHTML =
      '<div class="container">' +
        '<nav class="breadcrumb"><a href="index.html">หน้าแรก</a> / <a href="species.html">สายพันธุ์ปลา</a> / ไม่พบข้อมูล</nav>' +
        "<h1>ไม่พบสายพันธุ์ที่ต้องการ</h1>" +
        "<p>ขออภัย ไม่พบข้อมูลปลาที่คุณเรียกดู</p>" +
      "</div>";
    main.innerHTML =
      '<div class="container"><div class="empty-state">' +
        "🐟 ลองกลับไปเลือกสายพันธุ์จากหน้ารวมอีกครั้ง<br><br>" +
        '<a class="btn btn-primary" href="species.html">← กลับไปหน้าสายพันธุ์ปลา</a>' +
      "</div></div>";
    document.title = "ไม่พบข้อมูล | คลังความรู้ปลาน้ำจืดไทย";
    return;
  }

  document.title = fish.name + " (" + fish.nameEn + ") | คลังความรู้ปลาน้ำจืดไทย";

  var st = STATUS_LABELS[fish.statusLevel];
  var isThreatened = ["vuln", "endangered", "critical"].indexOf(fish.statusLevel) !== -1;

  var chips = fish.categories.map(function (c) {
    var cat = CATEGORY_LABELS[c];
    return cat ? '<span class="chip">' + cat.icon + " " + cat.label + "</span>" : "";
  }).join("");

  /* ---------------------- HERO ---------------------- */
  hero.innerHTML =
    '<div class="container">' +
      '<nav class="breadcrumb" aria-label="เส้นทาง"><a href="index.html">หน้าแรก</a> / <a href="species.html">สายพันธุ์ปลา</a> / ' + fish.name + "</nav>" +
      '<div class="detail-top">' +
        '<figure class="detail-figure">' +
          '<img src="' + fish.image + '" alt="' + fish.name + " (" + fish.nameEn + ')">' +
        "</figure>" +
        '<div class="detail-intro">' +
          "<h1>" + fish.name + "</h1>" +
          '<p class="sci">' + fish.sci + " · วงศ์ " + fish.family + "</p>" +
          '<p class="tagline">' + fish.tagline + "</p>" +
          '<div class="detail-meta">' +
            '<span class="chip">🏷️ ' + st.label + "</span>" + chips +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>";

  /* ---------------------- QUICK FACTS (side) ---------------------- */
  var quickRows = Object.keys(fish.quick).map(function (k) {
    return '<div class="row"><dt>' + k + "</dt><dd>" + fish.quick[k] + "</dd></div>";
  }).join("");

  var sideHTML =
    '<aside class="detail-side">' +
      '<div class="quick-facts">' +
        "<h3>📋 ข้อมูลสรุป</h3>" +
        "<dl>" + quickRows + "</dl>" +
      "</div>" +
      '<div class="quick-facts" style="margin-top:18px">' +
        "<h3>🔖 การจำแนก</h3>" +
        "<dl>" +
          '<div class="row"><dt>ชื่อสามัญ (EN)</dt><dd>' + fish.nameEn + "</dd></div>" +
          '<div class="row"><dt>ชื่อวิทยาศาสตร์</dt><dd><em>' + fish.sci + "</em></dd></div>" +
          '<div class="row"><dt>วงศ์</dt><dd>' + fish.family + "</dd></div>" +
          '<div class="row"><dt>อันดับ</dt><dd>' + fish.order + "</dd></div>" +
          '<div class="row"><dt>ชื่อพื้นเมือง</dt><dd>' + fish.localNames + "</dd></div>" +
        "</dl>" +
      "</div>" +
    "</aside>";

  /* ---------------------- MAIN CONTENT ---------------------- */
  var statusBanner =
    '<div class="status-banner level-' + fish.statusLevel + '">' +
      '<span class="ic">' + (isThreatened ? "⚠️" : "✅") + "</span>" +
      "<div><strong>สถานะการอนุรักษ์: " + fish.status + "</strong>" +
      (isThreatened
        ? "ปลาชนิดนี้อยู่ในภาวะถูกคุกคาม โปรดร่วมกันอนุรักษ์ ไม่จับ ไม่ซื้อขายจากธรรมชาติ และช่วยกันรักษาแหล่งน้ำ"
        : "ยังพบได้ทั่วไป แต่ควรใช้ประโยชน์อย่างยั่งยืนและรักษาคุณภาพแหล่งน้ำไว้") +
      "</div></div>";

  var sections = fish.sections.map(function (s) {
    return '<div class="content-block"><h2>' + s.h + "</h2><p>" + s.p + "</p></div>";
  }).join("");

  var factsHTML =
    '<div class="facts-box">' +
      "<h3>💡 เกร็ดน่ารู้</h3><ul>" +
      fish.facts.map(function (t) { return "<li>" + t + "</li>"; }).join("") +
      "</ul></div>";

  /* ปลาก่อนหน้า/ถัดไป */
  var idx = FISH_DATA.indexOf(fish);
  var prev = FISH_DATA[(idx - 1 + FISH_DATA.length) % FISH_DATA.length];
  var next = FISH_DATA[(idx + 1) % FISH_DATA.length];
  var navHTML =
    '<div class="detail-nav">' +
      '<a class="btn btn-outline btn-sm" href="species-detail.html?id=' + prev.id + '">← ' + prev.name + "</a>" +
      '<a class="btn btn-outline btn-sm" href="species.html">ทั้งหมด</a>' +
      '<a class="btn btn-outline btn-sm" href="species-detail.html?id=' + next.id + '">' + next.name + " →</a>" +
    "</div>";

  var mainHTML =
    '<article class="detail-main">' +
      statusBanner +
      sections +
      factsHTML +
      navHTML +
    "</article>";

  main.innerHTML = '<div class="container"><div class="detail-body">' + sideHTML + mainHTML + "</div></div>";
})();
