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

export async function POST(request) {
  try {
    const { delivery_postcode, weight, cod = true } = await request.json();
    
    const token = await getShiprocketToken();
    
    // Get pickup locations first
    const pickupResponse = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/pickup', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const pickupData = await pickupResponse.json();
    const pickupPostcode = pickupData.data?.[0]?.pin_code || process.env.SHIPROCKET_PICKUP_PINCODE;
    
    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${delivery_postcode}&weight=${weight}&cod=${cod ? 1 : 0}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.status === 200 && data.data?.available_courier_companies) {
      const rates = data.data.available_courier_companies.map(courier => ({
        courier_company_id: courier.courier_company_id,
        courier_name: courier.courier_name,
        rate: courier.rate,
        estimated_delivery_days: courier.estimated_delivery_days || '3-5'
      }));
      
      console.log(`Found ${rates.length} courier options for pincode ${delivery_postcode}`);
      return Response.json({ success: true, rates, total: rates.length });
    } else {
      return Response.json({ success: false, rates: [], error: 'No courier services available' });
    }

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}