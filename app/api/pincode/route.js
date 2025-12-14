export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');

    if (!pincode) {
      return Response.json({ error: 'Pincode is required' }, { status: 400 });
    }

    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data[0]?.Status === 'Success') {
      const postOffice = data[0].PostOffice[0];
      return Response.json({
        success: true,
        city: postOffice.District,
        state: postOffice.State,
        area: postOffice.Name
      });
    }

    return Response.json({ error: 'Invalid pincode' }, { status: 404 });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch pincode data' }, { status: 500 });
  }
}