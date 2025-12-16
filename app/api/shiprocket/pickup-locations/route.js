async function getShiprocketToken() {
  const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await response.json();
  return data.token;
}

export async function GET() {
  try {
    const token = await getShiprocketToken();
    
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      return Response.json({ success: true, pickupLocations: data.data });
    } else {
      return Response.json({ success: false, error: 'Failed to fetch pickup locations' });
    }

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}