
/**
 * Overrides the default react webpack config so it can handle apache-arrow .mjs files
*/
module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
        resolve: {
            fullySpecified: false
        }
      });
    
    return config;
}