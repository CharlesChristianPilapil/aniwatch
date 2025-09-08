import * as z from "zod";

export const CommentFormSchema = z.object({
    entity_id: z.string().nonempty(),
    entity_type: z.string().nonempty(),
    parent_comment_id: z.number().nullable(),
    reply_to_comment_id: z.number().nullable(),
    content: z.string().nonempty().max(65000, "Max characters reached."),
});

export type CommentFormData = z.infer<typeof CommentFormSchema>;