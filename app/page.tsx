import { Metadata } from "next";
import { HomePage } from "@/components/sections/home-page";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://taxisaudiarabia.com",
  },
};

export default function Home() {
  return <HomePage />;
}
