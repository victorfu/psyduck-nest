export interface OAuth {
  google: GoogleOAuthData;
}

interface GoogleOAuthData {
  id: string;
  displayName: string;
  name: GoogleOAuthName;
  emails: GoogleOAuthEmail[];
  photos: GoogleOAuthPhoto[];
  provider: string;
  raw: string;
  json: GoogleOAuthJson;
}

interface GoogleOAuthName {
  familyName: string;
  givenName: string;
}

interface GoogleOAuthEmail {
  value: string;
  verified: boolean;
}

interface GoogleOAuthPhoto {
  value: string;
}

interface GoogleOAuthJson {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  hd: string;
}
