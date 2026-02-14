import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    couples : Map.Map<Principal, Principal>;
    checkIns : Map.Map<Principal, List.List<CheckIn>>;
    tokens : Map.Map<Text, Principal>;
  };

  type NewUserProfile = {
    name : Text;
    premium : Bool;
  };

  public type CheckIn = {
    timestamp : Time.Time;
    emoji : Text;
    message : Text;
    author : Principal;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    couples : Map.Map<Principal, Principal>;
    checkIns : Map.Map<Principal, List.List<CheckIn>>;
    tokens : Map.Map<Text, Principal>;
  };

  public func run(old : OldActor) : NewActor {
    let newProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        { oldProfile with premium = false };
      }
    );

    {
      old with
      userProfiles = newProfiles
    };
  };
};
