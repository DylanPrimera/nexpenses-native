import type { AuthApiResponse, AuthPayload } from "../interfaces";

export class AuthMapper {
  static fromApiResponse(data: AuthApiResponse): AuthPayload {
    const { token, ...user } = data;
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        roles: user.roles,
      },
    };
  }
}
