"use client";

import Image from "next/image";
import { AuthTabs } from "@/components/tabs/auth-tabs";

export default function SignInPage() {
	return (
		<main className="grid grid-cols-1 md:grid-cols-[1fr_auto] h-screen w-screen">
			<div className="hidden md:flex items-center justify-center bg-gradient-to-r from-[#5081b5] to-[#0094FF]">
				<Image
					src="/telepuddy-png-white.png"
					alt="website-logo"
					width={400}
					height={400}
				/>
			</div>
			<div className="bg-white flex items-center justify-center w-full md:w-[500px] md:max-w-[500px]">
				<div className="flex flex-col w-[350px] max-w-[350px] gap-5">
					<AuthTabs />
				</div>
			</div>
		</main>
	);
}
