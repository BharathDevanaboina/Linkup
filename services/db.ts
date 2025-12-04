
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { Post } from '../types';
import { MOCK_POSTS } from '../constants';

// Real Firestore logic
const POSTS_COLLECTION = 'posts';

export const createPost = async (postData: Partial<Post>, user: any) => {
  if (!db) {
    console.warn("Firestore not configured. Post created in simulation mode.");
    // In a real mock implementation, we would add this to a local array state, 
    // but for now we just return success.
    return true;
  }

  try {
    await addDoc(collection(db, POSTS_COLLECTION), {
      userId: user.uid,
      user: {
        id: user.uid,
        name: user.displayName || 'Anonymous',
        handle: `@${user.email?.split('@')[0] || 'user'}`,
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`,
        isVerified: false, 
        rating: 5.0
      },
      category: postData.category,
      title: postData.title,
      description: postData.description,
      location: postData.location || 'Unknown',
      price: postData.price || '',
      reward: postData.reward || '',
      tags: postData.tags || [],
      // Use Server Timestamp for consistency
      createdAt: serverTimestamp(), 
      // Store local time string for immediate display if needed, 
      // but createdAt is better for sorting
      timestamp: new Date().toLocaleDateString(), 
      attendees: 0,
      
      // Safety & Options
      isAnonymous: postData.isAnonymous || false,
      isLocationPrivate: postData.isLocationPrivate || false,
      difficulty: postData.difficulty || 0,
      isBoosted: postData.isBoosted || false
    });
    return true;
  } catch (error) {
    console.error("Error creating post in Firestore:", error);
    return false;
  }
};

export const subscribeToPosts = (callback: (posts: Post[]) => void) => {
  // SAFETY CHECK: If DB is missing (no keys), return mock data
  if (!db) {
    console.warn("Firestore not configured. Using Mock Data.");
    // Simulate async delay
    setTimeout(() => {
        callback(MOCK_POSTS);
    }, 500);
    return () => {};
  }

  // Query posts ordered by creation time (newest first)
  const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      // Handle Firestore Timestamp conversion for UI
      let displayTime = 'Just now';
      if (data.createdAt) {
          // If it's a Firestore Timestamp
          if (data.createdAt.toDate) {
             const date = data.createdAt.toDate();
             displayTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
      }

      return {
        id: doc.id,
        ...data,
        timestamp: displayTime // Override the timestamp field for display
      } as Post;
    });
    
    callback(posts);
  });

  return unsubscribe;
};

export const subscribeToMyPosts = (userId: string, callback: (posts: Post[]) => void) => {
  if (!db) {
    callback(MOCK_POSTS.filter(p => p.userId === userId));
    return () => {};
  }

  const q = query(
    collection(db, POSTS_COLLECTION), 
    where("userId", "==", userId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
    callback(posts);
  });

  return unsubscribe;
};
    