import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const processNewGuess = functions.firestore
  .document("Guesses/{guessId}")
  .onCreate(async (guessSnapshot, context) => {
    const guessData = guessSnapshot.data();

    if (guessData) {
      // Check if Guess is correct
      await guessData.doozle
        .get()
        .then((doozleSnapshot: admin.firestore.QueryDocumentSnapshot) => {
          doozleSnapshot
            .data()
            .answer.get()
            .then(
              async (answerSnapshot: admin.firestore.QueryDocumentSnapshot) => {
                const answerString = answerSnapshot.data().answer.toUpperCase();

                if (answerString == guessData.guess.toUpperCase()) {
                  await guessSnapshot.ref.update({ correct: true });
                  await guessData.doozle.update({
                    solved: true,
                    answerHint: answerString,
                  });
                }
              }
            );
        });

      // Add Guess to the Doozle object
      await guessData.doozle.update({
        guesses: admin.firestore.FieldValue.arrayUnion(guessSnapshot.ref),
      });
    }
  });
