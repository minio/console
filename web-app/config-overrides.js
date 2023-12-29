const rewireReactHotLoader = require("react-app-rewire-hot-loader");

/* config-overrides.js */
module.exports = function override(config, env) {
  if (env === "development") {
    config.resolve.alias["react-dom"] = "@hot-loader/react-dom";
  }
  config = rewireReactHotLoader(config, env);
  return config;
};

const { override, addBabelPlugins } = require("customize-cra");

console.log("add babel plugin");

module.exports = override(
  process.env.USE_BABEL_PLUGIN_ISTANBUL &&
    addBabelPlugins("babel-plugin-istanbul"),
);
