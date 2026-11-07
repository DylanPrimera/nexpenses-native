import { usePendingExpenses } from "@/features/expenses/hooks/usePendingExpenses";
import { ConfirmDialog } from "@/shared/overlays/ConfirmDialog";
import { Button, Icon, SideDrawer, Text } from "@/shared";
import { messages } from "@/shared/i18n";
import { TOUR_TARGETS, useTourTarget } from "@/shared/tour";
import { IconLogout, IconUserCircle } from "@tabler/icons-react-native";
import { useIsFocused } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useAuthStore } from "../store";

function userInitials(firstName: string, lastName: string) {
  return `${firstName.trim()[0] ?? ""}${lastName.trim()[0] ?? ""}`.toUpperCase();
}

const avatarSize = {
  sm: { box: "size-11", text: "text-sm", icon: 22 },
  lg: { box: "size-20", text: "text-xl", icon: 36 },
} as const;

function ProfileAvatar({ initials, size }: { initials: string; size: keyof typeof avatarSize }) {
  const { box, text, icon } = avatarSize[size];
  return (
    <View
      className={`shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 ${box}`}
    >
      {initials ? (
        <Text className={`font-figtree-semibold text-primary ${text}`}>{initials}</Text>
      ) : (
        <Icon as={IconUserCircle} size={icon} strokeWidth={1.5} className="text-primary" />
      )}
    </View>
  );
}

export function AccountDrawer() {
  const { firstName, lastName, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const pending = usePendingExpenses();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const initials = userInitials(firstName, lastName);
  const focused = useIsFocused();
  const targetRef = useTourTarget(TOUR_TARGETS.avatar, focused);

  return (
    <>
      <Pressable
        ref={targetRef}
        role="button"
        accessibilityLabel={messages.Nav.account}
        onPress={() => setOpen(true)}
        className="size-12 items-center justify-center rounded-[0.875rem] active:bg-muted"
      >
        <ProfileAvatar initials={initials} size="sm" />
      </Pressable>
      <SideDrawer isOpen={open} onClose={() => setOpen(false)}>
        <Text role="heading" className="pr-12 font-figtree-semibold text-lg tracking-tight">
          {messages.Nav.profile}
        </Text>
        <View className="mt-6 items-center gap-3">
          <ProfileAvatar initials={initials} size="lg" />
          <Text className="text-center font-figtree-medium leading-snug">
            {fullName || messages.Nav.account}
          </Text>
        </View>
        <Button
          variant="secondary"
          size="lg"
          className="mt-auto w-full"
          onPress={() => {
            setOpen(false);
            if (pending.length) setConfirmLogout(true);
            else void logout();
          }}
        >
          <Icon as={IconLogout} size={20} strokeWidth={1.75} />
          <Text className="font-figtree-semibold">{messages.Nav.logout}</Text>
        </Button>
      </SideDrawer>
      <ConfirmDialog
        isOpen={confirmLogout}
        title={messages.Offline.logout_title}
        description={messages.Offline.logout_description}
        confirmLabel={messages.Nav.logout}
        onConfirm={() => {
          void logout();
        }}
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
}
