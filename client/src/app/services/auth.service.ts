import { WritableSignal, Injectable, signal, effect } from "@angular/core";
import axios, { AxiosError } from "axios";
import { API_URL, User } from "../../ts";

export interface RegisterUser
  extends Omit<User, "id" | "createdAt" | "updatedAt" | "address"> {
  password: string;
  houseNumber: string;
  street: string;
  postcode: string;
  city: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: WritableSignal<User | null> = signal(null);

  constructor() {
    this.getUserFromLocalStorage();
  }

  async login(email: string, password: string): Promise<User> | never {
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });
      const user = res.data;
      console.log(user);
      this.user.set(user);
      this.saveUidToLocalStorage(user.id);
      return user;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async register(formUser: RegisterUser): Promise<User> | never {
    console.log(formUser);
    try {
      const res = await axios.post(`${API_URL}/user`, {
        ...formUser,
      });
      const user = res.data;
      console.log(user);
      this.user.set(user);
      this.saveUidToLocalStorage(user.id);
      return user;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getUserFromLocalStorage(): Promise<User | null> {
    const uid = JSON.parse(localStorage.getItem("uid") || "");
    if (!uid) {
      return null;
    }
    try {
      const res = await axios.get(`${API_URL}/user/${uid}`);
      const user = res.data;
      this.user.set(user);
      return user;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("uid");
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem("uid");
  }

  private saveUidToLocalStorage(uid: string): void {
    localStorage.setItem("uid", JSON.stringify(uid));
  }
}
