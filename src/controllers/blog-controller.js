import * as api from '../helpers/api';

export const PAGE_SIZE = 20;

export function getAllPosts(pageNumber) {
  return api.get('posts', {
    page: pageNumber - 1,
    page_size: PAGE_SIZE
  });
}

export function getBloggerPosts(bloggerId, pageNumber) {
  return api.get('posts', {
    author_id: bloggerId,
    page: pageNumber - 1,
    page_size: PAGE_SIZE
  });
}

export function getPostAuthors(posts) {
  // Add posts author IDs to array
  const ids = posts.map(post => post.author_id);

  // Stringify as CSV
  const idsParams = ids.join(',');

  return api.get('users', {
    ids: idsParams
  })
  .then(users => {
    // Return author as a property of each post
    const postsWithAuthors = posts;

    for (let i = 0; i < posts.length; ++i) {
      postsWithAuthors[i].author = users[posts[i].author_id];
    }
    return postsWithAuthors;
  });
}

export function removeDupes(_posts) {
  if (_posts.length < 2) {
    return;
  }

  const posts = _posts;
  let compare = posts[0];

  for (let i = 1; i < posts.length; ++i) {
    if (posts[i].author_id === compare.author_id) {
      if (!compare.more) {
        compare.more = [];
      }
      compare.more.push(posts[i]);

      posts.splice(i, 1);
      --i;
    } else {
      compare = posts[i];
    }
  }
}
