(() => {
var exports = {};
exports.id = 820;
exports.ids = [820];
exports.modules = {

/***/ 211:
/***/ (() => {

global.__rewriteFramesDistDir__ = '.next';


/***/ }),

/***/ 846:
/***/ (() => {

var _global = (typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}); _global.SENTRY_RELEASE={id:"SKFXDTkjPqd9kj55D3uqC"};

/***/ }),

/***/ 561:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(97);
/* harmony import */ var _sentry_nextjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sentry_nextjs__WEBPACK_IMPORTED_MODULE_0__);
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
_sentry_nextjs__WEBPACK_IMPORTED_MODULE_0__.init({
    dsn: SENTRY_DSN || 'https://2d1a45f8548f4801ac4828b62b16d87e@o1125793.ingest.sentry.io/6551216',
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1
});


/***/ }),

/***/ 169:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _error)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: external "next/error"
const error_namespaceObject = require("next/error");
var error_default = /*#__PURE__*/__webpack_require__.n(error_namespaceObject);
// EXTERNAL MODULE: external "@sentry/nextjs"
var nextjs_ = __webpack_require__(97);
;// CONCATENATED MODULE: ./src/pages/_error.js



const MyError = ({ statusCode , hasGetInitialPropsRun , err  })=>{
    if (!hasGetInitialPropsRun && err) {
        // getInitialProps is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // err via _app.js so it can be captured
        nextjs_.captureException(err);
    // Flushing is not required in this case as it only happens on the client
    }
    return(/*#__PURE__*/ jsx_runtime_.jsx((error_default()), {
        statusCode: statusCode
    }));
};
MyError.getInitialProps = async (context)=>{
    const errorInitialProps = await error_default().getInitialProps(context);
    const { res , err , asPath  } = context;
    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // getInitialProps has run
    errorInitialProps.hasGetInitialPropsRun = true;
    // Returning early because we don't want to log 404 errors to Sentry.
    if ((res === null || res === void 0 ? void 0 : res.statusCode) === 404) {
        return errorInitialProps;
    }
    // Running on the server, the response object (`res`) is available.
    //
    // Next.js will pass an err on the server if a page's data fetching methods
    // threw or returned a Promise that rejected
    //
    // Running on the client (browser), Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    componentDidMount, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html
    if (err) {
        nextjs_.captureException(err);
        // Flushing before returning is necessary if deploying to Vercel, see
        // https://vercel.com/docs/platform/limits#streaming-responses
        await nextjs_.flush(2000);
        return errorInitialProps;
    }
    // If this point is reached, getInitialProps was called without any
    // information about what the error might be. This is unexpected and may
    // indicate a bug introduced in Next.js, so record it in Sentry
    nextjs_.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`));
    await nextjs_.flush(2000);
    return errorInitialProps;
};
/* harmony default export */ const _error = (MyError);


/***/ }),

/***/ 97:
/***/ ((module) => {

"use strict";
module.exports = require("@sentry/nextjs");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(846), __webpack_exec__(211), __webpack_exec__(561), __webpack_exec__(169));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=_error.js.map