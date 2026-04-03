import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type PlayerStats = {
    name : Text;
    wins : Nat;
  };

  module PlayerStats {
    public func compare(x : PlayerStats, y : PlayerStats) : Order.Order {
      switch (Nat.compare(y.wins, x.wins)) {
        case (#equal) { Text.compare(x.name, y.name) };
        case (order) { order };
      };
    };
  };

  let scoreboard = Map.empty<Text, Nat>();
  var recentWinners : [Text] = [];
  let maxRecentWinners = 10;

  public shared ({ caller }) func recordWin(name : Text) : async () {
    let currentWins = switch (scoreboard.get(name)) {
      case (null) { 0 };
      case (?wins) { wins };
    };
    scoreboard.add(name, currentWins + 1);

    var updatedWinners = [name];
    updatedWinners := updatedWinners.concat(recentWinners);
    if (updatedWinners.size() > maxRecentWinners) {
      updatedWinners := updatedWinners.sliceToArray(0, maxRecentWinners);
    };
    recentWinners := updatedWinners;
  };

  public query ({ caller }) func getScoreboard() : async [(Text, Nat)] {
    scoreboard.entries().toArray();
  };

  public query ({ caller }) func getSortedScoreboard() : async [PlayerStats] {
    scoreboard.entries().toArray().map(func((name, wins)) { { name; wins } }).sort();
  };

  public query ({ caller }) func getRecentWinners() : async [Text] {
    recentWinners;
  };

  public shared ({ caller }) func resetScoreboard() : async () {
    scoreboard.clear();
    recentWinners := [];
  };

  public query ({ caller }) func getPlayerWins(name : Text) : async ?Nat {
    scoreboard.get(name);
  };

  public query ({ caller }) func getTopPlayers(count : Nat) : async [PlayerStats] {
    let sorted = scoreboard.entries().toArray().map(func((name, wins)) { { name; wins } }).sort();
    sorted.sliceToArray(0, count);
  };

  public query ({ caller }) func getTotalGames() : async Nat {
    scoreboard.values().toArray().foldLeft(0, Nat.add);
  };

  public query ({ caller }) func getPlayerCount() : async Nat {
    let entries = scoreboard.entries();
    entries.toArray().foldLeft(0, func(count, (_, _)) { count + 1 });
  };
};
