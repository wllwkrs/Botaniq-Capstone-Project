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

/***/ "./src/css/detail-kebun.css":
/*!**********************************!*\
  !*** ./src/css/detail-kebun.css ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://capstone-project-webpack/./src/css/detail-kebun.css?");

/***/ }),

/***/ "./src/js/detail-kebun.js":
/*!********************************!*\
  !*** ./src/js/detail-kebun.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_detail_kebun_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/detail-kebun.css */ \"./src/css/detail-kebun.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var token = localStorage.getItem(\"token\");\n  var BASE_API_URL = 'https://previously-notable-hound.ngrok-free.app';\n  if (!token) {\n    alert(\"Token tidak ditemukan. Silakan login ulang.\");\n    window.location.href = \"login.html\";\n    return;\n  }\n  fetch(\"\".concat(BASE_API_URL, \"/profile\"), {\n    method: 'GET',\n    headers: {\n      \"Authorization\": \"Bearer \".concat(token),\n      \"ngrok-skip-browser-warning\": \"true\"\n    }\n  }).then(function (res) {\n    if (!res.ok) {\n      if (res.status === 401) {\n        alert(\"Sesi Anda telah berakhir, silakan login ulang.\");\n        localStorage.removeItem(\"token\");\n        window.location.href = \"login.html\";\n      }\n      throw new Error(\"Gagal mengambil profil: \".concat(res.statusText));\n    }\n    return res.json();\n  }).then(function (data) {\n    var profile = data.data || {};\n    var profileImageUrl = profile.foto ? \"\".concat(BASE_API_URL, \"/uploads/\").concat(profile.foto) : \"assets/img/profile.jpeg\";\n    document.querySelectorAll(\".profile-circle img\").forEach(function (img) {\n      img.src = profileImageUrl;\n    });\n    document.querySelectorAll(\".profile-avatar-card\").forEach(function (img) {\n      img.src = profileImageUrl;\n    });\n  })[\"catch\"](function (err) {\n    console.error(\"Gagal ambil data user atau profil:\", err);\n    document.getElementById(\"greeting\").textContent = \"Gagal memuat profil ❌\";\n    document.querySelectorAll(\".profile-circle img, .profile-avatar-card\").forEach(function (img) {\n      img.src = \"assets/img/profile.jpeg\"; // Path ke gambar default \n    });\n  });\n  if ('geolocation' in navigator) {\n    navigator.geolocation.getCurrentPosition(function (position) {\n      var latitude = position.coords.latitude;\n      var longitude = position.coords.longitude;\n      console.log('Latitude:', latitude);\n      console.log('Longitude:', longitude);\n\n      // Simpan lokasi di localStorage / kirim ke backend / tampilkan\n    }, function (error) {\n      console.error('Gagal mendapatkan lokasi:', error.message);\n    });\n  } else {\n    console.error('Geolocation tidak didukung browser ini.');\n  }\n  var togglePassword = document.getElementById('togglePassword');\n  var passwordInput = document.getElementById('password');\n  if (togglePassword && passwordInput) {\n    togglePassword.addEventListener('click', function () {\n      // toggle the type attribute\n      var type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';\n      passwordInput.setAttribute('type', type);\n\n      // toggle the eye icon\n      this.classList.toggle('fa-eye');\n      this.classList.toggle('fa-eye-slash');\n    });\n  }\n\n  // Mobile Sidebar Toggle\n  var mobileMenuIcon = document.querySelector('.mobile-menu-icon');\n  var mobileSidebar = document.querySelector('.mobile-sidebar');\n  var closeSidebar = document.querySelector('.close-sidebar');\n  var overlay = document.querySelector('.overlay');\n  var body = document.body;\n  function openSidebar() {\n    mobileSidebar.style.left = '0';\n    overlay.style.display = 'block';\n    body.classList.add('sidebar-open');\n    body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open\n  }\n  function closeSidebarMenu() {\n    mobileSidebar.style.left = '-250px';\n    overlay.style.display = 'none';\n    body.classList.remove('sidebar-open');\n    body.style.overflow = ''; // Restore scrolling\n  }\n\n  // Open sidebar when clicking the menu icon\n  mobileMenuIcon.addEventListener('click', openSidebar);\n\n  // Close sidebar when clicking the close button\n  closeSidebar.addEventListener('click', closeSidebarMenu);\n\n  // Close sidebar when clicking the overlay\n  overlay.addEventListener('click', closeSidebarMenu);\n\n  // Close sidebar when clicking a navigation link\n  var mobileNavLinks = document.querySelectorAll('.mobile-nav a');\n  mobileNavLinks.forEach(function (link) {\n    link.addEventListener('click', closeSidebarMenu);\n  });\n\n  // You can add form submission handling here if needed\n  // const loginForm = document.getElementById('loginForm');\n  // if (loginForm) {\n  //     loginForm.addEventListener('submit', function (event) {\n  //         event.preventDefault();\n  //         // Handle login logic here\n  //         console.log('Form submitted');\n  //     });\n  // }\n\n  document.getElementById('logoutbtn').addEventListener('click', function (e) {\n    e.preventDefault();\n    localStorage.removeItem('token'); // ganti 'token' sesuai nama penyimpananmu\n    sessionStorage.removeItem('token');\n    fetch(\"\".concat(BASE_API_URL, \"/logout\"), {\n      method: 'POST'\n    }).then(function (res) {\n      return res.json();\n    }).then(function (data) {\n      console.log(data.message);\n      window.location.href = 'home.html';\n    })[\"catch\"](function (err) {\n      console.error('Logout error:', err);\n      window.location.href = 'home.html';\n    });\n  });\n});\ndocument.addEventListener('DOMContentLoaded', function () {\n  // Select the container where the calendar will be displayed\n  var calendarContainer = document.querySelector('.calendar-container');\n\n  // Initialize your chosen calendar library here.\n  // This is a placeholder. Replace with the actual initialization code for your library.\n  if (calendarContainer) {\n    // Example using a hypothetical library:\n    // new MyCalendarLibrary(calendarContainer, { options });\n\n    // Or if the library uses a different initialization method:\n    // MyCalendarLibrary.init(calendarContainer, { options });\n\n    console.log('Calendar container found, ready to initialize calendar.');\n    // Add your calendar initialization code here.\n    var options = {\n      // You can customize options here\n      date: {\n        selectedDates: ['2027-02-03'] // Highlight February 3rd, 2027\n      }\n    };\n    var calendar = new VanillaCalendar(calendarContainer, options);\n    calendar.init();\n  } else {\n    console.error('Calendar container not found.');\n  }\n});\n\n//# sourceURL=webpack://capstone-project-webpack/./src/js/detail-kebun.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/detail-kebun.js");
/******/ 	
/******/ })()
;