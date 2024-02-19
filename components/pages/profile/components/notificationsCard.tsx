import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

interface IProps {
    text: string | React.ReactNode;
    type?: string;
    id: number;
    img?: string;
    className?: string;
}

const NotificationsCard: React.FC<IProps> = ({
    text,
    id,
    children,
    type,
    img,
    className,
}) => {
    return (
        <div
            className={classNames('notification_card ', className, {
                [type]: type,
            })}
        >
            <div className="notification_body d-flex">
                <Link href={'/user/' + id}>
                    <a>
                        <img
                            src={
                                img
                                    ? img
                                    : 'https://www.portmelbournefc.com.au/wp-content/uploads/2022/03/avatar-1.jpeg'
                            }
                        />
                    </a>
                </Link>
                <p>{text}</p>
            </div>

            <div className="notification_footer d-flex">{children}</div>
        </div>
    );
};

export default NotificationsCard;
