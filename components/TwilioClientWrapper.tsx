import { useInitializeTwilioClient } from "../hooks/useInitializeTwilioClient";
import { useInitializeNotification } from "../hooks/useNotification";

export default function TwilioClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useInitializeTwilioClient();
  useInitializeNotification();

  return <>{children}</>;
}
