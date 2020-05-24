import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import { isProduction } from "helpers/consts";
import App from "./components/App";

Sentry.init({
  dsn:
    "https://6e461e34086b42749c1aa092a966bfbe@o205093.ingest.sentry.io/5251897",
  environment: isProduction ? "production" : "development",
  enabled: isProduction,
});

ReactDOM.render(<App />, document.getElementById("root"));
