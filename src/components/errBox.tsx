"use client";
import { Alert, AlertDescription, AlertTitle, AlertAction } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CircleAlertIcon } from "lucide-react";

export default function ErrBox({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{msg}</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" onClick={onRetry}>Retry</Button>
      </AlertAction>
    </Alert>
  );
}
