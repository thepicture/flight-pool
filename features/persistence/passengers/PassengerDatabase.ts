import { createConnection } from "../../../features/persistence/db";

export class PassengerDoesNotExistError extends Error {}

export class PassengerDatabase {
  async throwIfPassengerDoesNotExist(bookingCode: string, passengerId: number) {
    const connection = createConnection();

    const passengers: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT p.id 
           FROM passengers p
           JOIN bookings b
             ON p.booking_id = b.id
          WHERE b.code = ? AND p.id = ?`,
        [bookingCode, passengerId],
        (error, results) => {
          if (error) {
            return reject(error);
          }

          resolve(results);
        }
      );
    });

    connection.end();

    if (passengers.length === 0) {
      throw new PassengerDoesNotExistError();
    }
  }
}
