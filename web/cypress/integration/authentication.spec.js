describe("Authentication workflow", () => {
  context("Login / Register (request login link)", () => {
    /* Currently limited, afaik, to testing everything that happens before the client receives
     * a response from the Google API server (stubbed, in this case).
     * TODO: Figure out how to test further, possibly using a specific stub response on the
     *       stubbed Google API to allow the "login" process to finish.
     */

    it("Should work with valid emails", () => {
      cy.server();
      cy.route("POST", /.+googleapis\.com\/.+/, {}).as("googleApi");
      cy.visit("localhost:3000/login");

      cy.get(".input[type=email]").click().type("cole@example.org");

      cy.get(".button[type=submit]").should("not.have.class", "is-loading");
      cy.get(".button[type=submit]").click();
      cy.wait("@googleApi")
        .its("url")
        .should("include", "getOobConfirmationCode");
      cy.get(".button[type=submit]").should("have.class", "is-loading");
    });
  });

  context("Authenticate", () => {
    /* Cannot test anything past the Firebase SDK attempts to consume the email given, afaik.
     * Also, Cypress is not allowing me stub or spy on localStorage for reasons I do not know;
     * resolving this would improve testing here (TODO).
     */

    beforeEach(() => {
      cy.server();
      cy.route("POST", /.+googleapis\.com\/.+/, {}).as("googleApi");
    });

    afterEach(() => {
      cy.wait("@googleApi").its("url").should("include", "emailLinkSignin");
    });

    it("Should prompt for an email if not available from local storage", () => {
      cy.visit(
        "localhost:3000/authenticate?apiKey=0&oobCode=1&mode=signIn&lang=en",
        {
          onBeforeLoad(win) {
            cy.stub(win, "prompt").returns("cole@example.org");
          },
        }
      );
      cy.window().its("prompt").should("be.calledOnce");
    });

    it("Should use the email in local storage if its available", () => {
      /* Cannot test that the email was retrieved from localStorage. Checking that the user
       * wasn't prompted for an email should do for now.
       */

      cy.visit(
        "localhost:3000/authenticate?apiKey=0&oobCode=1&mode=signIn&lang=en",
        {
          onBeforeLoad(win) {
            win.localStorage.setItem(
              "emailForAuthenticateHandler",
              "cole@example.org"
            );
            cy.stub(win, "prompt").returns("cole@example.org");
          },
        }
      );
      cy.window().its("prompt").should("not.be.called");
    });
  });
});
