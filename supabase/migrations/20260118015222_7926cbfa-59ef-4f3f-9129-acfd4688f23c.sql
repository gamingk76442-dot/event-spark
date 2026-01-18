-- Create a storage bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true);

-- Allow admins to upload files
CREATE POLICY "Admins can upload service images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'service-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update files
CREATE POLICY "Admins can update service images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'service-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete files
CREATE POLICY "Admins can delete service images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'service-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow public read access for service images
CREATE POLICY "Anyone can view service images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');