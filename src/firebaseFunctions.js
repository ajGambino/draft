import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export const getHighestBidUser = async (contestId) => {
    try {
        const db = firebase.firestore();
        const auctionRef = db.collection('contests').doc(contestId).collection('auctionBlock');

        // Get all bid amounts
        const bidAmountsSnapshot = await auctionRef.doc('bidAmounts').collection('users').get();
        if (bidAmountsSnapshot.empty) {
            return null; // No bids found
        }

        // Find the highest bid user
        let highestBidUser = null;
        let highestBidAmount = 0;
        bidAmountsSnapshot.forEach((doc) => {
            const bidData = doc.data();
            if (bidData.bidAmount > highestBidAmount) {
                highestBidUser = doc.id;
                highestBidAmount = bidData.bidAmount;
            }
        });

        return highestBidUser;
    } catch (error) {
        console.error('Error getting highest bid user:', error);
        return null;
    }
};
