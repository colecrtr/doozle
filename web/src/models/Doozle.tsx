import Model from "models/Model";
import { db, storage } from "services/firebase";
import UserProfile from "models/UserProfile";
import Answer from "models/Answer";
import Guess from "models/Guess";

export default class Doozle extends Model {
  static collection = db.collection("Doozles");

  static getDefaultCreateFields() {
    return { ...super.getDefaultCreateFields(), solved: false };
  }

  static getDoodleSVGStorageRef(id: string) {
    return storage.ref().child(`doodles/${id}.svg`);
  }

  static async create(
    user: UserProfile,
    answerString: string,
    doodleSVG: File
  ): Promise<Doozle> {
    /* Create Doozle Answer, create Doozle, upload Doozle doodle, update Answer with Doozle, and return Doozle. */

    const answerHint = answerString.replace(/[A-Z0-9]/g, "_");

    return Answer.create(user, answerString).then(async (answerObj) => {
      return Doozle.collection
        .add({
          ...Doozle.getDefaultCreateFields(),
          user: user.ref,
          answer: answerObj.ref,
          answerHint,
        })
        .then(async (docRef) => {
          const doozle = new Doozle(docRef.id, user, answerHint, [], false);

          return Doozle.getDoodleSVGStorageRef(doozle.id)
            .put(doodleSVG, { customMetadata: { userId: user.id } })
            .then(async (_snapshot) => {
              return answerObj.update(doozle).then(async (_answerObj) => {
                return doozle;
              });
            });
        });
    });
  }

  static empty(): Doozle {
    return new Doozle("", UserProfile.empty(), "", [], false);
  }

  constructor(
    readonly id: string,
    readonly user: UserProfile,
    readonly answerHint: string,
    readonly guesses: Array<Guess>,
    readonly solved: boolean
  ) {
    super(Doozle.collection, id);
  }

  get urlPath(): string {
    return `/!${this.id}`;
  }

  async getDoodleSVGDownloadURL(): Promise<string> {
    return Doozle.getDoodleSVGStorageRef(this.id)
      .getDownloadURL()
      .then((url) => {
        return url as string;
      });
  }
}
