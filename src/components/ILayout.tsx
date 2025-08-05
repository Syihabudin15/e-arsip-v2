"use client";

import "@ant-design/v5-patch-for-react-19";
import Image from "next/image";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import IContext from "./IContext";
import { MenuMobile, UserBio } from "./utils/LayoutUtil";

export default function ILayout({ children }: { children: React.ReactNode }) {
  return (
    <IContext>
      <AntdRegistry>
        <App>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: `"JetBrains Mono", monospace`,
              },
            }}
          >
            <div className="flex justify-between p-2 items-center bg-blue-400">
              <div className="flex gap-2 items-center">
                <Image
                  src={process.env.NEXT_PUBLIC_APP_LOGO || "/globe.svg"}
                  width={30}
                  height={30}
                  alt="App Logo"
                />
                <h1 className="font-bold text-lg text-white text-shadow-2xs">
                  {process.env.NEXT_PUBLIC_APP_SHORTNAME || "SIPP2025"}
                </h1>
              </div>
              <div className="flex gap-4 items-center">
                <UserBio />
                <MenuMobile />
              </div>
            </div>
            <div>{children}</div>
          </ConfigProvider>
        </App>
      </AntdRegistry>
    </IContext>
  );
}
