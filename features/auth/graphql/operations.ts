export const PASSWORD_LOGIN = `mutation PasswordLogin($input: PasswordLoginInput!) {
  passwordLogin(input: $input) { id email name role contentAdmin credentialVersion }
}`;
