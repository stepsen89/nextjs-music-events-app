import cookie from "cookie";

import { API_URL } from "@/config/index";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === "POST") {
    const { identifier, password } = req.body;
    const user = { identifier, password };

    const strapiRes = await fetch(`${API_URL}/auth/local`, {
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams(user),
    });

    const strapiData = await strapiRes.json();

    if (strapiRes.status === 200) {
      // set cookie
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", strapiData.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 7,
          sameSite: "strict",
          path: "/",
        })
      );
      res.status(200).json({ user: strapiData?.user });
    } else {
      res
        .status(strapiData?.error?.status)
        .json({ message: strapiData?.error?.message });
    }
  } else {
    res.header("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
