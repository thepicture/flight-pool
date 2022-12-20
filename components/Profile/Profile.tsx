import React from "react";

export interface Booking {
  id: number;
  departureDate: Date;
  arrivalDate: Date;
  departureAirportName: string;
  arrivalAirportName: string;
}

export interface User {
  firstName: string;
  lastName: string;
  flightCount: number;
  bookings: Booking[];
}

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const bookings = user.bookings.map((booking) => {
    return (
      <li key={booking.id}>
        <p>Booking Id: {booking.id}</p>
        <p>Departure Date: {booking.departureDate.toLocaleDateString()}</p>
        <p>Departure Time: {booking.departureDate.toLocaleTimeString()}</p>
        <p>Arrival Time: {booking.arrivalDate.toLocaleTimeString()}</p>
        <p>Departure Airport: {booking.departureAirportName}</p>
        <p>Arrival Airport: {booking.arrivalAirportName}</p>
      </li>
    );
  });

  return (
    <section>
      <h2>Profile</h2>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>Flight Count: {user.flightCount}</p>
      <input type="button" value="Log out" onClick={onLogout} />
      <h2>Closest Bookings</h2>
      <ul>{bookings}</ul>
    </section>
  );
};

export default Profile;
