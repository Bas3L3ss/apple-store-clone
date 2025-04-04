import { FetchProductsResponse, Order } from "@/src/@types";
import { axios, getDeviceInfo, makeAxiosRequest } from "@/src/lib/utils";

export const getOrdersOfUser = async (
  page = 1,
  limit = 10
): Promise<{
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalOrders: number;
  };
}> => {
  try {
    const response = await makeAxiosRequest<{
      data: Order[];
      pagination: {
        page: number;
        limit: number;
        totalPages: number;
        totalOrders: number;
      };
    }>("get", `/orders?page=${page}&limit=${limit}`);

    return response;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return {
      data: [],
      pagination: { page, limit, totalPages: 1, totalOrders: 0 },
    };
  }
};

export const getCustomerAnalytics = async () => {
  try {
    return await makeAxiosRequest<{ data: any[] }>("get", `/orders/analytics`);
  } catch (error) {
    console.error("Failed to fetch customer analytics:", error);
    return {
      data: [],
    };
  }
};

export const getOrderById = async (
  orderId?: string
): Promise<{ data: Order | null }> => {
  if (!orderId) {
    return {
      data: null,
    };
  }
  try {
    return await makeAxiosRequest("get", `/orders/${orderId}`);
  } catch {
    return {
      data: null,
    };
  } // Return empty array on failure to handle edge cases
};

export const getAllOrders = async ({
  search = "",
  status = "",
  paymentMethod = "",
  page = "1",
  limit = "10",
}: {
  search?: string;
  paymentMethod?: string;
  status?: string;
  page?: string | number;
  limit?: string | number;
}): Promise<FetchProductsResponse> => {
  try {
    const token = sessionStorage.getItem("token");
    const deviceId = (await getDeviceInfo()).deviceId;

    const response = await axios.get("/orders/admin", {
      params: { search, status, paymentMethod, page, limit, deviceId },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching users: ", error);

    return {
      data: [],
      pagination: {
        currentPage: 0,
        limit: 0,
        total: 0,
        totalPages: 0,
      },
      success: false,
    };
  }
};
export const editOrderStatus = async (orderId: string, status: string) => {
  try {
    await makeAxiosRequest("put", "/orders/admin", { orderId, status });
  } catch (error) {
    console.log("Something went wrong", error);

    throw error;
  }
};
