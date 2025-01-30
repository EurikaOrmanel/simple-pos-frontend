import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Customer {
  id?: string;
  name: string;
  phone: string;
  isPending?: boolean;
}

interface CartStore {
  items: CartItem[];
  customer: Customer | null;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCustomer: (customer: Customer) => void;
  setPendingCustomer: (name: string, phone: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  customer: null,
  total: 0,

  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          total: state.total + item.price,
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1 }],
        total: state.total + item.price,
      };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      return {
        items: state.items.filter((i) => i.id !== id),
        total: state.total - (item ? item.price * item.quantity : 0),
      };
    });
  },

  updateQuantity: (id, quantity) => {
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      const oldTotal = item.price * item.quantity;
      const newTotal = item.price * quantity;

      return {
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        total: state.total - oldTotal + newTotal,
      };
    });
  },

  setCustomer: (customer) => {
    set({ customer: { ...customer, isPending: false } });
  },

  setPendingCustomer: (name, phone) => {
    set({ customer: { name, phone, isPending: true } });
  },

  clearCart: () => {
    set({ items: [], customer: null, total: 0 });
  },
}));
