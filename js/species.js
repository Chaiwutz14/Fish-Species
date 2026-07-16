/* =======================================================================
   species.js — ตรรกะหน้ารายชื่อสายพันธุ์ (ค้นหา + กรองหมวดหมู่)
   ======================================================================= */
(function () {
  "use strict";

  var grid = document.getElementById("speciesGrid");
  var empty = document.getElementById("emptyState");
  var countEl = document.getElementById("resultCount");
  var searchInput = document.getElementById("searchInput");
  var filterWrap = document.getElementById("filters");
  if (!grid || !window.FISH_DATA) return;

  var state = { cat: "all", q: "" };

  /* อ่านหมวดหมู่จาก URL เช่น species.html?cat=rare */
  var params = new URLSearchParams(window.location.search);
  var urlCat = params.get("cat");
  if (urlCat) state.cat = urlCat;

  function cardHTML(f) {
    var st = STATUS_LABELS[f.statusLevel];
    var chips = f.categories.map(function (c) {
      var cat = CATEGORY_LABELS[c];
      return cat ? '<span class="chip ' + cat.cls + '">' + cat.icon + " " + cat.label + "</span>" : "";
    }).join("");
    return '' +
      '<article class="species-card">' +
        '<a class="species-media" href="species-detail.html?id=' + f.id + '" aria-label="ดูรายละเอียด ' + f.name + '">' +
          '<span class="species-status ' + st.cls + '">' + st.label + "</span>" +
          '<img src="' + f.image + '" alt="' + f.name + " (" + f.nameEn + ')" loading="lazy">' +
        "</a>" +
        '<div class="species-body">' +
          "<h3>" + f.name + "</h3>" +
          '<p class="species-sci">' + f.sci + "</p>" +
          '<p class="species-tagline">' + f.tagline + "</p>" +
          '<div class="chips">' + chips + "</div>" +
          '<div class="species-cta">' +
            '<a class="species-link" href="species-detail.html?id=' + f.id + '">ดูรายละเอียด →</a>' +
          "</div>" +
        "</div>" +
      "</article>";
  }

  function matches(f) {
    var byCat = state.cat === "all" || f.categories.indexOf(state.cat) !== -1;
    var q = state.q.trim().toLowerCase();
    var byQ = !q ||
      f.name.toLowerCase().indexOf(q) !== -1 ||
      f.nameEn.toLowerCase().indexOf(q) !== -1 ||
      f.sci.toLowerCase().indexOf(q) !== -1 ||
      (f.localNames || "").toLowerCase().indexOf(q) !== -1;
    return byCat && byQ;
  }

  function render() {
    var list = FISH_DATA.filter(matches);
    grid.innerHTML = list.map(cardHTML).join("");
    empty.style.display = list.length ? "none" : "block";
    countEl.textContent = "พบ " + list.length + " สายพันธุ์" +
      (state.cat !== "all" ? " ในหมวดที่เลือก" : "");
  }

  function setActiveButton() {
    var btns = filterWrap.querySelectorAll(".filter-btn");
    btns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-cat") === state.cat);
    });
  }

  filterWrap.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter-btn");
    if (!btn) return;
    state.cat = btn.getAttribute("data-cat");
    setActiveButton();
    render();
  });

  searchInput.addEventListener("input", function () {
    state.q = searchInput.value;
    render();
  });

  setActiveButton();
  render();
})();
