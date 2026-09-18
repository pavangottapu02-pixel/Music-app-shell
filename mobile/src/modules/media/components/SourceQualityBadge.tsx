// Copyright (C) 2024 - present, MissingCore
// SPDX-License-Identifier: AGPL-3.0-only

import { memo } from "react";
import { View } from "react-native";

import { StyledText } from "~/components/Typography/StyledText";
import { cn } from "~/lib/style";
import type { SourceAudioQualityBadge } from "~/utils/sourceAudioQuality";

export type SourceQualityBadgeProps = {
  type: NonNullable<SourceAudioQualityBadge>;
  className?: string;
};

function SourceQualityBadgeComponent({
  type,
  className,
}: SourceQualityBadgeProps) {
  if (!type) return null;

  const isDsd = type === "dsd";
  const label = isDsd ? "DSD" : "HI-RES";

  return (
    <View
      className={cn(
        "items-center justify-center rounded-[6px] px-2 py-1 bg-surfaceContainerHigh",
        className,
      )}
    >
      <StyledText className="text-xxs/tight font-bold tracking-wider">
        {label}
      </StyledText>
    </View>
  );
}

export const SourceQualityBadge = memo(SourceQualityBadgeComponent);
