import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Token = string;
export interface CheckIn {
    emoji: string;
    author: Principal;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface UserProfile {
    premium: boolean;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateInviteToken(): Promise<Token>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCheckInHistory(limit: bigint): Promise<Array<CheckIn>>;
    getPartner(): Promise<Principal | null>;
    getTodayCheckIns(): Promise<Array<CheckIn>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasPremium(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    joinWithToken(token: Token): Promise<Principal>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPremiumStatus(user: Principal, premium: boolean): Promise<void>;
    submitCheckIn(emoji: string, message: string): Promise<void>;
}
