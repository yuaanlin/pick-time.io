import jsonwebtoken from 'jsonwebtoken';

function verifyToken(token: string | undefined, eventId: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('ERROR_JWT_SECRET_NOT_SET');
  }

  if (!token) {
    throw new Error('ERROR_NOT_LOGGED_IN');
  }

  const parsedToken = jsonwebtoken.verify(token,
    process.env.JWT_SECRET) as unknown as { sub: string, eventId: string };

  if (!parsedToken) {
    throw new Error('ERROR_NOT_LOGGED_IN');
  }

  if (parsedToken.eventId !== eventId) {
    throw new Error('ERROR_NOT_LOGGED_IN');
  }

  return parsedToken;
}

export default verifyToken;
