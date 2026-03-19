export enum AdminAction {
  BAN = "ban",
  UNBAN = "unban",
  VERIFY = "verify",
  UNVERIFY = "unverify",
  DELETE = "delete",
  RESTORE = "restore",
}

export enum ContentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

export enum StatsPeriod {
  TODAY = "today",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  ALL = "all",
}