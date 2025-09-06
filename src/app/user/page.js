// user/page.js

import { redirect } from "next/navigation";

export default function UserPage() {
  // user 루트 페이지는 로그인 페이지로 리다이렉트
  redirect("/user/login");
}
