import Model from "models/Model";
import { db } from "services/firebase";
import UserProfile from "models/UserProfile";
import Doozle from "models/Doozle";

export default class Answer extends Model {
  static collection = db.collection("Answers");

  static async create(creator: UserProfile, answer: string) {
    return Answer.collection
      .add({ ...Model.getDefaultCreateFields(), creator: creator.ref, answer })
      .then((docRef) => {
        return new Answer(docRef.id, creator, answer, undefined);
      });
  }

  constructor(
    readonly id: string,
    readonly creator: UserProfile,
    readonly answer: string,
    doozle?: Doozle
  ) {
    super(Answer.collection, id);
  }

  async update(doozle: Doozle): Promise<Answer> {
    return this.ref
      .update({ ...Model.getDefaultUpdateFields, doozle: doozle.ref })
      .then(() => {
        return new Answer(this.id, this.creator, this.answer, doozle);
      });
  }
}
