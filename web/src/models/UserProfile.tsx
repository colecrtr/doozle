import Model from "models/Model";
import { db } from "services/firebase";

export default class UserProfile extends Model {
  static collection = db.collection("UserProfiles");

  constructor(readonly id: string, readonly name: string) {
    super(UserProfile.collection, id);
  }

  static async get(id: string): Promise<UserProfile> {
    const docRef = Model.getDocRef(UserProfile.collection, id);

    return super.getOrCallback(docRef, async () => {
      return docRef.get().then((doc) => {
        let userProfileData = { name: "", ...doc.data() };

        return new UserProfile(doc.exists ? id : "", userProfileData.name);
      });
    });
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

  get avatarSrc() {
    return `https://api.adorable.io/avatars/285/${this.name}.png`;
  }
}
