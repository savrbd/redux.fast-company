import { createSlice } from "@reduxjs/toolkit";
import professionServise from "../services/profession.service";

const professionSlice = createSlice({
    name: "profession",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionRequested: (state) => {
            state.isLoading = true;
        },
        professionReceved: (state, action) => {
            state.entities = action.payload;
            state.lastFetch = Date.now();
            state.isLoading = false;
        },
        professionRequestFiled: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: professionReducer, actions } = professionSlice;
const { professionRequested, professionReceved, professionRequestFiled } =
    actions;

function isOutdated(date) {
    if (Date.now() - date > 10 * 60 * 100) {
        return true;
    }
    return false;
}

export const loadProfessionList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().profession;
    if (isOutdated(lastFetch)) {
        console.log("lastFetch", lastFetch);
        dispatch(professionRequested());
        try {
            const { content } = await professionServise.get();
            dispatch(professionReceved(content));
        } catch (error) {
            dispatch(professionRequestFiled(error.message));
        }
    }
};

export const getProfession = () => (state) => state.profession.entities;
export const getProfessionLoadingStatus = () => (state) =>
    state.profession.isLoading;
export const getProfessionByIds = (professionId) => (state) => {
    if (state.profession.entities) {
        const profession = state.profession.entities.find((p) => {
            return p._id === professionId;
        });
        return profession;
    }
    return [];
};

export default professionReducer;
