export default async function handler(req, res) {
  // 1. Libera o CORS para a sua extensão
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Responde imediatamente à requisição "Preflight" do Chrome
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Bloqueia o que não for POST
  if (req.method !== 'POST') return res.status(405).send();
  
  // Extrai os dados do corpo da requisição
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { key, hwid } = body;
  
  const { key, hwid } = req.body;
  const ownerid = "yJwRhbe1qu";
  const name = "external";
  const ver = "1.0";

try {
    // Passo 1: Inicializa no KeyAuth
    const init = await fetch(`https://keyauth.win/api/1.2/?type=init&ver=${ver}&name=${name}&ownerid=${ownerid}`);
    const initData = await init.json();

    if (!initData.success) {
        return res.status(500).json({ valid: false, error: "Falha na inicialização do KeyAuth" });
    }

    // Passo 2: Valida a licença
    const license = await fetch(`https://keyauth.win/api/1.2/?type=license&key=${key}&hwid=${hwid}&sessionid=${initData.sessionid}&name=${name}&ownerid=${ownerid}`);
    const licenseData = await license.json();

    if (licenseData.success) {
      return res.json({ valid: true, key: key, discord: licenseData.info.discord || 'User' });
    } else {
      return res.json({ valid: false, error: licenseData.message });
    }
  } catch (error) {
    return res.status(500).json({ valid: false, error: "Erro interno no servidor" });
  }
}
