import type { CommentFormData } from "../utils/schema/comment.schema";
import { api } from "./baseApiService";

export type CommentType = {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    username: string;
    avatar_image: string | null;
    parent_comment_id: number | null;
    reply_to_comment_id: number | null;
    replies_count: number | null;
}

export type GetCommentsType = {
    success: boolean;
    hasNextPage: boolean;
    totalPages: number;
    currentPage: number;
    results: CommentType[];
    totalCount: number;
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
        getComments: builder.infiniteQuery<GetCommentsType, { entity_id: string; entity_type: string; }, number>({
            keepUnusedDataFor: 0,
            infiniteQueryOptions: {
                initialPageParam: 1,
                getNextPageParam: (lastPage, _allPages, lastPageParam) => lastPage.hasNextPage ? lastPageParam + 1 : undefined,
            },
            query: ({ queryArg: { entity_id, entity_type }, pageParam }) => {
                return `/api/comments?entity_id=${entity_id}&entity_type=${entity_type}&page=${pageParam}`;
            }
        }),
        getReplies: builder.infiniteQuery<GetCommentsType, { entity_id: string; entity_type: string; parent_comment_id: number | string }, number>({
            keepUnusedDataFor: 0,
            infiniteQueryOptions: {
                initialPageParam: 1,
                getNextPageParam: (lastPage, _allPages, lastPageParam) => lastPage.hasNextPage ? lastPageParam + 1 : undefined,
            },
            query: ({ queryArg: { entity_id, entity_type, parent_comment_id }, pageParam }) => {
                return `/api/comments/replies?entity_id=${entity_id}&entity_type=${entity_type}&parent_comment_id=${parent_comment_id}&page=${pageParam}`;
            },
        }),
    })
});

export const {
    useAddCommentMutation,
    useGetCommentsInfiniteQuery,
    useGetRepliesInfiniteQuery
} = commentService;