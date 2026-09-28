// / <reference types="react" />
import {
  Box,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { TradeBtn } from "../Buttons/Trade";
import { EditBtn } from "../Buttons/Edit";
import { CancelBtn } from "../Buttons/Cancel";
import { ReportBtn } from "../Buttons/Report";
import "../../App.css";
import { useAuthContext } from "../../context/UseAuthContext";
import { Booking, MachineNameEnum, MAX_RESERVATIONS_PER_WEEK } from "../../constants";
import { useMemo, useState } from "react";
import { MachineSelectBtn } from "../Buttons/MachineSelectBtn";
import { useFetchMachines } from "../../hooks/ machineHooks";

export function BookingHeader({
  data,
}: {
  data: {
    bookings: Booking[] | undefined;
  };
}) {
  const [machineLabel, setMachineLabel] = useState<MachineNameEnum>(
    MachineNameEnum.washing
  );
  const { user } = useAuthContext();
  const { data: machines } = useFetchMachines();

  const userBookingCount =
    data.bookings?.filter(
      (booking) => booking.userId.toString() === user?.userId?.toString()
    ).length ?? 0;

  const reservationCount = Math.max(
    0,
    MAX_RESERVATIONS_PER_WEEK - userBookingCount
  );

  // maybe extract fn to separate service, instead calling everywhere useAuthCtx ? just revisit
  const disabledBtnIfNoBookings = useMemo(() => {
    return userBookingCount > 0;
  }, [userBookingCount]);

  function ShowMachinesNameAndCounts() {
    const getMachinesCount = machines?.filter((machine) => {
      if (machineLabel === MachineNameEnum.washing) {
        return machine.name === MachineNameEnum.washing;
      } else {
        return machine.name === MachineNameEnum.dryer;
      }
    }).length;
    return machineLabel + (getMachinesCount ? getMachinesCount : "");
  }

  return (
    <>
      <Paper elevation={20} className="booking-header-paper">
        <Box className="booking-header-box">
          <Tooltip
            title="Bookings will be displayed based on selected machine. By default washing and dryer will be selecte automatically"
            className="infoIcon"
            placement="top"
          >
            <InfoIcon />
          </Tooltip>
          <Box className="booking-header-box-1">
            <Typography>Machines:</Typography>
            <FormGroup>
              <FormControlLabel
                className="form-control-label"
                control={
                  <Switch
                    className="machines-switch "
                    onChange={() => {
                      if (machineLabel === MachineNameEnum.washing) {
                        setMachineLabel(MachineNameEnum.dryer);
                      } else {
                        setMachineLabel(MachineNameEnum.washing);
                      }
                    }}
                  />
                }
                label={ShowMachinesNameAndCounts()}
              />
            </FormGroup>
          </Box>
          <Box className="booking-machines-status-box">
            {machines
              ?.filter((m) => m.name === machineLabel)
              .map((machine, index) => {
                return (
                  <Box
                    sx={{
                      width: "100px",
                    }}
                    key={machine.id ?? index}
                  >
                    <MachineSelectBtn
                      disabledBtnIfNoBookings={machine.status}
                      machine={machine}
                      allMachines={machines}
                    />
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Paper>
      <Box className="booking-counter-mainBox">
        <Box className="booking-counter-resesrvation">
          <Tooltip
            title="Number of reservations that can be used per week"
            className="infoIcon"
            placement="top-start"
          >
            <InfoIcon />
          </Tooltip>
          <Typography>Reservations left: {reservationCount}</Typography>
        </Box>
        <Box className="booking-counter-edit-cancel-btn">
          <EditBtn disabledBtnIfNoBookings={disabledBtnIfNoBookings} />
          <CancelBtn disabledBtnIfNoBookings={disabledBtnIfNoBookings} />
          <ReportBtn />
        </Box>
        <TradeBtn />
      </Box>
    </>
  );
}
