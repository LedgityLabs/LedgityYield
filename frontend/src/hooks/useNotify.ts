import { useToast } from "@/hooks/useToast";
import { ToastAction, type ToastProps } from "@/components/ui/Toast";

type ToastParameters = Omit<ToastProps, "id"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement<typeof ToastAction>;
};

export const useNotify = () => {
  const { toast, dismiss } = useToast();

  return {
    success: (title: string, description?: string, action?: React.ReactElement<typeof ToastAction>) => {
      return toast({
        title,
        description,
        action,
        variant: "default",
      });
    },
    error: (title: string, description?: string, action?: React.ReactElement<typeof ToastAction>) => {
      return toast({
        title,
        description,
        action,
        variant: "destructive",
      });
    },
    loading: (title: string, description?: string, action?: React.ReactElement<typeof ToastAction>) => {
      return toast({
        title,
        description,
        action,
        variant: "default",
      });
    },
    custom: (props: ToastParameters) => {
      return toast(props);
    },
    dismiss: (toastId?: string) => {
      dismiss(toastId);
    },
  };
};