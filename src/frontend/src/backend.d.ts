import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export interface CheckIn {
    emoji: string;
    author: Principal;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export type Token = string;
export interface RelationshipStatus {
    status: string;
    customMessage: string;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface UserProfile {
    relationship_status?: RelationshipStatus;
    streak_count: bigint;
    country?: string;
    can_set_relationship_status: boolean;
    premium: boolean;
    partner_ref?: Principal;
    name: string;
    last_checkin_date?: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    disconnect(): Promise<void>;
    generateInviteCode(): Promise<string>;
    generateInviteToken(): Promise<Token>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCheckInHistory(limit: bigint): Promise<Array<CheckIn>>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getPartner(): Promise<Principal | null>;
    getRelationshipStatus(): Promise<RelationshipStatus | null>;
    getSharedStreak(): Promise<bigint>;
    getTodayCheckIns(): Promise<Array<CheckIn>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasPremium(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    joinWithToken(token: Token): Promise<Principal>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setPremiumStatus(user: Principal, premium: boolean): Promise<void>;
    setRelationshipStatus(status: RelationshipStatus): Promise<void>;
    submitCheckIn(emoji: string, message: string): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
}
