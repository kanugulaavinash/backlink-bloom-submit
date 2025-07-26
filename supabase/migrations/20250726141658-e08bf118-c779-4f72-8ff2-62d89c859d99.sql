-- Add unique constraint on post_id to enable proper upsert operations
ALTER TABLE public.validation_results 
ADD CONSTRAINT validation_results_post_id_unique UNIQUE (post_id);