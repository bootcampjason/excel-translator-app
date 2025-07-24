export interface UserData {
  email: string;
  currentPlan: "free" | "starter" | "pro";
  charUsed: number;
  charLimit: number;
  lastLogonTimestamp: Date;
  lastSignoutTimestamp: Date;
  transactions: {
    transactionId: string;
    timestamp: Date;
    amount: number;
  }[];
}