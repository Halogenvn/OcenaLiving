async function listInternalDatabases() {
  const tokenResponse = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
    headers: { 'Metadata-Flavor': 'Google' }
  });
  const tokenData = await tokenResponse.json();
  const token = tokenData.access_token;
  const projectId = "ais-asia-southeast1-a494f6273f";

  console.log(`Listing databases for INTERNAL Project: ${projectId}`);
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  console.log("INTERNAL_DATABASES_RESPONSE:", JSON.stringify(data, null, 2));
}

listInternalDatabases();
