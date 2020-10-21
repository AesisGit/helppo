import { expect } from "chai";
import findSecretColumns from "./findSecretColumns";

describe("findSecretColumns", () => {
  const baseSchema = {
    tables: [
      {
        name: "users",
        primaryKey: "id",
        columns: [
          {
            name: "id",
            type: "integer",
            autoIncrements: true,
          },
          {
            name: "foobar",
            type: "integer",
          },
        ],
      },
    ],
  };

  // Helper function to find specific users table column from the nested schema
  const findUsersColumn = (schema, name) =>
    schema.tables
      .find((table) => table.name === "users")
      .columns.find((column) => column.name === name);

  it("does not change anything if columns do not indicate secrecy", () => {
    expect(findSecretColumns(baseSchema)).to.deep.equal(baseSchema);
  });

  it("adds secret: true if column name indicates secrecy", () => {
    const indicativeColumnNames = [
      "password",
      "Password",
      "token",
      "Token",
      "authToken",
      "user_pass",
    ];

    for (let columnName of indicativeColumnNames) {
      const schema = JSON.parse(JSON.stringify(baseSchema));

      // Add a column with the indicative column name
      schema.tables[0].columns.push({
        name: columnName,
        type: "string",
      });

      const result = findSecretColumns(schema);

      // Column should now have relation properties
      const column = findUsersColumn(result, columnName);
      expect(column.secret).to.equal(true, `for "${columnName}"`);
    }
  });

  it("does not overwrite value", () => {
    const schema = JSON.parse(JSON.stringify(baseSchema));

    schema.tables[0].columns.push({
      name: "password",
      type: "string",
      secret: false,
    });

    const result = findSecretColumns(schema);

    // Column should now have relation properties
    const column = findUsersColumn(result, "password");
    expect(column.secret).to.equal(false);
  });
});
