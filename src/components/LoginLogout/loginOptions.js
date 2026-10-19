/**
 * Derives what the login dialog offers from the service configuration
 * (GET /configuration, block "authentication").
 *
 * Services that do not report authentication options support username/password
 * login only. The password form is never hidden if there is no single sign-on
 * provider, so that users cannot be locked out.
 *
 * @param {object} serviceConfiguration Response of GET /configuration, may be undefined
 * @param {boolean} isLoading True while the configuration is being fetched
 * @returns {{ssoProviders: Array<{id: string, name: string}>, passwordLogin: boolean}}
 */
export const getLoginOptions = (serviceConfiguration, isLoading = false) => {
  const authentication = serviceConfiguration?.authentication;
  const ssoProviders = Array.isArray(authentication?.oidcProviders)
    ? authentication.oidcProviders
    : [];
  return {
    ssoProviders,
    // Do not flash the form while it is still unknown whether it should be shown
    passwordLogin: isLoading
      ? false
      : ssoProviders.length === 0 || authentication?.passwordLogin !== false
  };
};

/**
 * @param {string} backendUrl Olog service base URL, e.g. http://localhost:8080/Olog
 * @param {string} providerId Registration id of the identity provider
 * @returns {string} URL that starts the single sign-on login on the service
 */
export const ssoLoginUrl = (backendUrl, providerId) =>
  `${backendUrl}/oauth2/authorization/${encodeURIComponent(providerId)}`;
