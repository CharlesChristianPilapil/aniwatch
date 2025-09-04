import type { CommentFormData } from "../utils/schema/comment.schema";
import { api } from "./baseApiService";

export type CommentType = {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    username: string;
    avatar_image: string | null;
}

type GetCommentsType = {
    success: boolean;
    hasNextPage: boolean;
    totalPages: number;
    currentPage: number;
    results: CommentType[];
}

export const commentService = api.injectEndpoints({
    endpoints: (builder) => ({
        addComment: builder.mutation<
            { success: boolean, info: CommentType },
            CommentFormData
        >({
            query: (data) => ({
                url: "/api/comments",
                method: "POST",
                body: data,
            }),
        }),
        getComments: builder.query<GetCommentsType, { entity_id: string; entity_type: string, page: number | string }>({
            query: ({ entity_id, entity_type, page }) => `/api/comments?page=${page}&entity_id=${entity_id}&entity_type=${entity_type}`,
        }),
    })
})

export const {
    useAddCommentMutation,
    useGetCommentsQuery,
} = commentService;