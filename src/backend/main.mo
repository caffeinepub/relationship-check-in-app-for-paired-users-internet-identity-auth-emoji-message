import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    premium : Bool;
  };

  public type CheckIn = {
    timestamp : Time.Time;
    emoji : Text;
    message : Text;
    author : Principal;
  };

  module CheckIn {
    public func compare(a : CheckIn, b : CheckIn) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  public type Couple = {
    partner1 : Principal;
    partner2 : Principal;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let couples = Map.empty<Principal, Principal>();
  let checkIns = Map.empty<Principal, List.List<CheckIn>>();
  let tokens = Map.empty<Token, Principal>();

  public type Token = Text;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func setPremiumStatus(user : Principal, premium : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set premium status");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedProfile = { profile with premium };
        userProfiles.add(user, updatedProfile);
      };
    };
  };

  public query ({ caller }) func hasPremium() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view premium status");
    };

    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.premium };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    // Preserve existing premium status - users cannot change their own premium status
    let premiumStatus = switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?existingProfile) { existingProfile.premium };
    };
    
    let profileWithPreservedPremium = { profile with premium = premiumStatus };
    userProfiles.add(caller, profileWithPreservedPremium);
  };

  // Pairing Operations
  public shared ({ caller }) func generateInviteToken() : async Token {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate invite tokens");
    };

    switch (couples.get(caller)) {
      case (?_) { Runtime.trap("Already paired") };
      case (null) {
        let token = caller.toText();
        tokens.add(token, caller);
        token;
      };
    };
  };

  public shared ({ caller }) func joinWithToken(token : Token) : async Principal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join with tokens");
    };

    if (couples.containsKey(caller)) {
      Runtime.trap("Already paired");
    };

    switch (tokens.get(token)) {
      case (null) { Runtime.trap("Invalid token") };
      case (?inviter) {
        if (inviter == caller) {
          Runtime.trap("Cannot pair with yourself");
        };

        couples.add(inviter, caller);
        couples.add(caller, inviter);

        tokens.remove(token);
        inviter;
      };
    };
  };

  public query ({ caller }) func getPartner() : async ?Principal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view partner information");
    };
    couples.get(caller);
  };

  // Check-in Operations
  public shared ({ caller }) func submitCheckIn(emoji : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit check-ins");
    };

    let partner = switch (couples.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?p) { p };
    };

    let now = Time.now();
    let checkIn = {
      timestamp = now;
      emoji;
      message;
      author = caller;
    };

    let today = Time.now() / (24 * 3600 * 1000000000);

    let callerHasPremium = switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.premium };
    };

    let callerCheckIns = checkIns.get(caller);

    let hasSubmittedToday = switch (callerCheckIns) {
      case (null) { false };
      case (?checkInList) {
        checkInList.any(func(existing) { (existing.timestamp / (24 * 3600 * 1000000000)) == today });
      };
    };

    if (hasSubmittedToday and (not callerHasPremium)) {
      Runtime.trap("Already submitted today! Upgrade to premium for more submissions.");
    };

    let entries = switch (callerCheckIns) {
      case (null) { List.empty<CheckIn>() };
      case (?checkInList) { checkInList };
    };

    entries.add(checkIn);
    checkIns.add(caller, entries);
  };

  public query ({ caller }) func getTodayCheckIns() : async [CheckIn] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view check-ins");
    };

    let partner = switch (couples.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?p) { p };
    };

    let today = Time.now() / (24 * 3600 * 1000000000);

    func isToday(checkIn : CheckIn) : Bool {
      (checkIn.timestamp / (24 * 3600 * 1000000000)) == today;
    };

    let callerCheckIns = switch (checkIns.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.filter(isToday).toArray() };
    };

    let partnerCheckIns = switch (checkIns.get(partner)) {
      case (null) { [] };
      case (?entries) { entries.filter(isToday).toArray() };
    };

    callerCheckIns.concat(partnerCheckIns);
  };

  public query ({ caller }) func getCheckInHistory(limit : Nat) : async [CheckIn] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view check-in history");
    };

    let partner = switch (couples.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?p) { p };
    };

    let callerCheckIns = switch (checkIns.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };

    let partnerCheckIns = switch (checkIns.get(partner)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };

    let allCheckIns = callerCheckIns.concat(partnerCheckIns);
    let sorted = allCheckIns.sort();

    if (limit >= sorted.size()) {
      sorted;
    } else {
      sorted.sliceToArray(0, limit);
    };
  };
};
