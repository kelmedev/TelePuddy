import { redirect } from "next/navigation";

export default async function RootPage() {
	redirect("/auth/sign-in?logger=redirect");
}
