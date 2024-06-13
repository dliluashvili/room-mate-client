import React, { useLayoutEffect } from "react";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace("/profile/favorites", undefined, {
      shallow: true,
    });
  });

  return <></>;
};

export default Profile;
