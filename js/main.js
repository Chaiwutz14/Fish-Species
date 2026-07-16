/* =======================================================================
   main.js — สคริปต์ส่วนกลางที่ใช้ร่วมกันทุกหน้า
   - สร้างแถบเมนู (navbar) พร้อมปุ่มแฮมเบอร์เกอร์สำหรับมือถือ
   - สร้างส่วนท้ายเว็บ (footer) พร้อมข้อความหน่วยงานผู้พัฒนา
   - เอฟเฟกต์เลื่อนขึ้นเมื่อ scroll (reveal on scroll)
   ======================================================================= */
(function () {
  "use strict";

  /* รายการเมนูหลัก ใช้ร่วมกันทุกหน้า */
  var NAV_ITEMS = [
    { href: "index.html",   label: "หน้าแรก" },
    { href: "species.html", label: "สายพันธุ์ปลา" },
    { href: "news.html",    label: "คลังความรู้" },
    { href: "about.html",   label: "ผู้จัดทำ" }
  ];

  var ORG_NAME = "ศูนย์ส่งเสริมการเรียนรู้ระดับอำเภอเมืองพัทลุง";

  /* หาไฟล์ปัจจุบันเพื่อไฮไลต์เมนูที่กำลังเปิดอยู่ */
  function currentPage() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  /* ---------------------------------------------------------------- Navbar */
  function buildNavbar() {
    var mount = document.getElementById("site-nav");
    if (!mount) return;

    var active = currentPage();
    // species-detail ให้ไฮไลต์เมนู "สายพันธุ์ปลา"
    if (active === "species-detail.html") active = "species.html";

    var links = NAV_ITEMS.map(function (item) {
      var isActive = item.href === active ? " active" : "";
      var current = item.href === active ? ' aria-current="page"' : "";
      return '<li><a class="nav-link' + isActive + '" href="' + item.href + '"' + current + ">" +
             item.label + "</a></li>";
    }).join("");

    mount.innerHTML =
      '<nav class="navbar" aria-label="เมนูหลัก">' +
        '<div class="container navbar-inner">' +
          '<a class="brand" href="index.html">' +
            '<span class="brand-mark" aria-hidden="true">🐟</span>' +
            '<span class="brand-text">' +
              '<span class="brand-title">ปลาน้ำจืดไทย</span>' +
              '<span class="brand-sub">คลังความรู้เพื่อการอนุรักษ์</span>' +
            "</span>" +
          "</a>" +
          '<button class="nav-toggle" id="navToggle" aria-label="เปิด/ปิดเมนู" aria-expanded="false" aria-controls="navMenu">' +
            '<span></span><span></span><span></span>' +
          "</button>" +
          '<ul class="nav-links" id="navMenu">' + links + "</ul>" +
        "</div>" +
      "</nav>";

    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("is-active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // ปิดเมนูเมื่อคลิกลิงก์ (มือถือ)
    menu.addEventListener("click", function (e) {
      if (e.target.classList.contains("nav-link")) {
        menu.classList.remove("open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------------- Footer */
  function buildFooter() {
    var mount = document.getElementById("site-footer");
    if (!mount) return;

    var year = new Date().getFullYear() + 543; // พ.ศ.
    var navCols = NAV_ITEMS.map(function (i) {
      return '<li><a href="' + i.href + '">' + i.label + "</a></li>";
    }).join("");

    mount.innerHTML =
      '<footer class="site-footer">' +
        '<div class="container footer-grid">' +
          '<div class="footer-about">' +
            '<div class="footer-brand"><span aria-hidden="true">🐟</span> คลังความรู้ปลาน้ำจืดไทย</div>' +
            "<p>แหล่งเรียนรู้ออนไลน์เกี่ยวกับสายพันธุ์ปลาน้ำจืดของไทย " +
            "ระบบนิเวศแหล่งน้ำ และการอนุรักษ์ทรัพยากรสัตว์น้ำ เพื่อการศึกษาแก่ประชาชนทุกช่วงวัยโดยไม่มีค่าใช้จ่าย</p>" +
          "</div>" +
          '<nav class="footer-nav" aria-label="ลิงก์ส่วนท้าย">' +
            "<h4>เมนูลัด</h4>" +
            "<ul>" + navCols + "</ul>" +
          "</nav>" +
          '<div class="footer-contact">' +
            "<h4>เกี่ยวกับโครงการ</h4>" +
            "<ul>" +
              "<li>สื่อการเรียนรู้เพื่อการศึกษา</li>" +
              "<li>เผยแพร่ฟรีเพื่อสาธารณประโยชน์</li>" +
              "<li>ส่งเสริมการอนุรักษ์สัตว์น้ำไทย</li>" +
            "</ul>" +
          "</div>" +
        "</div>" +
        '<div class="footer-bar">' +
          '<div class="container footer-bar-inner">' +
            '<p class="footer-org">พัฒนาโดย ' + ORG_NAME + "</p>" +
            '<p class="footer-copy">© ' + year + " · สงวนลิขสิทธิ์เพื่อการศึกษา</p>" +
          "</div>" +
        "</div>" +
      "</footer>";
  }

  /* ------------------------------------------------- Reveal on scroll (UX) */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------- ปุ่มเลื่อนขึ้นบนสุด */
  function initBackToTop() {
    var btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "เลื่อนขึ้นบนสุด");
    btn.innerHTML = "↑";
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildNavbar();
    buildFooter();
    initReveal();
    initBackToTop();
  });
})();
