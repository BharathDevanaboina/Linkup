
import { Post } from '../types';
import { MOCK_POSTS } from '../constants';

// In-memory store for the session
let localPosts = [...MOCK_POSTS];

// Create a new post (Mock)
export const createPost = async (postData: Partial<Post>, user: any) => {
  try {
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      user: {
        id: user.uid,
        name: user.displayName || 'Anonymous',
        handle: `@${user.email?.split('@')[0] || 'user'}`,
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`,
        isVerified: false,
        rating: 5.0
      },
      category: postData.category!,
      title: postData.title!,
      description: postData.description!,
      location: postData.location || 'Unknown',
      price: postData.price,
      reward: postData.reward,
      tags: postData.tags || [],
      timestamp: 'Just now',
      attendees: 0,
      createdAt: new Date().toISOString(),
      ...postData
    };

    localPosts = [newPost, ...localPosts];
    return true;
  } catch (error) {
    console.error("Error creating post:", error);
    return false;
  }
};

// Subscribe to main feed (Mock)
export const subscribeToPosts = (callback: (posts: Post[]) => void) => {
  // Return initial posts
  callback(localPosts);
  
  // Return a cleanup function (no-op for mock)
  return () => {};
};

// Subscribe to user's own posts (Mock)
export const subscribeToMyPosts = (userId: string, callback: (posts: Post[]) => void) => {
  const myPosts = localPosts.filter(p => p.userId === userId);
  callback(myPosts);
  return () => {};
};
