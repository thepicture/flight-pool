import React, { useState } from "react";

import styles from "styles/AuthForm/AuthForm.module.css";
import { ErrorsContainer, ValidationErrors } from "../../features/validator";

interface AuthFormProps {
  registerMode?: boolean;
}

export interface User {
  firstName?: string;
  lastName?: string;
  phone: string;
  documentNumber?: string;
  password: string;
  passwordAgain?: string;
}

const DIGITS_FROM_PHONE_REGEXP = /[^0-9]/g;
export const AuthForm: React.FC<AuthFormProps> = ({ registerMode = false }) => {
  const [fields, setFields] = useState<User>({
    firstName: "",
    lastName: "",
    phone: "",
    documentNumber: "",
    password: "",
    passwordAgain: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerMode && fields.password !== fields.passwordAgain) {
      return alert("Passwords do not match");
    }

    const body = Object.assign({}, fields);
    delete body.passwordAgain;
    body.phone = body.phone.replaceAll(DIGITS_FROM_PHONE_REGEXP, "");
    if (!registerMode) {
      delete body.documentNumber;
      delete body.firstName;
      delete body.lastName;
    }

    try {
      const path = registerMode ? "/api/register" : "/api/login";
      const response = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 204) {
        alert("Registration successful!");
      } else if (response.status === 422) {
        const { error } = await response.json();
        console.log(error);
        if (error.message === ValidationErrors.VALIDATION_ERROR) {
          const properties = Object.getOwnPropertyNames(error.errors);
          let builder = "";

          for (const property of properties) {
            const errorArray = error.errors[property];

            if (errorArray.length === 0) {
              continue;
            }

            builder += `${property}: ${errorArray.join(", ")}\n`;
          }

          alert(builder);
        } else {
          alert("Unknown error occured!");
        }
      } else if (response.status === 200) {
        alert("Authentication successful!");
      } else if (response.status === 401) {
        alert("Incorrect phone or password, retype and try again");
      }
    } catch (error) {
      alert("Cannot register, server seems to be turned off");
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields((fields) => ({
      ...fields,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2>{registerMode ? "Registration" : "Auth"}</h2>
      {registerMode && (
        <>
          <label>
            First Name
            <input
              type="text"
              name="firstName"
              placeholder="John"
              minLength={2}
              maxLength={64}
              required
              onChange={handleChange}
              autoComplete="given-name"
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              minLength={2}
              maxLength={64}
              required
              onChange={handleChange}
              autoComplete="family-name"
            />
          </label>
          <label>
            Document Number
            <input
              type="text"
              name="documentNumber"
              placeholder="XXXX XXXXX"
              minLength={4}
              maxLength={16}
              required
              onChange={handleChange}
            />
          </label>
        </>
      )}
      <label>
        Phone Number
        <input
          type="tel"
          name="phone"
          pattern="\+[0-9] \([0-9]{3}\) [0-9]{3} [0-9]{2}-[0-9]{2}"
          placeholder="+ X (XXX) XXX XX-XX"
          required
          onChange={handleChange}
          autoComplete="tel"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          minLength={8}
          maxLength={64}
          required
          onChange={handleChange}
          autoComplete="new-password"
        />
      </label>
      {registerMode && (
        <label>
          Password Again
          <input
            type="password"
            name="passwordAgain"
            minLength={8}
            maxLength={64}
            required
            onChange={handleChange}
            autoComplete="new-password"
          />
        </label>
      )}
      <input
        type="submit"
        value={registerMode ? "Register" : "Sign in"}
        className="test-0-fbs"
      />
    </form>
  );
};
