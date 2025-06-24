export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

export interface JwtPayloadWithMetadata extends JwtPayload {
  sub: string; // Subject, typically the user ID
  iat: number; // Issued at time
  exp: number; // Expiration time
}
