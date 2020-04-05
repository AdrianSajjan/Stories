# STORIES!

## Tired of seeing pictures, videos and memes on every social platform? Believe that words carry deeper meaning than pictures? Then this site is for you. Post texts for other people to read and share. Post whats on your mind that you can describe through words and not pictures.

### **Author :**

- Adrian Sajjan

## **Scripts :**

- **npm run server** -
  Only runs the development server.

- **npm run client** -
  Runs the react client app.
- **npm run dev** -
  Concurrently runs both the scripts.

## **Server**

- **User** -
  Creates a User Model with Name, Email and Password.

- **Profile** -
  Creates a Profile Model with the value from User Model and additionally Username(unique), BIO, DOB etc.

- **Post** -
  Creates a Post Model with the owner value from User Model and Profile value from Profiles Model, Content, Image. Likes and Comment will be defaulted to 0.
