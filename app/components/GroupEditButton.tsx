import type { ComponentPropsWithoutRef, FC } from "react";
import type { ButtonProps, ModalProps } from "@mantine/core";

import GroupEditForm from "./GroupEditForm";
import type { GroupEditFormProps } from "./GroupEditForm";

export type GroupEditButtonProps = Omit<ButtonProps, "onClick"> &
  ComponentPropsWithoutRef<"button"> &
  Pick<GroupEditFormProps, "groupId" | "onUpdate"> & {
    readonly modalProps?: Pick<ModalProps, "title">;
  };

const GroupEditButton: FC<GroupEditButtonProps> = ({
  groupId,
  onUpdate,
  modalProps,
  children,
  ...otherProps
}) => (
  <Button
    leftIcon={<EditIcon />}
    onClick={() => {
      const { title } = modalProps ?? {};
      openModal({
        title: title ?? "Edit group",
        children: (
          <GroupEditForm
            {...{
              groupId,
              onUpdate,
            }}
          />
        ),
      });
    }}
    {...otherProps}
  >
    {children ?? "Edit group"}
  </Button>
);

export default GroupEditButton;
