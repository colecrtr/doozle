import { firebase } from "services/firebase";

export default abstract class Model {
  static async getOrCallback(
    ref: firebase.firestore.DocumentReference,
    callback: CallableFunction
  ): Promise<any> {
    /* TODO:
     * - Add local storage caching with expiration (e.g., re-fetch after model instance is > 30 minutes old)
     */

    return callback();
  }

  static getDocRef(
    collection: firebase.firestore.CollectionReference,
    id: string
  ): firebase.firestore.DocumentReference {
    return collection.doc(id);
  }

  static getDefaultCreateFields() {
    return { createdAt: firebase.firestore.FieldValue.serverTimestamp() };
  }

  static getDefaultUpdateFields() {
    return { updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
  }

  constructor(
    readonly collection: firebase.firestore.CollectionReference,
    readonly id: string
  ) {}

  get exists() {
    return this.id !== "";
  }

  get ref() {
    return this.collection.doc(this.id);
  }
}
