import Model from "models/Model";
import { db, storage } from "services/firebase";
import UserProfile from "models/UserProfile";
import Answer from "models/Answer";

export default class Doozle extends Model {
  static collection = db.collection("Doozles");

  constructor(readonly id: string, readonly creator: UserProfile) {
    super(Doozle.collection, id);
  }

  static getDefaultCreateFields() {
    return { ...super.getDefaultCreateFields(), solved: false };
  }

  static getDoodleSVGStorageRef(id: string) {
    return storage.ref().child(`doodles/${id}.svg`);
  }

  static async create(
    creator: UserProfile,
    answerString: string,
    doodleSVG: File
  ): Promise<Doozle> {
    /* Create Doozle Answer, create Doozle, upload Doozle doodle, update Answer with Doozle, and return Doozle. */

    return Answer.create(creator, answerString).then(async (answerObj) => {
      return Doozle.collection
        .add({
          ...Doozle.getDefaultCreateFields(),
          creator: creator.ref,
          answer: answerObj.ref,
        })
        .then(async (docRef) => {
          let doozle = new Doozle(docRef.id, creator);

          return Doozle.getDoodleSVGStorageRef(doozle.id)
            .put(doodleSVG, { customMetadata: { creatorId: creator.id } })
            .then(async (_snapshot) => {
              return answerObj.update(doozle).then(async (_answerObj) => {
                return doozle;
              });
            });
        });
    });
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
