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

export default Notification