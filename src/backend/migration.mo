import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal.Principal;
    relationship_status : ?RelationshipStatus;
    can_set_relationship_status : Bool;
    streak_count : Nat;
    last_checkin_date : ?Nat;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
  };

  type NewUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal.Principal;
    relationship_status : ?RelationshipStatus;
    can_set_relationship_status : Bool;
    streak_count : Nat;
    last_checkin_date : ?Nat;
    country : ?Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal.Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal.Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          country = null;
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
    };
  };

  public type RelationshipStatus = {
    status : Text;
    customMessage : Text;
  };
};
