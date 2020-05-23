import { trackPromise as _trackPromise } from "react-promise-tracker";

export const trackPromise = (
  promise: Promise<any | void>
): Promise<any | void> => {
  _trackPromise(promise);
  return promise;
};
