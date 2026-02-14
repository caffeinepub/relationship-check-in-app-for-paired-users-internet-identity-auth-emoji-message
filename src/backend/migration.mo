import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";

module {
  type OldUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal;
    relationship_status : ?RelationshipStatus;
    can_set_relationship_status : Bool;
    streak_count : Nat;
    last_checkin_date : ?Nat;
    country : Text;
  };

  type RelationshipStatus = {
    status : Text;
    customMessage : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    checkIns : Map.Map<Principal, List.List<CheckIn>>;
    tokens : Map.Map<Text, Principal>;
  };

  type CheckIn = {
    timestamp : Int;
    emoji : Text;
    message : Text;
    author : Principal;
  };

  type NewUserProfile = {
    name : Text;
    premium : Bool;
    partner_ref : ?Principal;
    relationship_status : ?RelationshipStatus;
    streak_count : Nat;
    last_checkin_date : ?Nat;
    country : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    checkIns : Map.Map<Principal, List.List<CheckIn>>;
    tokens : Map.Map<Text, Principal>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          name = oldProfile.name;
          premium = oldProfile.premium;
          partner_ref = oldProfile.partner_ref;
          relationship_status = oldProfile.relationship_status;
          streak_count = oldProfile.streak_count;
          last_checkin_date = oldProfile.last_checkin_date;
          country = oldProfile.country;
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
    };
  };
};
