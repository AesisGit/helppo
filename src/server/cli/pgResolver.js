export async function parseConnectionString(
  connectionString,
  localRequire = require
) {
  const ConnectionParameters = localRequire("pg/lib/connection-parameters");
  const config = new ConnectionParameters(connectionString);
  return config;
}

export async function resolveConnection(config, localRequire = require) {
  const pg = localRequire("pg");
  const client = new pg.Client(config);
  try {
    await client.connect();
  } catch (error) {
    if (error.message.includes("password authentication failed")) {
      return {
        prompt: {
          field: "password",
          message: "Password authentication failed. Try again:",
        },
      };
    }
    return {
      error: `Could not connect to database "${config.database}" at ${config.host}:${config.port} as "${config.user}" (${error.message})`,
    };
  }
  return { connection: client };
}
