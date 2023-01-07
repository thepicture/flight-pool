import { createConnection } from "../../../features/persistence/db";

export class UserDatabase {
  async throwIfDoesNotExistByDocumentNumber(documentNumber: string) {
    const connection = createConnection();

    const users: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT id
              FROM users
             WHERE document_number = ?
        `,
        [documentNumber],
        (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        }
      );
    });

    connection.end();

    if (users.length === 0) {
      throw new Error("Unauthorized");
    }
  }

  async getUserByDocumentNumber(documentNumber: string) {
    const connection = createConnection();

    const users: any[] = await new Promise((resolve, reject) => {
      connection.query(
        `
            SELECT first_name, last_name, phone, document_number
              FROM users
             WHERE document_number = ?
        `,
        [documentNumber],
        (error, results) => {
          if (error) {
            reject(error);
          }

          resolve(results);
        }
      );
    });

    connection.end();

    if (users.length === 0) {
      throw new Error("Unauthorized");
    }

    return users.pop();
  }
}
