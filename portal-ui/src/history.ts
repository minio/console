import { createBrowserHistory } from "history";
import { BrowserHistoryBuildOptions } from "history/createBrowserHistory";

let browserHistoryOpts: BrowserHistoryBuildOptions = {};

/**
 * Turns URL path into router basename by removing everything after the last slash
 * @param {string} path URL path, probably window.location.pathname
 * @returns {string} final basename
 */
 function getBasename(path: string): string {
  return path.substr(0, path.lastIndexOf('/'));
}

export let baseUrl = getBasename(window.location.pathname);

if (`${window.location.pathname}`.startsWith(`${baseUrl}/api/proxy/`)) {
  // grab from api to the tenant name (`${baseUrl}/api/proxy/namespace/tenant`)
  const urlWithoutBasename = window.location.pathname.replace(baseUrl, "")
  const urlParts = urlWithoutBasename.split("/").slice(0, 5);
  browserHistoryOpts.basename = baseUrl + urlParts.join("/");
} else {
  browserHistoryOpts.basename = baseUrl;
}

export default createBrowserHistory(browserHistoryOpts);
