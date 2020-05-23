import React from "react";
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
} from "bloomer";
import UserProfile from "models/UserProfile";
import Doozle from "models/Doozle";
import { Link } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { RouteComponentProps } from "react-router-dom";
import "literallycanvas/lib/css/literallycanvas.css";

// @ts-ignore
import LiterallyCanvas from "literallycanvas/lib/js/core/LiterallyCanvas";
// @ts-ignore
import defaultLiterallyCanvasOptions from "literallycanvas/lib/js/core/defaultOptions";
// @ts-ignore
import LC from "literallycanvas";

defaultLiterallyCanvasOptions.imageURLPrefix = "/images/literallycanvas";
defaultLiterallyCanvasOptions.toolbarPosition = "top";
defaultLiterallyCanvasOptions.imageSize.height = 550;

interface IProps extends RouteComponentProps {
  authUserProfile?: UserProfile;
}
interface IState {
  literallyCanvas: LiterallyCanvas;
  answer: string;
  isLoading: boolean;
  doozle?: Doozle;
  doodleSVGString: string;
}

export default class Creator extends React.Component<IProps, IState> {
  /* TODO: Add integration tests. Skipping for MVP since it seems difficult mocking firestore and whatnot. */

  readonly state = {
    literallyCanvas: new LiterallyCanvas(defaultLiterallyCanvasOptions),
    answer: "",
    isLoading: false,
    doozle: undefined,
    doodleSVGString: "",
  };

  onAnswerChange(event: React.ChangeEvent<HTMLInputElement>) {
    let answer = event.currentTarget.value.toUpperCase().substring(0, 50);

    if (/^(?:[A-Z0-9]+[ ]?)*$/.test(answer)) {
      this.setState({ answer });
    }
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState({ isLoading: true });

    if (this.props.authUserProfile === undefined) {
      /* Prevent submisions from unauthenticated users. */
      window.alert("Please login before submitting Doozles...");
      this.setState({ isLoading: false });
      return;
    }

    const doodleSVGString = this.state.literallyCanvas.getSVGString();
    this.setState({ doodleSVGString });
    const doodleSVG = new File([doodleSVGString], "doodle.svg", {
      type: "image/svg+xml",
    });

    const doozleCreatePromise = Doozle.create(
      this.props.authUserProfile,
      this.state.answer,
      doodleSVG
    ).then(async (doozle) => {
      this.props.history.push(doozle.urlPath);
    });
    trackPromise(doozleCreatePromise);
  }

  render() {
    return (
      <>
        <Title>Welcome to Doozle!</Title>
        <Subtitle>
          Doozle is a doodle puzzle game.
          <>
            {" "}
            {!this.props.authUserProfile ? (
              <>
                <Link to="/login">Login</Link> to join the fun :-)
              </>
            ) : (
              <>Create one below :-)</>
            )}
          </>
          {!this.props.authUserProfile ? null : (
            <Box
              style={{
                marginTop: "calc(1rem + 1vw)",
                padding: "1rem 1vw",
                maxWidth: "1000px",
              }}
            >
              <form onSubmit={this.onSubmit.bind(this)}>
                <Field>
                  <Label>Answer*</Label>
                  <Control>
                    <Input
                      type="text"
                      onChange={this.onAnswerChange.bind(this)}
                      value={this.state.answer}
                      disabled={this.state.isLoading}
                      required
                    />
                  </Control>
                  <Help style={{ fontSize: "1rem" }}>
                    The answer is what people are trying to guess based off your
                    doodle below. Make sure it's spelled correctly. Answers can
                    only contain uppercase letters, numbers, and non-consecutive
                    spaces. 50 character limit.
                  </Help>
                </Field>
                <Field>
                  {this.state.isLoading ? (
                    <img
                      src={`data:image/svg+xml;base64,${btoa(
                        unescape(encodeURIComponent(this.state.doodleSVGString))
                      )}`}
                    />
                  ) : (
                    <LC.LiterallyCanvasReactComponent
                      lc={this.state.literallyCanvas}
                    />
                  )}
                </Field>
                <button type="submit" disabled style={{ display: "none" }}>
                  {/* Prevent accidental submissions from hitting the enter key on elements other than the
                   * form's submit button. In user-testing with my girlfriend, this happened immediately
                   * somehow.
                   */}
                </button>
                <Field>
                  <Control>
                    <Button
                      type="submit"
                      isColor="success"
                      isLoading={this.state.isLoading}
                      style={{ display: "block", marginLeft: "auto" }}
                    >
                      Create This Doozle!
                    </Button>
                  </Control>
                </Field>
              </form>
            </Box>
          )}
        </Subtitle>
      </>
    );
  }
}
