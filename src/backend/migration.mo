import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Old UserProfile type with optional country
  type OldUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal;
    relationship_status : ?{
      status : Text;
      customMessage : Text;
    };
    can_set_relationship_status : Bool;
    streak_count : Nat;
    last_checkin_date : ?Nat;
    country : ?Text;
  };

  // New UserProfile type with mandatory (non-optional) country field
  type NewUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal;
    relationship_status : ?{
      status : Text;
      customMessage : Text;
    };
    can_set_relationship_status : Bool;
    streak_count : Nat;
    last_checkin_date : ?Nat;
    country : Text;
  };

  // Old actor type (checkIns Map is now obsolete)
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    tokens : Map.Map<Text, Principal>;
  };

  // New actor type (removes obsolete checkIns field)
  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    tokens : Map.Map<Text, Principal>;
  };

  // Perform migration from old to new actor state
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          country = switch (oldProfile.country) {
            case (null) { "" };
            case (?country) { country };
          };
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
    };
  };
};
