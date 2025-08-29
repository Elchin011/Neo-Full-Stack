const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return {
      id: payload.id, // <- _id yox, id
      email: payload.email,
      roles: payload.roles || [],
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

module.exports = {
  getUserFromToken,
};
