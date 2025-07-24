import { UserData } from "../types/UserData.ts";

export function defaultUserSchema(email: string): UserData {
  return {
    email,
    currentPlan: "free",
    charUsed: 0,
    charLimit: 10000,
    lastLogonTimestamp: new Date(),
    lastSignoutTimestamp: new Date(),
    transactions: [],
  };
}