import React from "react";

import styles from "styles/AuthForm/AuthForm.module.css";

interface AuthFormProps {
  registerMode?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ registerMode = false }) => {
  return (
    <form method="post" action="/flights" className={styles.container}>
      <h2>{registerMode ? "Registration" : "Auth"}</h2>
      {registerMode && (
        <>
          <label>
            First Name
            <input
              type="text"
              placeholder="John"
              minLength={2}
              maxLength={64}
              required
            />
          </label>
          <label>
            Last Name
            <input
              type="text"
              placeholder="Doe"
              minLength={2}
              maxLength={64}
              required
            />
          </label>
          <label>
            Document Number
            <input
              type="text"
              placeholder="XXXX XXXXX"
              minLength={4}
              maxLength={16}
              required
            />
          </label>
        </>
      )}
      <label>
        Phone Number
        <input
          type="tel"
          pattern="\+[0-9] \([0-9]{3}\) [0-9]{3} [0-9]{2}-[0-9]{2}"
          placeholder="+ X (XXX) XXX XX-XX"
          required
        />
      </label>
      <label>
        Password
        <input type="password" minLength={8} maxLength={64} required />
      </label>
      {registerMode && (
        <label>
          Password Again
          <input type="password" minLength={8} maxLength={64} required />
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
