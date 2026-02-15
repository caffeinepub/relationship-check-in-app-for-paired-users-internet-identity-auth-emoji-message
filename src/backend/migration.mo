import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Old UserProfile without avatar field
  type OldUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal;
    relationship_status : ?{ status : Text; customMessage : Text };
    streak_count : Nat;
    last_checkin_date : ?Nat;
    country : Text;
  };

  // Old type containing userProfiles with OldUserProfile.
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // New UserProfile with avatar field
  type NewUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal;
    relationship_status : ?{ status : Text; customMessage : Text };
    streak_count : Nat;
    last_checkin_date : ?Nat;
    country : Text;
    avatar : Text;
  };

  // New type containing userProfiles with NewUserProfile
  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        { oldProfile with avatar = "" }; // Default avatar
      }
    );
    { userProfiles = newUserProfiles };
  };
};
