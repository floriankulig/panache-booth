import { userByEmail } from "../services/user";

export async function customAuth(req: any, res: any, next: any) {
  try{
    const b64auth = req.headers.authorization.split(' ')[1];
    let [email, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    let user: any = await userByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).send('Username password mismatch!');
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send('Authentication required!');
  }
}