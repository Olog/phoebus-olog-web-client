import { describe, test, expect } from "vitest";
import { getLoginOptions, ssoLoginUrl } from "./loginOptions";

const provider = { id: "keycloak", name: "Keycloak" };

describe("getLoginOptions", () => {
  test("service without authentication options offers password login only", () => {
    expect(getLoginOptions({ levels: [] })).toEqual({
      ssoProviders: [],
      passwordLogin: true
    });
    expect(getLoginOptions(undefined)).toEqual({
      ssoProviders: [],
      passwordLogin: true
    });
  });

  test("providers are offered next to the password form", () => {
    expect(
      getLoginOptions({
        authentication: { passwordLogin: true, oidcProviders: [provider] }
      })
    ).toEqual({ ssoProviders: [provider], passwordLogin: true });
  });

  test("password form can be hidden if a provider exists", () => {
    expect(
      getLoginOptions({
        authentication: { passwordLogin: false, oidcProviders: [provider] }
      })
    ).toEqual({ ssoProviders: [provider], passwordLogin: false });
  });

  test("password form is never hidden without providers", () => {
    expect(
      getLoginOptions({
        authentication: { passwordLogin: false, oidcProviders: [] }
      }).passwordLogin
    ).toBe(true);
  });

  test("nothing is offered while loading", () => {
    expect(getLoginOptions(undefined, true)).toEqual({
      ssoProviders: [],
      passwordLogin: false
    });
  });
});

describe("ssoLoginUrl", () => {
  test("builds the authorization URL on the service", () => {
    expect(ssoLoginUrl("http://localhost:8080/Olog", "keycloak")).toBe(
      "http://localhost:8080/Olog/oauth2/authorization/keycloak"
    );
  });

  test("encodes the provider id", () => {
    expect(ssoLoginUrl("/Olog", "a b")).toBe(
      "/Olog/oauth2/authorization/a%20b"
    );
  });
});
