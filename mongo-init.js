// MongoDB initialization script
db = db.getSiblingDB('neighborhood-hub');

// Create collections
db.createCollection('users');
db.createCollection('communities');
db.createCollection('memberships');
db.createCollection('posts');
db.createCollection('comments');
db.createCollection('notifications');
db.createCollection('chatsessions');
db.createCollection('chatmessages');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.communities.createIndex({ "slug": 1 }, { unique: true });
db.memberships.createIndex({ "userId": 1, "communityId": 1 }, { unique: true });
db.posts.createIndex({ "communityId": 1, "createdAt": -1 });
db.posts.createIndex({ "authorId": 1, "createdAt": -1 });
db.comments.createIndex({ "postId": 1, "createdAt": -1 });
db.notifications.createIndex({ "userId": 1, "createdAt": -1 });
db.chatsessions.createIndex({ "communityId": 1, "createdAt": -1 });
db.chatmessages.createIndex({ "sessionId": 1, "createdAt": -1 });

print('Neighborhood Hub database initialized successfully!');
