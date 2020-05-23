import Model from "models/Model";
import { db } from "services/firebase";
import UserProfile from "models/UserProfile";
import Doozle from "models/Doozle";

export default class Answer extends Model {
  static collection = db.collection("Answers");

  static async create(user: UserProfile, answer: string) {
    return Answer.collection
      .add({ ...Model.getDefaultCreateFields(), user: user.ref, answer })
      .then((docRef) => {
        return new Answer(docRef.id, user, answer, undefined);
      });
  }

  constructor(
    readonly id: string,
    readonly user: UserProfile,
    readonly answer: string,
    doozle?: Doozle
  ) {
    super(Answer.collection, id);
  }

  async update(doozle: Doozle): Promise<Answer> {
    return this.ref
      .update({ ...Model.getDefaultUpdateFields, doozle: doozle.ref })
      .then(() => {
        return new Answer(this.id, this.user, this.answer, doozle);
      });
  }
}
