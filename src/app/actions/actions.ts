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
  const url_endpoint = "http://172.17.0.1:5000/items/stats/riz"
  const query_params = `?start=${rawFormData.start_date}&end=${rawFormData.end_date}`;
  const res = await fetch(url_endpoint+query_params, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resData = res.json() || [];
  //const resData = [{itemcode: "123456", dscription: "toto", quantity: 100}]
  return resData;
} 