import React, { Children } from 'react'
import { Notification } from 'rsuite'

const Notifications = ({ type, header, children, ...props }) => {
    return (
        <Notification type={type} header={header} {...props} closable>
            <p width={320} rows={2} />
            {children}
        </Notification>
    )
}
export default Notifications
