import React from "react";
import Link from "next/link";
import { ISearchItems } from "../../../services/profile/profile.http";
import { ProfileService } from "../../../services/profile/profile.http";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useTypedSelector } from "../../hooks/useTypeSelector";
import useTranslation from "next-translate/useTranslation";
import Sms from "../../../public/newImages/sms-edit.svg";
import Image from "next/image";

interface IProps extends ISearchItems {
  updateAddRemove?: (id: number, saveId: boolean) => void;
  setPayModal?: (payed: boolean) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setName: React.Dispatch<any>;
}

const ProfileCard: React.FC<IProps> = ({
  age,
  firstname,
  id,
  favourite_id,
  isFavourite,
  setPayModal,
  profile_image,
  cardInfo,
  updateAddRemove,
  setIsOpen,
  setName,
}) => {
  const addRemoveFromFavorites = () => {
    let requestId = favourite_id ? favourite_id : id;

    ProfileService.addRemoveFavorites(Number(requestId))
      .then((res) => {
        updateAddRemove(requestId, isFavourite);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let { t } = useTranslation("common");

  const { user } = useTypedSelector((state) => state.profile);
  const router = useRouter();

  const districtNames = cardInfo?.districtNames;
  const budget = cardInfo?.budget;
  const bio = cardInfo?.bio;

  return (
    <div className="userCard_wrapper">
      <div className="userCard_heading d-flex justify-content-between ">
        <div
          className={classnames({
            bluer: !user?.payed,
          })}
        >
          <span
            onClick={(e) => {
              e.preventDefault();
              if (!user?.payed) {
                setPayModal(user?.payed);
                return;
              } else {
                router.push(`/user/${id}`);
              }
            }}
            className="pr-3 pointer"
          >
            {firstname}
          </span>
          <span>
            {age} {t("years")}
          </span>
        </div>
        <div
          className={classnames({
            bluer: !user?.payed,
          })}
        >
          {!!budget && `${budget}$ - ${t("InMonth")} `}
        </div>
      </div>
      <div className="userCard_body d-flex">
        <div
          style={{
            position: "relative",
            width: "130px",
            height: "100px",
          }}
        >
          <img
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              border: "1px solid #b1a1a130",
            }}
            onClick={(e) => {
              e.preventDefault();
              if (!user?.payed) {
                setPayModal(user?.payed);
                return;
              } else {
                router.push(`/user/${id}`);
              }
            }}
            className="pointer"
            src={
              profile_image
                ? profile_image
                : "https://www.portmelbournefc.com.au/wp-content/uploads/2022/03/avatar-1.jpeg"
            }
          />
        </div>

        <p>{bio}</p>
      </div>
      <div className="userCard_footer d-flex justify-content-between ">
        <div className="d-flex align-items-center">
          <svg
            width="13"
            height="18"
            viewBox="0 0 13 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 17.2522C6.33391 17.0636 6.1183 16.8146 5.86773 16.5153C5.26494 15.7955 4.46213 14.788 3.66036 13.6362C2.85757 12.483 2.06237 11.1944 1.46949 9.9117C0.873426 8.62215 0.5 7.37688 0.5 6.3C0.5 3.10776 3.16773 0.5 6.5 0.5C9.83227 0.5 12.5 3.10776 12.5 6.3C12.5 7.37688 12.1266 8.62215 11.5305 9.9117C10.9376 11.1944 10.1424 12.483 9.33964 13.6362C8.53787 14.788 7.73506 15.7955 7.13227 16.5153C6.8817 16.8146 6.66608 17.0636 6.5 17.2522ZM3.67857 6.3C3.67857 7.83276 4.95727 9.05 6.5 9.05C8.04273 9.05 9.32143 7.83276 9.32143 6.3C9.32143 4.76724 8.04273 3.55 6.5 3.55C4.95727 3.55 3.67857 4.76724 3.67857 6.3Z"
              stroke="#5E666E"
            />
          </svg>
          <span
            className={classnames("userCard_footer_locations w-auto ", {
              bluer: !user?.payed,
            })}
          >
            {districtNames}
          </span>
        </div>
        {/* <Link href="/messages">
          <Button variant="message">Message</Button>
        </Link> */}

        <div className="d-flex pointer items-center">
          <button
            className="w-auto py-2 px-2 bg-[#0A7CFF] leading-none rounded-md  flex flex-row items-center justify-center"
            onClick={() => {
              setName(firstname);
              setIsOpen(true);
            }}
          >
            <Image src={Sms} width={16} height={16} alt="sms" />
            <span className="ml-1 text-white text-xs">Message</span>
          </button>
          <div
            onClick={() => {
              if (!user?.payed) {
                setPayModal(user?.payed);

                return;
              }
              addRemoveFromFavorites();
            }}
            className="mx-3 d-flex"
          >
            {isFavourite ? (
              <svg
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 89.96 82.52"
                width="17"
                height="15"
              >
                <defs></defs>
                <path
                  fill="#c73e3e"
                  d="M87.31,35.86a26.3,26.3,0,0,1-4.44,6.34C70.51,55.43,58.07,68.55,45.65,81.71c-.2.22-.43.42-.85.81a10.29,10.29,0,0,0-.67-.94Q25.65,62,7.16,42.41A25.16,25.16,0,0,1,.05,22.9,24.43,24.43,0,0,1,7.4,6.59a22.2,22.2,0,0,1,26.21-4,23.82,23.82,0,0,1,6.25,4.86l5.07,5.44c.75-.81,1.38-1.53,2-2.21,2.5-2.59,4.87-5.31,7.91-7.26A22.21,22.21,0,0,1,80,4.44,25.26,25.26,0,0,1,87.31,35.86Z"
                />
              </svg>
            ) : (
              <svg
                id="Layer_1"
                width="17"
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 89.96 82.52"
              >
                <defs></defs>
                <path
                  fill="#5e666e"
                  d="M44.81,82.52a9,9,0,0,0-.68-.94Q25.65,62,7.17,42.4A25.1,25.1,0,0,1,.05,22.9,24.48,24.48,0,0,1,7.4,6.58a22.2,22.2,0,0,1,26.21-4,23.71,23.71,0,0,1,6.26,4.86l5.06,5.43c.75-.81,1.39-1.52,2-2.21,2.49-2.59,4.87-5.31,7.9-7.26A22.26,22.26,0,0,1,80,4.43a25.29,25.29,0,0,1,7.29,31.43,26.21,26.21,0,0,1-4.44,6.34C70.52,55.42,58.07,68.55,45.66,81.7,45.45,81.92,45.22,82.12,44.81,82.52ZM45,76.4c.29-.29.52-.5.73-.72q17.19-18.24,34.4-36.49a21,21,0,0,0-.71-29.92,18.18,18.18,0,0,0-24.14-.92c-2.94,2.52-5.51,5.53-8.22,8.34-.66.68-1.25,1.45-1.91,2.23l-1-1-7-7.41A18.92,18.92,0,0,0,25.48,4.37c-9.69-1.22-18.83,5.42-21,15.49A20.74,20.74,0,0,0,10,39.41Q27.12,57.49,44.16,75.6C44.39,75.85,44.64,76.08,45,76.4Z"
                />
              </svg>
            )}

            {isFavourite ? t("delete") : t("save")}
          </div>
          <Link href={`/user/${id}`}>
            <a
              onClick={(e) => {
                e.preventDefault();
                if (!user?.payed) {
                  setPayModal(user?.payed);
                  return;
                } else {
                  router.push(`/user/${id}`);
                }
              }}
            >
              {t("seeMore")}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
