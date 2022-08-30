import React from "react";
import Link from "next/link";
import { ISearchItems } from "../../../services/profile/profile.http";
import { ProfileService } from "../../../services/profile/profile.http";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useTypedSelector } from "../../hooks/useTypeSelector";

interface IProps extends ISearchItems {
  updateAddRemove?: (id: number, saveId: boolean) => void;
  setPayModal?: (payed: boolean) => void;
}

const ProfileCard: React.FC<IProps> = ({
  age,
  firstname,
  suitableDistricts,
  suitablePrices,
  id,
  favourite_id,
  isFavourite,
  about_me,
  payed,
  setPayModal,

  updateAddRemove,
}) => {
  const addRemoveFromFavorites = () => {
    let requestId = favourite_id ? favourite_id : id;
    ProfileService.addRemoveFavorites(requestId)
      .then((res) => {
        console.log(res);
        updateAddRemove(requestId, isFavourite);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { user } = useTypedSelector((state) => state.profile);
  const router = useRouter();

  console.log(user?.payed);

  return (
    <div className="userCard_wrapper">
      <div className="userCard_heading d-flex justify-content-between ">
        <div
          className={classnames({
            bluer: !user?.payed,
          })}
        >
          <span className="pr-3">{firstname}</span>
          <span>{age} წლის</span>
        </div>
        <div
          className={classnames({
            bluer: !user?.payed,
          })}
        >
          {suitablePrices &&
            suitablePrices[0].split("-")[0] +
              "-" +
              suitablePrices[suitablePrices.length - 1]
                .split("-")[1]
                .replace("ლარი", "₾ ")}
          თვეში
        </div>
      </div>
      <div className="userCard_body d-flex">
        <div>
          <img src="/imgs/download.jpg" />
        </div>
        <p>{about_me}</p>
      </div>
      <div className="userCard_footer d-flex justify-content-between ">
        <div className="d-flex align-items-center">
          <svg
            className="pr-2"
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
            className={classnames("pl-2 userCard_footer_locations ", {
              bluer: !user?.payed,
            })}
          >
            {suitableDistricts && suitableDistricts.join(", ")}
          </span>
        </div>
        <div className="d-flex pointer ">
          <div
            onClick={() => {
              if (!user?.payed) {
                setPayModal(user?.payed);

                return;
              }
              addRemoveFromFavorites();
            }}
            className="mx-3 "
          >
            <svg
              width="17"
              height="15"
              viewBox="0 0 17 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.51338 1.81663L9.51315 1.81686L8.85906 2.49087L8.50024 2.86062L8.14143 2.49087L7.48734 1.81686L7.48676 1.81627C5.98177 0.260311 3.57076 0.0379397 1.97517 1.39741L9.51338 1.81663ZM9.51338 1.81663C11.022 0.260021 13.4299 0.0381075 15.0253 1.39741C16.8878 2.98705 16.9876 5.84713 15.3162 7.57195L15.3161 7.57205M9.51338 1.81663L15.3161 7.57205M15.3161 7.57205L8.89154 14.2058C8.89151 14.2058 8.89148 14.2059 8.89145 14.2059C8.6729 14.4313 8.32427 14.4313 8.10572 14.2059C8.10569 14.2059 8.10566 14.2058 8.10562 14.2058L1.68125 7.57227M15.3161 7.57205L1.68125 7.57227M1.68125 7.57227L1.68104 7.57205C0.0128322 5.8472 0.112702 2.98711 1.97509 1.39747L1.68125 7.57227Z"
                fill={isFavourite ? "red" : "#fff"}
                stroke="#5E666E"
              />
            </svg>

            {isFavourite ? "წაშლა" : " შენახვა"}
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
              მეტის ნახვა
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
