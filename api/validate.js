export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body =
    typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

  const { key, hwid } = body;

  const ownerid = "yJwRhbe1qu";
  const name = "external";
  const ver = "1.0";

  try {
    // Inicializa o KeyAuth
    const init = await fetch(
      `https://keyauth.win/api/1.2/?type=init&ver=${ver}&name=${name}&ownerid=${ownerid}`
    );

    const initData = await init.json();

    if (!initData.success) {
      return res.status(500).json({
        valid: false,
        error: "Falha na inicialização do KeyAuth",
      });
    }

    // Valida a licença
    const license = await fetch(
      `https://keyauth.win/api/1.2/?type=license&key=${encodeURIComponent(
        key
      )}&hwid=${encodeURIComponent(
        hwid
      )}&sessionid=${initData.sessionid}&name=${name}&ownerid=${ownerid}`
    );

    const licenseData = await license.json();

    if (licenseData.success) {
      return res.status(200).json({
        valid: true,
        key,
        discord: licenseData.info?.discord || "User",
      });
    }

    return res.status(200).json({
      valid: false,
      error: licenseData.message,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      valid: false,
      error: "Erro interno no servidor",
    });
  }
}
