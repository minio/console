import { createBrowserHistory } from "history";
import { BrowserHistoryBuildOptions } from "history/createBrowserHistory";

let browserHistoryOpts: BrowserHistoryBuildOptions = {};

export let baseUrl = "";

if (`${window.location.pathname}`.startsWith("/api/proxy/")) {
  // grab from api to the tenant name (/api/proxy/namespace/tenant)
  const urlParts = `${window.location.pathname}`.split("/").slice(0, 5);
  browserHistoryOpts.basename = urlParts.join("/");
  baseUrl = urlParts.join("/");
}

export default createBrowserHistory(browserHistoryOpts);
