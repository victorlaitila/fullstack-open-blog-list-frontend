import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificaton, setNotification] = useState(null)

  const initializeBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  useEffect(() => {
    initializeBlogs() 
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) 
      blogService.setToken(user.token)
      setUser(user)
    } catch (error) {
      console.error(error)
      showNotification('Wrong username or password', 'failure')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createNewBlog = async (title, author, url) => {
    try {
      const newBlog = await blogService.create({ title: title, author: author, url: url, user: user.id })
      setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes))
      showNotification(`A new blog '${newBlog.title}' by '${newBlog.author}' added`, 'success')
    } catch (error) {
      console.error(error)
      showNotification('Failed to create blog', 'failure')
    }
  }

  const likeBlog = async (id) => {
    try {
      const blogToUpdate = blogs.find(blog => blog.id === id)
      const newBlogObject = {...blogToUpdate, likes: blogToUpdate.likes + 1}
      const updatedBlog = await blogService.updateById(id, newBlogObject)
      setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog).sort((a, b) => b.likes - a.likes))
    } catch (error) {
      showNotification(error.message, 'failure')
    }
  }

  const showNotification = (message, type) => {
    setNotification({message, type})
    setTimeout(() => {
      setNotification(null)
    }, 5000);
  }

  return (
    <div>
      <Notification notification={notificaton} />
      { 
        user ? 
        <BlogList 
          blogs={blogs}
          user={user}
          handleLogout={handleLogout}
          createNewBlog={createNewBlog}
          likeBlog={likeBlog}
        /> : 
        <LoginForm 
          handleLogin={handleLogin} 
        /> 
      }
    </div>
  )
}

export default App