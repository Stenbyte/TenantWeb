import { useCallback, useEffect } from "react";
import { GenericButton } from "./GenericButton";

import {
  autoSelectMachines,
  setMachine,
} from "../../reduxState/selectMachineSlice";
import { useAppDispatch, useAppSelector } from "../../reduxState/store";
import { Machine, MachineNameEnum, MachineStatusEnum } from "../../constants";
import { Badge } from "@mui/material";

export function MachineSelectBtn({
  disabledBtnIfNoBookings,
  machine,
  allMachines,
}: {
  disabledBtnIfNoBookings: MachineStatusEnum;
  machine: Machine;
  allMachines: Machine[];
}) {
  const dispatch = useAppDispatch();
  const selectedMachines = useAppSelector((state) => state.selectMachines);
  useEffect(() => {
    const getWashingForAutoSelect = allMachines.find(
      (m) =>
        m.name === MachineNameEnum.washing &&
        m.status === MachineStatusEnum.available
    );
    const getDryerForAutoSelect = allMachines.find(
      (m) =>
        m.name === MachineNameEnum.dryer &&
        m.status === MachineStatusEnum.available
    );

    const alreadyHasWashing = selectedMachines.some(
      (m) => m?.name === MachineNameEnum.washing
    );
    const alreadyHasDryer = selectedMachines.some(
      (m) => m?.name === MachineNameEnum.dryer
    );

    if (
      getDryerForAutoSelect &&
      getWashingForAutoSelect &&
      !alreadyHasWashing &&
      !alreadyHasDryer
    ) {
      dispatch(
        autoSelectMachines([getWashingForAutoSelect, getDryerForAutoSelect])
      );
    }
  }, [allMachines, dispatch, selectedMachines]);

  const selectMachine = useCallback(() => {
    if (
      typeof machine.id === "string" &&
      Object.values(MachineStatusEnum).includes(machine.status) &&
      Object.values(MachineNameEnum).includes(machine.name) &&
      typeof machine.buildingId === "string"
    ) {
      dispatch(
        setMachine({
          id: machine.id,
          name: machine.name,
          buildingId: machine.buildingId,
          status: machine.status,
        })
      );
    }
  }, [dispatch, machine]);

  return (
    <>
      {selectedMachines.some((m) => m?.id === machine.id) && (
        <Badge
          badgeContent=""
          variant="dot"
          color="secondary"
          sx={{ height: "20px" }}
        />
      )}
      <GenericButton
        className={
          disabledBtnIfNoBookings === MachineStatusEnum.maintenance
            ? "disabledMachineBtn"
            : "enabledMachineBtn"
        }
        disabled={
          disabledBtnIfNoBookings === MachineStatusEnum.maintenance
            ? true
            : false
        }
        testid="select-machine-btn"
        onClick={selectMachine}
      >
        {machine.status}
      </GenericButton>
    </>
  );
}
