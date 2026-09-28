import {
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  editSlot,
  isTimeSlotInPast,
  reserveSlot,
} from "../../services/BookingService";
import { BookingHeader } from "./BookingHeader";
import { toast } from "react-toastify";
import { useUIContext } from "../../context/UseUIContext";
import { useAuthContext } from "../../context/UseAuthContext";
import { BookingSlot, EditSlotId, Machine, TIME_SLOTS } from "../../constants";
import { useFetchBookings } from "../../hooks/bookingsHooks";
import { useAppSelector } from "../../reduxState/store";
import { bookingMatchesCell } from "../../utils/bookingSlotMatch";

dayjs.extend(utc);
dayjs.extend(timezone);

export function BookingTable() {
  const { disabledBtn, dispatch } = useUIContext();
  const { user } = useAuthContext();

  const today = dayjs();
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    today.add(i, "day").toISOString()
  );

  const queryClient = useQueryClient();

  const { data: bookings, isError } = useFetchBookings();

  const selectedMachines = useAppSelector((state) => state.selectMachines);

  if (isError) {
    toast(`Failed to fetch reservations`);
  }

  const mutationFunction = (args: BookingSlot) => {
    return reserveSlot(args);
  };
  const editMutationFunction = (args: EditSlotId) => {
    return editSlot(args);
  };

  // move them to booking hooks
  const mutation = useMutation({
    mutationFn: mutationFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      dispatch({ type: "SET_DISABLED_BTN", payload: true });
    },
    onError: (error) => {
      if (error.message === "You can not add new reservation") {
        toast.error(error.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: editMutationFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      if (error.message === "You can not edit reservation") {
        toast.error(error.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const reserve = async (args: BookingSlot) => {
    await mutation.mutateAsync(args);
    toast.success("Booking successful!");
  };

  const edit = async (args: EditSlotId) => {
    try {
      await editMutation.mutateAsync(args);
      toast.success("Edit successful!");
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  // TODO Add message to tooltip about machines selectivity that it will be automatic for both machines and that they are reserved in groups like machine plus dryer.

  const getReservedSlotData = (day: string, time: string) => {
    for (const booking of bookings || []) {
      if (bookingMatchesCell(booking, day, time)) {
        return {
          isBooked: true,
          slotId: booking.id,
          bookingUserId: booking.userId,
        };
      }
    }
    return { isBooked: false, slotId: undefined, bookingUserId: undefined };
  };

  return (
    <div className="bookingTable" data-testid="booking-skeleton">
      <BookingHeader
        data={{
          bookings,
        }}
      />
      <Divider />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="tableBorders" data-testid="time-slot">
                Time Slot
              </TableCell>
              {weekDays.map((day) => (
                <TableCell
                  key={day}
                  align="center"
                  className="tableBorders"
                  data-testid="day-time"
                >
                  {dayjs(day).format("D ddd, MMM")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {TIME_SLOTS.map((timeSlots, slotIndex) => (
              <TableRow key={timeSlots}>
                <TableCell className="tableBorders" data-testid="time-slot-row">
                  {timeSlots}
                </TableCell>
                {weekDays.map((day, dayIndex) => {
                  const { isBooked, slotId, bookingUserId } =
                    getReservedSlotData(day, timeSlots);
                  return (
                    <TableCell
                      key={day}
                      align="center"
                      className="tableBorders"
                      data-testid={`reservation-slot-${slotIndex}-${dayIndex}`}
                    >
                      {isTimeSlotInPast(day, timeSlots) ? (
                        <Typography
                          className="expiredSlot"
                          data-testid={`expired-slot-${slotIndex}-${dayIndex}`}
                        >
                          Expired
                        </Typography>
                      ) : isBooked ? (
                        <Button
                          className={`${
                            bookingUserId?.toString() !==
                            user?.userId.toString()
                              ? "bookedSlot"
                              : !disabledBtn
                              ? "bookedEditSlot"
                              : "bookedUserSlot"
                          }`}
                          data-testid={`booked-slot-${slotIndex}-${dayIndex}`}
                          disabled={
                            bookingUserId?.toString() ===
                            user?.userId.toString()
                              ? disabledBtn
                              : true
                          }
                          key={slotId}
                          onClick={() => {
                            edit({ id: slotId });
                          }}
                        >
                          Booked
                        </Button>
                      ) : (
                        <Button
                          className="reserveBtn"
                          size="small"
                          data-testid={`reserve-slot-${slotIndex}-${dayIndex}`}
                          onClick={() => {
                            const machinesIds = selectedMachines
                              .filter((m): m is Machine => !!m?.id)
                              .map((m) => ({ id: m.id }));
                            reserve({
                              day,
                              timeSlots: [timeSlots],
                              selectedMachinesIds: machinesIds,
                            });
                          }}
                        >
                          Reserve
                        </Button>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
