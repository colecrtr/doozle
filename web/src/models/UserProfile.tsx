import Model from "./Model";
import { firebase, db } from "services/firebase";

export default class UserProfile extends Model {
    static collection: firebase.firestore.CollectionReference = db.collection("UserProfiles");

    constructor(
        readonly uid: null | string,
        readonly name: null | string,
    ) {
        super(uid);
    };

    static async get(uid: string): Promise<UserProfile> {
        const docRef = UserProfile.collection.doc(uid);
        return super.getOrCallback(docRef, async () => {
            return docRef.get().then(doc => {
                let userProfileData = { name: null, ...doc.data() };

                return new UserProfile(doc.exists ? uid : null, userProfileData.name);
            });
        });
    }

    static async getOrCreate(uid: string): Promise<UserProfile> {
        const docRef = UserProfile.collection.doc(uid);
        return this.get(uid).then(userProfile => {
            if (!userProfile.exists) {
                const defaultUserProfile = { name: uid.substring(0, 10) };

                return docRef.set(defaultUserProfile, { merge: true }).then(() => {
                    return new UserProfile(uid, defaultUserProfile.name);
                });
            }
            return userProfile;
        });
    }

    get avatarSrc() {
        return `https://api.adorable.io/avatars/285/${this.name}.png`;
    }
}