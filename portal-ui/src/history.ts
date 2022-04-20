import { createBrowserHistory } from "history";
import { BrowserHistoryBuildOptions } from "history/createBrowserHistory";

let browserHistoryOpts: BrowserHistoryBuildOptions = {};

let basename = document.baseURI.replace(window.location.origin, "");
// check if we are using base path, if not this always is `/`
const baseLocation = new URL(document.baseURI);
export const baseUrl = baseLocation.pathname;

if (basename !== "") {
  browserHistoryOpts.basename = basename;
}

export default createBrowserHistory(browserHistoryOpts);
