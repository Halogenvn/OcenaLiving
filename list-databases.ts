async function listDatabases() {
  const tokenResponse = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
    headers: { 'Metadata-Flavor': 'Google' }
  });
  const tokenData = await tokenResponse.json();
  const token = tokenData.access_token;
  const projectId = "project-d4cd7924-77a5-4732-846";

  console.log(`Listing databases for Project: ${projectId}`);
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  console.log("DATABASES_RESPONSE:", JSON.stringify(data, null, 2));
}

listDatabases();
