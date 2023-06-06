import { formatDistanceToNowStrict, formatRFC7231 } from "date-fns";
import { useAddressesStore } from "../stores";
import {
  useRoundImplementationApplicationsEndTime,
  useRoundImplementationApplicationsStartTime,
  useRoundImplementationRoundEndTime,
  useRoundImplementationRoundStartTime,
} from "../generated";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Tooltip,
} from "@chakra-ui/react";

type ApplicationState = "will-start" | "ongoing" | "ended";

const colourStyles = {
  "will-start": "orange.100",
  ongoing: "green.100",
  ended: "red.100",
};

export function RoundInfo() {
  const addresses = useAddressesStore();

  const { data: appStartTime } = useRoundImplementationApplicationsStartTime({
    address: addresses?.round,
  });
  const { data: appEndTime } = useRoundImplementationApplicationsEndTime({
    address: addresses?.round,
  });
  const { data: roundStartTime } = useRoundImplementationRoundStartTime({
    address: addresses?.round,
  });
  const { data: roundEndTime } = useRoundImplementationRoundEndTime({
    address: addresses?.round,
  });

  /*Time update*/
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1_000);
    return () => {
      clearInterval(interval);
    };
  }, [currentTime]);

  const applicationsState: ApplicationState =
    currentTime < appStartTime
      ? "will-start"
      : currentTime > appStartTime && currentTime < appEndTime
      ? "ongoing"
      : "ended";
  const roundState: ApplicationState =
    currentTime < roundStartTime
      ? "will-start"
      : currentTime > roundStartTime && currentTime < roundEndTime
      ? "ongoing"
      : "ended";

  // @ts-ignore
  return (
    Boolean(appStartTime) &&
    Boolean(appEndTime) &&
    Boolean(roundStartTime) &&
    Boolean(roundEndTime) && (
      <Card>
        <CardHeader>
          <Heading as={"h2"}>Round Info</Heading>
        </CardHeader>
        <CardBody>
          <Box bgColor={colourStyles[applicationsState]}>
            Applications: {applicationsState} (
            {formatDistanceToNowStrict(Number(appStartTime), {
              addSuffix: true,
            })}
            →
            {formatDistanceToNowStrict(Number(appEndTime), {
              addSuffix: true,
            })}
            )
          </Box>
          <Box bgColor={colourStyles[applicationsState]}>
            <Tooltip
              label={`${formatRFC7231(Number(roundStartTime))}-${formatRFC7231(
                Number(roundEndTime)
              )}`}
            >
              <div>
                Round: {roundState}(
                {formatDistanceToNowStrict(Number(roundStartTime), {
                  addSuffix: true,
                })}
                →
                {formatDistanceToNowStrict(Number(roundEndTime), {
                  addSuffix: true,
                })}
                )
              </div>
            </Tooltip>
          </Box>
        </CardBody>
      </Card>
    )
  );
}
