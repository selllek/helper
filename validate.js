export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send();
  
  const { key, hwid } = req.body;
  const ownerid = "yJwRhbe1qu";
  const name = "external";
  const ver = "1.0";

  const init = await fetch(`https://keyauth.win/api/1.2/?type=init&ver=${ver}&name=${name}&ownerid=${ownerid}`);
  const initData = await init.json();

  if (!initData.success) return res.status(500).json({ valid: false, error: "Init falhou" });

  const license = await fetch(`https://keyauth.win/api/1.2/?type=license&key=${key}&hwid=${hwid}&sessionid=${initData.sessionid}&name=${name}&ownerid=${ownerid}`);
  const licenseData = await license.json();

  if (licenseData.success) {
    return res.json({ valid: true, key: key, discord: licenseData.info.discord || 'User' });
  } else {
    return res.json({ valid: false, error: licenseData.message });
  }
}
