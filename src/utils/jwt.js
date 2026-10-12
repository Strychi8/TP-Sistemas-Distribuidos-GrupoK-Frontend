export function decodeJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // base64url -> base64
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // rellenar padding
    base64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    // decodificar con soporte UTF-8
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
