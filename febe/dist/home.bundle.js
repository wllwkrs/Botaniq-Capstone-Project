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

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://capstone-project-webpack/./src/css/style.css?");

/***/ }),

/***/ "./src/js/home.js":
/*!************************!*\
  !*** ./src/js/home.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/style.css */ \"./src/css/style.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var togglePassword = document.getElementById('togglePassword');\n  var passwordInput = document.getElementById('password');\n  if (togglePassword && passwordInput) {\n    togglePassword.addEventListener('click', function () {\n      var type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';\n      passwordInput.setAttribute('type', type);\n\n      // toggle the eye icon\n      this.classList.toggle('fa-eye');\n      this.classList.toggle('fa-eye-slash');\n    });\n  }\n\n  // Mobile Sidebar Toggle\n  var mobileMenuIcon = document.querySelector('.mobile-menu-icon');\n  var mobileSidebar = document.querySelector('.mobile-sidebar');\n  var closeSidebar = document.querySelector('.close-sidebar');\n  var overlay = document.querySelector('.overlay');\n  var body = document.body;\n  function openSidebar() {\n    mobileSidebar.style.left = '0';\n    overlay.style.display = 'block';\n    body.classList.add('sidebar-open');\n    body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open\n  }\n  function closeSidebarMenu() {\n    mobileSidebar.style.left = '-250px';\n    overlay.style.display = 'none';\n    body.classList.remove('sidebar-open');\n    body.style.overflow = ''; // Restore scrolling\n  }\n\n  // Open sidebar when clicking the menu icon\n  mobileMenuIcon.addEventListener('click', openSidebar);\n\n  // Close sidebar when clicking the close button\n  closeSidebar.addEventListener('click', closeSidebarMenu);\n\n  // Close sidebar when clicking the overlay\n  overlay.addEventListener('click', closeSidebarMenu);\n\n  // Close sidebar when clicking a navigation link\n  var mobileNavLinks = document.querySelectorAll('.mobile-nav a');\n  mobileNavLinks.forEach(function (link) {\n    link.addEventListener('click', closeSidebarMenu);\n  });\n\n  // You can add form submission handling here if needed\n  // const loginForm = document.getElementById('loginForm');\n  // if (loginForm) {\n  //     loginForm.addEventListener('submit', function (event) {\n  //         event.preventDefault();\n  //         // Handle login logic here\n  //         console.log('Form submitted');\n  //     });\n  // }\n});\ndocument.getElementById(\"signup-button\").addEventListener(\"click\", function () {\n  window.location.href = \"register.html\";\n});\ndocument.getElementById(\"start\").addEventListener(\"click\", function () {\n  window.location.href = \"register.html\";\n});\ndocument.getElementById(\"signin-button\").addEventListener(\"click\", function () {\n  window.location.href = \"login.html\";\n});\ndocument.getElementById(\"rekomendasi\").addEventListener(\"click\", function () {\n  window.location.href = \"login.html\";\n});\ndocument.getElementById(\"manajemen\").addEventListener(\"click\", function () {\n  window.location.href = \"login.html\";\n});\n\n//# sourceURL=webpack://capstone-project-webpack/./src/js/home.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/home.js");
/******/ 	
/******/ })()
;