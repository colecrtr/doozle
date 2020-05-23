import React from "react";
import UserProfile from "models/UserProfile";
import Doozle from "models/Doozle";
import {
  Title,
  Field,
  Label,
  Control,
  Input,
  Button,
  Help,
  Subtitle,
  Box,
  Level,
  LevelLeft,
  LevelRight,
  LevelItem,
} from "bloomer";
import { trackPromise } from "helpers/loading";
import InputMask, { Props as InputMaskProps } from "react-input-mask";
import Guess from "models/Guess";
import moment from "moment";

interface IProps {
  authUserProfile?: UserProfile;
  doozleId: string;
}
interface IState {
  unsubscribe: Function;
  doozle: Doozle;
  doozleImgSrc: string;
  guess: string;
  isGoodGuess: boolean;
  isGuessFormLoading: boolean;
}

export default class Solver extends React.Component<IProps, IState> {
  readonly state = {
    unsubscribe: () => {},
    doozle: Doozle.empty(),
    doozleImgSrc: "",
    guess: "",
    isGoodGuess: false,
    isGuessFormLoading: false,
  };

  async componentDidMount() {
    const unsubscribe = Doozle.getDocRef(
      Doozle.collection,
      this.props.doozleId
    ).onSnapshot(async (doozleSnapshot) => {
      const doozleData = doozleSnapshot.data();

      if (doozleData) {
        const userProfile = await trackPromise(
          UserProfile.get(doozleData.user.id)
        );
        const guesses: Guess[] = await Promise.all(
          (doozleData.guesses || []).map(
            async (guessSnapshot: firebase.firestore.DocumentSnapshot) => {
              return await Guess.get(guessSnapshot.id);
            }
          )
        );
        const doozle = new Doozle(
          this.props.doozleId,
          userProfile,
          doozleData.answerHint,
          guesses,
          doozleData.solved
        );

        const doozleImgSrc = await trackPromise(
          doozle.getDoodleSVGDownloadURL()
        );

        this.setState({ doozle, doozleImgSrc });
      }
    });

    this.setState({ unsubscribe });
  }

  async componentWillUnmount() {
    this.state.unsubscribe();
  }

  onGuessChange(event: React.ChangeEvent<HTMLInputElement>) {
    const guess = event.currentTarget.value.toUpperCase();

    this.setState({ guess, isGoodGuess: /^(?:[A-Z0-9]+[ ]?)*$/.test(guess) });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState({ isGuessFormLoading: true });

    if (this.state.guess === "") {
      /* Prevent blank guess submissions. */
      return;
    } else if (this.props.authUserProfile === undefined) {
      /* Prevent guesses from unauthenticated users. */
      window.alert("Please login before submitting Guesses...");
      this.setState({ isGuessFormLoading: false });
      return;
    }

    trackPromise(
      Guess.create(
        this.props.authUserProfile,
        this.state.doozle,
        this.state.guess
      )
    ).then(() => {
      this.setState({ guess: "", isGuessFormLoading: false });
    });
  }

  render() {
    return this.state.doozle.exists ? (
      <>
        <Title>Doozle by {this.state.doozle.user.name}</Title>
        <Subtitle>ID: {this.state.doozle.id}</Subtitle>
        <Box
          style={{
            marginTop: "calc(1rem + 1vw)",
            padding: "1rem 1vw",
            maxWidth: "1000px",
          }}
        >
          <img src={this.state.doozleImgSrc} />
          <p
            style={{
              fontSize: "4rem",
              letterSpacing: "0.5rem",
              margin: "1rem",
              marginBottom: "2rem",
            }}
          >
            {this.state.doozle.answerHint}
          </p>
          {this.state.doozle.solved ||
          this.props.authUserProfile?.id == this.state.doozle.user.id ? null : (
            <Box style={{ marginTop: "2rem", marginBottom: "2rem" }}>
              <form onSubmit={this.onSubmit.bind(this)}>
                <Field>
                  <Label>Guess*</Label>
                  <Control>
                    <InputMask
                      maskChar="_"
                      formatChars={{ _: "[a-zA-Z0-9]" }}
                      mask={this.state.doozle.answerHint}
                      alwaysShowMask={true}
                      onChange={this.onGuessChange.bind(this)}
                      value={this.state.guess}
                      disabled={this.state.isGuessFormLoading}
                    >
                      {(inputProps: InputMaskProps) => (
                        <Input
                          {...inputProps}
                          type="text"
                          style={{ letterSpacing: "0.33rem" }}
                        />
                      )}
                    </InputMask>
                  </Control>
                </Field>
                <Field>
                  <Control>
                    <Button
                      type="submit"
                      disabled={!this.state.isGoodGuess}
                      isLoading={this.state.isGuessFormLoading}
                    >
                      Guess "{this.state.guess || this.state.doozle.answerHint}
                      "!
                    </Button>
                  </Control>
                </Field>
              </form>
            </Box>
          )}
          {this.state.doozle.guesses.reverse().map((guess) => (
            <Box>
              <Level>
                <LevelLeft>
                  <LevelItem>{guess.correct ? "🏆" : "❌"}</LevelItem>
                  <LevelItem style={{ letterSpacing: "0.15rem" }}>
                    <strong>{guess.guess}</strong>
                  </LevelItem>
                </LevelLeft>
                <LevelRight>
                  <LevelItem>
                    {guess.user.name}, {moment(guess.createdAt).fromNow()}
                  </LevelItem>
                </LevelRight>
              </Level>
            </Box>
          ))}
        </Box>
      </>
    ) : null;
  }
}
