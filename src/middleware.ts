import { auth } from "@/auth";

export default auth((req) => {
  const privateRoutes = ["/profile", "/user/profile", "cart"];

  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  // const url = "http://localhost:3000";
  // const url = "https://b-dazzle-cafe.vercel.app"; 
  const url = "http://localhost:3000"; 
  const isRootRoute = req.nextUrl.pathname === "/";
  const isAuthRoute = req.nextUrl.pathname.includes("/account/");
  const isPrivateRoute = privateRoutes.includes(req.nextUrl.pathname);
  const isAdminRoute = req.nextUrl.pathname.includes("/admin");

  if (isLoggedIn && isAuthRoute) {
    if (user?.role == "Admin") {
      return Response.redirect(`${url}/admin`);
    } else if (user?.role == "User") {
      return Response.redirect(`${url}/`);
    }
  }

  if (!isLoggedIn && isPrivateRoute) {
    return Response.redirect(`${url}/`);
  }

  if (isAdminRoute) {
    if (!isLoggedIn || user?.role !== "Admin") {
      return Response.redirect(`${url}/`);
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};