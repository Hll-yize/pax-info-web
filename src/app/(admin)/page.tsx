import type { Metadata } from "next";
import CameraCapture from '@/components/clock/CameraCapture';

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function HomePage() {
  return (
    <div>
      <h1>欢迎来打卡</h1>
      <CameraCapture />
    </div>
  );
}
