import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [notificaton, setNotification] = useState(null)

  const initializeBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
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

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with: ', username, password)
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error(error)
      showNotification('Wrong username or password', 'failure')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title: blogTitle, author: blogAuthor, url: blogUrl })
      setBlogs(blogs.concat(newBlog))
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
      showNotification(`A new blog '${newBlog.title}' by '${newBlog.author}' added`, 'success')
    } catch (error) {
      console.error(error)
      showNotification('Failed to create blog', 'failure')
    }
  }

  const showNotification = (message, type) => {
    setNotification({message, type})
    setTimeout(() => {
      setNotification(null)
    }, 5000);
  }

  const LoginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div className='display-flex-gap'>
            Username
            <input 
              type='text'
              value={username}
              name='Username'
              onChange={({target}) => setUsername(target.value)}
            />
          </div>
          <div className='display-flex-gap'>
            Password
            <input 
              type='password'
              value={password}
              name='Password'
              onChange={({target}) => setPassword(target.value)}
            />
          </div>
          <br />
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }
  
  const BlogList = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <div className='display-flex-gap'>
          <p>{`${user.name} logged in`}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <br />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        <br />
        {NewBlogForm()}
      </div>      
    )
  }

  const NewBlogForm = () => {
    return (
      <div>
        <h2>Create new</h2>
        <form onSubmit={createNewBlog}>
          <div className='display-flex-gap'>
            Title:
            <input 
              type='text'
              value={blogTitle}
              name='BlogTitle'
              onChange={({target}) => setBlogTitle(target.value)}
            />
          </div>
          <div className='display-flex-gap'>
            Author:
            <input 
              type='text'
              value={blogAuthor}
              name='BlogAuthor'
              onChange={({target}) => setBlogAuthor(target.value)}
            />
          </div>
          <div className='display-flex-gap'>
            Url:
            <input 
              type='text'
              value={blogUrl}
              name='BlogUrl'
              onChange={({target}) => setBlogUrl(target.value)}
            />
          </div>
          <br />
          <button type='submit'>Create</button>
        </form>
      </div>
    )
  }

  const Notification = ({notification}) => {
    if (notification) {
      if (notification.type === 'success') {
        return (
          <div className='notification success-notification-color'>{notification.message}</div>
        )
      } else {
        return (
          <div className='notification failure-notification-color'>{notification.message}</div>
        )
      }
    }
  }

  return (
    <div>
      <Notification notification={notificaton} />
      { user ? BlogList() : LoginForm() }
    </div>
  )
}

export default App