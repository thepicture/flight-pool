import React from "react";

const SearchForm = () => {
  return (
    <>
      <form action="post">
        <h2>Search Form</h2>
        <label>
          From
          <input type="text" placeholder="Moscow" className="test-0-fd" />
        </label>
        <label>
          To
          <input
            type="text"
            placeholder="Saint-Petersburg"
            className="test-0-fa"
          />
        </label>
        <label>
          To Date
          <input type="date" className="test-0-fdt" />
        </label>
        <label>
          Back Date
          <input type="date" className="test-0-fat" />
        </label>
        <label>
          Passenger count
          <input
            type="text"
            pattern="[1-8]"
            placeholder="2"
            className="test-0-fnp"
          />
        </label>
        <input type="submit" value="Search Tickets" className="test-0-fbs" />
      </form>
    </>
  );
};

export default SearchForm;
