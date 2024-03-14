import React from "react";
import Link from "next/link";
import classnames from "classnames";
import { useRouter } from "next/router";

interface IProps {
  tabs: { label: string; path: string }[];
}

const ProfileTab: React.FC<IProps> = ({ tabs }) => {
  const router = useRouter();
  return (
    <div className="profile_tab d-flex">
      <div className="d-flex">
        {tabs.map((el, i) => {
          return (
            <Link key={i} href={el.path}>
              <a
                className={classnames("btn", {
                  active: router.pathname === el.path,
                })}
              >
                {el.label}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileTab;
