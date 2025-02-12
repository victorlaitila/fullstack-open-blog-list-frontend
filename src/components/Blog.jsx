import PropTypes from 'prop-types'

const Blog = ({blog, blogVisible, toggleBlogVisibility, likeBlog, username, deleteBlog}) => {
  const BlogDetails = () => {
    return (
      <div className='blog-item'>
        <div className='display-flex-gap'>
          {blog.title} - {blog.author}
          <button onClick={() => toggleBlogVisibility(blog.id, false)}>hide</button>
        </div>
        <a href={blog.url}>{blog.url}</a>
        <div className='display-flex-gap'>
          {`Likes: ${blog.likes}`}
          <button onClick={() => likeBlog(blog.id)}>like</button>
        </div>
        {blog.user.name}
        {
          username === blog.user.username &&
          <div>
            <button className='delete-button' onClick={() => deleteBlog(blog)}>delete</button>
          </div>
        }
      </div>
    )
  }

  return (
    <div>
      {
        blogVisible ?
          BlogDetails() :
          <div className='display-flex-gap blog-item'>
            {blog.title} - {blog.author}
            <button onClick={() => toggleBlogVisibility(blog.id, true)}>view</button>
          </div>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogVisible: PropTypes.bool.isRequired,
  toggleBlogVisibility: PropTypes.func.isRequired,
  likeBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog