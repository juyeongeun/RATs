"use client";

import { useRouter } from "next/navigation";
import { getUserInfo } from "@/api/admin";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // 사용자 정보 요청
        await getUserInfo();
        setIsLoading(false);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    checkUserAuth();
  }, [router]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }
}
