"use strict";
(() => {
var exports = {};
exports.id = 690;
exports.ids = [690];
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

/***/ 453:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var src_apiService_airtable_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(362);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(582);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var src_utils_runMiddleware__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(125);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(97);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _apiService_corsOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(860);
/* harmony import */ var src_apiService_airtable_getDataFromAirtable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(207);






async function handler(req, res) {
    await (0,src_utils_runMiddleware__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(req, res, cors__WEBPACK_IMPORTED_MODULE_1___default()(_apiService_corsOptions__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z));
    // const isValidUser = await validateUser(req.query.jwtToken as string);
    // if (!isValidUser) {
    //   res.status(401).send("Unauthorized");
    //   return;
    // }
    switch(req.method){
        case "GET":
            {
                if (!req.query.recordId) {
                    res.status(400).send("Bad Request");
                    return;
                }
                const { data: submission  } = await (0,src_apiService_airtable_getDataFromAirtable__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)({
                    tableName: "Tasks",
                    filterByFormula: `{Record ID} = '${req.query.recordId}'`
                });
                res.json(submission);
                break;
            }
        case "POST":
            {
                const fields = req.body.fields;
                if (!fields) {
                    res.status(400).send("Bad Request");
                    return;
                }
                (0,src_apiService_airtable_base__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Tasks").create([
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
                if (!req.query.recordId || !req.body.fields) {
                    res.status(400).send("Bad Request");
                    return;
                }
                // @ts-ignore
                (0,src_apiService_airtable_base__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Tasks").update([
                    {
                        id: req.query.recordId,
                        fields: req.body.fields
                    }, 
                ], function(err, records) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error updating task");
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_sentry_nextjs__WEBPACK_IMPORTED_MODULE_2__.withSentry)(handler));


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [382], () => (__webpack_exec__(479), __webpack_exec__(112), __webpack_exec__(485), __webpack_exec__(453)));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=tasks.js.map