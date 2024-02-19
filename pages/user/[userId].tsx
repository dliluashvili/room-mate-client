import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ProfileWrapper from '../../components/pages/profile/profileWrapper';
import {
    ProfileService,
    IUserProfile,
} from '../../services/profile/profile.http';
import QuestionPreview from '../../components/pages/profile/QuestionPreview';

const UserId = () => {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    useEffect(() => {
        ProfileService.getUserById(router.query.userId as string, router.locale)
            .then((res) => {
                setUserProfile(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.locale]);

    return (
        <div className="profile">
            <ProfileWrapper
                myProfile={false}
                userProfile={userProfile}
            >
                {userProfile ? (
                    <QuestionPreview userProfile={userProfile} />
                ) : null}
            </ProfileWrapper>
        </div>
    );
};

export default UserId;
