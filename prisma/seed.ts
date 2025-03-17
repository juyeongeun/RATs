import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// 실제 한국인 이름 목록
const koreanNames = [
  "김민준",
  "이준호",
  "박지훈",
  "최현우",
  "정민석",
  "강지원",
  "조민재",
  "윤서준",
  "장민호",
  "임지훈",
  "한지민",
  "오민수",
  "서지원",
  "신민준",
  "권지훈",
  "황민수",
  "안지원",
  "송민준",
  "전지훈",
  "홍민수",
  "김서연",
  "이지은",
  "박민지",
  "최서영",
  "정수빈",
  "강지은",
  "조서연",
  "윤지민",
  "장서영",
  "임지은",
  "한서연",
  "오지민",
  "서서영",
  "신지은",
  "권서연",
  "황지민",
  "안서영",
  "송지은",
  "전서연",
  "홍지민",
  "김지현",
  "이서현",
  "박현지",
  "최지영",
  "정현서",
  "강지현",
  "조서현",
  "윤현지",
  "장지영",
  "임현서",
];

async function main() {
  console.log("🧹 데이터베이스 초기화 중...");

  // 데이터베이스 초기화 - 테이블 순서에 주의하여 삭제
  // 외래 키 제약 조건 때문에 삭제 순서가 중요합니다
  await prisma.packet.deleteMany({});
  console.log("✅ 패킷 데이터 삭제 완료");

  await prisma.employee.deleteMany({});
  console.log("✅ 직원 데이터 삭제 완료");

  await prisma.admin.deleteMany({});
  console.log("✅ 관리자 데이터 삭제 완료");

  console.log("🌱 새로운 시드 데이터 추가 중...");

  // 관리자 5명 생성
  const admins = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.admin.create({
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      })
    )
  );

  // 각 관리자당 직원 20명 생성
  for (const admin of admins) {
    const employees = await Promise.all(
      Array.from({ length: 20 }).map(() =>
        prisma.employee.create({
          data: {
            name: koreanNames[Math.floor(Math.random() * koreanNames.length)], // 한글 이름 선택
            macAddress: faker.internet.mac(),
            adminId: admin.id,
          },
        })
      )
    );

    // 각 직원당 최근 30일 동안의 출퇴근 및 근태 패턴 반영
    for (const employee of employees) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 30); // 30일 전부터 시작

      for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식

        const timeStamps = [
          { time: `${dateStr}T09:00:00.000Z`, status: "CONNECT" }, // 출근
          { time: `${dateStr}T12:00:00.000Z`, status: "DISCONNECT" }, // 점심 외출
          { time: `${dateStr}T13:00:00.000Z`, status: "CONNECT" }, // 점심 복귀
          { time: `${dateStr}T18:00:00.000Z`, status: "DISCONNECT" }, // 퇴근
        ];

        // 패킷 데이터 삽입
        await Promise.all(
          timeStamps.map(({ time, status }) =>
            prisma.packet.create({
              data: {
                time,
                macAddress: employee.macAddress,
                status: status as Status,
                employeeId: employee.id,
              },
            })
          )
        );

        currentDate.setDate(currentDate.getDate() + 1); // 다음 날로 이동
      }
    }
  }

  console.log("✅ 시드 데이터 추가 완료!");
}

main()
  .catch((error) => {
    console.error("❌ 시드 작업 실패:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
