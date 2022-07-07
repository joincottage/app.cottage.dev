"use strict";
(() => {
var exports = {};
exports.id = 790;
exports.ids = [790];
exports.modules = {

/***/ 97:
/***/ ((module) => {

module.exports = require("@sentry/nextjs");

/***/ }),

/***/ 294:
/***/ ((module) => {

module.exports = require("airtable");

/***/ }),

/***/ 582:
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ 207:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ getDataFromAirtable)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(362);

async function getDataFromAirtable({ tableName , filterByFormula =""  }) {
    const data1 = await new Promise((resolve, reject)=>{
        const data = [];
        (0,_base__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(tableName).select({
            filterByFormula,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
                data.push(record.fields);
            });
            fetchNextPage();
        }, function done(err) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(data);
        });
    });
    return {
        data: data1
    };
};


/***/ }),

/***/ 501:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ validateUser)
});

;// CONCATENATED MODULE: external "axios"
const external_axios_namespaceObject = require("axios");
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_namespaceObject);
;// CONCATENATED MODULE: ./src/apiService/softr/validateUser.ts

// https://docs.softr.io/my-account/api-settings#validate-an-authentication-token
async function validateUser(jwt) {
    const response = await external_axios_default().post("https://sequense.softr.app/v1/api/users/validate-token", {
        jwt
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.data;
};


/***/ }),

/***/ 690:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_apiService_softr_validateUser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(501);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(582);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var src_utils_runMiddleware__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(125);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(97);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _apiService_corsOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(860);
/* harmony import */ var src_apiService_airtable_getDataFromAirtable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(207);






async function handler(req, res) {
    await (0,src_utils_runMiddleware__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(req, res, cors__WEBPACK_IMPORTED_MODULE_1___default()(_apiService_corsOptions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z));
    const isValidUser = await (0,src_apiService_softr_validateUser__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(req.query.jwtToken);
    if (!isValidUser) {
        res.status(401).send("Unauthorized");
        return;
    }
    switch(req.method){
        case "GET":
            {
                const { data: taskLists  } = await (0,src_apiService_airtable_getDataFromAirtable__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)({
                    tableName: "Task Lists"
                });
                res.json(taskLists);
                break;
            }
        default:
            {
                console.error(`Unsupported method type ${req.method} made to endpoint ${req.url}`);
                res.status(404).end();
                break;
            }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.withSentry)(handler));


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [382], () => (__webpack_exec__(479), __webpack_exec__(112), __webpack_exec__(485), __webpack_exec__(690)));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=tasklist-templates.js.map