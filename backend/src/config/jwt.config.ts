export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? "lab-equipment-dev-secret",
  expiresIn: "8h"
};
