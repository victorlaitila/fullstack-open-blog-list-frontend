const Blog = ({ blog, blogVisible, toggleBlogVisibility, likeBlog }) => {
  return (
    <div>
      {
        blogVisible ?
        <div className='blog-item'>
          <div className='display-flex-gap'>
            {blog.title} {blog.author}
            <button onClick={() => toggleBlogVisibility(blog.id, false)}>hide</button>
          </div>
          {blog.url}
          <div className='display-flex-gap'>
            {`Likes: ${blog.likes}`}
            <button onClick={() => likeBlog(blog.id)}>like</button>
          </div>
          {blog.user.name}
        </div> :
        <div className='display-flex-gap blog-item'>
          {blog.title} {blog.author}
          <button onClick={() => toggleBlogVisibility(blog.id, true)}>view</button>
        </div>
      }
    </div>
  )
}

export default Blog