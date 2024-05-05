'use server'

type FormState = {
success: number | undefined, 
data: Records<string, string> | undefined
}

export async function getRizStats(formState: FormState, formData: FormData) {
  const rawFormData = {
      start_date: formData.get('start-date'),
      end_date: formData.get('end-date')
  }
  return {success: 1, data: rawFormData || {}};
} 