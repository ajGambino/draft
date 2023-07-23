TO DO:

bid input require whole positive integer

Draft State:

redirect all registered users to /draft not just the last user to fill

track the index of the current user's turn in the Draft component state.
use the tracked index to display the name of the user in the "Select a Player" header.
increment the turn index each time a user selects a player.

synchronize the selected player and timer between multiple users in the same draft
implement real-time communication and data synchronization between clients using firestore 

change draft now button to only if full AND logged in user
is one of the registered users

fix bug where draft now is sometimes greyed out 

write logic to store each users bid

add $100 bankroll to user Card component
-logic to subtract when winning bid.
add max button?

Edge Cases:
must have $1 for every position left to fill
handle tie breakers
if no one bids, the person who selected a player wins the player for $1

subcollection bid amount should reset for each user document or 
add player field so they have multiple bid amounts ?

render selected player and timer for all users in draft

Update Roster:
once highest bidder is determined, update the winning user's roster in the 'registeredUsers' subcollection.
if the user already has an RB1 or WR1 in their roster, add the player to the corresponding RB2 or WR2 field. if not, add the player to the RB1 or WR1 field.
update the player's status to indicate that they are no longer available for bidding.


