import { shiprocketAPI } from '@/lib/shiprocket';

export async function POST(request) {
  try {
    const { delivery_postcode, weight } = await request.json();

    // Mock shipping rates for testing
    const mockRates = [
      {
        courier_company_id: 1,
        courier_name: "Delhivery",
        rate: Math.ceil(weight * 50),
        estimated_delivery_days: "3-5"
      },
      {
        courier_company_id: 2,
        courier_name: "Blue Dart",
        rate: Math.ceil(weight * 75),
        estimated_delivery_days: "2-3"
      },
      {
        courier_company_id: 3,
        courier_name: "DTDC",
        rate: Math.ceil(weight * 45),
        estimated_delivery_days: "4-6"
      }
    ];

    return Response.json({
      success: true,
      rates: mockRates
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}