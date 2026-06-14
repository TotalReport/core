export type UserSystemAccess = {
  isActive: boolean;
  isEmailVerified: boolean;
};

export const canUseSystem = (user: UserSystemAccess): boolean =>
  user.isActive && user.isEmailVerified;
