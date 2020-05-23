import Model from "models/Model";
import { db } from "services/firebase";
import UserProfile from "models/UserProfile";
import Doozle from "models/Doozle";

export default class Guess extends Model {
  static collection = db.collection("Guesses");

  static getDefaultCreateFields() {
    return { ...Model.getDefaultCreateFields(), correct: false };
  }

  static async create(
    user: UserProfile,
    doozle: Doozle,
    guess: string
  ): Promise<any> {
    return Guess.collection.add({
      ...Guess.getDefaultCreateFields(),
      user: user.ref,
      doozle: doozle.ref,
      guess,
    });
  }

  static async get(id: string): Promise<Guess> {
    return Guess.getDocRef(Guess.collection, id)
      .get()
      .then(async (guessSnapshot) => {
        const guessData = guessSnapshot.data();

        if (!guessData) {
          throw "Guess data is undefined";
        }

        return new Guess(
          id,
          await UserProfile.getFromRef(guessData.user),
          guessData.guess,
          guessData.correct,
          guessData.createdAt.toDate()
        );
      });
  }

  constructor(
    readonly id: string,
    readonly user: UserProfile,
    readonly guess: string,
    readonly correct: boolean,
    readonly createdAt: Date,
    readonly doozle?: Doozle
  ) {
    super(Guess.collection, id);
  }
}
