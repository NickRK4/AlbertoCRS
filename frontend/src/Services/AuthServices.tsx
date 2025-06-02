import axios from "axios";
import { User } from "../Models/User";

export const loginAPI = async ( email: string, password: string ) => {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        return { data };
    } catch (err) {
        console.log(err);
    }
}


export const registerAPI = async ( formData: User ) => {
    try {
      const data = await fetch('http://localhost:8000/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (data.status === 201) {
        alert("User created successfully!");
      }
      const json = await data.json();
      return json;
    } catch (err) {
      console.error(err);
    }
}