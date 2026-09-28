import { Machine } from './../constants';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Partial<Machine[]> = []

const machineSelectSlice = createSlice({
    name: 'selectMachines',
    initialState,
    reducers: {
        setMachine: (state, action: PayloadAction<Machine>) => {
            const incomingMachine = action.payload;

            const alreadyExists = state.some((m) => m?.name === incomingMachine.name);
            if (!alreadyExists) {
                state.push(incomingMachine)
            }
        },
        autoSelectMachines: (state, action: PayloadAction<Partial<Machine>[]>) => {
            action.payload.forEach((newMachine) => {

                const alreadyExists = state.some((m) => m?.id === newMachine.id);
                if (!alreadyExists) {
                    state.push(newMachine as Machine);
                }

            });
        }
    }
})


export const { setMachine, autoSelectMachines } = machineSelectSlice.actions;
export default machineSelectSlice.reducer;