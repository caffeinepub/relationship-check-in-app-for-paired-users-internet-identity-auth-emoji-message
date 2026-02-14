import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";


import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import InviteLinksModule "invite-links/invite-links-module";
import Random "mo:core/Random";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let inviteLinksState = InviteLinksModule.initState();

  public type UserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal;
    relationship_status : ?RelationshipStatus;
    can_set_relationship_status : Bool;
    streak_count : Nat;
    last_checkin_date : ?Nat;
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

  public type RelationshipStatus = {
    status : Text;
    customMessage : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let checkIns = Map.empty<Principal, List.List<CheckIn>>();
  let tokens = Map.empty<Token, Principal>();

  public type Token = Text;

  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteLinksState, code);
    code;
  };

  public shared ({ caller }) func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit RSVPs");
    };
    InviteLinksModule.submitRSVP(inviteLinksState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteLinksState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteLinksState);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
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

    let premiumStatus = switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?existingProfile) { existingProfile.premium };
    };

    let profileWithPreservedPremium = { profile with premium = premiumStatus };
    userProfiles.add(caller, profileWithPreservedPremium);
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

  // Pairing Operations
  public shared ({ caller }) func generateInviteToken() : async Token {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate invite tokens");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        let newProfile : UserProfile = {
          name = "";
          premium = false;
          partner_ref = null;
          relationship_status = null;
          can_set_relationship_status = false;
          streak_count = 0;
          last_checkin_date = null;
        };
        userProfiles.add(caller, newProfile);
        let token = caller.toText();
        tokens.add(token, caller);
        token;
      };
      case (?profile) {
        if (profile.partner_ref != null) {
          Runtime.trap("Already paired");
        };
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

    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (profile.partner_ref != null) {
          Runtime.trap("Already paired");
        };
      };
      case (null) {
        let newProfile : UserProfile = {
          name = "";
          premium = false;
          partner_ref = null;
          relationship_status = null;
          can_set_relationship_status = false;
          streak_count = 0;
          last_checkin_date = null;
        };
        userProfiles.add(caller, newProfile);
      };
    };

    switch (tokens.get(token)) {
      case (null) { Runtime.trap("Invalid token") };
      case (?inviter) {
        if (inviter == caller) {
          Runtime.trap("Cannot pair with yourself");
        };

        let inviterProfile = switch (userProfiles.get(inviter)) {
          case (null) {
            let newProfile : UserProfile = {
              name = "";
              premium = false;
              partner_ref = ?caller;
              relationship_status = null;
              can_set_relationship_status = false;
              streak_count = 0;
              last_checkin_date = null;
            };
            userProfiles.add(inviter, newProfile);
            newProfile;
          };
          case (?profile) {
            if (profile.partner_ref != null) {
              Runtime.trap("Already paired");
            };
            { profile with partner_ref = ?caller; can_set_relationship_status = false };
          };
        };

        let newPartnerProfile : UserProfile = {
          name = "";
          premium = false;
          partner_ref = ?inviter;
          relationship_status = null;
          can_set_relationship_status = true;
          streak_count = 0;
          last_checkin_date = null;
        };

        userProfiles.add(inviter, inviterProfile);
        userProfiles.add(caller, newPartnerProfile);

        tokens.remove(token);
        inviter;
      };
    };
  };

  public shared ({ caller }) func disconnect() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can disconnect.");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("You are not currently paired.") };
      case (?profile) {
        let updatedProfile = {
          profile with
          partner_ref = null;
          relationship_status = null;
          can_set_relationship_status = false;
          streak_count = 0;
          last_checkin_date = null;
        };
        userProfiles.add(caller, updatedProfile);

        switch (profile.partner_ref) {
          case (null) {};
          case (?partner) {
            switch (userProfiles.get(partner)) {
              case (null) {};
              case (?partnerProfile) {
                let updatedPartnerProfile = {
                  partnerProfile with
                  partner_ref = null;
                  relationship_status = null;
                  can_set_relationship_status = false;
                  streak_count = 0;
                  last_checkin_date = null;
                };
                userProfiles.add(partner, updatedPartnerProfile);
              };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getPartner() : async ?Principal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view partner information");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile.partner_ref };
    };
  };

  public shared ({ caller }) func setRelationshipStatus(status : RelationshipStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set relationship status");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?profile) { profile };
    };

    let partner = switch (callerProfile.partner_ref) {
      case (null) { Runtime.trap("Not paired") };
      case (?p) { p };
    };

    // AUTHORIZATION FIX: Only the invited user (who joined via token) can set the initial relationship status
    if (not callerProfile.can_set_relationship_status) {
      Runtime.trap("Unauthorized: Only the invited user can set the initial relationship status");
    };

    let partnerProfile = switch (userProfiles.get(partner)) {
      case (null) { Runtime.trap("Partner profile not found") };
      case (?profile) { profile };
    };

    let updatedCallerProfile = {
      callerProfile with
      relationship_status = ?status;
      can_set_relationship_status = false;
    };

    let updatedPartnerProfile = {
      partnerProfile with
      relationship_status = ?status;
    };

    userProfiles.add(caller, updatedCallerProfile);
    userProfiles.add(partner, updatedPartnerProfile);
  };

  public query ({ caller }) func getRelationshipStatus() : async ?RelationshipStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view relationship status");
    };

    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile.relationship_status };
    };
  };

  // Check-in Operations
  public shared ({ caller }) func submitCheckIn(emoji : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit check-ins");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?profile) { profile };
    };

    let partner = switch (callerProfile.partner_ref) {
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

    let today = (Time.now() / (24 * 3600 * 1000000000)).toNat();

    let callerCheckIns = checkIns.get(caller);

    let hasSubmittedToday = switch (callerCheckIns) {
      case (null) { false };
      case (?checkInList) {
        checkInList.any(func(existing) { (existing.timestamp / (24 * 3600 * 1000000000)) == today });
      };
    };

    if (hasSubmittedToday and (not callerProfile.premium)) {
      Runtime.trap("Already submitted today! Upgrade to premium for more submissions.");
    };

    let entries = switch (callerCheckIns) {
      case (null) { List.empty<CheckIn>() };
      case (?checkInList) { checkInList };
    };

    entries.add(checkIn);
    checkIns.add(caller, entries);

    // Update streak logic
    updatePartnerStreaks(caller, partner, today);
  };

  public query ({ caller }) func getTodayCheckIns() : async [CheckIn] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view check-ins");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?profile) { profile };
    };

    let partner = switch (callerProfile.partner_ref) {
      case (null) { Runtime.trap("Not paired") };
      case (?p) { p };
    };

    let today = (Time.now() / (24 * 3600 * 1000000000)).toNat();

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

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?profile) { profile };
    };

    let partner = switch (callerProfile.partner_ref) {
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

  public query ({ caller }) func getSharedStreak() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shared streaks");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Not paired") };
      case (?profile) { profile };
    };

    let partner = switch (callerProfile.partner_ref) {
      case (null) { Runtime.trap("Not paired") };
      case (?_p) { callerProfile };
    };

    let currentDay = (Time.now() / (24 * 3600 * 1000000000)).toNat();
    if (hasMissedDay(callerProfile, partner, currentDay) > 0) {
      0;
    } else {
      callerProfile.streak_count;
    };
  };

  func hasMissedDay(profile1 : UserProfile, profile2 : UserProfile, currentDay : Nat) : Nat {
    switch (profile1.last_checkin_date, profile2.last_checkin_date) {
      case (null, _) { 0 };
      case (_, null) { 0 };
      case (?date1, ?date2) {
        if (date1 != date2) {
          return 0;
        };
        if (currentDay > date1 + 1) {
          1;
        } else {
          0;
        };
      };
    };
  };

  func updatePartnerStreaks(caller : Principal, partner : Principal, today : Nat) {
    let maybeCallerProfile = userProfiles.get(caller);
    let maybePartnerProfile = userProfiles.get(partner);

    if (maybeCallerProfile != null and maybePartnerProfile != null) {
      let callerProfile = switch (maybeCallerProfile) {
        case (?p) { p };
        case (null) { return };
      };
      let partnerProfile = switch (maybePartnerProfile) {
        case (?p) { p };
        case (null) { return };
      };

      if (hasCheckInToday(partner)) {
        let (newStreak, newLastCheckinDate) = if (bothDidCheckInYesterday(caller, partner)) {
          (getStreak(caller) + 1, ?today);
        } else { (1, ?today) };

        let updatedCallerProfile = {
          callerProfile with
          streak_count = newStreak;
          last_checkin_date = newLastCheckinDate;
        };
        userProfiles.add(caller, updatedCallerProfile);
        let updatedPartnerProfile = {
          partnerProfile with
          streak_count = newStreak;
          last_checkin_date = newLastCheckinDate;
        };
        userProfiles.add(partner, updatedPartnerProfile);
      };
    };
  };

  func hasCheckInToday(user : Principal) : Bool {
    switch (checkIns.get(user)) {
      case (null) { false };
      case (?entries) {
        entries.any(func(checkin) { (checkin.timestamp / (24 * 3600 * 1000000000)) == (Time.now() / (24 * 3600 * 1000000000)).toNat() });
      };
    };
  };

  func bothDidCheckInYesterday(user1 : Principal, user2 : Principal) : Bool {
    let currentDay = (Time.now() / (24 * 3600 * 1000000000)).toNat();
    let yesterday : Nat = if (currentDay >= 1) { currentDay - 1 } else { return false };
    hasCheckInForDay(user1, yesterday) and hasCheckInForDay(user2, yesterday);
  };

  func hasCheckInForDay(user : Principal, day : Nat) : Bool {
    switch (checkIns.get(user)) {
      case (null) { false };
      case (?entries) {
        entries.any(func(checkin) { (checkin.timestamp / (24 * 3600 * 1000000000)) == day });
      };
    };
  };

  func getStreak(user : Principal) : Nat {
    switch (userProfiles.get(user)) {
      case (null) { 0 };
      case (?profile) { profile.streak_count };
    };
  };
};
