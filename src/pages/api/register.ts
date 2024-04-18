import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
const errors = { username: "", email: "", password: "" };

  try {
    const data = await request.formData();
    console.log("data: ", data);
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("number");
    console.log(name, email, password);

    try {
            const chat_resp = await fetch('https://prcbdkxqxh.execute-api.ap-south-1.amazonaws.com/default/BLZ_Search_Chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.PUBLIC_APIKEY,
            },
            body: JSON.stringify({
                // message: formObject,
                // user: formData,
            }),
            });
            const chat_resp_final = await chat_resp.json();
            console.log(chat_resp_final);
            // Handle the response (e.g., update UI)
        } catch (error) {
            // Handle any errors
            console.error('Error submitting form:', error);
        }



    if (typeof name !== "string" || name.length < 1) {
      errors.username += "Please enter a Name. ";
    }
    if (typeof email !== "string") {
      errors.email += "Email is not valid. ";
    }
    if (typeof password !== "string" || password.length < 6) {
      errors.password += "Password must be at least 6 characters. ";
    }
    const hasErrors = Object.values(errors).some(msg => msg)
    if (!hasErrors) {
      return Astro.redirect("/");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}