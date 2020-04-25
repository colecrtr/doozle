import * as React from "react";
import { BarLoader } from "react-spinners";
import { palette } from "./theme";
import { usePromiseTracker } from "react-promise-tracker";

const LoadingBar = (_props: any) => {
    const { promiseInProgress } = usePromiseTracker();

    return promiseInProgress ? (
        <BarLoader  loading={true} width="100%" height={2} color={palette.blue[5]} />
    ) : (
        <div style={{ width: "100%", height: "2px", backgroundColor: palette.blue[1] }}></div>
    );
};

export default LoadingBar;