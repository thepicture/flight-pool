import React from "react";

const ClosedDiscountsForm = () => {
  return (
    <>
      <form action="post">
        <h2>Subscribe to Closed Discounts</h2>
        <label>
          Email
          <input
            type="email"
            placeholder="me@example.com"
            className="test-0-sie"
          />
        </label>
        <input type="submit" value="Subscribe" className="test-0-sbs" />
      </form>
    </>
  );
};

export default ClosedDiscountsForm;
