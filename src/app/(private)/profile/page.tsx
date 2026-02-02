"use client";

import UserMetaCard from "@/components/settings/user-meta-card";
import UserInfoCard from "@/components/settings/user-info-card";
import UserAddressCard from "@/components/settings/user-address-card";
import UserTourCard from "@/components/settings/user-tour-card";

export default function Profile() {
  return (
    <div
      className="flex flex-col gap-6  bg-transparent "
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="rounded-2xl border bg-card p-5 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-foreground lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
          <UserTourCard />
        </div>
      </div>
    </div>
  );
}
