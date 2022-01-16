import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFiled: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentsCreated: (state, action) => {
            state.entities.push(action.payload);
        },
        commentsDelete: (state, action) => {
            state.entities = state.entities.filter(
                (el) => el._id !== action.payload
            );
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceved,
    commentsRequestFiled,
    commentsCreated,
    commentsDelete
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceved(content));
    } catch (error) {
        dispatch(commentsRequestFiled(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;
export const getCommentsByIds = (commentsId) => (state) => {
    if (state.comments.entities) {
        const comments = state.comments.entities.find((p) => {
            return p._id === commentsId;
        });
        return comments;
    }
    return [];
};
export const createComment = (data) => async (dispatch) => {
    try {
        const { content } = await commentService.createComment(data);
        dispatch(commentsCreated(content));
    } catch (error) {
        dispatch(commentsRequestFiled(error.message));
    }
};
export const removeComment = (data) => async (dispatch) => {
    try {
        const { content } = await commentService.removeComment(data);
        if (content === null) {
            dispatch(commentsDelete(data));
        }
    } catch (error) {
        dispatch(commentsRequestFiled(error.message));
    }
};

export default commentsReducer;
