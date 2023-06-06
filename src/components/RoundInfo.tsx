import { formatDistanceToNowStrict } from "date-fns";
import { useAddressesStore } from "../stores";
import {
  useRoundImplementationApplicationsEndTime,
  useRoundImplementationApplicationsStartTime,
  useRoundImplementationRoundEndTime,
  useRoundImplementationRoundStartTime,
} from "../generated";
import { useEffect, useState } from "react";

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
      setCurrentTime(Date.now());
    }, 1_000);
    return () => {
      clearInterval(interval);
    };
  }, [currentTime]);

  return (
    <div>
      {Boolean(appStartTime) &&
        Boolean(appEndTime) &&
        Boolean(roundStartTime) &&
        Boolean(roundEndTime) && (
          <div>
            {formatDistanceToNowStrict(Number(appStartTime), {
              addSuffix: true,
            })}
            -
            {formatDistanceToNowStrict(Number(appEndTime), {
              addSuffix: true,
            })}
            ,{" "}
            {formatDistanceToNowStrict(Number(roundStartTime), {
              addSuffix: true,
            })}
            -
            {formatDistanceToNowStrict(Number(roundEndTime), {
              addSuffix: true,
            })}
          </div>
        )}
    </div>
  );
}
