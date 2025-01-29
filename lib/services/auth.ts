interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function loginAdmin(data: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/v1/admins/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
}

export async function loginSalesPerson(
  data: LoginInput
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/v1/sales_persons/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
}
