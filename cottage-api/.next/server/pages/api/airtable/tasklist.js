"use strict";
(() => {
var exports = {};
exports.id = 401;
exports.ids = [401];
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

/***/ 773:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_apiService_airtable_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(362);
/* harmony import */ var src_apiService_softr_validateUser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(501);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(582);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var src_utils_runMiddleware__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(125);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(97);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _apiService_corsOptions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(860);






async function handler(req, res) {
    await (0,src_utils_runMiddleware__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(req, res, cors__WEBPACK_IMPORTED_MODULE_2___default()(_apiService_corsOptions__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z));
    const isValidUser = await (0,src_apiService_softr_validateUser__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(req.query.jwtToken);
    if (!isValidUser) {
        res.status(401).send("Unauthorized");
        return;
    }
    switch(req.method){
        case "POST":
            {
                const fields = req.body.fields;
                if (!fields) {
                    res.status(400).send("Bad Request");
                    return;
                }
                (0,src_apiService_airtable_base__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Task List Instances").create([
                    {
                        fields
                    }, 
                ], function(err, records) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error creating records");
                        return;
                    }
                    res.json(records[0].fields);
                });
                break;
            }
        case "PATCH":
            {
                if (!req.query.taskListId || !req.body.fields) {
                    res.status(400).send("Bad Request");
                    return;
                }
                // @ts-ignore
                (0,src_apiService_airtable_base__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Task List Instances").update([
                    {
                        id: req.query.taskListId,
                        fields: req.body.fields
                    }, 
                ], function(err, records) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error updating tasklist");
                        return;
                    }
                    res.json(records[0].fields);
                });
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_sentry_nextjs__WEBPACK_IMPORTED_MODULE_3__.withSentry)(handler));


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [382], () => (__webpack_exec__(479), __webpack_exec__(112), __webpack_exec__(485), __webpack_exec__(773)));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=tasklist.js.map