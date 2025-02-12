import { useState } from 'react'
import Blog from './Blog'
import NewBlogForm from './NewBlogForm'

const BlogList = ({blogs, user, handleLogout, createNewBlog, likeBlog}) => {
  const [openBlogs, setOpenBlogs] = useState([])

  const toggleBlogVisibilityById = (id, newValue) => {
    if (newValue) {
      setOpenBlogs(openBlogs.concat(id))
    } else {
      setOpenBlogs(openBlogs.filter(blog => blog !== id))
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      <div className='display-flex-gap'>
        <p>{`${user.name} logged in`}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <NewBlogForm 
        createNewBlog={createNewBlog}
      />
      <br />
      {blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          blogVisible={openBlogs.includes(blog.id)}
          toggleBlogVisibility={toggleBlogVisibilityById}
          likeBlog={likeBlog}
        />
      )}
      <br />
    </div>      
  )
}

export default BlogList