import { WritableSignal, Injectable, signal, effect } from "@angular/core";
import axios, { AxiosError } from "axios";
import { API_URL, User } from "../../../ts";
import { NotificationService } from "../notification/notification.service";

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

  constructor(private notificationService: NotificationService) {
    this.getUserFromLocalStorage();
  }

  async login(email: string, password: string): Promise<User> | never {
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });
      const user = res.data;
      this.user.set(user);
      this.saveUidToLocalStorage(user.id);
      this.notificationService.addNotification({
        message: `Logged in as @${user.userName}!`,
        duration: 6000,
      });
      return user;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async register(formUser: RegisterUser): Promise<User> | never {
    try {
      const res = await axios.post(`${API_URL}/user`, {
        ...formUser,
      });
      const user = res.data;
      this.user.set(user);
      this.saveUidToLocalStorage(user.id);
      this.notificationService.addNotification({
        message: `Welcome, @${user.userName}!`,
        duration: 6000,
      });
      return user;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async updateUser(
    formUser: Omit<RegisterUser, "password">,
    userId: string,
  ): Promise<User> | never {
    try {
      const res = await axios.put(`${API_URL}/user/${userId}`, {
        ...formUser,
      });
      const user = res.data;
      this.user.set(user);
      this.saveUidToLocalStorage(user.id);
      this.notificationService.addNotification({
        message: `Updated Profile!`,
        type: "success",
        duration: 5000,
      });
      return user;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getUser(id: string): Promise<User> | never {
    try {
      const res = await axios.get<User>(`${API_URL}/user/${id}`);
      return res.data;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getUserFromLocalStorage(): Promise<User | null> {
    let uid = localStorage.getItem("uid") || "";
    if (!uid) {
      return null;
    }
    uid = JSON.parse(uid);
    try {
      const user = await this.getUser(uid);
      this.user.set(user);
      this.notificationService.addNotification({
        message: `Welcome back, @${user.userName}!`,
        icon: "smile",
        duration: 6000,
      });
      return user;
    } catch (error) {
      if (
        ((error as AxiosError).response?.data as string).includes(
          "User does not exist",
        )
      ) {
        localStorage.removeItem("uid");
        return null;
      }
      throw error as AxiosError;
    }
  }

  uidFromLocalStorage(): string | null {
    try {
      return JSON.parse(localStorage.getItem("uid") || "");
    } catch (error) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("uid") && !!this.user();
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem("uid");
    this.notificationService.addNotification({
      message: `Successfully logged out!`,
      duration: 5000,
    });
  }

  async deleteUser(id: string): Promise<void> | never {
    try {
      await axios.delete(`${API_URL}/user/${id}`);
      this.logout();
    } catch (error) {
      throw error as AxiosError;
    }
  }

  private saveUidToLocalStorage(uid: string): void {
    localStorage.setItem("uid", JSON.stringify(uid));
  }
}
