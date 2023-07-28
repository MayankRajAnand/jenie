import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
    publicRoutes: ["/","/api/webook"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
