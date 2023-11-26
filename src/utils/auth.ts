import CryptoES from "crypto-es";

function deriveKeyFromPassphrase(
  passphrase: string,
  salt: string, // as hex string
  key_length: number,
  iterations: number
) {
  const _saltAsWordArray = CryptoES.enc.Hex.parse(salt);
  const key = CryptoES.PBKDF2(passphrase, _saltAsWordArray, {
    keySize: key_length / 32,
    iterations: iterations,
  });
  return key;
}

type Option = {
  embed?: string;
  encode?: boolean;
  key_length?: number;
  iterations?: number;
  app_secret?: string;
};

function encryptMessage(message: string, passphrase: string, options?: Option) {
  const {
    embed,
    encode = true,
    key_length = 256,
    iterations = 100000,
  } = options || {};
  //   const salt = "01380ccf6c17bb7b";
  const salt = CryptoES.lib.WordArray.random(8).toString();
  const key = deriveKeyFromPassphrase(passphrase, salt, key_length, iterations);

  // Generate a random IV (Initialization Vector)
  const iv = CryptoES.lib.WordArray.random(16);

  let messagePadded = CryptoES.enc.Utf8.parse(message);

  // Create an AES cipher object with CBC mode
  const cipher = CryptoES.AES.encrypt(messagePadded, key, { iv: iv });

  const add_key = embed ? embed : key.toString();
  const beforeEncode = salt + iv + add_key + cipher.ciphertext;
  if (!encode) {
    return beforeEncode;
  } // Combine IV, salt, and ciphertext and encode as base64
  const encryptedMessage = CryptoES.enc.Base64.stringify(
    CryptoES.enc.Hex.parse(beforeEncode)
  );

  return encryptedMessage;
}

export function encode(
  payload: any,
  userPassword: string,
  options: Option & {
    app_secret: string;
  }
) {
  const encryptedPassword = encryptMessage(userPassword, options.app_secret, {
    embed: "",
    encode: false,
    key_length: options.key_length,
    iterations: options.iterations,
  });
  const encryptedPayload = encryptMessage(
    JSON.stringify(payload),
    userPassword,
    {
      embed: encryptedPassword,
      key_length: options.key_length,
      iterations: options.iterations,
    }
  );
  return encryptedPayload;
}
