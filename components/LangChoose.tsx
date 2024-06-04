import Link from "next/link";
import { useRouter } from "next/router";

const LangChoose = ({ className, spanClassname }) => {
  const router = useRouter();

  return (
    <>
      {router.locales.map((lang) => {
        if (router.locale === lang) return null;
        return (
          <Link key={lang} href={router.asPath} locale={lang}>
            <div id="lang" className={className}>
              <span className={`${spanClassname}`}>
                {lang === "ka" ? "GEO" : "ENG"}
              </span>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default LangChoose;
