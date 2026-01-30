import { createClient } from "@supabase/supabase-js";
import type { UploadAdapter } from "payload/types";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseBucket = process.env.SUPABASE_BUCKET!;

const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseStorageAdapter: UploadAdapter = {
  async upload({ data, filename }) {
    const { error } = await supabase.storage
      .from(supabaseBucket)
      .upload(filename, data, {
        upsert: true,
        contentType: undefined,
      });
    if (error) throw new Error(error.message);
    return {
      filename,
      url: `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${filename}`,
    };
  },
  async delete({ filename }) {
    const { error } = await supabase.storage
      .from(supabaseBucket)
      .remove([filename]);
    if (error) throw new Error(error.message);
  },
};
