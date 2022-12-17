## ATG server
host link: https://atg-server.vercel.app/

# APIs list
1. base: https://atg-server.vercel.app/

2. register: https://atg-server.vercel.app/registration
   body : {
  "username": "user_name",
  "email": "user@mail.com",
  "password": "abcdef",
  "liked": [],
  "commented": []
}

3. login: https://atg-server.vercel.app/login
   body: {
  "email":"user@mail.com",
  "password":"abcdef"
}

4. create post: https://atg-server.vercel.app/post
   body: {
  "email": "user@mail.com",
  "title": "Title",
  "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione itaque cum pariatur vitae soluta autem nesciunt et eveniet fugit ducimus.",
  "likes": [],
  "comments": []
}

5. read post (all): https://atg-server.vercel.app/post

6. read post (email): https://atg-server.vercel.app/post?email=user@mail.com

7. read post (id): https://atg-server.vercel.app/post/[post_id]

8. update post: https://atg-server.vercel.app/post/[post_id]
   body: {
  "email": "user@mail.com",
  "title": "Updated Title",
  "description": "updated description"
}

9. delete post: https://atg-server.vercel.app/post/[post_id]

10. like post: https://atg-server.vercel.app/post/like/[post_id]
    body: {
  "userEmail":"john@wick.com"
}

11. comment post: https://atg-server.vercel.app/post/comment/[post_id]
    body: {
  "userEmail":"user@mail.com",
  "userName":"user_name",
  "comment":"comment_text"
}