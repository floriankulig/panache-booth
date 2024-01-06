import { WritableSignal, Injectable, signal, effect } from "@angular/core";
import axios, { AxiosError } from "axios";
import { API_URL, RegisterUser, User } from "../../../models";
import { NotificationService } from "../notification/notification.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: WritableSignal<User | null> = signal(null);
  profileMenuOpen: WritableSignal<boolean> = signal(false);

  constructor(private notificationService: NotificationService) {
    this.getUserFromLocalStorage();

    effect(() => {
      const user = this.user();
      console.log({ user });
      const authToken = JSON.parse(localStorage.getItem("auth") || "");
      console.log({ authToken });
      if (!user && !authToken) {
        axios.defaults.headers.common["Authorization"] = undefined;
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;
    });
  }

  async login(email: string, password: string): Promise<User> | never {
    try {
      const authToken = btoa(`${email}:${password}`);
      // const res = await axios.post(`${API_URL}/user/login`, {
      //   email,
      //   password,
      // });
      const res = await axios.get<User>(`${API_URL}/user/login`, {
        headers: { Authorization: `Basic ${authToken}` },
      });
      const user = res.data;
      this.user.set(user);
      this.saveUidToLocalStorage(user.id);
      localStorage.setItem("auth", JSON.stringify(authToken));
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
      const authToken = btoa(`${formUser.email}:${formUser.password}`);
      const res = await axios.post(`${API_URL}/user`, {
        ...formUser,
      });
      const user = res.data;
      this.user.set(user);
      this.saveUidToLocalStorage(user.id);
      localStorage.setItem("auth", JSON.stringify(authToken));
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
    let authToken = localStorage.getItem("auth") || "";
    if (!uid || !authToken) {
      return null;
    }
    uid = JSON.parse(uid);
    authToken = JSON.parse(authToken);
    try {
      axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;
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
          "User is not existing!", //Was eine scheiß Fehlermeldung
        )
      ) {
        localStorage.removeItem("uid");
        localStorage.removeItem("auth");
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

  async isLoggedIn(): Promise<boolean> {
    const uid = this.uidFromLocalStorage();
    if (!uid) {
      return false;
    }
    const user = this.user() || (await this.getUser(uid));
    return !!user;
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem("uid");
    localStorage.removeItem("auth");
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
