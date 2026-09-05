// Vercel owns the HTTP listener. Keep this function instance's app and pools warm.
module.exports = require('../backend/dist/src/app.js').default;
