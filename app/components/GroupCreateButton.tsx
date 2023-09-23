import type { ComponentPropsWithoutRef, FC } from "react";
import type { ButtonProps, ModalProps } from "@mantine/core";

import GroupCreateForm from "./GroupCreateForm";
import type { GroupCreateFormProps } from "./GroupCreateForm";

export type GroupCreateButtonProps = Omit<ButtonProps, "onClick"> &
  ComponentPropsWithoutRef<"button"> &
  Pick<GroupCreateFormProps, "onCreate"> & {
    readonly modalProps?: Pick<ModalProps, "title">;
  };

const GroupCreateButton: FC<GroupCreateButtonProps> = ({
  onCreate,
  modalProps,
  children,
  ...otherProps
}) => (
  <Button
    leftIcon={<AddIcon />}
    onClick={() => {
      const { title } = modalProps ?? {};
      openModal({
        title: title ?? "Create group",
        children: (
          <GroupCreateForm
            onCreate={group => {
              closeAllModals();
              onCreate(group);
            }}
          />
        ),
      });
    }}
    {...otherProps}
  >
    {children ?? "New group"}
  </Button>
);

export default GroupCreateButton;
