import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

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
            name: faker.person.fullName(),
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
          { time: `${dateStr}T09:00:00.000Z`, status: Status.CONNECT }, // 출근
          { time: `${dateStr}T12:00:00.000Z`, status: Status.DISCONNECT }, // 점심 외출
          { time: `${dateStr}T13:00:00.000Z`, status: Status.CONNECT }, // 점심 복귀
          { time: `${dateStr}T18:00:00.000Z`, status: Status.DISCONNECT }, // 퇴근
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

  console.log("✅ Seeding completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
