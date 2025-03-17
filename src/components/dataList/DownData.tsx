import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import styles from "./downData.module.css";

interface Packet {
  id: number;
  time: string;
  macAddress: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  employeeId?: number;
}

function DownData({ dayList }: { dayList: Packet[] }) {
  const { hourlyData, maxCount } = useMemo(() => {
    const hourCounts = Array(24).fill(0);

    const eventsByDate: {
      [key: string]: {
        hour: number;
        status: string;
        time: string;
        id: number;
      }[];
    } = {};

    dayList.forEach((packet) => {
      const [dateStr, timeStr] = packet.time.split("T");
      const hour = parseInt(timeStr.split(":")[0]);

      if (!eventsByDate[dateStr]) {
        eventsByDate[dateStr] = [];
      }

      eventsByDate[dateStr].push({
        hour,
        status: packet.status,
        time: packet.time,
        id: packet.id,
      });
    });

    Object.keys(eventsByDate).forEach((dateStr) => {
      const events = eventsByDate[dateStr].sort((a, b) => {
        if (a.hour === b.hour) {
          return a.status === "CONNECT" ? -1 : 1;
        }
        return a.hour - b.hour;
      });

      let isConnected = false;
      let connectHour = -1;

      for (let i = 0; i < events.length; i++) {
        const event = events[i];

        if (event.status === "CONNECT") {
          isConnected = true;
          connectHour = event.hour;
        } else if (event.status === "DISCONNECT" && isConnected) {
          const disconnectHour = event.hour;

          for (let h = connectHour; h < disconnectHour; h++) {
            hourCounts[h]++;
          }

          isConnected = false;
        }
      }

      if (isConnected && connectHour !== -1) {
        for (let h = connectHour; h < 24; h++) {
          hourCounts[h]++;
        }
      }
    });

    const maxCount = Math.max(...hourCounts, 1);

    const hourlyData = hourCounts.map((count, hour) => ({
      hour: hour.toString().padStart(2, "0"),
      count,
      timeLabel: `${hour.toString().padStart(2, "0")}:00`,
    }));

    return { hourlyData, maxCount };
  }, [dayList]);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active: boolean;
    payload: any;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p
            className={styles.tooltipTitle}
          >{`${payload[0].payload.timeLabel}`}</p>
          <p
            className={styles.tooltipContent}
          >{`연결된 횟수: ${payload[0].value}회`}</p>
        </div>
      );
    }
    return null;
  };

  const yAxisTicks = useMemo(() => {
    if (maxCount === 1) {
      return [0, 1];
    }
  }, [maxCount]);

  return (
    <div className={styles.downDataContainer}>
      <div className={styles.downDataTitle}>Check Time — Day Working</div>
      <ResponsiveContainer width="100%" height="95%">
        <AreaChart data={hourlyData}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffeba7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffeba7" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#444"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="hour"
            stroke="#ffeba7"
            axisLine={{ stroke: "#ffeba7" }}
            tick={{ fill: "#ffeba7", fontSize: 10 }}
            interval={0}
            tickFormatter={(value) => value}
          />
          <YAxis
            domain={[0, maxCount]}
            stroke="#ffeba7"
            axisLine={{ stroke: "#ffeba7" }}
            tick={{ fill: "#ffeba7", fontSize: 12 }}
            ticks={yAxisTicks}
            width={30}
          />
          <Tooltip content={<CustomTooltip active={false} payload={[]} />} />

          <ReferenceLine
            x="09"
            stroke="#8884d8"
            strokeDasharray="3 3"
            label={{
              value: "업무 시작",
              position: "insideTopRight",
              fill: "#8884d8",
              fontSize: 10,
            }}
          />
          <ReferenceLine
            x="18"
            stroke="#8884d8"
            strokeDasharray="3 3"
            label={{
              value: "업무 종료",
              position: "insideTopRight",
              fill: "#8884d8",
              fontSize: 10,
            }}
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#ffeba7"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
            activeDot={{ r: 6, fill: "#fff", stroke: "#ffeba7" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DownData;
