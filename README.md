TO DO:

change draft now button to only if full AND logged in user
is one of the registered users

fix bug where draft now is sometimes greyed out 

write logic to store each users bid


Real-time Bidding:

To handle real-time bidding, use Firebase Realtime Database or Firestore's real-time capabilities (Firestore listeners).
 When the timer expires, it will trigger a function to determine the highest bidder.
Use Firebase Realtime Database or Firestore to store and synchronize bid data among all users participating in the draft.
Determine Highest Bidder:

When the timer expires, the system should determine the highest bidder based on the bid amounts entered by each user.
Compare the bids and identify the highest bid and the corresponding user.
Update Roster:

Once the highest bidder is determined, update the winning user's roster in the 'registeredUsers' subcollection.
Check if the user already has an RB1 or WR1 in their roster. If they do, add the player to the corresponding RB2 or WR2 field. If not, add the player to the RB1 or WR1 field.
Update the player's status to indicate that they are no longer available for bidding.
Continue Auction:

Repeat the process to place the next player on the auction block until all players have been drafted.
Remember edge cases to consider. 