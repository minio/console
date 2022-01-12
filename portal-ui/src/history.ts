import { createBrowserHistory } from "history";
import { BrowserHistoryBuildOptions } from "history/createBrowserHistory";

let browserHistoryOpts: BrowserHistoryBuildOptions = {};

let basename = document.baseURI.replace(window.location.origin, "");

if (basename !== "") {
  browserHistoryOpts.basename = basename;
}

export default createBrowserHistory(browserHistoryOpts);
