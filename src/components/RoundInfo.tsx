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
  const { data: rndStartTime } = useRoundImplementationRoundStartTime({
    address: addresses?.round,
  });
  const { data: rndEndTime } = useRoundImplementationRoundEndTime({
    address: addresses?.round,
  });

  /*Time update*/
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1_000);
    return () => {
      clearInterval(interval);
    };
  }, [currentTime]);

  const applicationsStartTime = Number(appStartTime) * 1000;
  const applicationsEndTime = Number(appEndTime) * 1000;
  const roundStartTime = Number(rndStartTime) * 1000;
  const roundEndTime = Number(rndEndTime) * 1000;

  const applicationsState: ApplicationState =
    currentTime < applicationsStartTime
      ? "will-start"
      : currentTime > applicationsStartTime && currentTime < applicationsEndTime
      ? "ongoing"
      : "ended";
  const roundState: ApplicationState =
    currentTime < roundStartTime
      ? "will-start"
      : currentTime > roundStartTime && currentTime < roundEndTime
      ? "ongoing"
      : "ended";

  return (
    Boolean(applicationsStartTime) &&
    Boolean(applicationsEndTime) &&
    Boolean(roundStartTime) &&
    Boolean(roundEndTime) && (
      <Card>
        <CardHeader>
          <Heading as={"h2"}>Round Info</Heading>
        </CardHeader>
        <CardBody>
          <Box bgColor={colourStyles[applicationsState]}>
            Applications: {applicationsState} (
            {formatDistanceToNowStrict(applicationsStartTime, {
              addSuffix: true,
            })}
            →
            {formatDistanceToNowStrict(applicationsEndTime, {
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
                Round: {roundState} (
                {formatDistanceToNowStrict(roundStartTime, {
                  addSuffix: true,
                })}
                →
                {formatDistanceToNowStrict(roundEndTime, {
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
