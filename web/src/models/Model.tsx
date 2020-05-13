import { firebase } from "services/firebase";

export default class Model {
    static async getOrCallback(ref: firebase.firestore.DocumentReference, callback: CallableFunction): Promise<any> {
        /* TODO:
         * - Add local storage caching with expiration (e.g., re-fetch after model instance is > 30 minutes old)
         */

         return callback();
    }

    constructor(readonly uid: null | string) {}

    get exists() {
        return this.uid !== null;
    }
}