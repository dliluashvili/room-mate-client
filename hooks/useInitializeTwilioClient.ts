import { useMutation, useReactiveVar } from "@apollo/client";
import { twilioConnectionStateVar, twilioClientVar } from "../store/twilioVars";
import { useEffect } from "react";
import { ConnectionState, Client as TwilioClient } from "@twilio/conversations";
import {
  generateTwilioAccessTokenMutation,
  logConnectionErrorMutation,
} from "../gql/graphqlStatements";
import { useTypedSelector } from "../components/hooks/useTypeSelector";

export const useInitializeTwilioClient = () => {
  const { user } = useTypedSelector((state) => state.profile);

  const twilioClient = useReactiveVar(twilioClientVar);

  const [generateTwilioAccessToken] = useMutation(
    generateTwilioAccessTokenMutation
  );

  const [logConnectionError] = useMutation(logConnectionErrorMutation);

  const initializeTwilioClient = async () => {
    try {
      const { data } = await generateTwilioAccessToken();

      if (data?.generateTwilioAccessToken) {
        const client = new TwilioClient(data.generateTwilioAccessToken);

        twilioClientVar(client);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleConnectionStateChanged = (state: ConnectionState) => {
    twilioConnectionStateVar(state);
  };

  const handleTokenRefresh = async (twilioClient: TwilioClient) => {
    try {
      const { data } = await generateTwilioAccessToken();

      if (data?.generateTwilioAccessToken) {
        const client = await twilioClient.updateToken(
          data.generateTwilioAccessToken
        );

        twilioClientVar(client);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleConnectionError = (error: any) => {
    logConnectionError({
      variables: {
        error: JSON.stringify(error),
      },
    });
  };

  useEffect(() => {
    if (user) {
      initializeTwilioClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && twilioClient) {
      twilioClient.addListener("connectionStateChanged", (state) => {
        handleConnectionStateChanged(state);
      });

      twilioClient.addListener("tokenAboutToExpire", () => {
        handleTokenRefresh(twilioClient);
      });

      twilioClient.addListener("connectionError", (error) => {
        handleConnectionError(error);
      });
    }

    return () => {
      if (twilioClient) {
        twilioClient.removeListener("connectionStateChanged", (state) => {
          handleConnectionStateChanged(state);
        });

        twilioClient.removeListener("tokenAboutToExpire", () => {
          handleTokenRefresh(twilioClient);
        });

        twilioClient.removeListener("connectionError", (error) => {
          handleConnectionError(error);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twilioClient, user]);
};
