import Model from "models/Model";
import { db } from "services/firebase";

export default class UserProfile extends Model {
  static collection = db.collection("UserProfiles");

  static async getFromRef(
    ref: firebase.firestore.DocumentReference
  ): Promise<UserProfile> {
    return super.getOrCallback(ref, async () => {
      return ref.get().then((doc) => {
        let userProfileData = { name: "", ...doc.data() };

        return new UserProfile(doc.exists ? ref.id : "", userProfileData.name);
      });
    });
  }

  static async get(id: string): Promise<UserProfile> {
    return UserProfile.getFromRef(Model.getDocRef(UserProfile.collection, id));
  }

  static async getOrCreate(id: string): Promise<UserProfile> {
    const docRef = Model.getDocRef(UserProfile.collection, id);

    return UserProfile.get(id).then((userProfile) => {
      if (!userProfile.exists) {
        const defaultUserProfile = {
          ...Model.getDefaultCreateFields(),
          name: id.substring(0, 10),
        };

        return docRef.set(defaultUserProfile, { merge: true }).then(() => {
          return new UserProfile(id, defaultUserProfile.name);
        });
      }
      return userProfile;
    });
  }

  static empty(): UserProfile {
    return new UserProfile("", "");
  }

  constructor(readonly id: string, readonly name: string) {
    super(UserProfile.collection, id);
  }

  get avatarSrc() {
    return `https://api.adorable.io/avatars/285/${this.name}.png`;
  }
}
