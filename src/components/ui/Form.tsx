/* eslint-disable no-unused-vars */
import { type FormEvent, useState } from "react";

// import Button from '~/components/ui/Button.astro';

  interface FormInput {
  type?: string;
  name: string;
  label?: string;
  autocomplete?: string;
  placeholder?: string;
  required?: boolean;
}

interface TextArea {
  label?: string;
  rows?: number;
  placeholder?: string;
}

interface FormProps {
  inputs: FormInput[];
  textarea?: TextArea;
  disclaimer?: string;
  button?: string;
  description?: string;
}

export default function FormContainer(props: FormProps = { inputs: [] }) {
const { inputs, textarea, button = 'Contact us', description = '', required = false} = props;
  const [isSubmitted, setIsSubmitted] = useState('');

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault(); 
  const formElement = event.target as HTMLFormElement;
  const formData = new FormData(event.target as HTMLFormElement);
  const formObject = Object.fromEntries(formData.entries());

  try {
    const chat_resp = await fetch('https://prcbdkxqxh.execute-api.ap-south-1.amazonaws.com/default/BLZ_Search_Chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.PUBLIC_APIKEY,
      },
      body: JSON.stringify({
        message: formObject,
        user: "Contact Form",
      }),
    });
    const chat_resp_final = await chat_resp.json();
    if (chat_resp.status === 200) {
        setIsSubmitted("Thanks for your information, we will reach out to you soon. :)"); // Set the submission status
        formElement.reset(); // Reset the form
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}
return(
<form onSubmit={handleSubmit} method="POST">
  {isSubmitted && isSubmitted.trim() !== ''&&(
  <div className="mb-6 flex items-center justify-center p-4 bg-green-100 border border-green-400 rounded-lg">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
  <p className="text-green-700 font-semibold">{isSubmitted}</p>
</div>)
}

  {
    inputs &&
      inputs.map(
        ({ type = 'text', name, label = '', autocomplete = 'on', placeholder = '', required = false}, index) =>
          name && (
            <div key={index} className="mb-6">
              {label && (
                <label htmlFor={name} className="block text-sm font-medium">
                  {label}
                </label>
              )}
              <input
                key = {index}
                type={type}
                name={name}
                required={required}
                id={name}
                autoComplete={autocomplete}
                placeholder={placeholder}
                className="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
              />
            </div>
          )
      )
  }

  {
    textarea && (
      <div>
        <label htmlFor="textarea" className="block text-sm font-medium">
          {textarea.label}
        </label>
        <textarea
          id="textarea"
          name="textarea"
          rows={textarea.rows ? textarea.rows : 4}
          placeholder={textarea.placeholder}
          className="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
        />
      </div>
    )
  }

  {
    button && (
      <div className="mt-10 grid">
        <button className="btn btn-primary" type="submit">{button}</button>
      </div>
    )
  }

  {
    description && (
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    )
  }
</form>
)
}
