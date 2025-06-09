/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/css/rekomendasi.css":
/*!*********************************!*\
  !*** ./src/css/rekomendasi.css ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://capstone-project-webpack/./src/css/rekomendasi.css?");

/***/ }),

/***/ "./src/js/rekomendasi.js":
/*!*******************************!*\
  !*** ./src/js/rekomendasi.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_rekomendasi_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/rekomendasi.css */ \"./src/css/rekomendasi.css\");\n// import Map from './map.js';\n// import 'leaflet/dist/leaflet.css';\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  // Inisialisasi peta\n  if ('geolocation' in navigator) {\n    navigator.geolocation.getCurrentPosition(function (position) {\n      var latitude = position.coords.latitude;\n      var longitude = position.coords.longitude;\n      console.log('Latitude:', latitude);\n      console.log('Longitude:', longitude);\n\n      // Simpan lokasi di localStorage / kirim ke backend / tampilkan\n    }, function (error) {\n      console.error('Gagal mendapatkan lokasi:', error.message);\n    });\n  } else {\n    console.error('Geolocation tidak didukung browser ini.');\n  }\n  var togglePassword = document.getElementById('togglePassword');\n  var passwordInput = document.getElementById('password');\n  if (togglePassword && passwordInput) {\n    togglePassword.addEventListener('click', function () {\n      // toggle the type attribute\n      var type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';\n      passwordInput.setAttribute('type', type);\n\n      // toggle the eye icon\n      this.classList.toggle('fa-eye');\n      this.classList.toggle('fa-eye-slash');\n    });\n  }\n\n  // Mobile Sidebar Toggle\n  var mobileMenuIcon = document.querySelector('.mobile-menu-icon');\n  var mobileSidebar = document.querySelector('.mobile-sidebar');\n  var closeSidebar = document.querySelector('.close-sidebar');\n  var overlay = document.querySelector('.overlay');\n  var body = document.body;\n  function openSidebar() {\n    if (mobileSidebar) {\n      mobileSidebar.style.left = '0';\n    }\n    if (overlay) {\n      overlay.style.display = 'block';\n    }\n    if (body) {\n      body.classList.add('sidebar-open');\n      body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open\n    }\n  }\n  function closeSidebarMenu() {\n    if (mobileSidebar) {\n      mobileSidebar.style.left = '-250px';\n    }\n    if (overlay) {\n      overlay.style.display = 'none';\n    }\n    if (body) {\n      body.classList.remove('sidebar-open');\n      body.style.overflow = ''; // Restore scrolling\n    }\n  }\n\n  // Open sidebar when clicking the menu icon\n  if (mobileMenuIcon) {\n    mobileMenuIcon.addEventListener('click', openSidebar);\n  }\n\n  // Close sidebar when clicking the close button\n  if (closeSidebar) {\n    closeSidebar.addEventListener('click', closeSidebarMenu);\n  }\n\n  // Close sidebar when clicking the overlay\n  if (overlay) {\n    overlay.addEventListener('click', closeSidebarMenu);\n  }\n\n  // Close sidebar when clicking a navigation link\n  var mobileNavLinks = document.querySelectorAll('.mobile-nav a');\n  if (mobileNavLinks) {\n    mobileNavLinks.forEach(function (link) {\n      link.addEventListener('click', closeSidebarMenu);\n    });\n  }\n\n  // You can add form submission handling here if needed\n  // const loginForm = document.getElementById('loginForm');\n  // if (loginForm) {\n  //     loginForm.addEventListener('submit', function (event) {\n  //         event.preventDefault();\n  //         // Handle login logic here\n  //         console.log('Form submitted');\n  //     });\n  // }\n});\ndocument.getElementById(\"beranda\").addEventListener(\"click\", function () {\n  window.location.href = \"beranda.html\";\n});\n\n//# sourceURL=webpack://capstone-project-webpack/./src/js/rekomendasi.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/rekomendasi.js");
/******/ 	
/******/ })()
;